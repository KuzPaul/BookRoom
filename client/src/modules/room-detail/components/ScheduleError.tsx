import { ErrorTriangleIcon } from "../../../shared/ui/icons";
import scheduleStyles from "./Schedule.module.css";
import styles from "./ScheduleError.module.css";

type ScheduleErrorProps = {
  onRetry: () => void;
};

export function ScheduleError({ onRetry }: ScheduleErrorProps) {
  return (
    <section className={`${scheduleStyles.schedule} ${styles.card}`}>
      <div className={styles.body}>
        <div className={styles.iconWrap}>
          <ErrorTriangleIcon aria-hidden />
        </div>
        <h2 className={styles.title}>Не удалось загрузить расписание</h2>
        <p className={styles.text}>
          Произошла ошибка при загрузке расписания переговорной
        </p>
        <button className={styles.button} type="button" onClick={onRetry}>
          Попробовать снова
        </button>
      </div>
    </section>
  );
}
