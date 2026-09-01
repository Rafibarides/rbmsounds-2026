import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Bundle from "./pages/Bundle";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Thanks from "./pages/Thanks";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

export default function App() {
  const location = useLocation();

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
