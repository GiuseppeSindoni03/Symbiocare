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
        placeholder="Inserisci il nome del tuo studio medico"
      />

      <TextInput
        className={styles.input}
        label="Numero iscrizione ordine"
        {...form.getInputProps("registrationNumber")}
        placeholder="Inserisci il tuo numero di iscrizione"
      />

      <TextInput
        className={styles.input}
        label="Data iscrizione ordine"
        type="date"
        {...form.getInputProps("orderDate")}
        placeholder="Inserisci la data di iscrizione"
      />

      <TextInput
        className={styles.input}
        label="Tipo ordine"
        {...form.getInputProps("orderType")}
        placeholder="Inserisci il tipo di ordine"
      />

      <TextInput
        className={styles.input}
        label="Provincia ordine"
        {...form.getInputProps("orderProvince")}
        placeholder="Inserisci la provincia di ordine"
      />

      <TextInput
        className={styles.input}
        label="Specializzazione"
        {...form.getInputProps("specialization")}
        placeholder="Inserisci la tua specializzazione"
      />
    </div>
  );
}
