import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { formatMoney, getProduct } from "../data/products";
import {
  clerkPurchases,
  downloadUrl,
  mergePurchases,
  persistToClerk,
  readLocalPurchases,
  takePendingPurchase,
} from "../lib/purchases";

function Receipt({ purchase }) {
  const product = getProduct(purchase.productId);
  const date = purchase.purchasedAt
    ? new Date(purchase.purchasedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <article className="receipt">
      <img src={product?.square || product?.art} alt="" />
      <div>
        <h3>{product?.name || purchase.name}</h3>
        <p className="meta">
          {date}
          {purchase.amount ? ` · ${formatMoney(purchase.amount)}` : ""}
          {purchase.email ? ` · ${purchase.email}` : ""}
        </p>
      </div>
      <a className="btn btn-primary" href={downloadUrl(purchase)}>
        Download
      </a>
    </article>
  );
}

export default function Account() {
  const { user, isSignedIn } = useUser();
  const [local, setLocal] = useState([]);

  useEffect(() => {
    setLocal(readLocalPurchases());
  }, []);

  useEffect(() => {
    if (!user) return;
    const pending = takePendingPurchase();
    const extras = [pending, ...readLocalPurchases()].filter(Boolean);
    extras
      .reduce((chain, item) => chain.then(() => persistToClerk(user, item)), Promise.resolve())
      .catch(() => {});
  }, [user]);

  const purchases = useMemo(
    () => mergePurchases(clerkPurchases(user), local),
    [user, local]
  );

  return (
    <div className="wrap account">
      <div className="account-head">
        <div>
          <p className="kicker">Library</p>
          <h1>Your downloads</h1>
        </div>
        {isSignedIn ? (
          <p className="hint">{user?.primaryEmailAddress?.emailAddress}</p>
        ) : null}
      </div>

      {!isSignedIn && purchases.length === 0 ? (
        <div className="empty">
          <h2>Sign in to save downloads.</h2>
          <p className="hint" style={{ margin: "12px 0 20px" }}>
            Guest downloads stay in this browser. Use the same email you paid with
            to keep them on your account.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/sign-in">
              Sign in
            </Link>
            <Link className="btn btn-ghost" to="/sign-up">
              Create account
            </Link>
            <Link className="btn btn-ink" to="/">
              Browse packs
            </Link>
          </div>
        </div>
      ) : null}

      {!isSignedIn && purchases.length > 0 ? (
        <div className="empty" style={{ marginBottom: 18 }}>
          <h2>Save these files to an account.</h2>
          <p className="hint" style={{ margin: "12px 0 20px" }}>
            Sign in with the email you used to pay.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/sign-in">
              Sign in
            </Link>
            <Link className="btn btn-ghost" to="/sign-up">
              Create account
            </Link>
          </div>
        </div>
      ) : null}

      {purchases.length ? (
        <div className="receipts">
          {purchases.map((purchase) => (
            <Receipt
              key={`${purchase.productId}-${purchase.token}-${purchase.purchasedAt}`}
              purchase={purchase}
            />
          ))}
        </div>
      ) : isSignedIn ? (
        <div className="empty">
          <h2>No purchases yet.</h2>
          <p className="hint" style={{ margin: "12px 0 20px" }}>
            Receipts and downloads show up here after you buy.
          </p>
          <Link className="btn btn-ink" to="/">
            Browse packs
          </Link>
        </div>
      ) : null}
    </div>
  );
}
