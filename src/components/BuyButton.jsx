import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { formatMoney } from "../data/products";
import CheckoutModal from "./CheckoutModal";

export default function BuyButton({ product, className = "btn btn-primary", children }) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {children || `Buy ${formatMoney(product.price)}`}
      </button>
      {open ? (
        <CheckoutModal
          product={product}
          emailDefault={user?.primaryEmailAddress?.emailAddress || ""}
          clerkUserId={user?.id}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
