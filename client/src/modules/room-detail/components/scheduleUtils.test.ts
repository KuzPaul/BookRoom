import { describe, expect, it } from "vitest";
import {
  WORKDAY_END_MINUTES,
  WORKDAY_START_MINUTES,
} from "../../../shared/lib/date";
import {
  blockHeightPx,
  blockPositionStyle,
  isShortBlock,
  SCHEDULE_HEIGHT,
} from "./scheduleUtils";

describe("scheduleUtils", () => {
  it("calculates one-hour block height on the schedule grid", () => {
    const oneHourHeight = blockHeightPx(
      WORKDAY_START_MINUTES,
      WORKDAY_START_MINUTES + 60,
    );

    expect(oneHourHeight).toBeCloseTo(SCHEDULE_HEIGHT / 11, 5);
  });

  it("positions block from workday start", () => {
    const style = blockPositionStyle(WORKDAY_START_MINUTES + 60, WORKDAY_END_MINUTES);

    expect(style.top).toBe(`${SCHEDULE_HEIGHT / 11}px`);
    expect(style.height).toBe(`${(10 * SCHEDULE_HEIGHT) / 11}px`);
  });

  it("marks short bookings for compact layout", () => {
    expect(isShortBlock(WORKDAY_START_MINUTES, WORKDAY_START_MINUTES + 15)).toBe(
      true,
    );
    expect(isShortBlock(WORKDAY_START_MINUTES, WORKDAY_START_MINUTES + 60)).toBe(
      false,
    );
  });
});
