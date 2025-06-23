import { PasswordInput, Popover, TextInput } from "@mantine/core";
import { StepProps } from "../types/registration-form";
import { useState } from "react";
import styles from "../styles/Step.module.css";

export default function Step1({ form }: StepProps) {
  // const [popoverOpened, setPopoverOpened] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <TextInput
          className={styles.input}
          label="Nome"
          {...form.getInputProps("name")}
          placeholder="Inserisci il tuo nome"
        />
        <TextInput
          className={styles.input}
          label="Cognome"
          {...form.getInputProps("surname")}
          placeholder="Inserisci il tuo cognome"
        />
        <TextInput
          className={styles.input}
          label="Email"
          {...form.getInputProps("email")}
          placeholder="Inserisci la tua mail"
        />

        <Popover
          //opened={popoverOpened}
          position="bottom"
          width="target"
          transitionProps={{ transition: "pop" }}
        >
          {/* onFocus={() => setPopoverOpened(true)}
               onBlur={() => setPopoverOpened(false)} */}
          <Popover.Target>
            <div
              className={styles.input}
              // onFocus={() => setPopoverOpened(true)}
              // onBlur={() => setPopoverOpened(false)}
            >
              <PasswordInput
                label="Password"
                placeholder="Crea una password sicura"
                {...form.getInputProps("password")}
                className={styles.input}
              />
            </div>
          </Popover.Target>
        </Popover>

        <PasswordInput
          className={styles.input}
          label="Conferma Password"
          {...form.getInputProps("confirmPassword")}
          placeholder="Conferma password"
          mt="sm"
        />
      </div>
    </>
  );
}
