import { NumberInput, Select, TextInput } from "@mantine/core";
import { StepProps } from "../types/patient-registration-form";
import styles from "../styles/Step.module.css";

export default function Step3({ form }: StepProps) {
  return (
    <div className={styles.container}>
      <NumberInput
        label="Peso (kg)"
        required
        className={styles.input}
        {...form.getInputProps("weight")}
      />
      <NumberInput
        label="Altezza (cm)"
        required
        className={styles.input}
        {...form.getInputProps("height")}
      />

      <TextInput
        label="Sport"
        required
        className={styles.input}
        mt="sm"
        {...form.getInputProps("sport")}
      />
      <Select
        label="Livello"
        mt="sm"
        className={styles.input}
        required
        data={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
        {...form.getInputProps("level")}
      />
    </div>
  );
}
