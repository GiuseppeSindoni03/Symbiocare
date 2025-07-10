import { useQuery } from "@tanstack/react-query";
import { fetchReservations, fetchHowManyReservations } from "../api/doctor";
import { GroupedReservations } from "../types/reservation";

export interface Range {
  start: Date;
  end: Date;
}

export function useReservations(
  range: Range | null,
  status: "ALL" | "CONFIRMED" | "PENDING"
) {
  return useQuery<GroupedReservations[]>({
    queryKey: ["reservations", range, status],
    queryFn: () => fetchReservations(range, status),

    retry: 1,
    refetchOnWindowFocus: true, // Aggiorna quando si torna sulla finestra
    refetchInterval: 1000 * 60 * 2,
  });
}

export function useReservationCounts() {
  return useQuery<{ total: number }>({
    queryKey: ["reservations"],
    queryFn: fetchHowManyReservations,

    retry: 1,
    refetchOnWindowFocus: true, // Aggiorna quando si torna sulla finestra
    refetchInterval: 1000 * 60 * 2,
  });
}
