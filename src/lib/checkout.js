import {
  getDiscount,
  packTokenFor,
  stripeLinkFor,
  stripePromoLinkFor,
} from "../data/products";
import { checkoutHref } from "./purchases";

function freeThanksUrl(product, email) {
  const token = packTokenFor(product);
  if (!token) {
    throw new Error("This pack is missing its download token.");
  }
  const thanks = new URL("/thanks", window.location.origin);
  thanks.searchParams.set("p", product.slug);
  thanks.searchParams.set("t", token);
  thanks.searchParams.set("a", "0");
  if (email) thanks.searchParams.set("email", email);
  return thanks.toString();
}

export async function startCheckout({ product, email, clerkUserId, discountCode }) {
  const code = (discountCode || "").trim();
  const discount = getDiscount(code);
  if (code && !discount) {
    throw new Error("That code is not valid.");
  }

  if (discount && discount.total === 0) {
    window.location.href = freeThanksUrl(product, email);
    return;
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

  const link = discount ? stripePromoLinkFor(product) : stripeLinkFor(product);
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
