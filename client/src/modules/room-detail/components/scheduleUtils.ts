import {
  WORKDAY_END_MINUTES,
  WORKDAY_START_MINUTES,
} from "../../../shared/lib/date";

export const SCHEDULE_HEIGHT = 616;
export const HOUR_SEGMENT_COUNT = 11;
export const ROW_HEIGHT = SCHEDULE_HEIGHT / HOUR_SEGMENT_COUNT;
export const TIME_COLUMN_WIDTH = 52;
export const GRID_GAP = 12;
export const BLOCKS_OFFSET = TIME_COLUMN_WIDTH + GRID_GAP;

export const TIME_LABELS = Array.from({ length: 12 }, (_, index) => {
  const hour = 9 + index;
  return `${String(hour).padStart(2, "0")}:00`;
});

export const HOUR_ROWS = TIME_LABELS.slice(0, -1);

export const TOTAL_MINUTES = WORKDAY_END_MINUTES - WORKDAY_START_MINUTES;
export const SHORT_BLOCK_THRESHOLD = 32;

export function blockHeightPx(startMinutes: number, endMinutes: number): number {
  const clampedStart = Math.max(startMinutes, WORKDAY_START_MINUTES);
  const clampedEnd = Math.min(endMinutes, WORKDAY_END_MINUTES);
  return ((clampedEnd - clampedStart) / TOTAL_MINUTES) * SCHEDULE_HEIGHT;
}

export function isShortBlock(startMinutes: number, endMinutes: number): boolean {
  return blockHeightPx(startMinutes, endMinutes) < SHORT_BLOCK_THRESHOLD;
}

export function blockPositionStyle(startMinutes: number, endMinutes: number) {
  const clampedStart = Math.max(startMinutes, WORKDAY_START_MINUTES);
  const top =
    ((clampedStart - WORKDAY_START_MINUTES) / TOTAL_MINUTES) * SCHEDULE_HEIGHT;
  const height = blockHeightPx(startMinutes, endMinutes);

  return {
    top: `${top}px`,
    height: `${Math.max(height, 0)}px`,
  };
}
