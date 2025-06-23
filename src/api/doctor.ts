import api from "../services/axiosInstance";
import { CreateAvailabilityDto } from "../types/create-availabilty.dto";
import { CreatePatientDto } from "../types/create-patient.dto";

export async function fetchDoctor() {
  const res = await api.get<any>("doctor/me", {
    withCredentials: true,
  });
  return res.data;
}

export async function addPatient(patient: CreatePatientDto) {
  const res = await api.post<any>("invite/create", patient, {
    withCredentials: true,
  });

  console.log("Result: ", res.data);
  return res.data.id;
}

export async function fetchAvailability() {
  const res = await api.get<any>("doctor/availability", {
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
