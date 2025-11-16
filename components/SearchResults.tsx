
import React from 'react';
import { SearchResult, Document } from '../types';
import { DocumentIcon } from './Icons';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (document: Document) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect }) => {
  if (results.length === 0) {
    return <div className="mt-4 text-sm text-slate-500">Arama sonucu bulunamadı.</div>;
  }

  return (
    <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
      {results.map(({ document, snippet }, index) => (
        <div
          key={`${document.id}-${index}`}
          onClick={() => onSelect(document)}
          className="p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors border border-slate-200"
        >
          <div className="flex items-center text-sm font-semibold text-indigo-700">
            <DocumentIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <p className="truncate">{document.name}</p>
          </div>
          <p className="mt-1 text-xs text-slate-600 italic">"{snippet}"</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
