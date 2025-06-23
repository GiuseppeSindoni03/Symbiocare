import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { addAvailability } from "../api/doctor";
import { CreateAvailabilityDto } from "../types/create-availabilty.dto";

export const useAddAVailabilityMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (availability: CreateAvailabilityDto) => {
      console.log("Sto inviando i dati al backend");
      return addAvailability(availability);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });

      onSuccessCallback();

      console.log("Success");
      toast.success("Disponibilità inserita con successo");

      //navigate("/patient");
    },
    onError: (error: AxiosError<any>) => {
      let message = error?.response?.data?.message || "Errore sconosciuto";
      console.log("Error:", error);
      if (Array.isArray(message)) message = message.join(" | ");
      toast.error(`${message}`);
      // navigate("/home");
    },
    retry: false,
  });
};
