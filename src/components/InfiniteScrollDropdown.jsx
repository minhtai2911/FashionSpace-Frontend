import { useState, useEffect, useRef, useCallback } from "react";

export default function InfiniteScrollDropdown({
  value,
  onChange,
  fetchData,
  placeholder = "Chọn...",
  displayKey = "name",
  valueKey = "_id",
  renderOption = null,
  renderSelected = null,
  disabled = false,
  className = "",
  emptyMessage = "Không có dữ liệu",
  itemsPerPage = 5,
  searchable = false,
  onSearch = null,
}) {
  const [selectedValue, setSelectedValue] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);

  const dropdownRef = useRef(null);
  const scrollRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

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

  useEffect(() => {
    if (open && !initialLoaded) {
      loadData(1, true);
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm !== "") {
      setCurrentPage(1);
      setOptions([]);
      setHasMore(true);
      loadData(1, true, searchTerm);
    } else if (searchTerm === "" && options.length > 0) {
      setCurrentPage(1);
      setOptions([]);
      setHasMore(true);
      loadData(1, true);
    }
  }, [searchTerm]);

  const loadData = useCallback(
    async (page = 1, reset = false, search = "") => {
      if (loading) return;

      try {
        setLoading(true);
        const result = await fetchData(page, itemsPerPage, search);

        if (result && result.data) {
          if (reset) {
            setOptions(result.data);
          } else {
            setOptions((prev) => [...prev, ...result.data]);
          }

          const totalPages = result.meta?.totalPages || 1;
          setHasMore(page < totalPages);
          setCurrentPage(page);
          setInitialLoaded(true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, itemsPerPage, loading]
  );

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadData(currentPage + 1, false, searchTerm);
    }
  }, [loading, hasMore, currentPage, loadData, searchTerm]);

  const handleSelect = (option) => {
    const newValue = option[valueKey];
    setSelectedValue(newValue);
    setOpen(false);
    onChange && onChange(newValue, option);
  };

  const handleDropdownToggle = () => {
    if (!disabled) {
      setOpen(!open);
      if (!open && searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={handleDropdownToggle}
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
        <div className="absolute mt-1 z-10 w-full bg-white border rounded-md shadow-lg">
          {searchable && (
            <div className="p-2 border-b">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <ul
            ref={scrollRef}
            className="max-h-40 overflow-y-auto"
            onScroll={handleScroll}
          >
            {options.length === 0 && !loading ? (
              <li className="px-4 py-2 text-gray-500 text-sm">
                {emptyMessage}
              </li>
            ) : (
              <>
                {options.map((option, index) => (
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
                ))}

                {loading && (
                  <li className="px-4 py-2 text-center text-gray-500 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      <span>Đang tải...</span>
                    </div>
                  </li>
                )}

                {!hasMore && options.length > 0 && (
                  <li className="px-4 py-2 text-center text-gray-400 text-xs">
                    Đã tải hết dữ liệu
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
