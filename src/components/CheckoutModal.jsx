import { useState } from "react";
import { Link } from "react-router-dom";
import { startCheckout } from "../lib/checkout";
import { formatMoney, isValidDiscountCode } from "../data/products";

export default function CheckoutModal({ product, emailDefault, clerkUserId, onClose }) {
  const [email, setEmail] = useState(emailDefault);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const codeApplied = isValidDiscountCode(code);
  const total = codeApplied
    ? Number(import.meta.env.VITE_DISCOUNT_TOTAL || 500)
    : product.price;

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
        clerkUserId,
        discountCode: code,
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form
        className="modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <p className="kicker">Checkout</p>
        <h2>{product.name}</h2>
        <p className="hint">
          {formatMoney(total)}
          {codeApplied ? " with code applied" : ""}. Receipt and download go to
          this email.
        </p>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
            autoFocus
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
            {codeApplied ? (
              <span className="hint code-ok">
                Code applied. New total: {formatMoney(total)}.
              </span>
            ) : null}
          </label>
        ) : (
          <button
            type="button"
            className="linkish"
            onClick={() => setShowCode(true)}
          >
            Have a discount code?
          </button>
        )}
        <p className="hint">
          Optional:{" "}
          <Link to={`/sign-up?redirect_url=${encodeURIComponent(`/${product.slug}`)}`}>
            create an account
          </Link>{" "}
          to re-download later.
        </p>
        {error ? <p className="hint error">{error}</p> : null}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy ? "Opening payment" : `Pay ${formatMoney(total)}`}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
