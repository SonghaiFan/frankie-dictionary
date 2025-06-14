import { BsSearchHeart } from "react-icons/bs";
import { FaDice } from "react-icons/fa";
import { PiEraserFill } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";

const SearchInput = ({
  query,
  setQuery,
  defaultText,
  onSelect,
  results,
  onRandom,
  onConfirm,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!query || results.length === 0) {
      if (e.key === "Enter") {
        onConfirm();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          onSelect(results[0]);
        } else {
          onConfirm();
        }
        break;
      case "Escape":
        e.preventDefault();
        setQuery("");
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay blur to allow click events on dropdown items
    setTimeout(() => {
      setIsFocused(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleItemClick = (item, index) => {
    setSelectedIndex(index);
    onSelect(item);
  };

  // Smart button handler - handles search, random, and clear
  const handleButtonClick = () => {
    if (!query) {
      // No query: Random function
      onRandom();
    } else if (results.length > 0) {
      // Has query with results: Search function
      onConfirm();
    } else {
      // Has query but no results: Clear function
      onRandom(); // This clears the query
    }
  };

  // Smart button icon and title
  const getButtonContent = () => {
    if (!query) {
      return {
        icon: <FaDice size={22} />,
        title: "Random word",
      };
    } else if (results.length > 0) {
      return {
        icon: <BsSearchHeart size={22} />,
        title: "Search",
      };
    } else {
      return {
        icon: <PiEraserFill size={22} />,
        title: "Clear search",
      };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-md">
        {/* Search Input Container */}
        <div
          className={`flex rounded-md transition-all duration-300 ${
            isFocused
              ? "ring-2 ring-kleinBlue ring-opacity-50 shadow-lg"
              : "border border-gray-300"
          }`}
        >
          <input
            ref={inputRef}
            className="flex-grow px-4 py-3 focus:outline-none rounded-l-md bg-white text-gray-800 placeholder-gray-400"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type="text"
            placeholder={defaultText}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={handleButtonClick}
            className="bg-kleinBlue text-white px-4 py-3 rounded-r-md hover:bg-blue-600 focus:outline-none transition-all ease-in-out duration-300 border-0"
            type="button"
            title={buttonContent.title}
          >
            {buttonContent.icon}
          </button>
        </div>

        {/* Enhanced Dropdown Results */}
        {query && (isFocused || selectedIndex >= 0) && (
          <div
            ref={dropdownRef}
            className="absolute bg-white border-0 shadow-xl mt-2 w-full max-h-[12rem] rounded-lg overflow-hidden z-20"
            style={{
              boxShadow:
                "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-4 text-gray-500 text-center bg-gray-50">
                <div className="text-sm">未找到相关词条</div>
                <div className="text-xs text-gray-400 mt-1">
                  Try searching with different keywords
                </div>
              </div>
            ) : (
              <div className="max-h-[12rem] overflow-auto">
                {results.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemClick(item, index)}
                    className={`cursor-pointer px-4 py-3 transition-all ease-in-out duration-200 border-b border-gray-50 last:border-b-0 ${
                      selectedIndex === index
                        ? "bg-kleinBlue bg-opacity-10 border-l-4 border-l-kleinBlue"
                        : "hover:bg-gray-50 hover:border-l-4 hover:border-l-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-grow">
                        <div
                          className={`font-medium ${
                            selectedIndex === index
                              ? "text-kleinBlue"
                              : "text-gray-800"
                          }`}
                        >
                          {item.中文}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.英文}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {item.出处}
                      </div>
                    </div>
                  </div>
                ))}
                {results.length > 8 && (
                  <div className="px-4 py-2 text-xs text-gray-400 text-center bg-gray-50">
                    +{results.length - 8} more results
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search hint */}
      <div
        className={`text-xs text-gray-400 text-center mt-3 h-4 transition-opacity duration-300 ${
          !query && !isFocused ? "opacity-100" : "opacity-0"
        }`}
      >
        Type to search • Press Enter to explore • Use ↑↓ to navigate
      </div>
    </div>
  );
};

export default SearchInput;
