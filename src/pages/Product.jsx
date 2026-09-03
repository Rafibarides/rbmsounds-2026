import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { formatMoney, getProduct } from "../data/products";
import AudioDemos from "../components/AudioDemos";
import BuyButton from "../components/BuyButton";
import StemList from "../components/StemList";

export default function Product() {
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

  if (!product) return <Navigate to="/" replace />;

  return (
    <div className="wrap">
      <section className="product-hero">
        <div className="product-visual">
          <img src={product.art} alt={product.name} />
        </div>
        <div className="product-info">
          <p className="kicker">{product.tag}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>
          <p className="meta">
            {product.stemLabel || product.stemCount} sounds · Digital download · In stock
          </p>
          <div className="price-row">
            <span className="price">{formatMoney(product.price)}</span>
            <span className="price compare">{formatMoney(product.compareAt)}</span>
          </div>
          <div className="actions" ref={buyRef}>
            <BuyButton product={product} className="btn btn-buy">
              Buy now
            </BuyButton>
          </div>
          <StemList contents={product.contents} />
        </div>
      </section>

      {product.youtube || product.videoDemo || product.audioDemos ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2>Listen</h2>
          </div>
          {product.youtube ? (
            <div className="yt" style={{ marginBottom: 24 }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${product.youtube}?rel=0&modestbranding=1`}
                title={`${product.name} video demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
          {product.videoDemo ? (
            <div className="yt" style={{ marginBottom: 24 }}>
              <video src={product.videoDemo} controls playsInline />
            </div>
          ) : null}
          {product.audioDemos ? <AudioDemos demos={product.audioDemos} /> : null}
        </section>
      ) : null}

      <div className={`buy-bar${barVisible ? " show" : ""}`}>
        <div>
          <div className="buy-bar-name">{product.name}</div>
          <div className="price-row">
            <span className="price">{formatMoney(product.price)}</span>
            <span className="price compare">{formatMoney(product.compareAt)}</span>
          </div>
        </div>
        <BuyButton product={product} className="btn btn-primary">
          Buy now
        </BuyButton>
      </div>
    </div>
  );
}
