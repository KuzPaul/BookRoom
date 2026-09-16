import infoStyles from "./RoomInfo.module.css";
import styles from "./RoomInfoLoading.module.css";

const FEATURE_ROWS = 4;

export function RoomInfoLoading() {
  return (
    <aside className={infoStyles.panel} aria-busy="true" aria-label="Загрузка информации о комнате">
      <div className={`${styles.line} ${styles.title}`} />
      <div className={`${styles.line} ${styles.subtitle}`} />
      <div className={styles.divider} aria-hidden />
      {Array.from({ length: FEATURE_ROWS }, (_, index) => (
        <div key={index} className={styles.row}>
          <div className={`${styles.line} ${styles.icon}`} />
          <div className={`${styles.line} ${styles.text}`} />
        </div>
      ))}
    </aside>
  );
}
