import { Link } from "react-router-dom";
import { formatMoney } from "../data/products";
import BuyButton from "./BuyButton";

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <Link
        to={`/${product.slug}`}
        className="card-art"
        style={{ backgroundImage: `url(${product.square || product.art})` }}
        aria-label={product.name}
      />
      <div className="card-body">
        <p className="kicker">{product.tag}</p>
        <h3>
          <Link to={`/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="meta">
          {product.stemLabel || product.stemCount} sounds
        </p>
        <div className="price-row">
          <span className="price">{formatMoney(product.price)}</span>
          <span className="price compare">{formatMoney(product.compareAt)}</span>
        </div>
        <div className="actions">
          <BuyButton product={product} />
          <Link className="btn btn-ghost" to={`/${product.slug}`}>
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
