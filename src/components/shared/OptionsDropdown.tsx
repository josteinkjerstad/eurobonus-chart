import React, { useState, useRef, useEffect } from "react";
import styles from "./OptionsDropdown.module.scss";

type OptionsDropdownProps<T> = {
  options: T[];
  selectedOptions: Set<T>;
  onChange: (selectedOptions: Set<T>) => void;
  optionLabel: (option: T) => string;
  onClearAll?: () => void;
  onSelectAll?: () => void;
  placeholder: string;
};

export const OptionsDropdown = <T extends unknown>({
  options,
  selectedOptions,
  onChange,
  optionLabel,
  placeholder,
  onClearAll,
  onSelectAll,
}: OptionsDropdownProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => optionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())); // Filter options based on search term

  const handleOptionFilterChange = (option: T) => {
    const newSet = new Set(selectedOptions);
    if (newSet.has(option)) {
      newSet.delete(option);
    } else {
      newSet.add(option);
    }
    onChange(newSet);
  };

  const handleClearAll = () => {
    if (selectedOptions.size === options.length) {
      onChange(new Set());
      onClearAll?.();
    } else {
      onChange(new Set(options));
      onSelectAll?.();
    }
  };

  const handleSelectOnly = (option: T) => {
    onChange(new Set([option]));
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
          {placeholder}
          <span className={styles.dropdownArrow}></span>
        </div>
        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={handleClearAll} className={styles.clearButton}>
              Clear/Select All
            </button>
            {filteredOptions.map(option => (
              <div key={option as string} className={styles.optionContainer}>
                <label key={optionLabel(option)} className={styles.optionLabel}>
                  <input type="checkbox" checked={selectedOptions.has(option)} onChange={() => handleOptionFilterChange(option)} />
                  {optionLabel(option)}
                </label>
                <button onClick={() => handleSelectOnly(option)} className={styles.selectOnlyButton}>
                  Only
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
