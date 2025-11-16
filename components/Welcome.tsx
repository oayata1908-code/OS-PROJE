
import React from 'react';
import { BookIcon, SearchIcon, SparklesIcon } from './Icons';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-6">
        <BookIcon className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Mevzuat Asistanına Hoş Geldiniz</h2>
      <p className="mt-2 max-w-md text-slate-500">
        Silah ruhsatlandırma ile ilgili kanun, yönetmelik ve genelgeler hakkında anında bilgi alın.
      </p>
      <div className="mt-8 space-y-4 text-left max-w-sm w-full">
        <div className="flex items-start p-4 bg-slate-50 rounded-lg">
          <div className="bg-slate-200 text-slate-600 rounded-full p-2 mr-4">
             <UploadIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-700">1. Doküman Yükleyin</h3>
            <p className="text-sm text-slate-500">(Simülasyon) Uygulama örnek dokümanlarla başlar.</p>
          </div>
        </div>
        <div className="flex items-start p-4 bg-slate-50 rounded-lg">
           <div className="bg-slate-200 text-slate-600 rounded-full p-2 mr-4">
             <SearchIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-700">2. Arama Yapın</h3>
            <p className="text-sm text-slate-500">Yandaki arama çubuğunu kullanarak tüm belgelerde arama yapın.</p>
          </div>
        </div>
        <div className="flex items-start p-4 bg-slate-50 rounded-lg">
          <div className="bg-slate-200 text-slate-600 rounded-full p-2 mr-4">
             <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-700">3. AI ile Sohbet Edin</h3>
            <p className="text-sm text-slate-500">Bir arama sonucuna tıklayarak AI asistan ile konu hakkında sohbet edin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};


const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
    </svg>
);


export default Welcome;
