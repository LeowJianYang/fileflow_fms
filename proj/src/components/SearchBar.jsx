import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar Component 
 * 
 * @param {Array} data - The array of items to search through
 * @param {Array} searchFields - Array of field names to search in (e.g., ['filename', 'filetype'])
 * @param {Function} onSearchResults - Callback function that receives filtered results
 * @param {String} placeholder - Placeholder text for the search input
 * @param {String} className - Additional CSS classes for the container
 */
export default function SearchBar({ 
    data = [], 
    searchFields = [], 
    onSearchResults, 
    placeholder = "Search...",
    className = "",
    onFocus
}) {
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        if (!searchQuery.trim()) {
            // If search is empty, return all data
            onSearchResults(data);
            return;
        }

        const query = searchQuery.toLowerCase().trim();

        // Filter data based on search fields
        const filtered = data.filter((item) => {
          
            return searchFields.some((field) => {
                const value = getNestedValue(item, field);
                
                if (value === null || value === undefined) {
                    return false;
                }

                // Convert string and check if it includes the query
                return String(value).toLowerCase().includes(query);
            });
        });

        onSearchResults(filtered);
    }, [searchQuery, data]);


    // Get nested value "."
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    // Handle input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className={`relative w-full ${className}`}>
            {/* Icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Search size={20} />
            </div>

            {/*  Input */}
            <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-10 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#233648] text-gray-900 dark:text-white font-medium text-sm transition-all"
                onFocus={onFocus}
            />

            {/* Clear  */}
            {searchQuery && (
                <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                >
                    <X size={20} />
                </button>
            )}

        </div>
    );
}
