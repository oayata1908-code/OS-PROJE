
import React from 'react';
import { Document } from '../types';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileUpload: (documents: Document[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This is a simulation. In a real app, you would parse the files.
    // For now, we'll just log the file names and do nothing.
    if (event.target.files) {
      const fileNames = Array.from(event.target.files).map(file => file.name).join(', ');
      alert(`Simulated upload of: ${fileNames}. The app uses pre-loaded mock documents.`);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-700 mb-3">Doküman Yükle</h2>
      <label
        htmlFor="file-upload"
        className="relative cursor-pointer bg-white rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-500 transition-colors p-6 flex flex-col items-center justify-center text-center"
      >
        <UploadIcon className="w-10 h-10 text-slate-400" />
        <span className="mt-2 block text-sm font-medium text-slate-600">
          PDF veya Word dosyası sürükleyin
        </span>
        <span className="text-xs text-slate-500">veya tıklayarak seçin</span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </label>
       <p className="text-xs text-slate-400 mt-2">Not: Bu bir simülasyondur. Uygulama, arama yapabilmeniz için önceden yüklenmiş örnek dokümanlar kullanır.</p>
    </div>
  );
};

export default FileUpload;
