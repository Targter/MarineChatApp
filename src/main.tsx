import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import React from 'react';
import './index.css';
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = "pk_test_cGxlYXNlZC1hbHBhY2EtODQuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/"}>
    <App />
  </ClerkProvider>
// </StrictMode>
);
