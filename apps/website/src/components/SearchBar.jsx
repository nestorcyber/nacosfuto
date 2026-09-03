import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

function SearchBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const knownRoutes = [
    'home', 
    'about',
    'admissions',
    'programs',
    'campus-tour',
    'contact',
    'report-emergency',
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const query = search.trim().toLowerCase();

      if (knownRoutes.includes(query)) {
        navigate(`/${query}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }

      setSearch('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      const filteredSuggestions = knownRoutes.filter((route) =>
        route.toLowerCase().includes(value.trim().toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="hidden md:flex items-center relative max-w-md w-full">
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        onKeyDown={handleSearch}
        className="pl-10 pr-4 py-1.5 rounded bg-white dark:bg-[#083002] border border-gray-300 dark:border-[#138601]/40 focus:outline-none focus:ring-1 focus:ring-[#138601] w-full text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-green-100/60"
        placeholder="Search..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 rounded shadow-xl z-50 overflow-hidden">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="px-4 py-3 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#041801] cursor-pointer border-b last:border-none border-gray-100 dark:border-[#138601]/20 transition-colors"
              onClick={() => {
                navigate(`/${suggestion}`);
                setSearch('');
                setSuggestions([]);
              }}
            >
              {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;