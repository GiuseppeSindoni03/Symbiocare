import styles from "../styles/Register.module.css";
import { useForm } from "@mantine/form";
import { Paper, Button, Stepper } from "@mantine/core";
import { useState } from "react";
import Step2 from "../components/step2-registration";
import Step3 from "../components/step3-registration";
import Step4 from "../components/step4-registration";
import { useUser } from "../context/UserContext";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { completeEntraProfile } from "../api/auth";
import { step2Schema } from "../types/validation/registration/step2.schema";
import { step3Schema } from "../types/validation/registration/step3.schema";
import { step4Schema } from "../types/validation/registration/step4.schema";
import { ThemeToggle } from "../components/themeToggle";
import BackButton from "../components/BackButton";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

/**
 * Profile completion page for doctors who signed up via Microsoft Entra ID.
 * Skips Step 1 (name/email/password) because that data comes from the Entra token.
 * Shows Steps 2-4: personal info, address, medical details.
 */
export default function CompleteEntraProfilePage() {
  const [active, setActive] = useState(0);
  const { user, setUser, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const stepSchemas = [step2Schema, step3Schema, step4Schema];

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

  const mutation = useMutation({
    mutationFn: (data: typeof form.values) => completeEntraProfile(data),
    onSuccess: (result) => {
      setUser(result.user);
      toast.success("Profilo completato con successo!");
      navigate("/patients", { replace: true });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Errore nel completamento del profilo";
      if (Array.isArray(message)) {
        toast.error(`Errore: ${message.join(" | ")}`);
      } else {
        toast.error(`Errore: ${message}`);
      }
    },
  });

  const getStepData = (step: number) => {
    switch (step) {
      case 0:
        return {
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
          medicalOffice: form.values.medicalOffice,
          registrationNumber: form.values.registrationNumber,
          orderProvince: form.values.orderProvince,
          orderDate: form.values.orderDate,
          orderType: form.values.orderType,
          specialization: form.values.specialization,
        };
    }
  };

  const handleValidation = async (): Promise<boolean> => {
    const schema = stepSchemas[active];
    const stepData = getStepData(active);

    try {
      await schema.parseAsync(stepData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        Object.entries(errors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            form.setFieldError(field, messages[0]);
          }
        });
      }
      return false;
    }
  };

  const handleStepChange = async (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;
    if (isOutOfBounds) return;

    if (nextStep > active) {
      if (!(await handleValidation())) return;
    }

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!(await handleValidation())) return;
    mutation.mutate(values);
  };

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  // If not authenticated, redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <BackButton position="absolute" path={undefined} />
      <ThemeToggle />

      <div className={styles.container}>
        <div className={styles.main}>
          <Paper
            withBorder
            shadow="md"
            p="lg"
            radius="md"
            className={styles.paper}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "var(--accent-primary)", marginBottom: "0.5rem" }}>
                Benvenuto, {user?.name}!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Completa il tuo profilo medico per iniziare a usare SymbioCare
              </p>
            </div>

            <Stepper
              active={active}
              onStepClick={setActive}
              className={styles.header}
              size="lg"
            >
              <Stepper.Step
                color="var(--accent-primary)"
                className={styles.step}
                label="Primo step"
                description="Informazioni personali"
                allowStepSelect={shouldAllowSelectStep(0)}
              />
              <Stepper.Step
                color="var(--accent-primary)"
                label="Secondo step"
                description="Informazioni di residenza"
                allowStepSelect={shouldAllowSelectStep(1)}
              />
              <Stepper.Step
                color="var(--accent-primary)"
                label="Terzo step"
                description="Informazioni mediche"
                allowStepSelect={shouldAllowSelectStep(2)}
              />
            </Stepper>

            <form
              className={styles.form}
              onSubmit={form.onSubmit(handleSubmit)}
            >
              <div className={styles.fields}>
                {active === 0 && <Step2 form={form} />}
                {active === 1 && <Step3 form={form} />}
                {active === 2 && <Step4 form={form} />}
              </div>

              <div className={styles.buttonGroup}>
                {active > 0 && (
                  <Button
                    onClick={() => handleStepChange(active - 1)}
                    className="button"
                  >
                    Indietro
                  </Button>
                )}
                {active < 2 && (
                  <Button
                    onClick={() => handleStepChange(active + 1)}
                    className="button"
                  >
                    Avanti
                  </Button>
                )}
                {active === 2 && (
                  <Button
                    type="submit"
                    loading={mutation.isPending}
                    className="button"
                  >
                    Completa Profilo
                  </Button>
                )}
              </div>
            </form>
          </Paper>
        </div>
      </div>
    </>
  );
}
