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
          required
        />
        <TextInput
          className={styles.input}
          label="Cognome"
          {...form.getInputProps("surname")}
          required
        />

        <TextInput
          className={styles.input}
          label="Email"
          mt="sm"
          {...form.getInputProps("email")}
          required
        />
        <TextInput
          className={styles.input}
          label="Codice fiscale"
          mt="sm"
          required
          {...form.getInputProps("cf")}
        />
        {/* <DatePickerInput
          className={styles.input}
          required
          label="Data di nascita"
          error={form.errors.birthDate}
          {...form.getInputProps("birthDate")}
        ></DatePickerInput> */}

        <TextInput
          className={styles.input}
          label="Data di nascita"
          mt="sm"
          type="date"
          required
          {...form.getInputProps("birthDate")}
        />
        <Select
          className={styles.input}
          label="Genere"
          mt="sm"
          required
          data={["Uomo", "Donna", "Altro"]}
          {...form.getInputProps("gender")}
        />
        <TextInput
          className={styles.input}
          label="Telefono"
          mt="sm"
          required
          {...form.getInputProps("phone")}
        />
      </div>
    </>
  );
}
