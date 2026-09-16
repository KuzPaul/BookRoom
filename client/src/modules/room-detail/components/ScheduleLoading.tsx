import { ROW_HEIGHT, TIME_LABELS } from "./scheduleUtils";
import scheduleStyles from "./Schedule.module.css";
import loadingStyles from "./ScheduleLoading.module.css";

export function ScheduleLoading() {
  return (
    <section
      className={scheduleStyles.schedule}
      aria-busy="true"
      aria-label="Загрузка расписания"
    >
      <div className={loadingStyles.headerSkeleton}>
        <div>
          <div className={`${loadingStyles.line} ${loadingStyles.titleLine}`} />
          <div className={`${loadingStyles.line} ${loadingStyles.subtitleLine}`} />
        </div>
        <div className={`${loadingStyles.line} ${loadingStyles.buttonLine}`} />
      </div>

      <div className={scheduleStyles.gridWrap}>
        <div className={scheduleStyles.timeColumn}>
          {TIME_LABELS.map((label, index) => (
            <span
              key={label}
              className={`${scheduleStyles.hourLabel} ${
                index === TIME_LABELS.length - 1
                  ? scheduleStyles.hourLabelLast
                  : ""
              }`}
              style={{ top: `${index * ROW_HEIGHT}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className={scheduleStyles.linesColumn}>
          {TIME_LABELS.map((label, index) => {
            if (index === 0) return null;
            return (
              <div
                key={label}
                className={scheduleStyles.gridLine}
                style={{ top: `${index * ROW_HEIGHT}px` }}
              />
            );
          })}
        </div>
      </div>

      <div className={loadingStyles.footerSkeleton}>
        <div className={`${loadingStyles.line} ${loadingStyles.footerButton}`} />
      </div>
    </section>
  );
}
