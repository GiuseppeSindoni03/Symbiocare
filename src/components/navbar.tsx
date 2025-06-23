import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";
import { Avatar, Indicator } from "@mantine/core";
import { ThemeToggle } from "./themeToggle";
import {
  IconUsers,
  IconCalendar,
  IconClipboardList,
  IconReportMedical,
  IconSettings,
  IconBell,
  IconStethoscope,
  IconActivity,
  IconFileText,
  IconSearch,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.navItem} ${active ? styles.active : ""}`}
    >
      {icon}
      <span>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </button>
  );
}

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: <IconUsers size={20} />,
      label: "Patients",
      path: "/home",
      badge: "24",
    },
    {
      icon: <IconCalendar size={20} />,
      label: "Availability Calendar",
      path: "/availability",
    },
    {
      icon: <IconClipboardList size={20} />,
      label: "Appointments",
      path: "/appointments",
      badge: "3",
    },
    { icon: <IconFileText size={20} />, label: "Reports", path: "/reports" },
    { icon: <IconSettings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left} onClick={() => navigate("/home")}>
        <Logo dimension="small" />
        <div className={styles.logoText}>
          <h1>SymbioCare</h1>
          <p>Patient Management System</p>
        </div>
      </div>
      <div className={styles.right}>
        <nav className={styles.links}>
          <div className={styles.headerAction}>
            <ThemeToggle absolute={false} />
          </div>
          <button className={styles.headerAction}>
            <IconBell size={18} />
          </button>
          {/* <button onClick={() => navigate("/add-patient")}>
            Aggiungi paziente
          </button>
          <button onClick={() => navigate("/Home")}>Patients</button>
          <button onClick={() => navigate("/calendar")}>Calendar</button> */}
        </nav>

        <Indicator
          inline
          size={16}
          offset={7}
          position="bottom-end"
          color="green"
          withBorder
          className={styles.indicator}
        >
          <Avatar
            radius="xl"
            src="doctor.svg"
            onClick={() => navigate("/doctor-page")}
          ></Avatar>
        </Indicator>

        <div className={styles.userInfo}>
          <h3>Dr. Giuseppe Sindoni</h3>
          <p>Cardiologist</p>
        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={styles.navSection}></div>
        <h3 className={styles.navTitle}>Navigation</h3>
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
            }}
          />
        ))}
      </nav>
    </div>
  );
}
