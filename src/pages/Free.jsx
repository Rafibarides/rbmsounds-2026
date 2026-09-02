import { useEffect } from "react";
import { freeKit } from "../data/products";
import SamplePreviews from "../components/SamplePreviews";

export default function Free() {
  useEffect(() => {
    document.title = `${freeKit.name} · RBM Sounds`;
    return () => {
      document.title = "RBM Sounds";
    };
  }, []);

  return (
    <div className="wrap">
      <section className="product-hero">
        <div className="product-visual free-visual">
          <img src="/logo/full.png" alt={freeKit.name} />
        </div>
        <div className="product-info">
          <p className="kicker">{freeKit.tag}</p>
          <h1>{freeKit.name}</h1>
          <p className="lede">{freeKit.description}</p>
          <p className="meta">Electric guitar chord loops · WAV · Free download</p>
          <div className="actions">
            <a className="btn btn-buy" href={freeKit.file}>
              Download free
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <h2>Hear it first</h2>
          <p>Three loops from the kit.</p>
        </div>
        <SamplePreviews samples={freeKit.previews} />
      </section>
    </div>
  );
}
