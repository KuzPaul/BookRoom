import styles from "./BookingsLoadingState.module.css";

type BookingsLoadingStateProps = {
  cardsOnly?: boolean;
};

function BookingCardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.dateSkeleton}>
        <div className={`${styles.dateMonthSkeleton} ${styles.shimmer}`} />
        <div className={`${styles.dateDaySkeleton} ${styles.shimmer}`} />
      </div>

      <div className={styles.bodySkeleton}>
        <div className={`${styles.titleLine} ${styles.shimmer}`} />
        <div className={styles.metaSkeleton}>
          <div className={`${styles.metaPart} ${styles.metaPartLong} ${styles.shimmer}`} />
          <span className={styles.metaDot} aria-hidden />
          <div className={`${styles.metaPart} ${styles.metaPartMedium} ${styles.shimmer}`} />
          <span className={styles.metaDot} aria-hidden />
          <div className={`${styles.metaPart} ${styles.metaPartShort} ${styles.shimmer}`} />
        </div>
      </div>

      <div className={`${styles.buttonSkeleton} ${styles.shimmer}`} />
    </div>
  );
}

function BookingCardsSkeleton() {
  return (
    <div className={styles.list}>
      {Array.from({ length: 2 }, (_, index) => (
        <BookingCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BookingsLoadingState({
  cardsOnly = false,
}: BookingsLoadingStateProps) {
  if (cardsOnly) {
    return (
      <BookingCardsSkeleton />
    );
  }

  return (
    <div
      className={styles.wrap}
      aria-busy="true"
      aria-label="Загрузка бронирований"
    >
      <div className={styles.topRow}>
        <div className={`${styles.titleSkeleton} ${styles.shimmer}`} />
        <div className={styles.filters}>
          <div
            className={`${styles.filterSkeleton} ${styles.filterSkeletonOffice} ${styles.shimmer}`}
          />
          <div
            className={`${styles.filterSkeleton} ${styles.filterSkeletonTime} ${styles.shimmer}`}
          />
        </div>
      </div>

      <div className={styles.tabsBar}>
        <div className={styles.tabs}>
          <div
            className={`${styles.tabSkeleton} ${styles.tabSkeletonUpcoming} ${styles.shimmer}`}
          />
          <div
            className={`${styles.tabSkeleton} ${styles.tabSkeletonPast} ${styles.shimmer}`}
          />
        </div>
      </div>

      <BookingCardsSkeleton />
    </div>
  );
}
