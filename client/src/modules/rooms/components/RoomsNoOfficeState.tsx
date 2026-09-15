import { BuildingIcon } from "../../../shared/ui/icons";
import styles from "./RoomsStates.module.css";

export function RoomsNoOfficeState() {
  return (
    <section className={styles.stateBlock}>
      <div className={`${styles.stateIcon} ${styles.stateIconOffice}`}>
        <BuildingIcon aria-hidden />
      </div>
      <h2 className={styles.stateTitle}>Выберите офис</h2>
      <p className={styles.stateText}>
        Для просмотра доступных переговорных сначала выберите офис из списка
        выше
      </p>
    </section>
  );
}
