import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
} from "../../../shared/ui/icons";
import { DatePickerField } from "../../../shared/ui/DatePickerField";
import fieldStyles from "../../../shared/ui/DatePickerField.module.css";
import { FilterDropdown } from "../../../shared/ui/FilterDropdown";
import { createBooking } from "../../../shared/api/bookings.api";
import { ApiError } from "../../../shared/api/http";
import type { Booking, RoomSummary } from "../../../shared/api/types";
import {
  buildInterval,
  clampDurationForStartTime,
  formatBookingBannerSummary,
  formatDateLabel,
  formatDurationWithEnd,
  generateDurationOptions,
  generateTimeSlots,
  isValidStartTime,
} from "../../../shared/lib/date";
import type { SelectedSlot } from "../types";
import styles from "./BookingModal.module.css";

type BookingModalProps = {
  room: RoomSummary;
  initialDate: Date;
  initialSlot: SelectedSlot | null;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
  onConflict: () => void;
};

type FieldErrors = {
  title?: string;
  date?: string;
};

export function BookingModal({
  room,
  initialDate,
  initialSlot,
  onClose,
  onSuccess,
  onConflict,
}: BookingModalProps) {
  const queryClient = useQueryClient();
  const timezone = room.office.timezone;

  const initialStartTime = initialSlot?.startTime ?? "15:00";

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [durationMin, setDurationMin] = useState(() =>
    clampDurationForStartTime(
      initialStartTime,
      initialSlot?.durationMin ?? 60,
    ),
  );
  const [comment, setComment] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const timeSlots = generateTimeSlots();
  const durationOptions = useMemo(
    () =>
      isValidStartTime(startTime) ? generateDurationOptions(startTime) : [],
    [startTime],
  );

  const handleStartTimeChange = (nextStartTime: string) => {
    setStartTime(nextStartTime);
    setDurationMin((current) =>
      clampDurationForStartTime(nextStartTime, current),
    );
  };

  const mutation = useMutation({
    mutationFn: () => {
      const interval = buildInterval(date, startTime, durationMin, timezone);
      return createBooking({
        roomId: room.id,
        title: title.trim(),
        startsAt: interval.from,
        endsAt: interval.to,
        comment: comment.trim() || undefined,
      });
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["room-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess(booking);
    },
    onError: (error) => {
      if (!(error instanceof ApiError)) return;

      if (error.status === 409 || error.code === "BOOKING_CONFLICT") {
        queryClient.invalidateQueries({ queryKey: ["room-bookings"] });
        onConflict();
        return;
      }

      const nextErrors: FieldErrors = {};

      if (error.code === "TITLE_REQUIRED") {
        nextErrors.title = "Обязательное поле";
      }
      if (error.code === "START_NOT_IN_FUTURE") {
        nextErrors.date = "Нельзя создать бронирование в прошлом";
      }

      setFieldErrors(nextErrors);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!title.trim()) {
      nextErrors.title = "Обязательное поле";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    mutation.mutate();
  };

  const summary = formatBookingBannerSummary(
    date,
    startTime,
    durationMin,
    timezone,
  );

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <div className={styles.header}>
          <h2 id="booking-modal-title" className={styles.title}>
            Новое бронирование
          </h2>
          <p className={styles.subtitle}>
            Переговорная:{" "}
            <span className={styles.roomName}>{room.name}</span> (
            {room.office.name}, {room.floor} этаж)
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="booking-title">
              Тема встречи *
            </label>
            <input
              id="booking-title"
              className={`${styles.input} ${fieldErrors.title ? styles.inputError : ""}`}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (fieldErrors.title) {
                  setFieldErrors((current) => ({ ...current, title: undefined }));
                }
              }}
              placeholder="Укажите тему встречи"
            />
            {fieldErrors.title && (
              <p className={styles.errorText}>{fieldErrors.title}</p>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Дата</span>
              <DatePickerField
                selected={date}
                timezone={timezone}
                onSelect={(value) => {
                  setDate(value);
                  if (fieldErrors.date) {
                    setFieldErrors((current) => ({ ...current, date: undefined }));
                  }
                }}
                icon={CalendarIcon}
                iconClassName={styles.fieldIcon}
                controlClassName={styles.dateControl}
                popoverClassName={fieldStyles.popoverOffsetMd}
                buttonClassName={`${styles.dateButton} ${
                  fieldErrors.date ? styles.dateButtonError : ""
                }`}
                buttonLabel={formatDateLabel(date, timezone)}
              />
              {fieldErrors.date && (
                <p className={styles.errorText}>{fieldErrors.date}</p>
              )}
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Время начала</span>
              <FilterDropdown
                value={startTime}
                options={timeSlots.map((slot) => ({
                  value: slot,
                  label: slot,
                }))}
                onChange={handleStartTimeChange}
                placeholder="--:--"
                icon={ClockIcon}
                withIcon
                hideChevron
              />
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Продолжительность</span>
            <FilterDropdown
              value={durationMin}
              options={durationOptions.map((option) => ({
                value: option,
                label: formatDurationWithEnd(startTime, option),
              }))}
              onChange={setDurationMin}
              disabled={durationOptions.length === 0}
              placeholder="Выберите"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="booking-comment">
              Комментарий
            </label>
            <textarea
              id="booking-comment"
              className={styles.textarea}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Дополнительная информация для участников встречи..."
            />
          </div>

          <div className={styles.infoBanner}>
            <InfoIcon className={styles.infoIcon} aria-hidden />
            <span>{summary}</span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={mutation.isPending}
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
