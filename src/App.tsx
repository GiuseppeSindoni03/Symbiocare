import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@mantine/core/styles.css";
import Login from "./pages/LoginPage";
import Home from "./pages/PatientsPage";
import Container from "./components/container";
import { ToastContainer } from "react-toastify";
import Register from "./pages/RegisterPage";
import DoctorPage from "./pages/DoctorPage";
import AddPatientPage from "./pages/AddPatientPage";
import CalendarPage from "./pages/CalendarPage";
import PatientPage from "./pages/PatientPage";
import "@mantine/core/styles.css";
import { ThemeProvider } from "./context/ThemeContext";
import { useUser } from "./context/UserContext";
import { Loader } from "lucide-react";
import PatientsPage from "./pages/PatientsPage";
import Layout from "./components/Layout";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/custom.calendar.css";

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
              <Route path="/doctor-page" element={<DoctorPage />} />
              <Route path="/add-patient" element={<AddPatientPage />} />
              <Route path="/availability" element={<CalendarPage />} />
              <Route path="/patients/:id" element={<PatientPage />} />
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
