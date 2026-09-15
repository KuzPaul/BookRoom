import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import {
  getMaxSelectableDate,
  getMinSelectableDate,
  normalizeCalendarDate,
} from "../lib/date";

type DatePickerCalendarProps = {
  selected?: Date;
  timezone: string;
  onSelect: (date: Date) => void;
};

function capitalizeCaption(label: string): string {
  return label.replace(/^./, (char) => char.toUpperCase());
}

export function DatePickerCalendar({
  selected,
  timezone,
  onSelect,
}: DatePickerCalendarProps) {
  const minDate = getMinSelectableDate(timezone);
  const maxDate = getMaxSelectableDate(timezone);
  const normalizedSelected = selected
    ? normalizeCalendarDate(selected, timezone)
    : undefined;

  return (
    <DayPicker
      mode="single"
      required
      timeZone={timezone}
      selected={normalizedSelected}
      defaultMonth={normalizedSelected ?? minDate}
      startMonth={minDate}
      endMonth={maxDate}
      onSelect={(value) => {
        if (!value) return;
        onSelect(normalizeCalendarDate(value, timezone));
      }}
      locale={ru}
      showOutsideDays={false}
      disabled={[
        { before: minDate },
        { after: maxDate },
      ]}
      formatters={{
        formatCaption: (month) =>
          capitalizeCaption(format(month, "LLLL yyyy", { locale: ru })),
      }}
    />
  );
}
