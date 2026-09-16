import { formatInTimeZone } from "date-fns-tz";
import { useMemo } from "react";
import { CalendarIcon } from "../../../shared/ui/icons";
import { DatePickerField } from "../../../shared/ui/DatePickerField";
import fieldStyles from "../../../shared/ui/DatePickerField.module.css";
import type { Booking } from "../../../shared/api/types";
import {
  formatDayHeading,
  minutesInTimezone,
} from "../../../shared/lib/date";
import {
  ROW_HEIGHT,
  TIME_LABELS,
  blockPositionStyle,
  isShortBlock,
} from "./scheduleUtils";
import styles from "./Schedule.module.css";

type ScheduleProps = {
  date: Date;
  timezone: string;
  bookings: Booking[];
  myBookingIds: Set<string>;
  onDateChange: (date: Date) => void;
  onBook: () => void;
};

function getOwnBookingLabel(booking: Booking): string {
  const subtitle = booking.comment?.trim() || booking.owner.displayName;
  return subtitle ? `${booking.title} / ${subtitle}` : booking.title;
}

export function Schedule({
  date,
  timezone,
  bookings,
  myBookingIds,
  onDateChange,
  onBook,
}: ScheduleProps) {
  const dayBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const bookingDay = formatInTimeZone(booking.startsAt, timezone, "yyyy-MM-dd");
        const selectedDay = formatInTimeZone(date, timezone, "yyyy-MM-dd");
        return bookingDay === selectedDay;
      }),
    [bookings, date, timezone],
  );

  return (
    <section className={styles.schedule}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Расписание на день</h2>
          <p className={styles.dateLabel}>{formatDayHeading(date, timezone)}</p>
        </div>
        <DatePickerField
          selected={date}
          timezone={timezone}
          onSelect={onDateChange}
          controlClassName={styles.datePicker}
          buttonClassName={styles.dateButton}
          popoverClassName={`${fieldStyles.popoverRight} ${fieldStyles.popoverOffsetMd}`}
          buttonLabel={
            <>
              <CalendarIcon className={styles.calendarIcon} aria-hidden />
              Выбрать дату
            </>
          }
        />
      </div>

      <div className={styles.gridWrap}>
        <div className={styles.timeColumn}>
          {TIME_LABELS.map((label, index) => (
            <span
              key={label}
              className={`${styles.hourLabel} ${
                index === TIME_LABELS.length - 1 ? styles.hourLabelLast : ""
              }`}
              style={{ top: `${index * ROW_HEIGHT}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className={styles.linesColumn}>
          {TIME_LABELS.map((label, index) => {
            if (index === 0) return null;
            return (
              <div
                key={label}
                className={styles.gridLine}
                style={{ top: `${index * ROW_HEIGHT}px` }}
              />
            );
          })}
        </div>

        <div className={styles.blocksLayer}>
          {dayBookings.map((booking) => {
            const isOwn = myBookingIds.has(booking.id);
            const start = minutesInTimezone(booking.startsAt, timezone);
            const end = minutesInTimezone(booking.endsAt, timezone);
            const isCompact = isShortBlock(start, end);

            if (isOwn) {
              return (
                <div
                  key={booking.id}
                  className={`${styles.booking} ${styles.bookingOwn} ${
                    isCompact ? styles.bookingCompact : ""
                  }`}
                  style={blockPositionStyle(start, end)}
                >
                  <p className={styles.bookingTitle}>
                    {getOwnBookingLabel(booking)}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={booking.id}
                className={`${styles.booking} ${styles.bookingOther} ${
                  isCompact ? styles.bookingCompact : ""
                }`}
                style={blockPositionStyle(start, end)}
              >
                Занято
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.bookButton} onClick={onBook}>
          Забронировать комнату
        </button>
      </div>
    </section>
  );
}
