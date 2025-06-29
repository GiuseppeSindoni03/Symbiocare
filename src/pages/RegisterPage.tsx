import styles from "../styles/Register.module.css";
import { useForm } from "@mantine/form";
import { Box, Group, Paper, Button, Stepper } from "@mantine/core";

import { useState } from "react";
import Step1 from "../components/step1-registration";
import Step2 from "../components/step2-registration";
import Step3 from "../components/step3-registration";
import Step4 from "../components/step4-registration";
import { useRegisterMutation } from "../hooks/use-register-mutation";
import { step1Schema } from "../types/validation/registration/step1.schema";
import { step2Schema } from "../types/validation/registration/step2.schema";
import { step3Schema } from "../types/validation/registration/step3.schema";
import { step4Schema } from "../types/validation/registration/step4.schema";
import { ThemeToggle } from "../components/themeToggle";
import BackButton from "../components/BackButton";

export default function RegisterPage() {
  const [active, setActive] = useState(0);
  const mutation = useRegisterMutation();
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

  const getStepData = (step: number) => {
    switch (step) {
      case 0:
        return {
          name: form.values.name,
          surname: form.values.surname,
          email: form.values.email,
          password: form.values.password,
          confirmPassword: form.values.confirmPassword,
        };
      case 1:
        return {
          cf: form.values.cf,
          birthDate: form.values.birthDate,
          phone: form.values.phone,
          gender: form.values.gender,
        };
      case 2:
        return {
          address: form.values.address,
          city: form.values.city,
          cap: form.values.cap,
          province: form.values.province,
        };
      case 3:
        return {
          medicalOffice: form.values.medicalOffice,
          registrationNumber: form.values.registrationNumber,
          orderProvince: form.values.orderProvince,
          orderDate: form.values.orderDate,
          orderType: form.values.orderType,
          specialization: form.values.specialization,
        };
    }
  };

  function handleSubmit(values: typeof form.values) {
    console.log("ciao");
    if (!handleValidation()) return;

    console.log("Dati registrazione:", values);
    // Fai la POST o la mutation qui
    mutation.mutate(values);
  }

  const handleValidation = (): boolean => {
    console.log("Active: ", active);

    const schema = stepSchemas[active];
    const stepData = getStepData(active);
    const result = schema.safeParse(stepData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Imposta gli errori nel form
      Object.entries(errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          form.setFieldError(field, messages[0]); // solo il primo messaggio
        }
      });

      return false;
    }

    return true;
  };

  const handleStepChange = async (nextStep: number) => {
    // chiamare e verificare lo schema dell'attuale step prima di andare avanti:

    console.log("Step attuale: " + active);
    console.log("NextStep: ", nextStep);

    const isOutOfBounds = nextStep > 4 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }

    if (nextStep > active) {
      if (!handleValidation()) return;
    } else setActive(active - 1);

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  // const form = useForm({
  //   initialValues: {
  //     name: "Giuseppe",
  //     surname: "Sindoni",
  //     email: "giuseppe2@example.com",
  //     password: "Giuseppe2#",
  //     confirmPassword: "Giuseppe2#",
  //     cf: "TNSNVN35M44L327Z",
  //     birthDate: "1985-02-08",
  //     phone: "351123456",
  //     gender: "Uomo",
  //     address: "Via Roma 25",
  //     city: "Napoli",
  //     cap: "80100",
  //     province: "NA",
  //     medicalOffice: "Studio Medico Porricelli",
  //     registrationNumber: "NA987654",
  //     orderProvince: "NA",
  //     orderDate: "2012-07-01",
  //     orderType: "Ordine dei Medici Chirurghi",
  //     specialization: "Neurologia",
  //   },
  // });
  const form = useForm({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      cf: "",
      birthDate: "",
      phone: "",
      gender: "",
      address: "",
      city: "",
      cap: "",
      province: "",
      medicalOffice: "",
      registrationNumber: "",
      orderProvince: "",
      orderDate: "",
      orderType: "",
      specialization: "",
    },
  });

  return (
    <>
      <BackButton position="absolute" />
      <ThemeToggle />

      <div className={styles.container}>
        <Box maw={800} mx="auto" mt="xl">
          <Paper
            withBorder
            shadow="md"
            p="lg"
            radius="md"
            className={styles.paper}
            style={{ overflow: "visible" }}
          >
            {/* <Title order={2} mb="md">
          Registrazione Medico
        </Title> */}
            <Stepper
              className={styles.step}
              active={active}
              onStepClick={setActive}
            >
              <Stepper.Step
                label="First step"
                description="General Info"
                allowStepSelect={shouldAllowSelectStep(0)}
              >
                General Info
              </Stepper.Step>
              <Stepper.Step
                label="Second step"
                description="Personal Info"
                allowStepSelect={shouldAllowSelectStep(1)}
              >
                Personal Info
              </Stepper.Step>
              <Stepper.Step
                label="Third Step"
                description="Address info"
                allowStepSelect={shouldAllowSelectStep(2)}
              >
                Address Info
              </Stepper.Step>
              <Stepper.Step
                label="Fourth Step"
                description="Medical Info"
                allowStepSelect={shouldAllowSelectStep(3)}
              >
                Medical Info
              </Stepper.Step>

              <Stepper.Completed>
                Completed, click back button to get to previous step
              </Stepper.Completed>
            </Stepper>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              {active === 0 && <Step1 form={form} />}
              {active === 1 && <Step2 form={form} />}
              {active === 2 && <Step3 form={form} />}
              {active === 3 && <Step4 form={form} />}

              <Group justify="center" mt="xl">
                {active > 0 && (
                  <Button
                    onClick={() => handleStepChange(active - 1)}
                    className={styles.button}
                  >
                    Indietro
                  </Button>
                )}
                {active < 3 && (
                  <Button
                    onClick={() => handleStepChange(active + 1)}
                    className={styles.button}
                  >
                    Avanti
                  </Button>
                )}
                {active === 3 && (
                  <Button
                    type="submit"
                    loading={mutation.isPending}
                    className={styles.button}
                  >
                    Registrati
                  </Button>
                )}
              </Group>
            </form>
          </Paper>
        </Box>
      </div>
    </>
  );
}
