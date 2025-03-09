import React, { useState, useRef } from "react";
import styles from "./OptionsDropdown.module.scss";

type  OptionsDropdownProps<T> = {
  options: T[];
  selectedOptions: Set<T>;
  onChange: (selectedOptions: Set<T>) => void;
  optionLabel: (option: T) => string;
  placeholder: string;
}

export const OptionsDropdown = <T extends unknown>({ options, selectedOptions, onChange, optionLabel, placeholder }: OptionsDropdownProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    } else {
      onChange(new Set(options));
    }
  };

  const filteredOptions = options.filter(option =>
    optionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdown}>
        <div
          className={styles.dropdownButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          tabIndex={0}
          ref={dropdownRef}
        >
          {placeholder}
          <span className={styles.dropdownArrow}></span>
        </div>
        {isDropdownOpen && (
          <div 
            className={styles.dropdownContent}
            onMouseDown={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.optionsList}>
              <button 
                onClick={handleClearAll} 
                className={styles.clearButton}
              >
                Clear/Select All
              </button>
              {filteredOptions.map(option => (
                <label key={optionLabel(option)} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={selectedOptions.has(option)}
                    onChange={() => handleOptionFilterChange(option)}
                  />
                  {optionLabel(option)}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
