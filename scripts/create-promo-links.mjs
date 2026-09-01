import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPacks } from "../api/catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
fs.readFileSync(envPath, "utf8")
  .split("\n")
  .forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const eq = trimmed.indexOf("=");
    process.env[trimmed.slice(0, eq)] ||= trimmed.slice(eq + 1);
  });

const key = process.env.STRIPE_SECRET_KEY;
const site = process.env.VITE_SITE_URL || "https://rbmsounds.com";
const promoTotal = Number(process.env.DISCOUNT_TOTAL || 500);
const packs = getPacks();

async function stripe(pathname, params, method = "POST") {
  const body = new URLSearchParams();
  const flatten = (obj, prefix) => {
    Object.entries(obj).forEach(([k, value]) => {
      const next = prefix ? `${prefix}[${k}]` : k;
      if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, next);
      else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === "object") flatten(item, `${next}[${index}]`);
          else body.append(`${next}[${index}]`, String(item));
        });
      } else if (value !== undefined && value !== null) body.append(next, String(value));
    });
  };
  const options = { method, headers: { Authorization: `Bearer ${key}` } };
  if (method !== "GET") {
    flatten(params);
    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    options.body = body;
  }
  const res = await fetch(`https://api.stripe.com/v1/${pathname}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(`${pathname}: ${data.error?.message || "failed"}`);
  return data;
}

function envKey(id) {
  return `VITE_STRIPE_PROMO_${id.replace(/-/g, "_").toUpperCase()}`;
}

async function main() {
  const existing = await stripe("products?limit=100&active=true", {}, "GET");
  const bySlug = {};
  existing.data.forEach((product) => {
    if (product.metadata?.slug) bySlug[product.metadata.slug] = product;
  });

  const links = {};
  for (const pack of Object.values(packs)) {
    const product = bySlug[pack.id];
    if (!product) throw new Error(`No Stripe product found for ${pack.id}`);
    const price = await stripe("prices", {
      product: product.id,
      unit_amount: promoTotal,
      currency: "usd",
      nickname: "RAFI2026 promo",
    });
    const thanks = `${site}/thanks?p=${encodeURIComponent(pack.id)}&t=${encodeURIComponent(
      pack.token
    )}&a=${promoTotal}`;
    const link = await stripe("payment_links", {
      "line_items[0][price]": price.id,
      "line_items[0][quantity]": 1,
      customer_creation: "always",
      billing_address_collection: "auto",
      after_completion: {
        type: "redirect",
        redirect: { url: thanks },
      },
    });
    links[envKey(pack.id)] = link.url;
    console.log(pack.name, "promo", link.url);
  }

  let next = fs.readFileSync(envPath, "utf8");
  Object.entries(links).forEach(([k, url]) => {
    const line = `${k}=${url}`;
    if (next.includes(`${k}=`)) {
      next = next.replace(new RegExp(`${k}=.*`), line);
    } else {
      next += `\n${line}`;
    }
  });
  fs.writeFileSync(envPath, next);
  console.log("Updated .env with promo Payment Links");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
