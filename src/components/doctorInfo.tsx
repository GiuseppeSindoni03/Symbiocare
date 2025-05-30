import { Avatar, Paper } from "@mantine/core";
import { useDoctor } from "../hooks/useDoctor";
import styles from "../styles/doctorPage.module.css";
export default function DoctorInfo() {
  const { data: doctor, isLoading, isError } = useDoctor();

  if (isLoading) return <p>Caricamento...</p>;
  if (isError || !doctor) return <p>Errore nel recupero dei dati</p>;

  return (
    <div>
      <Paper shadow="md" p="lg" radius="md" className={styles.container}>
        <Avatar className={styles.logo} radius="xl" src="doctor.svg"></Avatar>

        {/* <img src="doctor.svg" className={styles.logo} /> */}
        <h1>
          Dott. {doctor.user.name} {doctor.user.surname}
        </h1>
        <p>Specializzazione: {doctor.specialization}</p>
        <p>Studio medico: {doctor.medicalOffice}</p>
        <p>
          Ordine: {doctor.orderType} ({doctor.orderProvince})
        </p>
        <p>Registrazione: {doctor.registrationNumber}</p>
        <p>Email: {doctor.user.email}</p>
      </Paper>
    </div>
  );
}
