import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";
import { Avatar, Button, Indicator, TextInput } from "@mantine/core";
import { ThemeToggle } from "./themeToggle";
import { IconBell, IconSearch } from "@tabler/icons-react";
import { useUser } from "../context/UserContext";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function NavBar() {
  const [_searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const query = useQueryClient();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset a pagina 1 e aggiungi la search string nella query URL
    const newParams = new URLSearchParams({
      page: "1",
      limit: "12", // puoi anche recuperarlo dinamicamente
      search: search,
    });

    setSearchParams(newParams);

    query.invalidateQueries({
      queryKey: ["patients"],
      exact: false,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left} onClick={() => navigate("/patients")}>
        <Logo dimension="small" />
        <div className={styles.logoText}>
          <h1>SymbioCare</h1>
          <p>Patient Management System</p>
        </div>
      </div>
      <div className={styles.right}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Cerca pazienti..."
            size="sm"
          />
          <Button type="submit" size="sm" className={styles.headerAction}>
            <IconSearch size={16} />{" "}
          </Button>
        </form>
        <nav className={styles.links}>
          <div className={styles.headerAction}>
            <ThemeToggle absolute={false} />
          </div>
          <button className={styles.headerAction}>
            <IconBell size={18} />
          </button>
        </nav>

        <div className={styles.user} onClick={() => navigate("/doctor-page")}>
          <Indicator
            inline
            size={16}
            offset={7}
            position="bottom-end"
            color="green"
            withBorder
            className={styles.indicator}
          >
            <Avatar radius="xl" size={45} src="doctor.svg"></Avatar>
          </Indicator>

          <div className={styles.userInfo}>
            <h3>
              Dr. {user?.name} {user?.surname}
            </h3>
            <p>{user?.doctor?.specialization}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
