import { Select, TextInput } from "@mantine/core";
import { StepProps } from "../types/patient-registration-form";
// import { useState } from "react";
import styles from "../styles/Step.module.css";
// import { z } from "zod";
// import { DatePickerInput } from "@mantine/dates";

export default function Step1({ form }: StepProps) {
  // const [popoverOpened, setPopoverOpened] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <TextInput
          className={styles.input}
          label="Nome"
          {...form.getInputProps("name")}
          placeholder="Inserisci il nome del paziente"
        />
        <TextInput
          className={styles.input}
          label="Cognome"
          {...form.getInputProps("surname")}
          placeholder="Inserisci il cognome del paziente"
        />

        <TextInput
          className={styles.input}
          label="Email"
          mt="sm"
          {...form.getInputProps("email")}
          placeholder="Inserisci l'indirizzo mail del paziente"
        />
        <TextInput
          className={styles.input}
          label="Codice fiscale"
          mt="sm"
          {...form.getInputProps("cf")}
          placeholder="Inserisci il codice fiscale del paziente"
        />
        {/* <DatePickerInput
          className={styles.input}
          
          label="Data di nascita"
          error={form.errors.birthDate}
          {...form.getInputProps("birthDate")}
        ></DatePickerInput> */}

        <TextInput
          className={styles.input}
          label="Data di nascita"
          mt="sm"
          type="date"
          {...form.getInputProps("birthDate")}
          placeholder="Inserisci la data di nascita del paziente"
        />
        <Select
          className={styles.input}
          label="Genere"
          mt="sm"
          data={["Uomo", "Donna", "Altro"]}
          {...form.getInputProps("gender")}
          placeholder="Inserisci il genere del paziente"
        />
        <TextInput
          className={styles.input}
          label="Telefono"
          mt="sm"
          {...form.getInputProps("phone")}
          placeholder="Inserisci il numero di telefono del paziente"
        />
      </div>
    </>
  );
}
