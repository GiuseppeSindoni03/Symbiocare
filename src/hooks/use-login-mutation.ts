// hooks/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useLoginMutation = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(data.email, data.password),
    onSuccess: async (user, _variables) => {
      // console.log("User:", user.name);
      toast.success(`Benvenuto ${user.name} :)`);

      console.log("entro qua dentro");
      navigate("/home");
    },
    onError: (error: AxiosError<any>) => {
      let message = error?.response?.data?.message || "Errore sconosciuto";
      if (Array.isArray(message)) message = message.join(" | ");
      toast.error(`Ooops: ${message}`);
    },
  });
};
