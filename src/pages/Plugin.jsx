import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { formatMoney, getProduct } from "../data/products";
import BuyButton from "../components/BuyButton";

export default function Plugin() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const buyRef = useRef(null);
  const [barVisible, setBarVisible] = useState(false);

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
  }, [slug]);

  if (!product || product.kind !== "plugin") return <Navigate to="/plugins" replace />;

  return (
    <div className="wrap plugin-page">
      <section className="plugin-hero">
        <div className="plugin-art">
          <img src={product.art} alt={product.name} />
        </div>
        <div className="plugin-copy">
          <p className="kicker">{product.tag}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>
          <p className="meta">{product.formats}</p>
          <div className="price">{formatMoney(product.price)}</div>
          <div ref={buyRef}>
            <BuyButton product={product} className="btn btn-buy">
              Buy now
            </BuyButton>
          </div>
        </div>
      </section>

      <section className="plugin-ui">
        <img src={product.ui} alt={`${product.name} interface`} />
      </section>

      <section className="plugin-features">
        {product.features.map((feature) => (
          <div key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </div>
        ))}
      </section>

      <div className={`buy-bar${barVisible ? " show" : ""}`}>
        <div>
          <div className="buy-bar-name">{product.name}</div>
          <div className="price">{formatMoney(product.price)}</div>
        </div>
        <BuyButton product={product} className="btn btn-primary">
          Buy now
        </BuyButton>
      </div>
    </div>
  );
}
