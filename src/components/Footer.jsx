import { Link } from "react-router-dom";
import { legal, studio } from "../data/products";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img className="footer-crown" src="/logo/crown.png" alt="" />
          <img className="footer-wordmark" src="/logo/wordmark.png" alt="RBM" />
          <p>
            {studio.name}
            <br />
            {studio.city}
          </p>
        </div>
        <div>
          <p className="foot-heading">Contact</p>
          <div className="foot-links">
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
            <a href={studio.phoneHref}>{studio.phone}</a>
            <Link to="/account">Your library</Link>
          </div>
        </div>
        <div>
          <p className="foot-heading">Legal</p>
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
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} {studio.name}</p>
        <p>Digital files. Instant download. All sales final.</p>
      </div>
    </footer>
  );
}
