import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 🚫 Removed StrictMode wrapper to avoid double-mount in dev
createRoot(document.getElementById("root")!).render(<App />);
