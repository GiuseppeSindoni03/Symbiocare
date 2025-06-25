import PatientsTable from "../components/patients-table";
import styles from "../styles/PatientsPage.module.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PatientsPage() {
  return (
    <div className={styles.container}>
      <PatientsTable />
    </div>
  );
}
