import { Link } from "react-router-dom";
import { HomeIcon } from "../shared/ui/icons";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <p className={styles.code} aria-hidden>
          404
        </p>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.text}>
          Запрашиваемая страница не существует, была удалена или перенесена на
          другой адрес.
        </p>
        <Link className={styles.button} to="/rooms">
          <HomeIcon className={styles.buttonIcon} aria-hidden />
          Вернуться к переговорным
        </Link>
      </section>
    </div>
  );
}
