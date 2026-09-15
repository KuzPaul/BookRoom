import { useEffect, useState } from "react";
import type { Office } from "../../../shared/api/types";
import {
  formatOfficeAddress,
  formatOfficeClock,
  formatOfficeTimezoneLabel,
} from "../../../shared/lib/date";
import styles from "./OfficeHeader.module.css";

type OfficeHeaderProps = {
  offices: Office[];
  officeId: string | null;
  onOfficeChange: (officeId: string | null) => void;
  isLoading?: boolean;
};

export function OfficeHeader({
  offices,
  officeId,
  onOfficeChange,
  isLoading = false,
}: OfficeHeaderProps) {
  const office = offices.find((item) => item.id === officeId);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const timezoneLabel = office ? formatOfficeTimezoneLabel(office.id) : "MSK";

  return (
    <section className={styles.officeSection}>
      <div className={styles.officeRow}>
        <select
          className={styles.officeSelect}
          value={officeId ?? ""}
          disabled={isLoading}
          onChange={(event) =>
            onOfficeChange(event.target.value ? event.target.value : null)
          }
        >
          <option value="">
            {isLoading ? "Загрузка офисов..." : "Выберите офис"}
          </option>
          {offices.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <p className={styles.officeMeta}>
        {office
          ? `${formatOfficeAddress(office.address)} • Местное время: ${formatOfficeClock(now, office.timezone)} ${timezoneLabel}`
          : "Адрес не выбран • Местное время: --"}
      </p>
    </section>
  );
}
