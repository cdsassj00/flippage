
import React, { useState, useRef, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { BookState } from '../types';

interface FlipBookViewerProps {
  book: BookState;
  setBook: React.Dispatch<React.SetStateAction<BookState | null>>;
}

export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({ book, setBook }) => {
  const [zoom, setZoom] = useState(1.0);
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { totalPages, pages, aspectRatio } = book;

  const calculateBestFit = useCallback(() => {
    // 컨테이너가 없으면 window 크기라도 사용
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;
    
    const clientWidth = containerRef.current?.clientWidth || vWidth;
    const clientHeight = containerRef.current?.clientHeight || vHeight;
    
    // 가로 슬라이드의 경우 높이를 거의 다 쓰도록 설정 (컨트롤러 제외 100px)
    const targetAreaW = clientWidth * 0.95;
    const targetAreaH = clientHeight - 120; 

    // aspectRatio는 (너비*2)/높이 임. 한 페이지 비율은 aspectRatio / 2
    const singlePageRatio = aspectRatio / 2;

    // 1. 높이 기준으로 맞춤 (가장 크게 보임)
    let h = targetAreaH;
    let w = h * singlePageRatio;

    // 2. 만약 펼친 너비가 화면을 넘어가면 너비 기준으로 줄임
    if (w * 2 > targetAreaW) {
      w = targetAreaW / 2;
      h = w / singlePageRatio;
    }

    // 최소 크기 보장 (너무 작아지는 것 방지)
    const finalW = Math.max(w, 200);
    const finalH = Math.max(h, 150);

    setDimensions({
      width: Math.floor(finalW),
      height: Math.floor(finalH)
    });
  }, [aspectRatio]);

  useEffect(() => {
    // 즉시 실행 및 지연 실행으로 렌더링 타이밍 보장
    calculateBestFit();
    const timers = [
      setTimeout(calculateBestFit, 50),
      setTimeout(calculateBestFit, 500),
      setTimeout(calculateBestFit, 2000)
    ];
    
    window.addEventListener('resize', calculateBestFit);
    return () => {
      window.removeEventListener('resize', calculateBestFit);
      timers.forEach(t => clearTimeout(t));
    };
  }, [calculateBestFit]);

  const onPageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    setBook(prev => prev ? { ...prev, currentPage: e.data } : null);
  }, [setBook]);

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden">
      
      {/* 책 영역: dimensions가 0이어도 컨테이너는 렌더링하여 ref를 잡을 수 있게 함 */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full flex items-center justify-center p-2 relative overflow-hidden"
      >
        {dimensions.width > 0 && (
          <div 
            className="flip-shadow transition-all duration-500 ease-out origin-center"
            style={{ 
              width: dimensions.width * 2, 
              height: dimensions.height,
              transform: `scale(${zoom})`
            }}
          >
            <HTMLFlipBook
              width={dimensions.width}
              height={dimensions.height}
              size="fixed"
              minWidth={dimensions.width}
              maxWidth={4000}
              minHeight={dimensions.height}
              maxHeight={4000}
              maxShadowOpacity={0.7}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onPageFlip}
              className="flip-book-canvas"
              ref={flipBookRef}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {pages.map((pageUrl, index) => (
                <div key={index} className={`page ${index % 2 === 0 ? 'page-left' : 'page-right'}`}>
                  <div className="w-full h-full bg-white relative">
                    <img 
                      src={pageUrl} 
                      alt={`Page ${index + 1}`} 
                      className="w-full h-full object-fill pointer-events-none"
                    />
                    <div className="paper-texture"></div>
                    <div className="page-spine"></div>
                    <div className={`absolute bottom-4 ${index % 2 === 0 ? 'left-6' : 'right-6'} text-[10px] font-black text-black/20 tracking-widest`}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* 개선된 하단 리모컨 */}
      <div className="h-28 w-full flex items-end justify-center pb-6 controls-gradient relative z-[300]">
        <div className="flex items-center gap-6 bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-90 md:scale-100">
          
          {/* Zoom & Fit */}
          <div className="flex items-center gap-3 pr-6 border-r border-white/5">
            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.15))} className="text-white/30 hover:text-indigo-400 transition-colors p-1">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
            </button>
            <button 
              onClick={() => { setZoom(1.0); calculateBestFit(); }} 
              className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all uppercase"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button onClick={() => setZoom(z => Math.min(5.0, z + 0.15))} className="text-white/30 hover:text-indigo-400 transition-colors p-1">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
              className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-full text-white/40 hover:text-white transition-all disabled:opacity-5 active:scale-90"
              disabled={currentPage === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-baseline gap-2 min-w-[90px] justify-center">
               <span className="text-3xl font-black text-white tracking-tighter">{currentPage + 1}</span>
               <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">/ {totalPages}</span>
            </div>

            <button 
              onClick={() => flipBookRef.current?.pageFlip().flipNext()}
              className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-full text-white/40 hover:text-white transition-all disabled:opacity-5 active:scale-90"
              disabled={currentPage >= totalPages - 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-4 pl-6 border-l border-white/5">
             <button 
                onClick={calculateBestFit} 
                className="text-white/20 hover:text-indigo-400 transition-all p-2 bg-white/5 rounded-xl"
                title="Fit to Screen"
              >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
