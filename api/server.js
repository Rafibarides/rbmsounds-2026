import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { artUrl, getPacks } from "./catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");

if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    });
}

const packs = getPacks();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const port = Number(process.env.PORT || 8787);
const publicR2 = process.env.R2_PUBLIC_URL;
const r2 = {
  endpoint: process.env.R2_ENDPOINT,
  accessKey: process.env.R2_ACCESS_KEY_ID,
  secretKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
};

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function stripe(pathname, params) {
  const body = new URLSearchParams();
  const flatten = (obj, prefix) => {
    Object.entries(obj).forEach(([key, value]) => {
      const next = prefix ? `${prefix}[${key}]` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        flatten(value, next);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === "object") flatten(item, `${next}[${index}]`);
          else body.append(`${next}[${index}]`, String(item));
        });
      } else if (value !== undefined && value !== null) {
        body.append(next, String(value));
      }
    });
  };
  flatten(params);
  const res = await fetch(`https://api.stripe.com/v1/${pathname}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Stripe request failed");
  }
  return data;
}

async function stripeGet(pathname) {
  const res = await fetch(`https://api.stripe.com/v1/${pathname}`, {
    headers: { Authorization: `Bearer ${stripeKey}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Stripe request failed");
  return data;
}

function encoder() {
  return new TextEncoder();
}

async function hmacSha256(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? encoder().encode(key) : key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder().encode(data));
  return new Uint8Array(sig);
}

async function sha256Hex(data) {
  const hash = await crypto.subtle.digest("SHA-256", encoder().encode(data));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function r2Put(key, payload) {
  const body = JSON.stringify(payload);
  const url = new URL(`/${r2.bucket}/${key}`, r2.endpoint);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";
  const payloadHash = await sha256Hex(body);
  const canonicalHeaders = [
    `content-type:application/json`,
    `host:${url.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join("\n");
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    "PUT",
    url.pathname,
    "",
    `${canonicalHeaders}\n`,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");
  const kDate = await hmacSha256(`AWS4${r2.secretKey}`, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, "aws4_request");
  const signature = toHex(await hmacSha256(kSigning, stringToSign));
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: `AWS4-HMAC-SHA256 Credential=${r2.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Could not store order");
  }
}

function purchaseFromPack(pack, extras = {}) {
  return {
    productId: pack.id,
    name: pack.name,
    file: pack.file,
    token: pack.token,
    amount: extras.amount || pack.price,
    email: extras.email || "",
    purchasedAt: extras.purchasedAt || Date.now(),
    sessionId: extras.sessionId || "",
  };
}

async function createCheckout({ productId, email, clerkUserId, origin }) {
  const pack = packs[productId];
  if (!pack) throw new Error("Unknown product");
  if (!email) throw new Error("Email is required");
  const success = new URL("/thanks", origin || "http://localhost:5173");
  success.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  const session = await stripe("checkout/sessions", {
    mode: "payment",
    customer_email: email,
    client_reference_id: clerkUserId || undefined,
    success_url: success.toString().replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}"),
    cancel_url: `${origin || "http://localhost:5173"}/${pack.id === "bundle" ? "bundle" : pack.id}`,
    allow_promotion_codes: "false",
    billing_address_collection: "auto",
    metadata: {
      productId: pack.id,
      token: pack.token,
      file: pack.file,
    },
    payment_intent_data: {
      receipt_email: email,
      metadata: {
        productId: pack.id,
      },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pack.price,
          product_data: {
            name: pack.name,
            images: artUrl[pack.id] ? [artUrl[pack.id]] : [],
          },
        },
      },
    ],
  });
  return session;
}

async function fulfill(sessionId) {
  const session = await stripeGet(`checkout/sessions/${sessionId}`);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    throw new Error("Payment is not complete yet");
  }
  const productId = session.metadata?.productId;
  const pack = packs[productId];
  if (!pack) throw new Error("Paid session is missing its pack");
  const purchase = purchaseFromPack(pack, {
    amount: session.amount_total,
    email: session.customer_details?.email || session.customer_email || "",
    purchasedAt: (session.created || Math.floor(Date.now() / 1000)) * 1000,
    sessionId,
  });
  await r2Put(`orders/${sessionId}.json`, {
    purchase,
    sessionId,
    createdAt: new Date().toISOString(),
  }).catch(() => {});
  return { purchase, download: `${publicR2}/packs/${purchase.token}/${purchase.file}` };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return json(res, 204, {});
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "POST" && url.pathname === "/api/checkout") {
      const body = await readBody(req);
      const origin = req.headers.origin || "http://localhost:5173";
      const session = await createCheckout({ ...body, origin });
      return json(res, 200, { url: session.url });
    }
    if (req.method === "GET" && url.pathname === "/api/thanks") {
      const sessionId = url.searchParams.get("session_id");
      if (!sessionId) return json(res, 400, { error: "Missing session" });
      const result = await fulfill(sessionId);
      return json(res, 200, result);
    }
    return json(res, 404, { error: "Not found" });
  } catch (error) {
    return json(res, 400, { error: error.message || "Request failed" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`RBM API on http://127.0.0.1:${port}`);
});
