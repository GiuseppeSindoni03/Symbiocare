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
} from "../api/auth";
import { fetchUserMe } from "../api/user";

import { RegisterInfo } from "../types/registration-form";
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (data: RegisterInfo) => Promise<User>;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await fetchUserMe(); // fa una GET a /user/me
        setUser(me);
      } catch (e) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  // const { data: user } = useQuery({
  //   queryKey: ["me"],
  //   queryFn: fetchUserMe,
  //   staleTime: 5 * 60 * 1000, // 5 minuti: considerato “fresco”
  //   retry: false, // eviti retry infiniti se non autenticato,
  //   enabled: true,
  // });

  // const queryClient = useQueryClient();

  const login = async (email: string, password: string) => {
    const user = await loginFunction({ email, password });

    setUser(user);
    //queryClient.setQueryData(["me"], user);

    return user;
  };

  const register = async (data: RegisterInfo) => {
    const user = await registerFunction(data);

    setUser(user);
    //queryClient.setQueryData(["me"], user);

    return user;
  };

  const logout = async () => {
    await logoutFunction();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
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
