import { Link } from "react-router-dom";
import { legal, studio } from "../data/products";
import Crown from "./Crown";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="brand">
            <Crown />
            RBM Sounds
          </div>
          <p className="fine">
            {studio.name}
            <br />
            {studio.city}
          </p>
        </div>
        <div className="foot-links">
          <a href={`mailto:${studio.email}`}>{studio.email}</a>
          <a href={studio.phoneHref}>{studio.phone}</a>
          <Link to="/account">Your library</Link>
        </div>
        <div className="foot-links">
          <a href={legal.terms} target="_blank" rel="noreferrer">
            Terms
          </a>
          <a href={legal.privacy} target="_blank" rel="noreferrer">
            Privacy
          </a>
          <a href={legal.refund} target="_blank" rel="noreferrer">
            Refunds
          </a>
          <a href={legal.fulfillment} target="_blank" rel="noreferrer">
            Fulfillment
          </a>
        </div>
      </div>
      <div className="wrap fine">Digital files. Instant download. All sales final.</div>
    </footer>
  );
}
