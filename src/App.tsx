import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Container from "./components/container";
import { ToastContainer } from "react-toastify";
import Register from "./pages/RegisterPage";
import DoctorPage from "./pages/DoctorPage";
import AddPatientPage from "./pages/AddPatientPage";
import CalendarPage from "./pages/CalendarPage";
import PatientPage from "./pages/PatientPage";

function App() {
  return (
    <>
      <MantineProvider theme={{ fontFamily: "Inter, sans-serif" }}>
        <BrowserRouter>
          <Container />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctor-page" element={<DoctorPage />} />
            <Route path="/add-patient" element={<AddPatientPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/patients/:id" element={<PatientPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
