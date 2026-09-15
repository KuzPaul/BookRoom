import { useEffect, useRef, useState, type SVGProps } from "react";
import styles from "./FilterDropdown.module.css";

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

type FilterDropdownProps<T extends string | number> = {
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  placeholder: string;
  icon?: IconComponent;
  withIcon?: boolean;
  hideChevron?: boolean;
  className?: string;
};

export function FilterDropdown<T extends string | number>({
  value,
  options,
  onChange,
  disabled = false,
  placeholder,
  icon: Icon,
  withIcon = false,
  hideChevron = false,
  className,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.root} ${className ?? ""}`.trim()} ref={rootRef}>
      {withIcon && Icon && <Icon className={styles.icon} aria-hidden />}
      <button
        type="button"
        className={`${styles.trigger} ${withIcon ? "" : styles.triggerNoIcon} ${
          hideChevron ? styles.triggerNoChevron : ""
        } ${disabled ? styles.triggerDisabled : ""}`}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => !disabled && setIsOpen((open) => !open)}
      >
        <span className={selected ? undefined : styles.placeholder}>
          {selected?.label ?? placeholder}
        </span>
      </button>
      {isOpen && !disabled && (
        <div className={styles.menu} role="listbox">
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`${styles.item} ${
                option.value === value ? styles.itemSelected : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <span className={styles.check} aria-hidden>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
