import {
  isValidDiscountCode,
  stripeLinkFor,
  stripePromoLinkFor,
} from "../data/products";
import { checkoutHref } from "./purchases";

export async function startCheckout({ product, email, clerkUserId, discountCode }) {
  const code = (discountCode || "").trim();
  if (code && !isValidDiscountCode(code)) {
    throw new Error("That code is not valid.");
  }

  if (import.meta.env.DEV) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        email,
        clerkUserId: clerkUserId || undefined,
        discountCode: code || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Checkout failed");
    window.location.href = data.url;
    return;
  }

  const link = code ? stripePromoLinkFor(product) : stripeLinkFor(product);
  if (!link) {
    throw new Error("Checkout is not configured for this pack.");
  }
  window.location.href = checkoutHref(link, email);
}

export async function fulfillSession(sessionId) {
  const res = await fetch(`/api/thanks?session_id=${encodeURIComponent(sessionId)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not confirm order");
  return data;
}
