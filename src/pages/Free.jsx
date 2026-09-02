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
    <div className="wrap free-page">
      <section className="free-hero">
        <div className="free-art">
          <img src={freeKit.art} alt={freeKit.name} />
        </div>
        <div className="free-copy">
          <p className="kicker">{freeKit.tag}</p>
          <h1>{freeKit.name}</h1>
          <p className="lede">{freeKit.description}</p>
          <p className="meta">Electric guitar chord loops · WAV · Free download</p>
          <a className="btn btn-buy" href={freeKit.file}>
            Download free
          </a>
        </div>
      </section>
      <SamplePreviews samples={freeKit.previews} />
    </div>
  );
}
