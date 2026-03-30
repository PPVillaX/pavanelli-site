'use client';

import { useState } from 'react';
import { categories } from '@/data/projects';

interface FilterBarProps {
  onFilterChange: (category: string) => void;
  activeFilter: string;
}

export default function FilterBar({ onFilterChange, activeFilter }: FilterBarProps) {
  return (
    <div className="flex gap-6 mt-10">
      {categories.map(cat => (
        <button
          key={cat.value}
          onClick={() => onFilterChange(cat.value)}
          className={`bg-transparent border-none font-sans text-[13px] font-medium tracking-[0.08em] uppercase cursor-pointer pb-1 border-b-2 transition-all duration-300 ${
            activeFilter === cat.value
              ? 'text-brand-graphite border-b-brand-terracotta'
              : 'text-brand-gray border-b-transparent hover:text-brand-graphite hover:border-b-brand-terracotta'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
