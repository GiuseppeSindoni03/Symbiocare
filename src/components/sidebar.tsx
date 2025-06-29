import { CalendarPlus2, LogOut, UserPlus } from "lucide-react";
import { usePatients } from "../hooks/use-patients";
import styles from "../styles/sidebar.module.css";

import {
  IconUsers,
  IconClipboardList,
  IconSettings,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/use-logout-mutation";
import { useCallback } from "react";

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
  const { data } = usePatients();
  const mutation = useLogoutMutation();

  const logout = {
    icon: <LogOut size={25} />,
    label: "Logout",
    path: "/login",
  };

  const navItems = [
    {
      icon: <IconUsers size={25} />,
      label: "Pazienti",
      path: "/patients",
      badge: `${data?.total ? data.total : ""} `,
    },
    {
      icon: <UserPlus size={25} />,
      label: "Aggiungi paziente",
      path: "/add-patient",
    },
    {
      icon: <CalendarPlus2 size={25} />,
      label: "Calendario disponibiltà",
      path: "/availability",
    },
    {
      icon: <IconClipboardList size={25} />,
      label: "Calendario prenotazioni",
      path: "/reservations",
    },

    {
      icon: <IconSettings size={25} />,
      label: "Impostazioni",
      path: "/settings",
    },
  ];

  const handleLogout = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return (
    <div className={styles.sidebar}>
      <nav className={styles.navbar}>
        <div className={styles.navTop}>
          <h3 className={styles.navTitle}>Navigazione</h3>
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
        <div className={styles.navBottom}>
          <NavItem {...logout} onClick={handleLogout} />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
