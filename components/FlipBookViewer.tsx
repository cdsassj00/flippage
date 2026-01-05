
import React, { useState, useRef, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { BookState } from '../types';

interface FlipBookViewerProps {
  book: BookState;
  setBook: React.Dispatch<React.SetStateAction<BookState | null>>;
}

export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({ book, setBook }) => {
  // 초기 줌 수치를 높여 문서가 더 크게 보이도록 설정
  const [zoom, setZoom] = useState(0.95);
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { totalPages, pages, aspectRatio } = book;

  // 페이지 가로/세로 크기 계산 (낱장 기준)
  const singlePageRatio = (aspectRatio / 2);
  // 고정 높이를 상향하여 더 큰 캔버스 확보
  const pageHeight = 950; 
  const pageWidth = pageHeight * singlePageRatio;

  const onPageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    setBook(prev => prev ? { ...prev, currentPage: e.data } : null);
  }, [setBook]);

  return (
    <div className="relative flex flex-col w-full h-full items-center justify-start select-none overflow-hidden">
      
      {/* 뷰어 스테이지: 상단 여백을 줄이고 영역을 가득 채움 */}
      <div 
        className="book-container flex-1 flex items-center justify-center w-full transition-transform duration-500 ease-out pt-4 pb-20"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="flip-shadow">
          <HTMLFlipBook
            width={Math.round(pageWidth)}
            height={pageHeight}
            size="stretch"
            minWidth={315}
            maxWidth={1200}
            minHeight={420}
            maxHeight={1800}
            maxShadowOpacity={0.4}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPageFlip}
            className="flip-book-canvas"
            ref={flipBookRef}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pages.map((pageUrl, index) => (
              <div key={index} className={`page ${index % 2 === 0 ? 'page-left' : 'page-right'}`}>
                <div className="page-content relative w-full h-full">
                  <img 
                    src={pageUrl} 
                    alt={`Page ${index + 1}`} 
                    className="w-full h-full object-fill"
                    loading="lazy"
                  />
                  <div className="paper-texture"></div>
                  <div className="page-spine"></div>
                  
                  {/* 페이지 번호: 더 은은하게 변경 */}
                  <div className={`absolute bottom-3 ${index % 2 === 0 ? 'left-4' : 'right-4'} text-[9px] font-bold text-black/10 uppercase tracking-[0.3em]`}>
                    PAGE {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* 플로팅 콤팩트 컨트롤러 (하단에 작게 배치) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] w-auto">
        <div className="flex items-center gap-6 bg-[#121212]/90 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-3 pr-6 border-r border-white/5">
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.05))} className="text-white/40 hover:text-indigo-400 transition-colors p-1.5 hover:bg-white/5 rounded-full">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
            </button>
            <span className="text-[13px] font-bold text-indigo-500 w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.05))} className="text-white/40 hover:text-indigo-400 transition-colors p-1.5 hover:bg-white/5 rounded-full">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
              className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-full text-white/50 hover:text-white transition-all disabled:opacity-5 active:scale-90"
              disabled={currentPage === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center gap-2 min-w-[80px] justify-center">
               <span className="text-xl font-black text-white tabular-nums">{currentPage + 1}</span>
               <span className="text-white/20 text-sm font-light">/</span>
               <span className="text-sm font-medium text-white/40 tabular-nums">{totalPages}</span>
            </div>

            <button 
              onClick={() => flipBookRef.current?.pageFlip().flipNext()}
              className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-full text-white/50 hover:text-white transition-all disabled:opacity-5 active:scale-90"
              disabled={currentPage >= totalPages - 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Fullscreen Tool */}
          <div className="pl-6 border-l border-white/5">
             <button onClick={() => document.documentElement.requestFullscreen()} className="text-white/30 hover:text-indigo-400 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-xl">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
