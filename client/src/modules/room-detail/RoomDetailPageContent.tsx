import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { getBookings } from "../../shared/api/bookings.api";
import { getRoom, getRoomBookings } from "../../shared/api/rooms.api";
import type { Booking } from "../../shared/api/types";
import {
  buildWorkdayRange,
  DEFAULT_OFFICE_TIMEZONE,
  formatBookingSummary,
  getMinSelectableDate,
  parseUrlSlot,
} from "../../shared/lib/date";
import { BookingModal } from "./components/BookingModal";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { BreadcrumbsLoading } from "./components/BreadcrumbsLoading";
import { ConflictModal } from "./components/ConflictModal";
import { RoomInfo } from "./components/RoomInfo";
import { RoomInfoLoading } from "./components/RoomInfoLoading";
import { Schedule } from "./components/Schedule";
import type { SelectedSlot } from "./types";
import { ScheduleError } from "./components/ScheduleError";
import { ScheduleLoading } from "./components/ScheduleLoading";
import { SuccessToast } from "./components/SuccessToast";
import styles from "./RoomDetailPage.module.css";

export function RoomDetailPageContent() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const [selectedDateOverride, setSelectedDateOverride] = useState<Date | null>(null);
  const [manualModalSlot, setManualModalSlot] = useState<SelectedSlot | null>(null);
  const [isBookingOpenManual, setIsBookingOpenManual] = useState(false);
  const [userDismissedUrlBooking, setUserDismissedUrlBooking] = useState(false);
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<{
    title: string;
    text: string;
  } | null>(null);

  const roomQuery = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId!),
    enabled: Boolean(roomId),
  });

  const myBookingsQuery = useQuery({
    queryKey: ["bookings", "all"],
    queryFn: () => getBookings({ scope: "all" }),
  });

  const myBookingIds = useMemo(
    () => new Set(myBookingsQuery.data?.items.map((booking) => booking.id) ?? []),
    [myBookingsQuery.data],
  );

  const urlSlotParams = useMemo(() => {
    const startsAt = searchParams.get("startsAt");
    const endsAt = searchParams.get("endsAt");
    return startsAt && endsAt ? { startsAt, endsAt } : null;
  }, [searchParams]);

  const parsedUrlSlot = useMemo(() => {
    if (!roomQuery.data || !urlSlotParams) return null;
    return parseUrlSlot(
      urlSlotParams.startsAt,
      urlSlotParams.endsAt,
      roomQuery.data.office.timezone,
    );
  }, [roomQuery.data, urlSlotParams]);

  const defaultDate = useMemo(() => {
    if (parsedUrlSlot) return parsedUrlSlot.date;
    if (roomQuery.data) {
      return getMinSelectableDate(roomQuery.data.office.timezone);
    }
    return getMinSelectableDate(DEFAULT_OFFICE_TIMEZONE);
  }, [parsedUrlSlot, roomQuery.data]);

  const selectedDate = selectedDateOverride ?? defaultDate;
  const isBookingOpen =
    isBookingOpenManual || (parsedUrlSlot !== null && !userDismissedUrlBooking);
  const modalSlot = isBookingOpenManual
    ? manualModalSlot
    : parsedUrlSlot && !userDismissedUrlBooking
      ? {
          startTime: parsedUrlSlot.startTime,
          durationMin: parsedUrlSlot.durationMin,
        }
      : null;

  const timezone = roomQuery.data?.office.timezone ?? DEFAULT_OFFICE_TIMEZONE;
  const workday = buildWorkdayRange(selectedDate, timezone);

  const bookingsQuery = useQuery({
    queryKey: ["room-bookings", roomId, workday.from, workday.to],
    queryFn: () => getRoomBookings(roomId!, workday.from, workday.to),
    enabled: Boolean(roomId && roomQuery.data),
  });

  useEffect(() => {
    if (!successToast) return;

    const timer = window.setTimeout(() => setSuccessToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [successToast]);

  const handleBookingSuccess = (booking: Booking) => {
    setIsBookingOpenManual(false);
    setUserDismissedUrlBooking(true);

    const bookingTimezone = booking.office.timezone;
    const day = formatInTimeZone(booking.startsAt, bookingTimezone, "yyyy-MM-dd");
    const bookingDate = fromZonedTime(`${day}T00:00:00`, bookingTimezone);
    const startTime = formatInTimeZone(booking.startsAt, bookingTimezone, "HH:mm");
    const durationMin = Math.round(
      (new Date(booking.endsAt).getTime() - new Date(booking.startsAt).getTime()) /
        60000,
    );

    setSuccessToast({
      title: "Бронирование создано",
      text: formatBookingSummary(
        booking.room.name,
        bookingDate,
        startTime,
        durationMin,
        bookingTimezone,
        booking.office.id,
      ),
    });
    bookingsQuery.refetch();
  };

  const handleConflictClose = () => {
    setIsConflictOpen(false);
    bookingsQuery.refetch();
  };

  if (roomQuery.isLoading && !roomQuery.data) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <BreadcrumbsLoading />
          <div className={styles.layout}>
            <RoomInfoLoading />
            <ScheduleLoading />
          </div>
        </div>
      </div>
    );
  }

  if (!roomQuery.data) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorPanel}>
            <div className={styles.roomLoadError}>
              <h2 className={styles.roomLoadErrorTitle}>
                Не удалось загрузить комнату
              </h2>
              <p className={styles.roomLoadErrorText}>
                Произошла ошибка при загрузке данных переговорной
              </p>
              <button
                type="button"
                className={styles.roomLoadErrorButton}
                onClick={() => roomQuery.refetch()}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const room = roomQuery.data;

  const renderSchedule = () => {
    if (bookingsQuery.isLoading) {
      return <ScheduleLoading />;
    }

    if (bookingsQuery.isError) {
      return (
        <ScheduleError onRetry={() => bookingsQuery.refetch()} />
      );
    }

    return (
      <Schedule
        date={selectedDate}
        timezone={timezone}
        bookings={bookingsQuery.data?.items ?? []}
        myBookingIds={myBookingIds}
        onDateChange={setSelectedDateOverride}
        onBook={() => {
          setManualModalSlot(null);
          setIsBookingOpenManual(true);
        }}
      />
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs room={room} />

        <div className={styles.layout}>
          <RoomInfo room={room} />
          {renderSchedule()}
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          room={room}
          initialDate={selectedDate}
          initialSlot={modalSlot}
          onClose={() => {
            setIsBookingOpenManual(false);
            setUserDismissedUrlBooking(true);
            setManualModalSlot(null);
          }}
          onSuccess={handleBookingSuccess}
          onConflict={() => {
            setIsBookingOpenManual(false);
            setUserDismissedUrlBooking(true);
            setIsConflictOpen(true);
          }}
        />
      )}

      {isConflictOpen && <ConflictModal onClose={handleConflictClose} />}

      {successToast && (
        <SuccessToast
          title={successToast.title}
          text={successToast.text}
          onClose={() => setSuccessToast(null)}
        />
      )}
    </div>
  );
}
