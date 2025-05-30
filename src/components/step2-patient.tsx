import { TextInput } from "@mantine/core";
import { StepProps } from "../types/patient-registration-form";
import styles from "../styles/Step.module.css";

export default function Step2({ form }: StepProps) {
  return (
    <div className={styles.container}>
      <TextInput
        className={styles.input}
        label="Indirizzo"
        mt="sm"
        required
        {...form.getInputProps("address")}
      />

      <TextInput
        className={styles.input}
        label="Città"
        required
        {...form.getInputProps("city")}
      />
      <TextInput
        className={styles.input}
        label="CAP"
        required
        {...form.getInputProps("cap")}
      />
      <TextInput
        className={styles.input}
        label="Provincia"
        required
        {...form.getInputProps("province")}
      />
    </div>
  );
}
