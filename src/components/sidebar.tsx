import { UserPlus } from "lucide-react";
import { usePatients } from "../hooks/use-patients";
import styles from "../styles/sidebar.module.css";

import {
  IconUsers,
  IconCalendar,
  IconClipboardList,
  IconSettings,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading } = usePatients();

  const navItems = [
    {
      icon: <IconUsers size={25} />,
      label: "Pazienti",
      path: "/patients",
      badge: `${data?.total ? data.total : ""} `,
    },
    {
      icon: <IconCalendar size={25} />,
      label: "Calendario disponibiltà",
      path: "/availability",
    },
    {
      icon: <IconClipboardList size={25} />,
      label: "Visite mediche",
      path: "/appointments",
    },
    {
      icon: <UserPlus size={25} />,
      label: "Aggiungi paziente",
      path: "/add-patient",
    },
    {
      icon: <IconSettings size={25} />,
      label: "Impostazioni",
      path: "/settings",
    },
  ];

  return (
    <div>
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
};

export default SideBar;
