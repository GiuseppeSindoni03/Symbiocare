import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";
import { Avatar, Indicator } from "@mantine/core";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.left} onClick={() => navigate("/home")}>
        <Logo dimension="small" />
      </div>
      <div className={styles.right}>
        <nav className={styles.links}>
          <button onClick={() => navigate("/add-patient")}>
            Aggiungi paziente
          </button>
          <button onClick={() => navigate("/Home")}>Patients</button>
          <button onClick={() => navigate("/calendar")}>Calendar</button>
        </nav>
        <Indicator
          inline
          size={16}
          offset={7}
          position="bottom-end"
          color="green"
          withBorder
        >
          <Avatar
            radius="xl"
            src="doctor.svg"
            onClick={() => navigate("/doctor-page")}
          ></Avatar>
        </Indicator>
      </div>
    </div>
  );
}
