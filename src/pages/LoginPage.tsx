import { useLoginMutation } from "../hooks/use-login-mutation";
import { useUser } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Divider,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Title,
} from "@mantine/core";

import styles from "../styles/Login.module.css";

import Logo from "../components/Logo";
import { hasLength, isEmail, useForm } from "@mantine/form";

export default function LoginPage() {
  const mutation = useLoginMutation();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength({ min: 8 }),
    },
  });

  async function handleSubmit(values: typeof form.values) {
    //e.preventDefault();
    console.log("Credenziali:", values);

    mutation.mutate(values);
  }

  if (isAuthenticated) return <Navigate to="/home" />;

  return (
    <div className={styles.page}>
      {/* <Header /> */}

      <main className={styles.main}>
        <Box className={styles.container}>
          <Logo dimension={"big"} />
          <Paper p="xl" radius="lg" style={{ width: "100%" }}>
            <Title className={styles.title} order={2} mb="md">
              Welcome back!
            </Title>
            <form
              onSubmit={form.onSubmit(handleSubmit)}
              className={styles.form}
            >
              <TextInput
                placeholder="Email"
                {...form.getInputProps("email")}
                required
                styles={{ input: { height: 50 } }}
                className={styles.input}
              />
              <PasswordInput
                placeholder="Password"
                mt="sm"
                type="password"
                required
                {...form.getInputProps("password")}
                styles={{ input: { height: 50 } }}
                className={styles.input}
              />
              <Space h="md" />
              <Center>
                <Button
                  variant="gradient"
                  type="submit"
                  mt="md"
                  className={styles.button}
                  gradient={{ from: "indigo", to: "cyan", deg: 90 }}
                >
                  Accedi
                </Button>
              </Center>

              <Divider my="md" label="o" labelPosition="center" />
              <Center>
                <Button
                  mt="md"
                  className={styles.button}
                  onClick={() => navigate("/register")}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 90 }}
                >
                  Registrati
                </Button>
              </Center>
            </form>
          </Paper>
        </Box>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
