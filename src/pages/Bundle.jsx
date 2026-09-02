import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bundle, bundlePreviews, catalog, formatMoney } from "../data/products";
import BuyButton from "../components/BuyButton";
import AudioDemos from "../components/AudioDemos";
import SamplePreviews from "../components/SamplePreviews";

const soldSeparately = catalog.reduce((sum, pack) => sum + pack.price, 0);
const discount = soldSeparately - bundle.price;

const contentGroups = [
  { title: "Main pack", items: bundle.contents },
  ...catalog.map((pack) => ({ title: pack.name, items: pack.contents })),
];

const packDemos = catalog.flatMap((pack) =>
  (pack.audioDemos || []).map((demo) => ({
    ...demo,
    title: `${pack.name} · ${demo.title}`,
  }))
);

function remainingToday() {
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  return Math.max(0, end.getTime() - Date.now());
}

function Countdown() {
  const [left, setLeft] = useState(remainingToday);

  useEffect(() => {
    const id = setInterval(() => setLeft(remainingToday()), 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.floor(left / 1000);
  const cells = [
    { value: String(Math.floor(total / 3600)).padStart(2, "0"), unit: "hrs" },
    { value: String(Math.floor((total % 3600) / 60)).padStart(2, "0"), unit: "min" },
    { value: String(total % 60).padStart(2, "0"), unit: "sec" },
  ];

  return (
    <div className="countdown">
      <span className="countdown-label">Sale price ends in</span>
      <div className="countdown-digits">
        {cells.map((cell) => (
          <div className="countdown-cell" key={cell.unit}>
            <b key={cell.value}>{cell.value}</b>
            <i>{cell.unit}</i>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <h1 className="shine">{bundle.name}</h1>
          <p className="lede">{bundle.description}</p>
          <p className="meta">
            {bundle.stemLabel} sounds · 6 kits + RBM Drum Hits · One download
          </p>
          <div className="pedestal" ref={buyRef}>
            <div className="pedestal-meta">
              <span>
                Value <strong>{formatMoney(soldSeparately)}</strong>
              </span>
              <span>
                Discount <strong>−{formatMoney(discount)}</strong>
              </span>
            </div>
            <div className="pedestal-price">{formatMoney(bundle.price)}</div>
            <BuyButton product={bundle} className="btn btn-primary btn-wide">
              Buy now
            </BuyButton>
            <Countdown />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2>Preview the sounds</h2>
          <p>Samples pulled straight from the bundle.</p>
        </div>
        <SamplePreviews samples={bundlePreviews} />
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

      {packDemos.length > 0 ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2>Pack demos</h2>
            <p>Full demos from the kits in this bundle.</p>
          </div>
          <AudioDemos demos={packDemos} />
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="value-band">
          <div className="value-band-copy">
            <p className="kicker">One checkout</p>
            <h2>One download. {bundle.stemLabel} sounds.</h2>
            <div className="value-band-stats">
              <div>
                <span className="value-stat">{formatMoney(soldSeparately)}</span>
                <span className="value-label">Value</span>
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
          <p>Every kit broken down, top to bottom.</p>
        </div>
        <div className="contents-card">
          <div className="contents-columns">
            {contentGroups.map((group) => (
              <div className="contents-group" key={group.title}>
                <h3>{group.title}</h3>
                {group.items.map((item) => (
                  <div className="stem" key={`${group.title}-${item.label}`}>
                    <span>{item.label}</span>
                    <span>{item.count ?? ""}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
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
