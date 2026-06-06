import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("App root element #app was not found.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
