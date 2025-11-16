
import React from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-3">Mevzuatta Ara</h2>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Aranacak metni yazın..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
        />
      </div>
    </div>
  );
};

export default SearchBar;
