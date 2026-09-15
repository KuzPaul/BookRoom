import { ErrorTriangleIcon } from "../../../shared/ui/icons";
import styles from "./RoomsStates.module.css";

type RoomsErrorStateProps = {
  onRetry: () => void;
};

export function RoomsErrorState({ onRetry }: RoomsErrorStateProps) {
  return (
    <section className={styles.stateBlock}>
      <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
        <ErrorTriangleIcon aria-hidden />
      </div>
      <h2 className={styles.stateTitle}>Не удалось загрузить данные</h2>
      <p className={styles.stateText}>
        Произошла ошибка при загрузке списка переговорных
      </p>
      <button className={styles.primaryButton} type="button" onClick={onRetry}>
        Попробовать снова
      </button>
    </section>
  );
}
