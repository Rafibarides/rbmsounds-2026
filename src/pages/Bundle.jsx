import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bundle, catalog, formatMoney } from "../data/products";
import BuyButton from "../components/BuyButton";
import StemList from "../components/StemList";

const soldSeparately = catalog.reduce((sum, pack) => sum + pack.price, 0);
const savings = soldSeparately - bundle.price;

export default function Bundle() {
  const buyRef = useRef(null);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    document.title = "RBM Bundle · RBM Sounds";
    return () => {
      document.title = "RBM Sounds";
    };
  }, []);

  useEffect(() => {
    const node = buyRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="wrap">
      <section className="product-hero">
        <div className="product-visual">
          <img src={bundle.art} alt={bundle.name} />
        </div>
        <div className="product-info">
          <p className="kicker">{bundle.tag}</p>
          <h1>{bundle.name}</h1>
          <p className="lede">{bundle.description}</p>
          <p className="meta">
            {bundle.stemLabel} sounds · 6 kits + RBM Drum Hits · Digital download
          </p>
          <div className="price-row">
            <span className="price">{formatMoney(bundle.price)}</span>
            <span className="price compare">{formatMoney(bundle.compareAt)}</span>
          </div>
          <div className="actions" ref={buyRef}>
            <BuyButton product={bundle} className="btn btn-primary">
              Buy now
            </BuyButton>
          </div>
          <div className="receipt-lines" style={{ marginTop: 8 }}>
            <div className="receipt-line">
              <span>Kits sold separately</span>
              <span>{formatMoney(soldSeparately)}</span>
            </div>
            <div className="receipt-line">
              <span>Bundle</span>
              <span>{formatMoney(bundle.price)}</span>
            </div>
            <div className="receipt-line">
              <span>You keep</span>
              <span>{formatMoney(savings)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2>Inside the bundle</h2>
          <p>Every kit, exactly as sold on its own page.</p>
        </div>
        <div className="kit-grid">
          {catalog.map((pack) => (
            <Link className="kit-tile" key={pack.id} to={`/${pack.slug}`}>
              <div className="kit-tile-art">
                <img src={pack.square || pack.art} alt={pack.name} loading="lazy" />
              </div>
              <div className="kit-tile-body">
                <h3>{pack.name}</h3>
                <p className="meta">{pack.stemCount} sounds</p>
                <p className="kit-tile-price">
                  <span className="price compare">{formatMoney(pack.price)}</span>
                  <span className="included">Included</span>
                </p>
              </div>
            </Link>
          ))}
          <div className="kit-tile kit-tile-dark">
            <div className="kit-tile-art">
              <img src="/logo/full.png" alt="RBM Drum Hits" loading="lazy" />
            </div>
            <div className="kit-tile-body">
              <h3>RBM Drum Hits</h3>
              <p className="meta">140 drum one shots</p>
              <p className="kit-tile-price">
                <span className="included">Included</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="value-band">
          <div className="value-band-copy">
            <p className="kicker">One checkout</p>
            <h2>Seven downloads. {bundle.stemLabel} sounds.</h2>
            <div className="value-band-stats">
              <div>
                <span className="value-stat">{formatMoney(soldSeparately)}</span>
                <span className="value-label">Sold separately</span>
              </div>
              <div>
                <span className="value-stat accent">{formatMoney(bundle.price)}</span>
                <span className="value-label">Bundle today</span>
              </div>
            </div>
            <BuyButton product={bundle} className="btn btn-primary">
              Get the bundle
            </BuyButton>
          </div>
          <div className="value-band-mark">
            <img src="/logo/crown.png" alt="" />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2>Full contents</h2>
          <p>Counts across the whole bundle.</p>
        </div>
        <div className="contents-card">
          <StemList contents={bundle.contents} />
        </div>
      </section>

      <div className={`buy-bar${barVisible ? " show" : ""}`}>
        <div>
          <div className="buy-bar-name">{bundle.name}</div>
          <div className="price-row">
            <span className="price">{formatMoney(bundle.price)}</span>
            <span className="price compare">{formatMoney(bundle.compareAt)}</span>
          </div>
        </div>
        <BuyButton product={bundle} className="btn btn-primary">
          Buy now
        </BuyButton>
      </div>
    </div>
  );
}
