import { TextInput } from "@mantine/core";
import { StepProps } from "../types/registration-form";
import styles from "../styles/Step.module.css";

export default function Step3({ form }: StepProps) {
  return (
    <div className={styles.container}>
      <TextInput
        className={styles.input}
        label="Indirizzo"
        {...form.getInputProps("address")}
      />
      <TextInput
        className={styles.input}
        label="Città"
        {...form.getInputProps("city")}
      />
      <TextInput
        className={styles.input}
        label="CAP"
        {...form.getInputProps("cap")}
      />
      <TextInput
        className={styles.input}
        label="Provincia"
        {...form.getInputProps("province")}
      />
    </div>
  );
}
