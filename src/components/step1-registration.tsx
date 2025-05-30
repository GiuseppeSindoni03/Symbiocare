import { PasswordInput, Popover, TextInput } from "@mantine/core";
import { StepProps } from "../types/registration-form";
import { useState } from "react";
import styles from "../styles/Step.module.css";

// const requirements = [
//   { re: /[0-9]/, label: "Includes number" },
//   { re: /[a-z]/, label: "Includes lowercase letter" },
//   { re: /[A-Z]/, label: "Includes uppercase letter" },
//   { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
// ];

// function getStrength(password: string) {
//   if (password.length < 5) {
//     return 10;
//   }

//   let multiplier = password.length > 5 ? 0 : 1;

//   requirements.forEach((requirement) => {
//     if (!requirement.re.test(password)) {
//       multiplier += 1;
//     }
//   });

//   return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
// }

// function getStrengthColor(strength: number) {
//   switch (true) {
//     case strength < 30:
//       return "red";
//     case strength < 50:
//       return "orange";
//     case strength < 70:
//       return "yellow";
//     default:
//       return "teal";
//   }
// }

export default function Step1({ form }: StepProps) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  // const password = form.values.password;
  // const strength = getStrength(password);
  // const color = getStrengthColor(strength);

  // const checks = requirements.map((requirement, index) => (
  //   <Text
  //     key={index}
  //     color={requirement.re.test(password) ? "teal" : "red"}
  //     size="xs"
  //   >
  //     {requirement.label}
  //   </Text>
  // ));

  return (
    <>
      <div className={styles.container}>
        <TextInput
          className={styles.input}
          label="Nome"
          {...form.getInputProps("name")}
        />
        <TextInput
          className={styles.input}
          label="Cognome"
          {...form.getInputProps("surname")}
        />
        <TextInput
          className={styles.input}
          label="Email"
          {...form.getInputProps("email")}
        />

        <Popover
          opened={popoverOpened}
          position="bottom"
          width="target"
          transitionProps={{ transition: "pop" }}
        >
          <Popover.Target>
            <div
              className={styles.input}
              onFocus={() => setPopoverOpened(true)}
              onBlur={() => setPopoverOpened(false)}
            >
              <PasswordInput
                label="Password"
                placeholder="Crea una password sicura"
                {...form.getInputProps("password")}
                className={styles.input}
              />
            </div>
          </Popover.Target>
          {/* <Popover.Dropdown>
            <Progress
              color={color}
              value={strength}
              size={5}
              style={{ marginBottom: 10 }}
            />
            <Text size="xs" color="dimmed" mb="xs">
              La password deve includere:
            </Text>
            {requirements.map((req, index) => (
              <Text
                key={index}
                color={req.re.test(password) ? "teal" : "red"}
                size="xs"
              >
                • {req.label}
              </Text>
            ))}
          </Popover.Dropdown> */}
        </Popover>

        <PasswordInput
          className={styles.input}
          label="Conferma Password"
          {...form.getInputProps("confirmPassword")}
          mt="sm"
        />
      </div>
    </>
  );
}
