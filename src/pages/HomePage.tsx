import PatientsTable from "../components/patients-table";
import { NavBar } from "../components/navbar";
import styles from "../styles/Home.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <NavBar></NavBar>

      <PatientsTable />
    </div>
  );
}
