import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

interface SmartFiltersProps {
  darkMode: boolean;
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function SmartFilters({ darkMode, filters, setFilters }: SmartFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filterOptions: Record<string, string[]> = {
    qualification: ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma'],
    ageLimit: ['18-25 years', '21-30 years', '25-35 years', '30-40 years', 'No Age Limit'],
    category: ['All Categories', 'UR (General)', 'OBC', 'SC', 'ST', 'EWS'],
    state: ['All India', 'Delhi', 'Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal'],
    department: ['All Departments', 'Police', 'Education', 'Health', 'Transport', 'Revenue', 'Bank']
  };

  const handleSelectOption = (key: string, option: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: option
    }));
    setActiveFilter(null);
  };

  const clearFilter = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  return (
    <section className={`py-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Filter className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Smart Filters:
            </span>
          </div>

          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key} className="relative">
              <button
                onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  filters[key] 
                    ? (darkMode ? 'bg-sky-900 border-sky-700 text-sky-100' : 'bg-sky-100 border-sky-300 text-sky-800')
                    : (darkMode ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')
                }`}
              >
                <span className="capitalize text-sm mr-2 whitespace-nowrap">
                  {filters[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {filters[key] ? (
                  <X className="h-4 w-4" onClick={(e) => clearFilter(key, e)} />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {activeFilter === key && (
                <div className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-10 ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                } border`}>
                  <div className="py-2 max-h-60 overflow-y-auto">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelectOption(key, option)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {Object.keys(filters).length > 0 && (
            <button 
              onClick={clearAllFilters}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              Clear All
            </button>
          )}
        </div>
      </div>
    </section>
  );
}