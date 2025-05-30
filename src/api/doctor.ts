import api from "../services/axiosInstance";
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
