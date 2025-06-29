import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@mantine/core/styles.css";
import Login from "./pages/LoginPage";
import Container from "./components/container";
import { ToastContainer } from "react-toastify";
import Register from "./pages/RegisterPage";
import AddPatientPage from "./pages/AddPatientPage";
import PatientPage from "./pages/PatientPage";
import "@mantine/core/styles.css";
import { ThemeProvider } from "./context/ThemeContext";
import { useUser } from "./context/UserContext";
import { Loader } from "lucide-react";
import PatientsPage from "./pages/PatientsPage";
import Layout from "./components/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/custom.calendar.css";
import CalendarAvailability from "./pages/CalendarAvailability";
import CalendarReservations from "./pages/CalendarReservation";
import DoctorInfo from "./components/doctorInfo";

function App() {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
          }}
        >
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <Container />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/:id" element={<PatientPage />} />
              <Route path="add-patient" element={<AddPatientPage />} />
              <Route path="/doctor-page" element={<DoctorInfo />} />
              <Route path="/reservations" element={<CalendarReservations />} />
              <Route path="/availability" element={<CalendarAvailability />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
