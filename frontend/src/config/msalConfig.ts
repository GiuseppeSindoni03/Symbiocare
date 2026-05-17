import { Configuration, LogLevel } from "@azure/msal-browser";

/**
 * MSAL configuration for Microsoft Entra ID authentication.
 *
 * Required environment variables:
 * - VITE_ENTRA_CLIENT_ID: Application (client) ID from Azure App Registration
 * - VITE_ENTRA_AUTHORITY: (optional) Authority URL, defaults to multi-tenant common endpoint
 * - VITE_ENTRA_REDIRECT_URI: (optional) Redirect URI, defaults to window.location.origin
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || "",
    // Multi-tenant: any organizational directory
    authority:
      import.meta.env.VITE_ENTRA_AUTHORITY ||
      "https://login.microsoftonline.com/common",
    redirectUri:
      import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error("[MSAL]", message);
            break;
          case LogLevel.Warning:
            console.warn("[MSAL]", message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

/**
 * Scopes to request during login.
 * - openid + profile + email: standard OIDC claims
 * - User.Read: allows reading the signed-in user's profile from Graph (not used, but standard)
 */
export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};
