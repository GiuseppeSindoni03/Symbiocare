import { UseFormReturnType } from "@mantine/form";

export type FormValues = {
  name: string;
  surname: string;
  email: string;
  cf: string;
  birthDate: Date;
  phone: string;
  gender: string;
  address: string;
  city: string;
  cap: string;
  province: string;
  weight: number;
  height: number;
  bloodType: string;
  sport: string;
  level: string;
  patologies: string[];
  medications: string[];
  injuries: string[];
};

export interface RegisterInfo {
  name: string;
  surname: string;
  email: string;
  cf: string;
  birthDate: Date;
  phone: string;
  gender: string;
  address: string;
  city: string;
  cap: string;
  province: string;
  weight: number;
  height: number;
  bloodType: string;
  sport: string;
  level: string;
  patologies: string[];
  medications: string[];
  injuries: string[];
}

export type StepProps = {
  form: UseFormReturnType<FormValues>;
};
