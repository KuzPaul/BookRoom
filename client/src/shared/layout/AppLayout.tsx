import { Outlet } from "react-router-dom";
import { useAppRealtime } from "../lib/useAppRealtime";
import { Header } from "./Header";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  useAppRealtime();

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
