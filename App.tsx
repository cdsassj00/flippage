
import React, { useState, useCallback } from 'react';
import { PdfUploader } from './components/PdfUploader';
import { FlipBookViewer } from './components/FlipBookViewer';
import { AiSidebar } from './components/AiSidebar';
import { BookState } from './types';

const App: React.FC = () => {
  const [book, setBook] = useState<BookState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePdfLoaded = useCallback((pages: string[], aspectRatio: number) => {
    setBook({
      pages,
      currentPage: 0,
      totalPages: pages.length,
      aspectRatio
    });
    setIsLoading(false);
  }, []);

  const resetBook = () => setBook(null);

  return (
    <div className="h-full w-full flex flex-col bg-black overflow-hidden relative">
      {!book && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-indigo-500/20">
              Exclusive 3D Engine
            </div>
            <h1 className="text-8xl font-black mb-6 tracking-tighter leading-none flex flex-col md:flex-row items-center justify-center gap-4">
              <span>FLIP</span> 
              <span className="text-indigo-500 bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-purple-600">PRO</span>
            </h1>
            <p className="text-lg text-white/40 max-w-lg mx-auto font-medium leading-relaxed">
              최고 수준의 3D 물리 엔진을 탑재한 인터랙티브 북 엔진입니다.<br/>
              PDF를 업로드하여 상용 수준의 플립북을 지금 생성하세요.
            </p>
          </div>
          <PdfUploader 
            onUploadStart={() => setIsLoading(true)} 
            onPagesGenerated={handlePdfLoaded} 
          />
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white bg-black">
          <div className="relative w-24 h-24 mb-10">
            <div className="absolute inset-0 border-[3px] border-indigo-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xs font-black tracking-[0.5em] text-indigo-500 animate-pulse">GENERATING PREVIEWS</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* NavBar */}
          <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 bg-gradient-to-b from-black to-transparent z-[150] pointer-events-none">
            <div className="flex items-center gap-6 pointer-events-auto">
              <button onClick={resetBook} className="group flex items-center gap-3 text-white/40 hover:text-white transition-all">
                <div className="p-2.5 bg-white/5 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                <span className="font-bold text-xs uppercase tracking-widest">Back</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 pointer-events-auto">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                Run AI Insight
              </button>
            </div>
          </div>

          <div className="flex-1 w-full h-full relative">
            <FlipBookViewer book={book} setBook={setBook} />
          </div>

          <AiSidebar 
            isOpen={isSidebarOpen} 
            bookContent="" 
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default App;
