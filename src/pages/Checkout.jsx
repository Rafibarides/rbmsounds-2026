import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Crown from "../components/Crown";
import { formatMoney, getProduct, isValidDiscountCode } from "../data/products";
import { startCheckout } from "../lib/checkout";

export default function Checkout() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { user } = useUser();

  const [email, setEmail] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const clerkEmail = user?.primaryEmailAddress?.emailAddress;
    if (clerkEmail) setEmail((current) => current || clerkEmail);
  }, [user]);

  if (!product) return <Navigate to="/" replace />;

  const codeApplied = isValidDiscountCode(code);
  const promoTotal = Number(import.meta.env.VITE_DISCOUNT_TOTAL || 500);
  const total = codeApplied ? promoTotal : product.price;
  const saleSavings = product.compareAt - product.price;
  const codeSavings = codeApplied ? product.price - promoTotal : 0;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function onSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required for the receipt and download.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await startCheckout({
        product,
        email: trimmed,
        clerkUserId: user?.id,
        discountCode: code,
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="wrap checkout">
      <div className="checkout-art">
        <img src={product.square || product.art} alt={product.name} />
      </div>

      <form className="receipt-card" onSubmit={onSubmit}>
        <div className="receipt-head">
          <span className="receipt-brand">
            <Crown />
            RBM Sounds
          </span>
          <span className="receipt-date">{today}</span>
        </div>

        <div>
          <p className="kicker">{product.tag}</p>
          <h1 className="receipt-title">{product.name}</h1>
          <p className="hint">
            {product.stemLabel || product.stemCount} sounds · Instant digital download
          </p>
        </div>

        <div className="receipt-lines">
          <div className="receipt-line">
            <span>List price</span>
            <span>{formatMoney(product.compareAt)}</span>
          </div>
          <div className="receipt-line">
            <span>Limited offer</span>
            <span>-{formatMoney(saleSavings)}</span>
          </div>
          {codeApplied ? (
            <div className="receipt-line">
              <span>Code {code.trim().toUpperCase()}</span>
              <span>-{formatMoney(codeSavings)}</span>
            </div>
          ) : null}
        </div>

        <div className="receipt-total">
          <span>Total due today</span>
          <span className="receipt-amount">{formatMoney(total)}</span>
        </div>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@studio.com"
          />
        </label>

        {showCode ? (
          <label className="field">
            <span>Discount code</span>
            <input
              type="text"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              placeholder="Enter code"
              autoCapitalize="characters"
            />
            {codeApplied ? <span className="hint code-ok">Code applied.</span> : null}
          </label>
        ) : (
          <button type="button" className="linkish" onClick={() => setShowCode(true)}>
            Have a discount code?
          </button>
        )}

        {error ? <p className="hint error">{error}</p> : null}

        <button className="btn btn-primary btn-wide" disabled={busy} type="submit">
          {busy ? "Opening secure payment" : "Continue to payment"}
        </button>

        <p className="hint receipt-fine">
          Payment handled by Stripe. Your receipt lands in this inbox, and the
          download is waiting right after.{" "}
          {user ? null : (
            <>
              <Link to={`/sign-up?redirect_url=${encodeURIComponent(`/checkout/${product.slug}`)}`}>
                Create an account
              </Link>{" "}
              to keep it in your library.
            </>
          )}
        </p>
      </form>
    </div>
  );
}
