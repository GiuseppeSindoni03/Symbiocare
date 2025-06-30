import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";
import { Avatar, Indicator, TextInput, Menu, Text } from "@mantine/core";
import { ThemeToggle } from "./themeToggle";
import {
  IconSearch,
  IconChevronDown,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useUser } from "../context/UserContext";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLogoutMutation } from "../hooks/use-logout-mutation";

export function NavBar() {
  const [_searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const query = useQueryClient();
  const mutation = useLogoutMutation();

  const handleLogout = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams({
      page: "1",
      limit: "12",
      search: search,
    });
    setSearchParams(newParams);
    query.invalidateQueries({
      queryKey: ["patients"],
      exact: false,
    });
  };

  return (
    <header className={styles.navbar}>
      {/* Brand Section */}
      <div className={styles.brand} onClick={() => navigate("/patients")}>
        <Logo dimension="small" />
        <div className={styles.brandText}>
          <h1>SymbioCare</h1>
          <span>Patient Management</span>
        </div>
      </div>

      {/* Search Section - Solo nella pagina pazienti */}
      {location.pathname === "/patients" && (
        <div className={styles.searchSection}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <TextInput
              value={search}
              leftSection={<IconSearch size={16} />}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Cerca pazienti..."
              size="md"
              className={styles.searchInput}
              variant="filled"
            />
          </form>
        </div>
      )}

      {/* Actions Section */}
      <div className={styles.actions}>
        {/* Notifications */}

        {/* Theme Toggle */}
        <div className={styles.actionButton}>
          <ThemeToggle absolute={false} />
        </div>

        {/* User Menu */}
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <div className={styles.userProfile}>
              <Indicator
                inline
                size={12}
                offset={4}
                position="bottom-end"
                color="green"
                withBorder
              >
                <Avatar radius="xl" size={40} src="doctor.svg" />
              </Indicator>
              <div className={styles.userInfo}>
                <Text size="md" fw={1000} className={styles.userName}>
                  Dr. {user?.name} {user?.surname}
                </Text>
                <Text size="xs" c="dimmed" className={styles.userRole}>
                  {user?.doctor?.specialization}
                </Text>
              </div>

              <IconChevronDown size={14} className={styles.chevron} />
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconUser size={16} />}
              onClick={() => navigate("/doctor-page")}
            >
              Profilo
            </Menu.Item>

            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              color="red"
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
}
