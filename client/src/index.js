import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js"; 
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "./config/i18n"; 

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/*  Wrap with AuthProvider to manage auth state */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

//  Measure performance
reportWebVitals();
