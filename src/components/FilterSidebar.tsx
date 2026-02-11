'use client';

import React, { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  categories: { id: string; name: string; count: number }[];
}

export default function FilterSidebar({ onFilterChange, categories }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: false,
    material: false,
    rating: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelected);
    onFilterChange({ ...onFilterChange, categories: newSelected });
  };

  return (
    <div className="card-luxury p-6 h-fit">
      <h2 className="font-heading text-lg uppercase tracking-wider text-gold-500 mb-6">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <button 
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('category')}
        >
          <h3 className="font-heading text-sm uppercase tracking-wider text-champagne-200">Category</h3>
          <svg 
            className={`w-4 h-4 text-silver-500 transition-transform ${openSections.category ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {openSections.category && (
          <div className="mt-4 space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-gold-500 bg-luxury-dark border-gold-500/30 rounded focus:ring-gold-500 focus:ring-2"
                />
                <label 
                  htmlFor={`cat-${category.id}`} 
                  className="ml-2 text-sm text-silver-400 flex-1"
                >
                  {category.name}
                </label>
                <span className="text-xs text-silver-600">({category.count})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Filter */}
      <div className="mb-6">
        <button 
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-heading text-sm uppercase tracking-wider text-champagne-200">Price Range</h3>
          <svg 
            className={`w-4 h-4 text-silver-500 transition-transform ${openSections.price ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {openSections.price && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-silver-400 mb-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="relative pt-1">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-silver-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Material Filter */}
      <div className="mb-6">
        <button 
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('material')}
        >
          <h3 className="font-heading text-sm uppercase tracking-wider text-champagne-200">Material</h3>
          <svg 
            className={`w-4 h-4 text-silver-500 transition-transform ${openSections.material ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {openSections.material && (
          <div className="mt-4 space-y-2">
            {['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold'].map(material => (
              <div key={material} className="flex items-center">
                <input
                  type="checkbox"
                  id={`mat-${material}`}
                  className="w-4 h-4 text-gold-500 bg-luxury-dark border-gold-500/30 rounded focus:ring-gold-500 focus:ring-2"
                />
                <label 
                  htmlFor={`mat-${material}`} 
                  className="ml-2 text-sm text-silver-400"
                >
                  {material}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Rating Filter */}
      <div className="mb-6">
        <button 
          className="flex justify-between items-center w-full text-left"
          onClick={() => toggleSection('rating')}
        >
          <h3 className="font-heading text-sm uppercase tracking-wider text-champagne-200">Rating</h3>
          <svg 
            className={`w-4 h-4 text-silver-500 transition-transform ${openSections.rating ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {openSections.rating && (
          <div className="mt-4 space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  className="w-4 h-4 text-gold-500 bg-luxury-dark border-gold-500/30 rounded focus:ring-gold-500 focus:ring-2"
                />
                <label 
                  htmlFor={`rating-${rating}`} 
                  className="ml-2 text-sm text-silver-400 flex items-center"
                >
                  {rating}+ Stars
                  <svg className="w-4 h-4 text-gold-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button 
        className="btn-luxury-outline w-full py-2 text-sm"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 1000]);
          onFilterChange({});
        }}
      >
        Clear All Filters
      </button>
    </div>
  );
}