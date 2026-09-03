import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { formatMoney, getProduct } from "../data/products";
import { fulfillSession } from "../lib/checkout";
import {
  persistToClerk,
  saveLocalPurchase,
  setPendingPurchase,
} from "../lib/purchases";

function purchaseFromParams(params) {
  const slug = params.get("p");
  const token = params.get("t");
  const product = getProduct(slug);
  if (!product || !token) return null;
  const amountParam = Number(params.get("a"));
  return {
    productId: product.id,
    name: product.name,
    file: product.file,
    token,
    amount: Number.isFinite(amountParam) && amountParam > 0 ? amountParam : product.price,
    email: params.get("email") || "",
    purchasedAt: Date.now(),
  };
}

export default function Thanks() {
  const [params] = useSearchParams();
  const { user } = useUser();
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function run() {
      const sessionId = params.get("session_id");
      try {
        if (sessionId && import.meta.env.DEV) {
          const data = await fulfillSession(sessionId);
          if (!alive) return;
          setPurchase(data.purchase);
        } else {
          const fromLink = purchaseFromParams(params);
          if (!fromLink) {
            throw new Error("This confirmation link is missing its pack.");
          }
          setPurchase(fromLink);
        }
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setReady(true);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [params]);

  useEffect(() => {
    if (!purchase) return;
    saveLocalPurchase(purchase);
    setPendingPurchase(purchase);
    if (user) persistToClerk(user, purchase).catch(() => {});
  }, [purchase, user]);

  const product = purchase ? getProduct(purchase.productId) : null;
  const href = purchase
    ? `${import.meta.env.VITE_R2_PUBLIC_URL}/packs/${purchase.token}/${purchase.file}`
    : "";

  return (
    <div className="wrap thanks">
      <div className="thanks-card">
        <p className="kicker">Paid</p>
        <h1>{ready && purchase ? "Download ready." : "Confirming order."}</h1>
        {error ? <p className="hint">{error}</p> : null}
        {purchase && product ? (
          <>
            <p className="lede">
              {product.name} · {formatMoney(purchase.amount)} ·{" "}
              {new Date(purchase.purchasedAt).toLocaleDateString()}
            </p>
            <p className="hint">
              A receipt is on its way to your email. Download the pack below.
            </p>
            <div className="actions">
              <a className="btn btn-primary" href={href}>
                Download pack
              </a>
              {user ? (
                <Link className="btn btn-ghost" to="/account">
                  Go to library
                </Link>
              ) : (
                <Link className="btn btn-ghost" to="/sign-up?redirect_url=/account">
                  Save to an account
                </Link>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
