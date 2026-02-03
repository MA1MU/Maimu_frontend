import React, { useState, useEffect } from "react";
import "./BirthSelect.css";
import arrowIcon from "../../images/MyPage/SelectorArrow.svg";

const Dropdown = ({ options, value, onChange, placeholder, isOpen, onToggle }) => {
  // Dropdown 컴포넌트 내용은 동일하게 유지

  const handleOptionClick = (option) => {
    onChange(option);
    onToggle(false);
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation();
    onToggle(!isOpen);
  };

  return (
    <div className="BirthSelect">
      <div className={`Dropdown ${isOpen ? "clicked" : ""}`} onClick={handleDropdownClick}>
        <div className="DropdownHeader">
          <div className="SelectedOption">{value ? value.label : placeholder}</div>
          <img
            src={arrowIcon}
            alt="DropdownIndicator"
            style={{ width: "8px", height: "4px", marginRight: "20px" }}
          />
        </div>
        {isOpen && (
          <div className="DropdownOptions">
            {options.map((option) => (
              <div
                key={option.value}
                className="DropdownOption"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BirthSelect = ({ onSelectYear, onSelectMonth, onSelectDay, selectedYear: initialYear, selectedMonth: initialMonth, selectedDay: initialDay }) => {
  const years = Array.from({ length: 100 }, (_, index) => ({
    value: 2024 - index,
    label: `${2024 - index}`,
  }));
  const months = Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: `${index + 1}` }));
  const days = Array.from({ length: 31 }, (_, index) => ({ value: index + 1, label: `${index + 1}` }));

  const [selectedYear, setSelectedYear] = useState(initialYear || null);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || null);
  const [selectedDay, setSelectedDay] = useState(initialDay || null);

  // 외부에서 주입된 값이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (initialYear) setSelectedYear(initialYear);
    if (initialMonth) setSelectedMonth(initialMonth);
    if (initialDay) setSelectedDay(initialDay);
  }, [initialYear, initialMonth, initialDay]);

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const closeDropdowns = (currentDropdown) => {
    switch (currentDropdown) {
      case "year":
        setIsMonthOpen(false);
        setIsDayOpen(false);
        break;
      case "month":
        setIsYearOpen(false);
        setIsDayOpen(false);
        break;
      case "day":
        setIsYearOpen(false);
        setIsMonthOpen(false);
        break;
      default:
        setIsYearOpen(false);
        setIsMonthOpen(false);
        setIsDayOpen(false);
    }
  };

  return (
    <div className="DropdownContainer">
      <Dropdown
        options={years}
        value={selectedYear}
        onChange={(option) => {
          setSelectedYear(option);
          onSelectYear(option);
        }}
        placeholder="년"
        isOpen={isYearOpen}
        onToggle={(value) => {
          setIsYearOpen(value);
          closeDropdowns("year");
        }}
      />

      <Dropdown
        options={months}
        value={selectedMonth}
        onChange={(option) => {
          setSelectedMonth(option);
          onSelectMonth(option);
        }}
        placeholder="월"
        isOpen={isMonthOpen}
        onToggle={(value) => {
          setIsMonthOpen(value);
          closeDropdowns("month");
        }}
      />

      <Dropdown
        options={days}
        value={selectedDay}
        onChange={(option) => {
          setSelectedDay(option);
          onSelectDay(option);
        }}
        placeholder="일"
        isOpen={isDayOpen}
        onToggle={(value) => {
          setIsDayOpen(value);
          closeDropdowns("day");
        }}
      />
    </div>
  );
};

export default BirthSelect;
