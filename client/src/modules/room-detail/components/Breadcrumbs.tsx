import { Link } from "react-router-dom";
import type { RoomSummary } from "../../../shared/api/types";
import styles from "./Breadcrumbs.module.css";

type BreadcrumbsProps = {
  room: RoomSummary;
};

export function Breadcrumbs({ room }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Навигация">
      <Link className={styles.link} to="/rooms">
        Переговорные
      </Link>
      <span className={styles.separator} aria-hidden>
        ›
      </span>
      <span>{room.office.name}</span>
      <span className={styles.separator} aria-hidden>
        ›
      </span>
      <span className={styles.current}>Комната &apos;{room.name}&apos;</span>
    </nav>
  );
}
