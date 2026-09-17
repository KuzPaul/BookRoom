import { Link } from "react-router-dom";
import { NotReservationIcon } from "../../../shared/ui/icons";
import type { BookingsTabScope } from "../types";
import styles from "./BookingsStates.module.css";

type BookingsEmptyStateProps = {
  scope: BookingsTabScope;
};

export function BookingsEmptyState({ scope }: BookingsEmptyStateProps) {
  if (scope === "past") {
    return (
      <section className={styles.stateBlock}>
        <div className={styles.stateIcon}>
          <NotReservationIcon aria-hidden />
        </div>
        <h2 className={styles.stateTitle}>Нет прошедших бронирований</h2>
        <p className={styles.stateText}>
          Здесь будут отображаться завершённые встречи
        </p>
      </section>
    );
  }

  return (
    <section className={styles.stateBlock}>
      <div className={styles.stateIcon}>
        <NotReservationIcon aria-hidden />
      </div>
      <h2 className={styles.stateTitle}>Нет бронирований</h2>
      <p className={styles.stateText}>
        У вас пока нет предстоящих бронирований. Перейдите в раздел переговорных,
        чтобы забронировать комнату.
      </p>
      <Link className={styles.primaryButton} to="/rooms">
        Перейти к переговорным
      </Link>
    </section>
  );
}
