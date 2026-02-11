'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search jewelry...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Mock search suggestions (in a real app, this would come from an API)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Simulate API call for search suggestions
      const mockSuggestions = [
        `${debouncedQuery} rings`,
        `${debouncedQuery} necklaces`,
        `${debouncedQuery} earrings`,
        `${debouncedQuery} bracelets`,
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleSearch = (searchTerm: string = query) => {
    if (searchTerm.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchTerm)) {
        const updatedSearches = [searchTerm, ...recentSearches].slice(0, 5);
        setRecentSearches(updatedSearches);
      }

      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-6 py-4 bg-luxury-dark border border-gold-500/30 rounded-full text-champagne-200 focus:outline-none focus:ring-2 focus:ring-gold-500 pr-14"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-silver-400 hover:text-gold-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {(isOpen && (suggestions.length > 0 || recentSearches.length > 0)) && (
        <div className="absolute z-10 w-full mt-2 bg-luxury-dark border border-gold-500/30 rounded-lg shadow-lg overflow-hidden">
          {suggestions.length > 0 && (
            <div className="py-2 border-b border-gold-500/20">
              <div className="px-4 py-2 text-xs font-heading uppercase tracking-wider text-gold-500">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-4 py-3 text-silver-400 hover:bg-gold-500/10 hover:text-champagne-200 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-3 text-silver-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="py-2">
              <div className="flex justify-between items-center px-4 py-2">
                <div className="text-xs font-heading uppercase tracking-wider text-gold-500">Recent Searches</div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-silver-500 hover:text-silver-300"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-4 py-3 text-silver-400 hover:bg-gold-500/10 hover:text-champagne-200 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-3 text-silver-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}