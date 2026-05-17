import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import { User } from "../types/user.interface";
import {
  login as loginFunction,
  logout as logoutFunction,
  register as registerFunction,
  verify2FA,
  entraCallback,
} from "../api/auth";
import { fetchUserMe } from "../api/user";
import { RegisterInfo } from "../types/registration-form";
import { LoginResponse } from "../types/loginResponse";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/msalConfig";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterInfo) => Promise<User>;
  twoFactorAuthenticate: (challengeId: string, code: string) => Promise<User>;
  loginWithEntra: () => Promise<{ profileCompleted: boolean }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { instance } = useMsal();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await fetchUserMe();
        setUser(me);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginFunction({ email, password });

    if (!response.requires2fa) {
      setUser(response.user);
    }
    return response;

  };

  const register = async (data: RegisterInfo) => {
    const response = await registerFunction(data);

    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    await logoutFunction();
    setUser(null);
  };


  const twoFactorAuthenticate = async (challengeId: string, code: string) => {
    const response = await verify2FA(challengeId, code);
    setUser(response);
    return response;
  };

  useEffect(() => {
    // Gestisce il ritorno dal loginRedirect di Microsoft
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === "msal:loginSuccess" && event.payload) {
        const payload = event.payload as any;
        if (payload.idToken) {
          entraCallback(payload.idToken)
            .then((res) => {
              setUser(res.user);
              if (!res.profileCompleted) {
                // Reindirizza forzatamente al completamento profilo
                window.location.href = "/entra/complete-profile";
              }
            })
            .catch((err) => console.error("Errore validazione backend Entra:", err));
        }
      }
    });

    return () => {
      if (callbackId) instance.removeEventCallback(callbackId);
    };
  }, [instance]);

  /**
   * Initiates Microsoft Entra ID login via MSAL redirect.
   * Sends the ID token to the backend for validation and user creation/linking.
   */
  const loginWithEntra = async (): Promise<{ profileCompleted: boolean }> => {
    // Usiamo loginRedirect invece di loginPopup per evitare tutti i problemi di blocco finestre
    await instance.loginRedirect(loginRequest);
    
    // Essendo un redirect, la pagina si ricaricherà. Ritorniamo una promise infinita
    // così il mutation loading state rimane attivo finché la pagina non scompare.
    return new Promise(() => {});
  };

  return (
    <UserContext.Provider
      value={{
        setUser,
        isLoading,
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        twoFactorAuthenticate,
        loginWithEntra,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

