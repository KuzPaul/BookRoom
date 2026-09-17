import { ErrorTriangleIcon } from "../../../shared/ui/icons";
import styles from "./BookingsStates.module.css";

type BookingsErrorStateProps = {
  onRetry: () => void;
};

export function BookingsErrorState({ onRetry }: BookingsErrorStateProps) {
  return (
    <section className={styles.stateBlock}>
      <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
        <ErrorTriangleIcon aria-hidden />
      </div>
      <h2 className={styles.stateTitle}>Не удалось загрузить данные</h2>
      <p className={styles.stateText}>
        Произошла ошибка при загрузке списка бронирований
      </p>
      <button className={styles.primaryButton} type="button" onClick={onRetry}>
        Попробовать снова
      </button>
    </section>
  );
}
