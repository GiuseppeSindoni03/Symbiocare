import { useCallback } from "react";
import { useLogoutMutation } from "../hooks/use-logout-mutation";
import { NavBar } from "../components/navbar";
import DoctorInfo from "../components/doctorInfo";
import styles from "../styles/doctorPage.module.css";

export default function DoctorPage() {
  const mutation = useLogoutMutation();
  //const { isAuthenticated, user } = useUser();

  const handleLogout = useCallback(() => {
    mutation.mutate();
  }, [mutation]);
  return (
    <div>
      <NavBar />

      <div className={styles.container}>
        <DoctorInfo />

        <button onClick={handleLogout} disabled={mutation.isPending}>
          {mutation.isPending ? "Logout in corso..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
