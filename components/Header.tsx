
import React from 'react';
import { BookIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <BookIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800 ml-3">Mevzuat Asistanı</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
