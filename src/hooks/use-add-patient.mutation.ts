// hooks/useLogoutMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { addPatient } from "../api/doctor";
import { CreatePatientDto } from "../types/create-patient.dto";

export const useAddPatientMutation = (
  onSuccessCallback: (id: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patient: CreatePatientDto) => {
      console.log("Sto inviando i dati al backend");
      return addPatient(patient);
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });

      onSuccessCallback(id);

      console.log("Success");
      toast.success("Paziente inserito con successo");

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
