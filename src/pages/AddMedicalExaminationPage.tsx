import { useParams, useSearchParams } from "react-router-dom";
import ReservationsTable from "../components/ReservationTable";
import { useCallback } from "react";
import styles from "../styles/addMedicalExaminationPage.module.css";
import { Text } from "@mantine/core";

export default function AddMedicalExamination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { patient } = useParams<{ patient: string }>();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const search = searchParams.get("search") || "";

  const handlePaginationChange = useCallback(
    ({ page: newPage, limit: newLimit }: { page: number; limit: number }) => {
      const urlParams: Record<string, string> = {
        page: newPage.toString(),
        limit: newLimit.toString(),
      };

      if (search) {
        urlParams.search = search;
      }

      setSearchParams(urlParams);
    },
    [search, setSearchParams]
  );

  console.log("Sono dentro ");

  if (!patient) return <div>Errore manca il patient Id</div>;

  return (
    <div className={styles.container}>
      <ReservationsTable
        patient={patient}
        search={search}
        page={page}
        limit={limit}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
