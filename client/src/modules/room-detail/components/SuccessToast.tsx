import { CheckIcon, ClearCircleIcon } from "../../../shared/ui/icons";
import styles from "./SuccessToast.module.css";

type SuccessToastProps = {
  title: string;
  text: string;
  onClose: () => void;
};

export function SuccessToast({ title, text, onClose }: SuccessToastProps) {
  return (
    <div className={styles.toast} role="status">
      <span className={styles.iconWrap}>
        <CheckIcon className={styles.icon} aria-hidden />
      </span>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{text}</p>
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Закрыть"
      >
        <ClearCircleIcon className={styles.closeIcon} aria-hidden />
      </button>
    </div>
  );
}
