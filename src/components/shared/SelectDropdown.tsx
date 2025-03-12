import { useState, useRef, useEffect } from "react";
import styles from "./SelectDropdown.module.scss";

type SelectDropdownProps<T> = {
  options: T[];
  selectedOption: T;
  onChange: (selectedOption: T) => void;
  optionLabel: (option: T) => string;
  placeholder: string;
};

export const SelectDropdown = <T extends unknown>({ options, selectedOption, onChange, optionLabel, placeholder }: SelectDropdownProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionChange = (option: T) => {
    onChange(option);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdown}>
        <div className={styles.dropdownButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)} tabIndex={0}>
          {optionLabel(selectedOption) || placeholder}
          <span className={styles.dropdownArrow}></span>
        </div>
        {isDropdownOpen && (
          <div className={styles.dropdownContent} onMouseDown={e => e.preventDefault()}>
            <div className={styles.optionsList}>
              {options.map(option => (
                <div key={optionLabel(option)} className={styles.optionLabel} onClick={() => handleOptionChange(option)}>
                  {optionLabel(option)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
