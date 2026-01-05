
import React, { useState, useCallback } from 'react';
import { PdfUploader } from './components/PdfUploader';
import { FlipBookViewer } from './components/FlipBookViewer';
import { AiSidebar } from './components/AiSidebar';
import { Layout } from './components/Layout';
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
    <div className="h-screen w-screen flex flex-col bg-[#0f0f0f] overflow-hidden">
      {!book && !isLoading ? (
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-block px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-indigo-600/30">
                Next-Gen Flipbook Engine
              </div>
              <h1 className="text-7xl font-black mb-6 tracking-tighter leading-none">
                FLIP <span className="text-indigo-500">PRO</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
                원본 비율을 완벽하게 유지하는 HTML5 플립북입니다.<br/>
                상용 서비스 수준의 부드러운 페이지 전환을 경험하세요.
              </p>
            </div>
            <PdfUploader 
              onUploadStart={() => setIsLoading(true)} 
              onPagesGenerated={handlePdfLoaded} 
            />
          </div>
        </Layout>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-white bg-[#0f0f0f]">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-[6px] border-indigo-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-[6px] border-indigo-300/10 rounded-full"></div>
            <div className="absolute inset-4 border-[6px] border-indigo-300 border-b-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-2xl font-black tracking-widest text-indigo-500 animate-pulse">RENDERING...</p>
        </div>
      ) : (
        <div className="relative flex-1 flex flex-col viewer-bg overflow-hidden">
          {/* Top Navbar */}
          <div className="h-16 flex items-center justify-between px-6 bg-black/60 border-b border-white/5 backdrop-blur-xl z-50">
            <div className="flex items-center gap-6">
              <button onClick={resetBook} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                <span className="font-bold text-sm tracking-tight">뒤로 가기</span>
              </button>
              <div className="h-6 w-px bg-white/10 hidden md:block"></div>
              <h2 className="text-white/80 text-sm font-medium hidden md:block">Interactive PDF Document</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                AI 분석 실행
              </button>
            </div>
          </div>

          {/* 메인 뷰어 */}
          <div className="flex-1 relative flex items-center justify-center">
            {book && <FlipBookViewer book={book} setBook={setBook} />}
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
