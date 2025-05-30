import { useParams } from "react-router-dom";
import { usePatient } from "../hooks/use-patients";
import { Loader } from "@mantine/core";

export default function PatientPage() {
  const { id } = useParams<{ id: string }>();

  console.log("Id pazient: ", id);
  if (!id) {
    return <div>Parametro ID mancante</div>;
  }

  const { data: patient, isLoading, isError } = usePatient(id);

  if (isLoading) return <Loader />;

  if (isError || !patient) return <div>Errore nel Caricamento </div>;

  return (
    <div>
      <h2>
        {patient.user.name} {patient.user.surname}
      </h2>
      <p>Email: {patient.user.email}</p>
      <p>Phone: {patient.user.phone}</p>
      <p>CF: {patient.user.cf}</p>
      <p>Codice Fiscale: {patient.user.cf}</p>
      <p>
        Data di nascita: {new Date(patient.user.birthDate).toLocaleDateString()}
      </p>
      <p>Genere: {patient.user.gender}</p>
      <p>
        Address: {patient.user.address} - City: {patient.user.city}
      </p>
      <p>Peso: {patient.weight}kg</p>
      <p>Altezza: {patient.height}cm</p>
      <p>Gruppo sanguigno: {patient.bloodType}</p>
      <p>
        Sport: {patient.sport} - Livello: {patient.level}
      </p>
      {patient.patologies ? (
        <p>Patologie: {patient.patologies}</p>
      ) : (
        <p>Nessuna patologia.</p>
      )}
      {<p>Infortuni: {patient.injuries}</p>}
      {<p>Farmaci assunti: {patient.medications}</p>}
    </div>
  );
}
