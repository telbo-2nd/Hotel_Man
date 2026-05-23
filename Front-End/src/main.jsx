import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#fff",
                    color: "#1e293b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                },
                success: {
                    iconTheme: {
                        primary: "#1a3a6e",
                        secondary: "#fff",
                    },
                },
            }}
        />
    </StrictMode>
);