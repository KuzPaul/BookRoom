import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarIcon } from "../../shared/ui/icons";
import { FilterDropdown } from "../../shared/ui/FilterDropdown";
import {
  cancelBooking,
  getBookings,
} from "../../shared/api/bookings.api";
import { getOffices } from "../../shared/api/offices.api";
import type { Booking } from "../../shared/api/types";
import { ALL_OFFICES_VALUE, type BookingsTabScope } from "./types";
import { BookingCard } from "./components/BookingCard";
import { BookingsEmptyState } from "./components/BookingsEmptyState";
import { BookingsErrorState } from "./components/BookingsErrorState";
import { BookingsLoadingState } from "./components/BookingsLoadingState";
import { CancelBookingModal } from "./components/CancelBookingModal";
import styles from "./BookingsPage.module.css";

type BookingsList = { items: Booking[] };

export function BookingsPageContent() {
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<BookingsTabScope>("upcoming");
  const [officeFilter, setOfficeFilter] = useState<string>(ALL_OFFICES_VALUE);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  const officeId =
    officeFilter === ALL_OFFICES_VALUE ? undefined : officeFilter;
  const officeKey = officeId ?? ALL_OFFICES_VALUE;

  const officesQuery = useQuery({
    queryKey: ["offices"],
    queryFn: getOffices,
  });

  const upcomingQuery = useQuery({
    queryKey: ["bookings", "upcoming", officeKey],
    queryFn: () => getBookings({ scope: "upcoming", officeId }),
  });

  const pastQuery = useQuery({
    queryKey: ["bookings", "past", officeKey],
    queryFn: () => getBookings({ scope: "past", officeId }),
    enabled: scope === "past",
  });

  const bookingsQuery = scope === "upcoming" ? upcomingQuery : pastQuery;
  const upcomingCount = upcomingQuery.data?.items.length ?? 0;

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: ["bookings"] });

      const snapshots = queryClient.getQueriesData<BookingsList>({
        queryKey: ["bookings"],
      });

      queryClient.setQueriesData<BookingsList>(
        { queryKey: ["bookings"] },
        (current) =>
          current
            ? {
                items: current.items.filter((booking) => booking.id !== bookingId),
              }
            : current,
      );

      setCancelTarget(null);

      return { snapshots };
    },
    onError: (_error, _bookingId, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });

  const offices = officesQuery.data?.items ?? [];
  const officeOptions = [
    { value: ALL_OFFICES_VALUE, label: "Все офисы" },
    ...offices.map((office) => ({
      value: office.id,
      label: office.name,
    })),
  ];

  const isInitialLoad =
    !upcomingQuery.data && upcomingQuery.isLoading;

  const showCardSkeleton =
    bookingsQuery.isLoading && !bookingsQuery.data && !isInitialLoad;

  const renderContent = () => {
    if (bookingsQuery.isError) {
      return (
        <BookingsErrorState onRetry={() => bookingsQuery.refetch()} />
      );
    }

    const items = bookingsQuery.data?.items ?? [];

    if (items.length === 0) {
      return <BookingsEmptyState scope={scope} />;
    }

    return (
      <div className={styles.list}>
        {items.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            showCancel={scope === "upcoming"}
            onCancel={() => setCancelTarget(booking)}
          />
        ))}
      </div>
    );
  };

  if (isInitialLoad) {
    return (
      <div className={styles.page}>
        <BookingsLoadingState />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Мои бронирования</h1>
          <div className={styles.filters}>
            <FilterDropdown
              value={officeFilter}
              options={officeOptions}
              onChange={setOfficeFilter}
              placeholder="Все офисы"
              disabled={officesQuery.isLoading}
              className={styles.officeFilter}
            />
            <button
              type="button"
              className={`${styles.timeFilterButton} ${styles.timeFilterButtonActive}`}
              aria-pressed="true"
            >
              <CalendarIcon className={styles.timeFilterIcon} aria-hidden />
              За все время
            </button>
          </div>
        </div>

        <div className={styles.tabsBar}>
          <div className={styles.tabs} role="tablist" aria-label="Тип бронирований">
            <button
              type="button"
              role="tab"
              aria-selected={scope === "upcoming"}
              className={`${styles.tab} ${scope === "upcoming" ? styles.tabActive : ""}`}
              onClick={() => setScope("upcoming")}
            >
              Предстоящие ({upcomingCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={scope === "past"}
              className={`${styles.tab} ${scope === "past" ? styles.tabActive : ""}`}
              onClick={() => setScope("past")}
            >
              Прошедшие
            </button>
          </div>
        </div>

        {showCardSkeleton ? (
          <BookingsLoadingState cardsOnly />
        ) : (
          renderContent()
        )}
      </div>

      {cancelTarget && (
        <CancelBookingModal
          booking={cancelTarget}
          isPending={cancelMutation.isPending}
          onClose={() => {
            if (!cancelMutation.isPending) {
              setCancelTarget(null);
            }
          }}
          onConfirm={() => cancelMutation.mutate(cancelTarget.id)}
        />
      )}
    </div>
  );
}
