import { useQuery } from "@tanstack/react-query";
import { fetchAvailability } from "../api/doctor";
import { GroupedAvailabilities } from "../types/availability";

export function useAvailability() {
  return useQuery<GroupedAvailabilities[]>({
    queryKey: ["availabilities"],
    queryFn: fetchAvailability,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
