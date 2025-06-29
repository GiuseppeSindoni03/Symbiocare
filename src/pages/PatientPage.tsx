import { useParams } from "react-router-dom";
import { usePatient } from "../hooks/use-patients";
import {
  Avatar,
  Button,
  Divider,
  Loader,
  Modal,
  Paper,
  Title,
} from "@mantine/core";
import { IconPhone, IconQrcode, IconUser } from "@tabler/icons-react";
import styles from "../styles/PatientPage.module.css";

import InfoCard from "../components/InfoCard";
import {
  Accessibility,
  Building2,
  Droplet,
  HeartPulse,
  House,
  IdCard,
  Mail,
  MapPin,
  Medal,
  Pill,
  Ruler,
  Scale,
  Stethoscope,
  VenusAndMars,
} from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import QRCode from "react-qr-code";
import BackButton from "../components/BackButton";

export default function PatientPage() {
  const { id } = useParams<{ id: string }>();

  console.log("Id pazient: ", id);
  if (!id) {
    return <div>Errore nel Caricamento...</div>;
  }

  const [opened, handler] = useDisclosure(false);

  const { data: patient, isLoading, isError } = usePatient(id);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // occupa tutto lo schermo
        }}
      >
        <Loader size="xl" />
      </div>
    );

  if (isError || !patient) return <div>Errore nel Caricamento.. </div>;

  console.log("Paziente: ", patient);

  return (
    <div className={styles.container}>
      <Paper radius="md" p="md" className={styles.header}>
        <BackButton position="static" />

        <div className={styles.profileHeader}>
          <Avatar
            size={120}
            radius="xl"
            color="var(--accent-primary)"
            className={styles.avatar}
          >
            <IconUser size={80} />
          </Avatar>
          <div className={styles.nameSection}>
            <Title order={2} fw={700}>
              {patient.user.name} {patient.user.surname}
            </Title>
            {patient.user.inviteId && (
              <Button
                leftSection={<IconQrcode size={16} />}
                onClick={handler.open}
                mt="xs"
                className="button"
              >
                QR di invito
              </Button>
            )}
          </div>
        </div>

        <Title order={3} mt="xl" mb="sm">
          Informazioni personali{" "}
        </Title>
        <Divider mb="md" />

        <div className={styles.userInfoGrid}>
          <InfoCard
            value={patient.user.cf}
            icon={<IdCard />}
            label="Codice Fiscale"
          />
          <InfoCard value={patient.user.email} icon={<Mail />} label="Email" />
          <InfoCard
            value={patient.user.phone}
            icon={<IconPhone />}
            label="Telefono"
          />
          <InfoCard
            value={patient.user.gender}
            icon={<VenusAndMars />}
            label="Genere"
          />
          <InfoCard
            value={patient.user.address}
            icon={<House />}
            label="Indirizzo"
          />
          <InfoCard
            value={patient.user.city}
            icon={<Building2 />}
            label="Città"
          />
          <InfoCard value={patient.user.cap} icon={<MapPin />} label="CAP" />
        </div>

        <Title order={3} mt="xl" mb="sm">
          Informazioni mediche{" "}
        </Title>
        <Divider mb="md" />
        <div className={styles.medicalInfo}>
          <InfoCard
            value={String(patient.weight)}
            icon={<Scale />}
            label="Peso kg"
          />
          <InfoCard
            value={String(patient.height)}
            icon={<Ruler />}
            label="Altezza cm"
          />
          <InfoCard
            value={patient.bloodType}
            icon={<Droplet />}
            label="Gruppo sanguigno"
          />
          <InfoCard value={patient.sport} icon={<HeartPulse />} label="Sport" />
          <InfoCard
            value={patient.level}
            icon={<Medal />}
            label="Livello sportivo"
          />

          {patient.medications.length > 0 && (
            <InfoCard
              value={patient.medications}
              icon={<Pill />}
              label="Farmaci"
            />
          )}

          {patient.injuries.length > 0 && (
            <InfoCard
              value={patient.injuries}
              icon={<Accessibility />}
              label="Infortuni"
            />
          )}

          {patient.patologies.length > 0 && (
            <InfoCard
              value={patient.patologies}
              icon={<Stethoscope />}
              label="Patologie"
            />
          )}
        </div>

        <Modal
          opened={opened}
          onClose={handler.close}
          title={null} // titolo custom dentro il body
          size="auto"
          radius="md"
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          centered
        >
          <div style={{ textAlign: "center", padding: "1.5rem" }}>
            <h2
              style={{
                marginBottom: "0.5rem",
                fontSize: "1.5rem",
                color: "var(--text-primary)",
              }}
            >
              QR Code per la registrazione
            </h2>
            <p
              style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}
            >
              Scansiona questo codice per completare la registrazione del
              paziente.
            </p>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                display: "inline-block",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <QRCode
                value={String(patient.user.inviteId)}
                level="L"
                size={300}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <button onClick={handler.close} className="button">
                Chiudi
              </button>
            </div>
          </div>
        </Modal>
      </Paper>
    </div>
  );
}
