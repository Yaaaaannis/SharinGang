import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="w-full px-3 py-2 bg-[#f5ecd7] border-2 border-black rounded-lg flex items-center gap-2 mb-2">
      <span className="text-red-700 text-lg">🔎</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Rechercher...'}
        className="flex-1 bg-transparent outline-none text-black font-bold uppercase placeholder-gray-400"
        style={{ letterSpacing: '0.05em' }}
      />
    </div>
  );
} 