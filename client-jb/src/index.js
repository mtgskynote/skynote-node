import React from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/appContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <GoogleOAuthProvider
        clientId={"process.env.GOOGLE_CLIENT_ID"}
      ></GoogleOAuthProvider>
    </AppProvider>
  </React.StrictMode>
);
