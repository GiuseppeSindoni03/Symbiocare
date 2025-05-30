import { TextInput } from "@mantine/core";
import { StepProps } from "../types/registration-form";
import styles from "../styles/Step.module.css";

export default function Step4({ form }: StepProps) {
  return (
    <div className={styles.container}>
      <TextInput
        className={styles.input}
        label="Studio medico"
        {...form.getInputProps("medicalOffice")}
      />

      <TextInput
        className={styles.input}
        label="Provincia ordine"
        {...form.getInputProps("orderProvince")}
      />
      <TextInput
        className={styles.input}
        label="Data iscrizione ordine"
        type="date"
        {...form.getInputProps("orderDate")}
      />

      <TextInput
        className={styles.input}
        label="Numero iscrizione ordine"
        {...form.getInputProps("registrationNumber")}
      />
      <TextInput
        className={styles.input}
        label="Tipo ordine"
        {...form.getInputProps("orderType")}
      />

      <TextInput
        className={styles.input}
        label="Specializzazione"
        {...form.getInputProps("specialization")}
      />
    </div>
  );
}
