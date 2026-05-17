import { useMutation } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showLoginSuccessToast } from "../utils/login.utils";

export const useEntraLoginMutation = () => {
  const { loginWithEntra, user } = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => loginWithEntra(),

    onSuccess: (result) => {
      if (!result.profileCompleted) {
        // First-time Entra user — redirect to profile completion
        toast.info("Completa il tuo profilo per continuare.");
        navigate("/entra/complete-profile", { replace: true });
      } else {
        // Returning user — go to dashboard
        showLoginSuccessToast(user!);
        navigate("/patients", { replace: true });
      }
    },

    onError: (error: any) => {
      // Handle user cancelling the popup
      if (error?.errorCode === "user_cancelled") {
        return; // Silently ignore popup cancellation
      }

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Errore durante l'accesso con Microsoft";
      toast.error(`Errore: ${message}`);
    },
  });
};
