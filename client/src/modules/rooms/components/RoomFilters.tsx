import { useMemo } from "react";
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
} from "../../../shared/ui/icons";
import { DatePickerField } from "../../../shared/ui/DatePickerField";
import { FilterDropdown } from "../../../shared/ui/FilterDropdown";
import {
  clampDurationForStartTime,
  formatDateLabel,
  formatDuration,
  generateDurationOptions,
  generateTimeSlots,
  isValidStartTime,
} from "../../../shared/lib/date";
import styles from "./RoomFilters.module.css";

type RoomFiltersProps = {
  timezone: string;
  date: Date | null;
  startTime: string;
  durationMin: number | null;
  minCapacity: number | null;
  disabled: boolean;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onDurationChange: (minutes: number) => void;
  onMinCapacityChange: (capacity: number) => void;
};

const CAPACITY_OPTIONS = [2, 4, 6, 8, 10, 12];

export function RoomFilters({
  timezone,
  date,
  startTime,
  durationMin,
  minCapacity,
  disabled,
  onDateChange,
  onStartTimeChange,
  onDurationChange,
  onMinCapacityChange,
}: RoomFiltersProps) {
  const timeSlots = generateTimeSlots();
  const durationOptions = useMemo(
    () =>
      isValidStartTime(startTime) ? generateDurationOptions(startTime) : [],
    [startTime],
  );

  const handleStartTimeChange = (nextStartTime: string) => {
    onStartTimeChange(nextStartTime);
    if (durationMin !== null) {
      onDurationChange(clampDurationForStartTime(nextStartTime, durationMin));
    }
  };

  return (
    <section
      className={`${styles.filters} ${disabled ? styles.filtersDisabled : ""}`}
    >
      <div className={`${styles.filterGroup} ${styles.filterGroupDate}`}>
        <span className={styles.filterLabel}>Дата</span>
        <DatePickerField
          selected={date ?? undefined}
          timezone={timezone}
          onSelect={onDateChange}
          disabled={disabled}
          icon={CalendarIcon}
          iconClassName={styles.filterIcon}
          buttonClassName={`${styles.filterInput} ${styles.filterInputNoChevron} ${
            disabled ? styles.filterInputDisabled : ""
          }`}
          buttonLabel={
            <span className={date && !disabled ? undefined : styles.filterPlaceholder}>
              {disabled || !date
                ? "Выберите дату"
                : formatDateLabel(date, timezone)}
            </span>
          }
        />
      </div>

      <div className={`${styles.filterGroup} ${styles.filterGroupTime}`}>
        <span className={styles.filterLabel}>Время начала</span>
        <FilterDropdown
          value={disabled || !startTime ? null : startTime}
          options={timeSlots.map((slot) => ({
            value: slot,
            label: slot,
          }))}
          onChange={handleStartTimeChange}
          disabled={disabled}
          placeholder="--:--"
          icon={ClockIcon}
          withIcon
          hideChevron
        />
      </div>

      <div className={`${styles.filterGroup} ${styles.filterGroupDuration}`}>
        <span className={styles.filterLabel}>Длительность</span>
        <FilterDropdown
          value={durationMin}
          options={durationOptions.map((option) => ({
            value: option,
            label: formatDuration(option),
          }))}
          onChange={onDurationChange}
          disabled={disabled || durationOptions.length === 0}
          placeholder="Выберите"
        />
      </div>

      <div className={`${styles.filterGroup} ${styles.filterGroupCapacity}`}>
        <span className={styles.filterLabel}>Вместимость</span>
        <FilterDropdown
          value={minCapacity}
          options={CAPACITY_OPTIONS.map((option) => ({
            value: option,
            label: `Мин. ${option} чел.`,
          }))}
          onChange={onMinCapacityChange}
          disabled={disabled}
          placeholder="Не указано"
          icon={UsersIcon}
          withIcon
        />
      </div>
    </section>
  );
}
