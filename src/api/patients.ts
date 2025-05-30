import api from "../services/axiosInstance";
import { PatientItem } from "../types/patient.interface";
// import { Patient } from "../types/patient.interface";

export async function fetchPatients() {
  const res = await api.get<PatientItem[]>("doctor/patients", {
    withCredentials: true,
  });
  return res.data;
}

export async function fetchPatient(id: string) {
  const res = await api.get<PatientItem>(`doctor/patients/${id}`, {
    withCredentials: true,
  });

  return res.data;
}
