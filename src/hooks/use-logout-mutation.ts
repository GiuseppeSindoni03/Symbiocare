// hooks/useLogoutMutation.ts
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useLogoutMutation = ({
  onSuccessRedirect = "/login",
  onSuccessMessage = "Logout effettuato con successo, arrivederci!",
  onErrorMessage = "Ooops: ",
} = {}) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success(onSuccessMessage);
      navigate(onSuccessRedirect);
    },
    onError: (error: AxiosError<any>) => {
      let message = error?.response?.data?.message || "Errore sconosciuto";
      if (Array.isArray(message)) message = message.join(" | ");
      toast.error(`${onErrorMessage}${message}`);
    },
    retry: false,
  });
};
