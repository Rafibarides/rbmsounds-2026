import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./styles/index.css";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: "#e8b423",
    colorBackground: "#fbf8f1",
    colorText: "#14120e",
    colorTextSecondary: "#6a645c",
    borderRadius: "16px",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },
  elements: {
    card: "box-shadow: 0 18px 40px rgba(20, 18, 14, 0.08);",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey} appearance={clerkAppearance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
