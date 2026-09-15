import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOffices } from "../../shared/api/offices.api";
import { getRooms } from "../../shared/api/rooms.api";
import {
  buildInterval,
  DEFAULT_OFFICE_TIMEZONE,
  getMinSelectableDate,
  isValidStartTime,
} from "../../shared/lib/date";
import {
  getStoredRoomsOfficeId,
  setStoredRoomsOfficeId,
} from "../../shared/lib/roomsOfficeStorage";
import { OfficeHeader } from "./components/OfficeHeader";
import { RoomCard } from "./components/RoomCard";
import { RoomFilters } from "./components/RoomFilters";
import { RoomsEmptyState } from "./components/RoomsEmptyState";
import { RoomsErrorState } from "./components/RoomsErrorState";
import { RoomsLoadingState } from "./components/RoomsLoadingState";
import { RoomsNoOfficeState } from "./components/RoomsNoOfficeState";
import styles from "./RoomsPage.module.css";

const DEFAULT_START_TIME = "15:00";
const DEFAULT_DURATION = 60;
const DEFAULT_CAPACITY = 4;

export function RoomsPageContent() {
  const [officeId, setOfficeId] = useState<string | null>(() =>
    getStoredRoomsOfficeId(),
  );
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [minCapacity, setMinCapacity] = useState<number | null>(null);

  const officesQuery = useQuery({
    queryKey: ["offices"],
    queryFn: getOffices,
  });

  const offices = officesQuery.data?.items ?? [];

  if (offices.length > 0 && officeId && !offices.some((office) => office.id === officeId)) {
    setOfficeId(null);
    setStoredRoomsOfficeId(null);
  }

  const selectedOffice = offices.find((office) => office.id === officeId);

  const effectiveDate =
    date ?? (selectedOffice ? getMinSelectableDate(selectedOffice.timezone) : null);
  const effectiveStartTime =
    startTime || (selectedOffice ? DEFAULT_START_TIME : "");
  const effectiveDurationMin =
    durationMin ?? (selectedOffice ? DEFAULT_DURATION : null);
  const effectiveMinCapacity =
    minCapacity ?? (selectedOffice ? DEFAULT_CAPACITY : null);

  const filtersReady =
    Boolean(selectedOffice) &&
    effectiveDate !== null &&
    isValidStartTime(effectiveStartTime) &&
    effectiveDurationMin !== null &&
    effectiveMinCapacity !== null;

  const interval =
    selectedOffice && filtersReady
      ? buildInterval(
          effectiveDate!,
          effectiveStartTime,
          effectiveDurationMin!,
          selectedOffice.timezone,
        )
      : null;

  const roomsQuery = useQuery({
    queryKey: [
      "rooms",
      officeId,
      interval?.from,
      interval?.to,
      effectiveMinCapacity,
    ],
    queryFn: () =>
      getRooms({
        officeId: officeId!,
        minCapacity: effectiveMinCapacity!,
        from: interval!.from,
        to: interval!.to,
      }),
    enabled: Boolean(officeId && interval),
  });

  const applyOfficeFilters = (timezone: string) => {
    setDate((current) => current ?? getMinSelectableDate(timezone));
    setStartTime((current) => current || DEFAULT_START_TIME);
    setDurationMin((current) => current ?? DEFAULT_DURATION);
    setMinCapacity((current) => current ?? DEFAULT_CAPACITY);
  };

  const handleOfficeChange = (nextOfficeId: string | null) => {
    setOfficeId(nextOfficeId);
    setStoredRoomsOfficeId(nextOfficeId);

    if (!nextOfficeId) {
      setDate(null);
      setStartTime("");
      setDurationMin(null);
      setMinCapacity(null);
      return;
    }

    const office = offices.find((item) => item.id === nextOfficeId);
    applyOfficeFilters(office?.timezone ?? DEFAULT_OFFICE_TIMEZONE);
  };

  const resetFilters = () => {
    const timezone = selectedOffice?.timezone ?? DEFAULT_OFFICE_TIMEZONE;
    setDate(getMinSelectableDate(timezone));
    setStartTime(DEFAULT_START_TIME);
    setDurationMin(DEFAULT_DURATION);
    setMinCapacity(DEFAULT_CAPACITY);
  };

  const renderRoomsContent = () => {
    if (!officeId) {
      return <RoomsNoOfficeState />;
    }

    if (officesQuery.isError) {
      return <RoomsErrorState onRetry={() => officesQuery.refetch()} />;
    }

    if (!filtersReady || !interval) {
      return null;
    }

    if (roomsQuery.isLoading) {
      return <RoomsLoadingState />;
    }

    if (roomsQuery.isError) {
      return <RoomsErrorState onRetry={() => roomsQuery.refetch()} />;
    }

    if (!roomsQuery.data || roomsQuery.data.items.length === 0) {
      return <RoomsEmptyState onReset={resetFilters} />;
    }

    return (
      <section>
        <h2 className={styles.sectionTitle}>
          Доступные переговорные в этом офисе
        </h2>
        <div className={styles.grid}>
          {roomsQuery.data.items.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              filterFrom={interval.from}
              filterTo={interval.to}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className={styles.page}>
      <section className={styles.officeBand}>
        <div className={styles.inner}>
          <OfficeHeader
            offices={offices}
            officeId={officeId}
            onOfficeChange={handleOfficeChange}
            isLoading={officesQuery.isLoading}
          />
        </div>
        <div className={styles.officeDivider} aria-hidden />
      </section>

      <div
        className={
          officeId ? styles.filtersBandWhite : styles.filtersBandGrey
        }
      >
        <div className={styles.inner}>
          <RoomFilters
            timezone={selectedOffice?.timezone ?? DEFAULT_OFFICE_TIMEZONE}
            date={effectiveDate}
            startTime={effectiveStartTime}
            durationMin={effectiveDurationMin}
            minCapacity={effectiveMinCapacity}
            disabled={!officeId}
            onDateChange={setDate}
            onStartTimeChange={setStartTime}
            onDurationChange={setDurationMin}
            onMinCapacityChange={setMinCapacity}
          />
        </div>
      </div>

      <section className={styles.contentBand}>
        <div className={styles.inner}>{renderRoomsContent()}</div>
      </section>
    </div>
  );
}
