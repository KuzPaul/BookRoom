import { OfficeIcon } from "../../../shared/ui/icons";
import type { Booking } from "../../../shared/api/types";
import {
  formatBookingCardDay,
  formatBookingCardMonth,
  formatBookingTimeRange,
} from "../../../shared/lib/date";
import styles from "./BookingCard.module.css";

type BookingCardProps = {
  booking: Booking;
  showCancel?: boolean;
  onCancel?: () => void;
};

export function BookingCard({
  booking,
  showCancel = false,
  onCancel,
}: BookingCardProps) {
  const timezone = booking.office.timezone;

  return (
    <article className={styles.card}>
      <div className={styles.dateBox}>
        <span className={styles.month}>
          {formatBookingCardMonth(booking.startsAt, timezone)}
        </span>
        <span className={styles.day}>
          {formatBookingCardDay(booking.startsAt, timezone)}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.bookingTitle}>{booking.title}</h3>
        <div className={styles.meta}>
          <OfficeIcon className={styles.metaIcon} aria-hidden />
          <span className={styles.roomName}>{booking.room.name}</span>
          <span className={styles.dot} aria-hidden>
            •
          </span>
          <span>{booking.room.floor} этаж</span>
          <span className={styles.dot} aria-hidden>
            •
          </span>
          <span>
            {formatBookingTimeRange(
              booking.startsAt,
              booking.endsAt,
              timezone,
              booking.office.id,
            )}
          </span>
        </div>
      </div>

      {showCancel && onCancel && (
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Отменить
        </button>
      )}
    </article>
  );
}
