import { Link } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import Crown from "./Crown";

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = isLoaded && isSignedIn;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" aria-label="RBM Sounds home">
          <Crown />
          RBM
        </Link>
        <nav className="nav-links">
          <Link to="/#packs">Packs</Link>
          <Link to="/bundle">Bundle</Link>
          {signedIn ? (
            <>
              <Link className="keep" to="/account">
                Library
              </Link>
              <span className="auth-slot">
                <UserButton afterSignOutUrl="/" />
              </span>
            </>
          ) : (
            <>
              <Link className="keep mobile-cta" to="/sign-in">
                Sign in
              </Link>
              <Link className="nav-cta keep desktop-only" to="/sign-up">
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
