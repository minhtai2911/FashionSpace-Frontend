import { useState, useEffect, useRef } from "react";

export default function GenericDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Chọn...",
  displayKey = "name", // Key to display (e.g., 'name', 'roleName', 'title')
  valueKey = "_id", // Key for the actual value (e.g., '_id', 'value', 'id')
  renderOption = null, // Custom render function for options
  renderSelected = null, // Custom render function for selected value
  disabled = false,
  className = "",
  emptyMessage = "Không có dữ liệu",
}) {
  const [selectedValue, setSelectedValue] = useState(value || "");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (option) => {
    const newValue = option[valueKey];
    setSelectedValue(newValue);
    setOpen(false);
    onChange && onChange(newValue, option);
  };

  const getSelectedOption = () => {
    return options.find((option) => option[valueKey] === selectedValue);
  };

  const getDisplayValue = () => {
    const selectedOption = getSelectedOption();
    if (!selectedOption) return placeholder;

    if (renderSelected) {
      return renderSelected(selectedOption);
    }

    return selectedOption[displayKey] || placeholder;
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full font-semibold font-manrope px-5 py-3 border border-[#808191] focus:outline-none rounded-lg bg-transparent text-[#0a0a0a] text-sm flex justify-between items-center ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className="flex-1 text-left truncate">{getDisplayValue()}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute mt-1 z-10 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg">
          {options.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 text-sm">{emptyMessage}</li>
          ) : (
            options.map((option, index) => (
              <li
                key={option[valueKey] || index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  option[valueKey] === selectedValue ? "bg-blue-50" : ""
                }`}
              >
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <span className="font-medium font-manrope text-sm">
                    {option[displayKey]}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
