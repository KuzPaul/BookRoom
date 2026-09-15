import styles from "./RoomsLoadingState.module.css";

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonTitleBlock}>
        <div className={styles.skeletonBarWide} />
        <div className={styles.skeletonBarShort} />
      </div>
      <div className={styles.skeletonMeta}>
        <div className={styles.skeletonMetaRow}>
          <div className={styles.skeletonDot} />
          <div className={styles.skeletonBarMedium} />
        </div>
        <div className={styles.skeletonMetaRow}>
          <div className={styles.skeletonDot} />
          <div className={styles.skeletonBarMedium} />
        </div>
      </div>
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonActions}>
        <div className={styles.skeletonButton} />
        <div className={styles.skeletonButtonPrimary} />
      </div>
    </div>
  );
}

export function RoomsLoadingState() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Загрузка переговорных...</h2>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
}
