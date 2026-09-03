import { Link } from "react-router-dom";
import { bundle, catalog, formatMoney } from "../data/products";
import BuyButton from "../components/BuyButton";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-card">
            <div className="hero-copy">
              <p className="kicker">Limited offer</p>
              <h1>{bundle.shortName}</h1>
              <p className="lede">{bundle.description}</p>
              <p className="meta">{bundle.stemLabel} sounds</p>
              <div className="price-row">
                <span className="price">{formatMoney(bundle.price)}</span>
                <span className="price compare">{formatMoney(bundle.compareAt)}</span>
              </div>
              <div className="actions">
                <BuyButton product={bundle}>Get the bundle</BuyButton>
                <Link className="btn btn-ghost" to="/bundle">
                  See everything
                </Link>
              </div>
            </div>
            <div
              className="hero-art"
              style={{ backgroundImage: `url(${bundle.art})` }}
              role="img"
              aria-label={bundle.name}
            />
          </div>
        </div>
      </section>

      <section className="section" id="packs">
        <div className="wrap">
          <div className="section-head">
            <h2>The kits</h2>
            <p>Stem lists and demos for each pack.</p>
          </div>
          <div className="grid">
            {catalog.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
