import { NavLink } from "react-router-dom";
import { HeaderIcon } from "../ui/icons";
import { Container } from "./Container";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <HeaderIcon width={18} height={18} aria-hidden />
            </span>
            <span className={styles.logoText}>BookRoom</span>
          </div>

          <nav className={styles.nav}>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
            >
              Переговорные
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
            >
              Мои бронирования
            </NavLink>
          </nav>

          <div className={styles.user}>
            <span className={styles.userName}>Кузнецов П.</span>
            <span className={styles.avatar}>КП</span>
          </div>
        </div>
      </Container>
    </header>
  );
}
