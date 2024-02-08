import React from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/appContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@fortawesome/fontawesome-free/css/all.css";
import {SessionTimerProvider} from './components/SessionTimer';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <AppProvider>
      <SessionTimerProvider>
        <App />
        <GoogleOAuthProvider
          clientId={"process.env.GOOGLE_CLIENT_ID"}
        ></GoogleOAuthProvider>
      </SessionTimerProvider>
    </AppProvider>
  // </React.StrictMode>
);
