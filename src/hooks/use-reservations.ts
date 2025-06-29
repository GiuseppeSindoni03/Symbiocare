import { useQuery } from "@tanstack/react-query";
import { fetchReservations } from "../api/doctor";
import { GroupedReservations } from "../types/reservation";

export interface Range {
  start: Date;
  end: Date;
}

export function useReservations(
  range: Range | null,
  status: "ALL" | "CONFIRMED"
) {
  return useQuery<GroupedReservations[]>({
    queryKey: ["reservations", range, status],
    queryFn: () => fetchReservations(range, status),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
