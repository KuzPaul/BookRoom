import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";
import { DatePickerCalendar } from "./DatePickerCalendar";
import fieldStyles from "./DatePickerField.module.css";

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

type DatePickerFieldProps = {
  selected?: Date;
  timezone: string;
  onSelect: (date: Date) => void;
  disabled?: boolean;
  buttonLabel: ReactNode;
  buttonClassName?: string;
  controlClassName?: string;
  popoverClassName?: string;
  icon?: IconComponent;
  iconClassName?: string;
};

export function DatePickerField({
  selected,
  timezone,
  onSelect,
  disabled = false,
  buttonLabel,
  buttonClassName,
  controlClassName,
  popoverClassName,
  icon: Icon,
  iconClassName,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date) => {
    onSelect(date);
    setIsOpen(false);
  };

  return (
    <div
      className={`${fieldStyles.control} ${controlClassName ?? ""}`.trim()}
      ref={controlRef}
    >
      {Icon && iconClassName && <Icon className={iconClassName} aria-hidden />}
      <button
        type="button"
        className={buttonClassName}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => !disabled && setIsOpen((open) => !open)}
      >
        {buttonLabel}
      </button>
      {isOpen && !disabled && (
        <div
          className={`${fieldStyles.popover} ${popoverClassName ?? ""}`.trim()}
        >
          <DatePickerCalendar
            selected={selected}
            timezone={timezone}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
