import { Link } from "react-router-dom";
import { ClockIcon, UsersIcon } from "../../../shared/ui/icons";
import type { RoomSummary } from "../../../shared/api/types";
import styles from "./RoomCard.module.css";

type RoomCardProps = {
  room: RoomSummary;
  filterFrom: string;
  filterTo: string;
};

export function RoomCard({ room, filterFrom, filterTo }: RoomCardProps) {
  const isAvailable = room.available ?? false;
  const occupancyText = isAvailable
    ? "Свободна на выбранное время"
    : "Занята на выбранное время";

  const bookingSearch = new URLSearchParams({
    startsAt: filterFrom,
    endsAt: filterTo,
  });

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{room.name}</h3>
        <p className={styles.cardFloor}>{room.floor} этаж</p>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.metaRow}>
          <UsersIcon className={styles.metaIcon} aria-hidden />
          <span>Вместимость: до {room.capacity} человек</span>
        </div>
        <div className={styles.metaRow}>
          <ClockIcon className={styles.metaIcon} aria-hidden />
          <span>{occupancyText}</span>
        </div>
      </div>

      <div
        className={`${styles.statusBadge} ${
          isAvailable ? styles.statusAvailable : styles.statusUnavailable
        }`}
      >
        <span
          className={`${styles.statusDot} ${
            isAvailable ? styles.dotAvailable : styles.dotUnavailable
          }`}
        />
        {isAvailable
          ? "Доступно на выбранное время"
          : "Недоступно на выбранное время"}
      </div>

      <div className={styles.cardActions}>
        <Link className={styles.linkButton} to={`/rooms/${room.id}`}>
          Подробнее
        </Link>
        {isAvailable ? (
          <Link
            className={styles.primaryButton}
            to={`/rooms/${room.id}?${bookingSearch.toString()}`}
          >
            Забронировать
          </Link>
        ) : (
          <button className={styles.primaryButton} type="button" disabled>
            Забронировать
          </button>
        )}
      </div>
    </article>
  );
}
