import { Select, TagsInput } from "@mantine/core";
import { StepProps } from "../types/patient-registration-form";
import styles from "../styles/Step.module.css";

export default function Step4({ form }: StepProps) {
  return (
    <div className={styles.container}>
      <Select
        className={styles.input}
        label="Gruppo sanguigno"
        required
        mt="sm"
        data={["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"]}
        {...form.getInputProps("bloodType")}
      />

      <TagsInput
        className={styles.input}
        label="Patologie"
        mt="sm"
        data={[]}
        placeholder="Aggiungi patologie"
        {...form.getInputProps("patologies")}
        error={form.errors.patologies}
      />

      <TagsInput
        className={styles.input}
        label="Farmaci"
        mt="sm"
        data={[]}
        placeholder="Aggiungi farmaci"
        {...form.getInputProps("medications")}
        error={form.errors.medications}
      />

      <TagsInput
        className={styles.input}
        label="Infortuni"
        mt="sm"
        data={[]}
        placeholder="Aggiungi infortuni"
        {...form.getInputProps("injuries")}
        error={form.errors.injuries}
      />
    </div>
  );
}
