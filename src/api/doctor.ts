import { PatchedReservation } from "../hooks/use-patch-reservation.mutation";
import { Range } from "../hooks/use-reservations";
import api from "../services/axiosInstance";
import { CreateAvailabilityDto } from "../types/create-availabilty.dto";
import { CreatePatientDto } from "../types/create-patient.dto";
import { Doctor } from "../types/patient-registration-form";
import { GroupedReservations, ReservationsDTO } from "../types/reservation";

export async function fetchDoctor() {
  const res = await api.get<Doctor>("doctor/me", {
    withCredentials: true,
  });
  return res.data;
}

export async function addPatient(patient: CreatePatientDto) {
  const res = await api.post<any>("invite/create", patient, {
    withCredentials: true,
  });

  console.log("Result: ", res.data);
  return res.data.patientId;
}

export async function fetchAvailability(range: Range | null) {
  const params = new URLSearchParams();

  if (range) {
    if (range?.start) params.append("start", range.start.toISOString());
    if (range?.end) params.append("end", range.end.toISOString());
  }

  const res = await api.get<any>(`doctor/availability?${params.toString()}`, {
    withCredentials: true,
  });

  console.log("Result: ", res);
  console.log("Result.data: ", res.data);

  return res.data;
}

export async function addAvailability(availability: CreateAvailabilityDto) {
  const a = {
    title: availability.title,
    startTime: availability.start,
    endTime: availability.end,
  };

  console.log("Availability inserita: ", a);

  const res = await api.post<any>("doctor/availability", a, {
    withCredentials: true,
  });

  console.log("Result: ", res.data);
  return res.data.id;
}

export async function deleteAvailability(idAvailability: string) {
  const res = await api.delete(`doctor/availability/${idAvailability}`, {
    withCredentials: true,
  });

  console.log("Result: ", res.data);
  return res.data.id;
}

export async function fetchReservations(
  range: Range | null,
  status: "ALL" | "CONFIRMED"
) {
  const params = new URLSearchParams();

  if (range) {
    if (range?.start) params.append("start", range.start.toISOString());
    if (range?.end) params.append("end", range.end.toISOString());
  }

  if (status) params.append("status", status);

  const res = await api.get<GroupedReservations[]>(
    `reservations?${params.toString()}`,

    {
      withCredentials: true,
    }
  );

  return res.data;
}

export async function patchReservation(reservation: PatchedReservation) {
  await api.patch<ReservationsDTO>(
    `reservations/${reservation.reservationId}/${reservation.status}`,
    {
      withCredentials: true,
    }
  );

  return reservation.status;
}
