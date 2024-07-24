import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import 'normalize.css';
import './index.css';
import App from './App';
import { AppProvider } from './context/appContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@fortawesome/fontawesome-free/css/all.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <StyledEngineProvider injectFirst>
    <AppProvider>
      <App />
      <GoogleOAuthProvider
        clientId={'process.env.GOOGLE_CLIENT_ID'}
      ></GoogleOAuthProvider>
    </AppProvider>
  </StyledEngineProvider>
  // </React.StrictMode>
);
