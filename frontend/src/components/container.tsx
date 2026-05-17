import api from "../services/axiosInstance";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Container() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authInterceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (
          error?.response?.status === 401 &&
          !location.pathname.startsWith("/auth/2fa") &&
          !location.pathname.startsWith("/2fa") &&
          !location.pathname.startsWith("/settings/two-factor-auth")
        ) {
          console.log("Unauthorized! Redirecting to login...");
          setUser(null); // Pulisce lo stato dell'utente nel client
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(authInterceptor);
  }, [navigate, location, setUser]);

  return <div></div>;
}
