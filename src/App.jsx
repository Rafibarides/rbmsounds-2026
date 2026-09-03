import { useEffect } from "react";
import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { applySeo, seoForPath } from "./lib/seo";
import { getProduct } from "./data/products";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Bundle from "./pages/Bundle";
import Free from "./pages/Free";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Thanks from "./pages/Thanks";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

export default function App() {
  const location = useLocation();
  const [params] = useSearchParams();

  useEffect(() => {
    const seo = seoForPath(location.pathname);
    if (location.pathname === "/thanks") {
      const product = getProduct(params.get("p"));
      if (product) {
        seo.image = product.square || product.art;
        seo.title = `Thank you · ${product.name} · RBM Sounds`;
      }
    }
    applySeo(seo);
  }, [location.pathname, params]);

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash);
      if (node) node.scrollIntoView({ block: "start" });
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="page">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bundle" element={<Bundle />} />
          <Route path="/free" element={<Free />} />
          <Route path="/checkout/:slug" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/:slug" element={<Product />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
