import { Box, Button, Group, Stepper, Modal, Paper } from "@mantine/core";
import { NavBar } from "../components/navbar";
import styles from "../styles/addPatient.module.css";
import { useForm } from "@mantine/form";
import { useAddPatientMutation } from "../hooks/use-add-patient.mutation";
import { useState } from "react";
import { step1Schema } from "../types/validation/add-patient/step1.schema";
import Step1 from "../components/step1-patient";
import Step2 from "../components/step2-patient";
import Step3 from "../components/step3-patient";
import Step4 from "../components/step4-patient";
import { step2Schema } from "../types/validation/add-patient/step2.schema";
import { step3Schema } from "../types/validation/add-patient/step3.schema";
import { FormValues } from "../types/patient-registration-form";
import { step4Schema } from "../types/validation/add-patient/step4.schema";
import QRCode from "react-qr-code";
import { useDisclosure } from "@mantine/hooks";

export default function AddPatientPage() {
  const [id, setId] = useState<string | null>(null);

  const mutation = useAddPatientMutation(setId);
  // const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

  const [opened, handler] = useDisclosure(false);

  const getStepData = (step: number) => {
    switch (step) {
      case 0:
        return {
          name: form.values.name,
          surname: form.values.surname,
          email: form.values.email,
          cf: form.values.cf,
          birthDate: form.values.birthDate,
          phone: form.values.phone,
          gender: form.values.gender,
        };
      case 1:
        return {
          address: form.values.address,
          city: form.values.city,
          cap: form.values.cap,
          province: form.values.province,
        };
      case 2:
        return {
          weight: form.values.weight,
          height: form.values.height,
          sport: form.values.sport,
          level: form.values.level,
        };
      case 3:
        return {
          bloodType: form.values.bloodType,
          patologies: form.values.patologies,
          medications: form.values.medications,
          injuries: form.values.injuries,
        };
    }
  };

  const handleValidation = (): boolean => {
    console.log("Active: ", active);

    const schema = stepSchemas[active];
    const stepData = getStepData(active);
    const result = schema.safeParse(stepData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      console.log("Result: ", result);

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

  function handleSubmit(values: typeof form.values) {
    console.log("Submitted values:", values);

    console.log("Prima dell'if");
    if (!handleValidation()) return;

    console.log("Sto chiamando l'api.");
    mutation.mutate({
      ...values,
      birthDate: new Date(values.birthDate),
    });

    handler.open();
  }

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

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      surname: "",
      email: "f",
      cf: "",
      birthDate: new Date(),
      gender: "",
      phone: "",
      address: "",
      city: "",
      cap: "",
      province: "",
      weight: 0,
      height: 0,
      bloodType: "",
      level: "",
      sport: "",
      patologies: [],
      medications: [],
      injuries: [],
    },
  });

  return (
    <div>
      <NavBar />

      <div className={styles.container}>
        <Box maw={800} mx="auto" mt="xl">
          <Paper
            withBorder
            shadow="md"
            p="lg"
            radius="md"
            className={styles.paper}
          >
            <Stepper
              className={styles.step}
              active={active}
              onStepClick={setActive}
            >
              <Stepper.Step
                label="First step"
                description="Personal Info"
                allowStepSelect={shouldAllowSelectStep(0)}
              >
                Personal Info
              </Stepper.Step>
              <Stepper.Step
                label="Second step"
                description="Address Info"
                allowStepSelect={shouldAllowSelectStep(1)}
              >
                Address Info
              </Stepper.Step>
              <Stepper.Step
                label="Third Step"
                description="Physical Info"
                allowStepSelect={shouldAllowSelectStep(2)}
              >
                Physical Info
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

            <form
              onSubmit={form.onSubmit(handleSubmit)}
              className={styles.form}
            >
              {active === 0 && <Step1 form={form} />}
              {active === 1 && <Step2 form={form} />}
              {active === 2 && <Step3 form={form} />}
              {active === 3 && <Step4 form={form} />}

              <Group justify="center" mt="xl" className={styles.footer}>
                {active > 0 && (
                  <Button
                    onClick={() => handleStepChange(active - 1)}
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 90 }}
                    className={styles.button}
                  >
                    Indietro
                  </Button>
                )}
                {active < 3 && (
                  <Button
                    onClick={() => handleStepChange(active + 1)}
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 90 }}
                    className={styles.button}
                  >
                    Avanti
                  </Button>
                )}
                {active === 3 && (
                  <Button
                    type="submit"
                    loading={mutation.isPending}
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 90 }}
                    className={styles.button}
                  >
                    Salva Paziente
                  </Button>
                )}
              </Group>
            </form>
          </Paper>
        </Box>

        {id && (
          <Modal
            opened={opened}
            className={styles.modal}
            onClose={handler.close}
            title="Authentication"
          >
            <QRCode
              //title="title"
              value={id}
              bgColor="#fff"
              //fgcolor="#0000"
              level="L"
              size={256}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
