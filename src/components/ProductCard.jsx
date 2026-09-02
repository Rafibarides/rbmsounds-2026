import { Link } from "react-router-dom";
import { formatMoney } from "../data/products";
import BuyButton from "./BuyButton";
import PreviewButton from "./PreviewButton";

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <Link
        to={`/${product.slug}`}
        className="card-link"
        aria-label={`${product.name} details`}
      />
      <div className="card-art">
        <img src={product.square || product.art} alt={product.name} loading="lazy" />
        {product.preview ? (
          <PreviewButton src={product.preview} label={product.name} />
        ) : null}
      </div>
      <div className="card-body">
        <p className="kicker">{product.tag}</p>
        <h3>{product.name}</h3>
        <p className="meta">{product.stemLabel || product.stemCount} sounds</p>
        <div className="price-row">
          <span className="price">{formatMoney(product.price)}</span>
          <span className="price compare">{formatMoney(product.compareAt)}</span>
        </div>
        <div className="actions">
          <BuyButton product={product} className="btn btn-buy" />
        </div>
      </div>
    </article>
  );
}
