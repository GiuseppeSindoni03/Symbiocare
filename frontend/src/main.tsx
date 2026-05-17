// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/msalConfig.ts";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./config/appInsights.ts";
import "./styles/global.css";
const queryClient = new QueryClient();
const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  createRoot(document.getElementById("root")!).render(
    // <StrictMode>
      <AppInsightsContext.Provider value={reactPlugin}>
        <QueryClientProvider client={queryClient}>
          <MsalProvider instance={msalInstance}>
            <UserProvider>
              <App />
            </UserProvider>
          </MsalProvider>
        </QueryClientProvider>
      </AppInsightsContext.Provider>
    // </StrictMode>
  );
});

