const STORAGE_KEY = "rbm_purchases";
const PENDING_KEY = "rbm_pending_purchase";

export const r2Public = import.meta.env.VITE_R2_PUBLIC_URL;

export function downloadUrl(purchase) {
  return `${r2Public}/packs/${purchase.token}/${purchase.file}`;
}

export function readLocalPurchases() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeLocalPurchases(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function upsertPurchase(list, purchase) {
  const next = list.filter(
    (item) =>
      !(item.productId === purchase.productId && item.token === purchase.token)
  );
  next.unshift(purchase);
  return next;
}

export function saveLocalPurchase(purchase) {
  const next = upsertPurchase(readLocalPurchases(), purchase);
  writeLocalPurchases(next);
  return next;
}

export function setPendingPurchase(purchase) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(purchase));
}

export function takePendingPurchase() {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_KEY);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function persistToClerk(user, purchase) {
  if (!user) return;
  const existing = Array.isArray(user.unsafeMetadata?.purchases)
    ? user.unsafeMetadata.purchases
    : [];
  const next = upsertPurchase(existing, purchase);
  await user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      purchases: next,
    },
  });
}

export function clerkPurchases(user) {
  return Array.isArray(user?.unsafeMetadata?.purchases)
    ? user.unsafeMetadata.purchases
    : [];
}

export function mergePurchases(...lists) {
  const seen = new Set();
  const merged = [];
  lists.flat().forEach((item) => {
    if (!item?.productId || !item?.token) return;
    const key = `${item.productId}:${item.token}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });
  merged.sort((a, b) => (b.purchasedAt || 0) - (a.purchasedAt || 0));
  return merged;
}

export function checkoutHref(link, email) {
  if (!link) return "";
  const url = new URL(link);
  if (email) url.searchParams.set("prefilled_email", email);
  return url.toString();
}
