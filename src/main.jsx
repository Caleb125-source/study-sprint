import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";  
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { SessionsProvider } from "./context/SessionsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <SettingsProvider>
      <SessionsProvider>
      <App />
      </SessionsProvider>
    </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
