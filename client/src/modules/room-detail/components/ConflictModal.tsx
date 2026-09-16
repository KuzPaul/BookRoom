import { ErrorTriangleIcon } from "../../../shared/ui/icons";
import styles from "./ConflictModal.module.css";

type ConflictModalProps = {
  onClose: () => void;
};

export function ConflictModal({ onClose }: ConflictModalProps) {
  return (
    <div className={styles.overlay} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.iconWrap}>
          <ErrorTriangleIcon aria-hidden />
        </div>
        <h2 className={styles.title}>Время уже занято</h2>
        <p className={styles.text}>
          Выбранный интервал был забронирован другим сотрудником. Расписание
          обновлено.
        </p>
        <button type="button" className={styles.button} onClick={onClose}>
          Выбрать другое время
        </button>
      </div>
    </div>
  );
}
