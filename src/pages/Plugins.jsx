import { Link } from "react-router-dom";
import { formatMoney, plugins } from "../data/products";

export default function Plugins() {
  return (
    <div className="wrap plugins-page">
      <div className="section-head">
        <h1>Plugins</h1>
        <p>Stereo tools for the mix.</p>
      </div>
      <div className="plugin-list">
        {plugins.map((plugin) => (
          <article className="plugin-row" key={plugin.id}>
            <Link className="plugin-row-art" to={`/plugins/${plugin.slug}`}>
              <img src={plugin.art} alt={plugin.name} />
            </Link>
            <div className="plugin-row-copy">
              <p className="kicker">{plugin.tag}</p>
              <h2>
                <Link to={`/plugins/${plugin.slug}`}>{plugin.name}</Link>
              </h2>
              <p className="lede">{plugin.description}</p>
              <p className="meta">{plugin.formats}</p>
              <div className="plugin-row-buy">
                <span className="price">{formatMoney(plugin.price)}</span>
                <Link className="btn btn-buy" to={`/plugins/${plugin.slug}`}>
                  View plugin
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
