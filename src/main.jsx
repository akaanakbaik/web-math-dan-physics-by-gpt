import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster richColors closeButton position="top-right" expand visibleToasts={6} />
  </React.StrictMode>
);