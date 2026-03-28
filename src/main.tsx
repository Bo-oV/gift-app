import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";

import { ShareProvider } from "./context/ShareProvider.tsx";
import { UserProvider } from "./context/UserProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShareProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ShareProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
