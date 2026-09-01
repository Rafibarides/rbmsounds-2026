import { Link } from "react-router-dom";

export default function BuyButton({ product, className = "btn btn-primary", children }) {
  return (
    <Link className={className} to={`/checkout/${product.slug}`}>
      {children || "Buy now"}
    </Link>
  );
}
