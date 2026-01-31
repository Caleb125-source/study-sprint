import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { SessionsProvider } from "./context/SessionsContext.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <SessionsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SessionsProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);