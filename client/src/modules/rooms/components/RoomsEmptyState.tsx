import { SearchIcon } from "../../../shared/ui/icons";
import styles from "./RoomsStates.module.css";

type RoomsEmptyStateProps = {
  onReset: () => void;
};

export function RoomsEmptyState({ onReset }: RoomsEmptyStateProps) {
  return (
    <section className={styles.stateBlock}>
      <div className={`${styles.stateIcon} ${styles.stateIconEmpty}`}>
        <SearchIcon aria-hidden />
      </div>
      <h2 className={styles.stateTitle}>Нет доступных переговорных</h2>
      <p className={styles.stateText}>
        Попробуйте изменить параметры фильтрации или выбрать другой офис
      </p>
      <button className={styles.primaryButton} type="button" onClick={onReset}>
        Сбросить фильтры
      </button>
    </section>
  );
}
