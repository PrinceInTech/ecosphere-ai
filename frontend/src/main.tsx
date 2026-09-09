import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#111827",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#059669", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#fff" },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
