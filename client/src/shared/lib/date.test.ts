import { fromZonedTime } from "date-fns-tz";
import { describe, expect, it } from "vitest";
import {
  buildInterval,
  buildWorkdayRange,
  computeEndTime,
  formatDuration,
  formatOfficeTimezoneLabel,
  generateDurationOptions,
  generateTimeSlots,
  getMaxSelectableDate,
  getMinSelectableDate,
  isValidStartTime,
  MAX_ADVANCE_DAYS,
  parseUrlSlot,
} from "./date";

const MOSCOW = "Europe/Moscow";

describe("generateTimeSlots", () => {
  it("covers workday from 09:00 to 19:45 with 15-minute step", () => {
    const slots = generateTimeSlots();

    expect(slots[0]).toBe("09:00");
    expect(slots.at(-1)).toBe("19:45");
    expect(slots).toHaveLength(44);
  });
});

describe("isValidStartTime", () => {
  it("accepts slot on the 15-minute grid inside work hours", () => {
    expect(isValidStartTime("15:00")).toBe(true);
  });

  it("rejects time outside the slot grid", () => {
    expect(isValidStartTime("15:07")).toBe(false);
    expect(isValidStartTime("20:00")).toBe(false);
  });
});

describe("generateDurationOptions", () => {
  it("limits duration so booking ends by 20:00", () => {
    expect(generateDurationOptions("19:00")).toEqual([15, 30, 45, 60]);
    expect(generateDurationOptions("19:45")).toEqual([15]);
  });
});

describe("computeEndTime", () => {
  it("adds duration to start time", () => {
    expect(computeEndTime("15:00", 45)).toBe("15:45");
  });
});

describe("buildInterval", () => {
  it("builds UTC interval for office timezone", () => {
    const date = fromZonedTime("2026-09-08T00:00:00", MOSCOW);
    const interval = buildInterval(date, "15:00", 60, MOSCOW);

    expect(interval.from).toBe("2026-09-08T12:00:00.000Z");
    expect(interval.to).toBe("2026-09-08T13:00:00.000Z");
  });
});

describe("buildWorkdayRange", () => {
  it("uses 09:00-20:00 bounds in office timezone", () => {
    const date = fromZonedTime("2026-09-08T00:00:00", MOSCOW);
    const range = buildWorkdayRange(date, MOSCOW);

    expect(range.from).toBe("2026-09-08T06:00:00.000Z");
    expect(range.to).toBe("2026-09-08T17:00:00.000Z");
  });
});

describe("booking date limits", () => {
  it("allows selecting dates up to 30 days ahead", () => {
    const minDate = getMinSelectableDate(MOSCOW);
    const maxDate = getMaxSelectableDate(MOSCOW);
    const dayDiff = Math.round(
      (maxDate.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000),
    );

    expect(dayDiff).toBe(MAX_ADVANCE_DAYS);
  });
});

describe("formatOfficeTimezoneLabel", () => {
  it("maps office ids to short labels", () => {
    expect(formatOfficeTimezoneLabel("office-saint-petersburg")).toBe("SPB");
    expect(formatOfficeTimezoneLabel("office-moscow")).toBe("MSK");
  });
});

describe("parseUrlSlot", () => {
  it("parses valid booking slot from URL timestamps", () => {
    const result = parseUrlSlot(
      "2026-09-08T12:00:00.000Z",
      "2026-09-08T13:00:00.000Z",
      MOSCOW,
    );

    expect(result).toEqual({
      date: fromZonedTime("2026-09-08T00:00:00", MOSCOW),
      startTime: "15:00",
      durationMin: 60,
    });
  });

  it("returns null for invalid slot duration", () => {
    expect(
      parseUrlSlot(
        "2026-09-08T12:00:00.000Z",
        "2026-09-08T12:00:00.000Z",
        MOSCOW,
      ),
    ).toBeNull();
  });
});

describe("formatDuration", () => {
  it("formats minutes for UI labels", () => {
    expect(formatDuration(45)).toBe("45 мин");
    expect(formatDuration(60)).toBe("1 час");
  });
});
