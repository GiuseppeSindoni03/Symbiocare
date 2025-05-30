import { useQuery } from "@tanstack/react-query";
import { fetchPatients, fetchPatient } from "../api/patients";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: [`patient`, id],
    queryFn: () => fetchPatient(id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
