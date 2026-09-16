import breadcrumbStyles from "./Breadcrumbs.module.css";
import styles from "./BreadcrumbsLoading.module.css";

export function BreadcrumbsLoading() {
  return (
    <nav
      className={breadcrumbStyles.breadcrumbs}
      aria-busy="true"
      aria-label="Загрузка навигации"
    >
      <span
        className={`${styles.segment} ${styles.segmentShort} ${styles.shimmer}`}
      />
      <span className={breadcrumbStyles.separator} aria-hidden>
        ›
      </span>
      <span
        className={`${styles.segment} ${styles.segmentMedium} ${styles.shimmer}`}
      />
      <span className={breadcrumbStyles.separator} aria-hidden>
        ›
      </span>
      <span
        className={`${styles.segment} ${styles.segmentLong} ${styles.shimmer}`}
      />
    </nav>
  );
}
