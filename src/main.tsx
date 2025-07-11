import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";
import { I18nProvider } from '@/i18n/I18nProvider';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
        <Toaster />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
