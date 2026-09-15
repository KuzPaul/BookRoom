import { addDays, addMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { ru } from "date-fns/locale";

export const WORKDAY_START_MINUTES = 9 * 60;
export const WORKDAY_END_MINUTES = 20 * 60;
const SLOT_STEP_MINUTES = 15;
export const MAX_ADVANCE_DAYS = 30;
export const DEFAULT_OFFICE_TIMEZONE = "Europe/Moscow";

export function buildInterval(
  date: Date,
  startTime: string,
  durationMin: number,
  timezone: string,
) {
  const day = formatInTimeZone(date, timezone, "yyyy-MM-dd");
  const start = fromZonedTime(`${day}T${startTime}:00`, timezone);
  const end = addMinutes(start, durationMin);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export function formatOfficeClock(now: Date, timezone: string): string {
  return formatInTimeZone(now, timezone, "HH:mm");
}

function capitalizeDateParts(label: string): string {
  return label.replace(/(^|[\s,]+)([а-яё])/g, (_, prefix, char) => {
    return `${prefix}${char.toUpperCase()}`;
  });
}

export function formatDateLabel(date: Date, timezone: string): string {
  const label = formatInTimeZone(date, timezone, "d MMMM, EE", { locale: ru });
  return capitalizeDateParts(label);
}

export function formatOfficeAddress(address: string): string {
  return address
    .replace(/^Москва,\s*/u, "")
    .replace(/^Санкт-Петербург,\s*/u, "")
    .replace(/,\s*/g, " ")
    .trim();
}

export function isValidStartTime(time: string): boolean {
  return generateTimeSlots().includes(time);
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (
    let minutes = WORKDAY_START_MINUTES;
    minutes < WORKDAY_END_MINUTES;
    minutes += SLOT_STEP_MINUTES
  ) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(
      `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
    );
  }
  return slots;
}

export function generateDurationOptions(startTime: string): number[] {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startMinutes = hours * 60 + minutes;
  const maxDuration = WORKDAY_END_MINUTES - startMinutes;
  const options: number[] = [];

  for (let duration = SLOT_STEP_MINUTES; duration <= maxDuration; duration += SLOT_STEP_MINUTES) {
    options.push(duration);
  }

  return options;
}

export function clampDurationForStartTime(
  startTime: string,
  durationMin: number,
): number {
  if (!isValidStartTime(startTime)) return durationMin;

  const options = generateDurationOptions(startTime);
  if (options.length === 0) return durationMin;

  return options.includes(durationMin) ? durationMin : options[0];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    if (hours === 1) return "1 час";
    return `${hours} часа`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} ч ${mins} мин`;
}

export function getMinSelectableDate(timezone: string): Date {
  const todayStr = formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
  return fromZonedTime(`${todayStr}T00:00:00`, timezone);
}

export function getMaxSelectableDate(timezone: string): Date {
  return addDays(getMinSelectableDate(timezone), MAX_ADVANCE_DAYS);
}

function getCalendarDayString(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd");
}

export function normalizeCalendarDate(date: Date, timezone: string): Date {
  const dayStr = getCalendarDayString(date, timezone);
  return fromZonedTime(`${dayStr}T00:00:00`, timezone);
}

export function buildWorkdayRange(date: Date, timezone: string) {
  const day = formatInTimeZone(date, timezone, "yyyy-MM-dd");
  return {
    from: fromZonedTime(`${day}T09:00:00`, timezone).toISOString(),
    to: fromZonedTime(`${day}T20:00:00`, timezone).toISOString(),
  };
}

export function formatDayHeading(date: Date, timezone: string): string {
  const label = formatInTimeZone(date, timezone, "EEEE, d MMMM", { locale: ru });
  return capitalizeDateParts(label);
}

export function computeEndTime(startTime: string, durationMin: number): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endMinutes = hours * 60 + minutes + durationMin;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;

  return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
}

export function formatDurationWithEnd(
  startTime: string,
  durationMin: number,
): string {
  return `${formatDuration(durationMin)} (до ${computeEndTime(startTime, durationMin)})`;
}

export function formatBookingBannerSummary(
  date: Date,
  startTime: string,
  durationMin: number,
  timezone: string,
): string {
  const dayLabel = formatDayHeading(date, timezone);
  const endStr = computeEndTime(startTime, durationMin);

  return `Бронирование на ${dayLabel}, ${startTime} - ${endStr} (${formatDuration(durationMin)})`;
}

export function formatOfficeTimezoneLabel(officeId: string): string {
  if (officeId === "office-saint-petersburg") return "SPB";
  return "MSK";
}

export function formatBookingCardMonth(iso: string, timezone: string): string {
  return formatInTimeZone(iso, timezone, "LLLL", { locale: ru }).toUpperCase();
}

export function formatBookingCardDay(iso: string, timezone: string): string {
  return formatInTimeZone(iso, timezone, "d");
}

export function formatBookingTimeRange(
  startsAt: string,
  endsAt: string,
  timezone: string,
  officeId: string,
): string {
  const start = formatInTimeZone(startsAt, timezone, "HH:mm");
  const end = formatInTimeZone(endsAt, timezone, "HH:mm");
  const timezoneLabel = formatOfficeTimezoneLabel(officeId);

  return `${start} - ${end} ${timezoneLabel}`;
}

export function formatCancelModalDateTime(
  startsAt: string,
  endsAt: string,
  timezone: string,
): string {
  const day = formatInTimeZone(startsAt, timezone, "yyyy-MM-dd");
  const date = fromZonedTime(`${day}T00:00:00`, timezone);
  const dayLabel = formatDayHeading(date, timezone);
  const start = formatInTimeZone(startsAt, timezone, "HH:mm");
  const end = formatInTimeZone(endsAt, timezone, "HH:mm");

  return `${dayLabel}, ${start} - ${end}`;
}

export function formatBookingSummary(
  roomName: string,
  date: Date,
  startTime: string,
  durationMin: number,
  timezone: string,
  officeId: string,
): string {
  const dayLabel = formatInTimeZone(date, timezone, "d MMMM", { locale: ru });
  const endStr = computeEndTime(startTime, durationMin);
  const timezoneLabel = formatOfficeTimezoneLabel(officeId);

  return `Комната ${roomName}, ${dayLabel}, ${startTime}–${endStr} ${timezoneLabel}`;
}

export function minutesInTimezone(iso: string, timezone: string): number {
  const [hours, minutes] = formatInTimeZone(iso, timezone, "HH:mm")
    .split(":")
    .map(Number);
  return hours * 60 + minutes;
}

export function parseUrlSlot(
  startsAt: string,
  endsAt: string,
  timezone: string,
): { date: Date; startTime: string; durationMin: number } | null {
  const startTime = formatInTimeZone(startsAt, timezone, "HH:mm");
  if (!isValidStartTime(startTime)) return null;

  const day = formatInTimeZone(startsAt, timezone, "yyyy-MM-dd");
  const date = fromZonedTime(`${day}T00:00:00`, timezone);
  const durationMin = Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000,
  );

  if (durationMin <= 0) return null;

  return { date, startTime, durationMin };
}
