
import React, { useState, useMemo } from 'react';
import { Document, SearchResult, ChatMessage } from './types';
import { MOCK_DOCUMENTS } from './constants';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import ChatView from './components/ChatView';
import Welcome from './components/Welcome';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [chatKey, setChatKey] = useState<number>(0);

  const handleFileUpload = (newDocs: Document[]) => {
    setDocuments(prevDocs => [...prevDocs, ...newDocs]);
  };

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    documents.forEach(doc => {
      const matchIndex = doc.content.toLowerCase().indexOf(query);
      if (matchIndex !== -1) {
        const snippetStart = Math.max(0, matchIndex - 50);
        const snippetEnd = Math.min(doc.content.length, matchIndex + query.length + 50);
        const snippet = `...${doc.content.substring(snippetStart, snippetEnd)}...`;
        results.push({ document: doc, snippet });
      }
    });

    return results;
  }, [searchQuery, documents]);

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setChatKey(prev => prev + 1); // Reset chat view by changing key
  };

  const handleNewSearch = () => {
    setSelectedDocument(null);
    setSearchQuery('');
  };


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-6 max-w-7xl mx-auto">
        <aside className="md:col-span-1 lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <FileUpload onFileUpload={handleFileUpload} />
          <div className="mt-6 border-t border-slate-200 pt-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SearchResults results={searchResults} onSelect={handleSelectDocument} />
          </div>
        </aside>
        
        <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200">
          {selectedDocument ? (
             <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-700 truncate flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500" />
                        AI Sohbet Asistanı
                    </h2>
                    <button
                        onClick={handleNewSearch}
                        className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-1 px-3 rounded-lg transition-colors"
                    >
                        Yeni Arama
                    </button>
                </div>
                <ChatView key={chatKey} document={selectedDocument} />
            </div>
          ) : (
            <Welcome />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
