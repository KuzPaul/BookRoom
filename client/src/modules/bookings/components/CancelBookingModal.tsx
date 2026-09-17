import {
  CalendarIcon,
  OfficeIcon,
} from "../../../shared/ui/icons";
import type { Booking } from "../../../shared/api/types";
import { formatCancelModalDateTime } from "../../../shared/lib/date";
import styles from "./CancelBookingModal.module.css";

type CancelBookingModalProps = {
  booking: Booking;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelBookingModal({
  booking,
  isPending = false,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const timezone = booking.office.timezone;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-booking-title"
      >
        <h2 id="cancel-booking-title" className={styles.title}>
          Отменить бронирование?
        </h2>
        <p className={styles.text}>
          Это действие нельзя будет отменить. Освободившееся время станет
          доступно другим сотрудникам.
        </p>

        <div className={styles.summary}>
          <p className={styles.summaryTitle}>{booking.title}</p>
          <div className={styles.summaryRow}>
            <OfficeIcon className={styles.summaryIcon} aria-hidden />
            <span>
              Комната &apos;{booking.room.name}&apos;, {booking.room.floor} этаж
            </span>
          </div>
          <div className={styles.summaryRow}>
            <CalendarIcon className={styles.summaryIcon} aria-hidden />
            <span>
              {formatCancelModalDateTime(
                booking.startsAt,
                booking.endsAt,
                timezone,
              )}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.keepButton}
            onClick={onClose}
            disabled={isPending}
          >
            Нет, оставить
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isPending}
          >
            Да, отменить
          </button>
        </div>
      </div>
    </div>
  );
}
