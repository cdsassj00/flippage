
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
    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;
    
    const clientWidth = containerRef.current?.clientWidth || vWidth;
    const clientHeight = containerRef.current?.clientHeight || vHeight;
    
    const targetAreaW = clientWidth * 0.94; // 좌우 여백 확보
    const targetAreaH = clientHeight - 160; 

    const singlePageRatio = aspectRatio / 2;

    let h = targetAreaH;
    let w = h * singlePageRatio;

    if (w * 2 > targetAreaW) {
      w = targetAreaW / 2;
      h = w / singlePageRatio;
    }

    setDimensions({
      width: Math.floor(Math.max(w, 200)),
      height: Math.floor(Math.max(h, 150))
    });
  }, [aspectRatio]);

  useEffect(() => {
    calculateBestFit();
    window.addEventListener('resize', calculateBestFit);
    const timers = [setTimeout(calculateBestFit, 100), setTimeout(calculateBestFit, 800)];
    return () => {
      window.removeEventListener('resize', calculateBestFit);
      timers.forEach(clearTimeout);
    };
  }, [calculateBestFit]);

  const onPageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    setBook(prev => prev ? { ...prev, currentPage: e.data } : null);
  }, [setBook]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#030303] overflow-hidden">
      
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full flex items-center justify-center p-4 relative overflow-hidden"
      >
        {dimensions.width > 0 && (
          <div 
            className="flip-shadow transition-all duration-700 ease-out origin-center"
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
              maxShadowOpacity={0.5}
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
                  <div className="w-full h-full bg-white relative overflow-hidden">
                    {/* 원본 페이지 이미지 */}
                    <img 
                      src={pageUrl} 
                      alt={`Page ${index + 1}`} 
                      className="w-full h-full object-fill pointer-events-none"
                    />
                    
                    {/* 3D 리얼리즘 레이어 (중앙 접힘부 효과) */}
                    <div className="page-outer-edge"></div>
                    <div className="page-crease"></div>
                    <div className="page-spine-shadow"></div>
                    <div className="page-curvature-highlight"></div>
                    <div className="paper-texture"></div>
                    
                    {/* 페이지 번호 (디자인적 요소) */}
                    <div className={`absolute bottom-6 ${index % 2 === 0 ? 'left-10' : 'right-10'} text-[9px] font-black text-black/20 tracking-[0.3em] z-40 select-none`}>
                      PAGE {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </div>

      {/* 강화된 하단 리모컨 */}
      <div className="h-28 w-full flex items-end justify-center pb-8 controls-gradient relative z-[300]">
        <div className="flex items-center gap-8 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 px-10 py-4 rounded-full shadow-[0_30px_100px_rgba(0,0,0,1)] scale-90 md:scale-100">
          
          <div className="flex items-center gap-4 pr-8 border-r border-white/5">
            <button onClick={() => setZoom(z => Math.max(0.2, z - 0.2))} className="text-white/20 hover:text-indigo-400 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
            </button>
            <button onClick={() => { setZoom(1.0); calculateBestFit(); }} className="text-[11px] font-black text-indigo-500 bg-indigo-500/10 px-4 py-1.5 rounded-xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all uppercase tracking-wider">
              {Math.round(zoom * 100)}%
            </button>
            <button onClick={() => setZoom(z => Math.min(4.0, z + 0.2))} className="text-white/20 hover:text-indigo-400 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
              className="p-3 bg-white/5 hover:bg-indigo-600 rounded-2xl text-white/30 hover:text-white transition-all disabled:opacity-5 active:scale-90"
              disabled={currentPage === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex flex-col items-center min-w-[100px]">
               <span className="text-3xl font-black text-white leading-none tabular-nums tracking-tighter">{currentPage + 1}</span>
               <span className="text-white/10 text-[9px] font-black uppercase tracking-[0.2em] mt-1">of {totalPages}</span>
            </div>

            <button 
              onClick={() => flipBookRef.current?.pageFlip().flipNext()}
              className="p-3 bg-white/5 hover:bg-indigo-600 rounded-2xl text-white/30 hover:text-white transition-all disabled:opacity-5 active:scale-90"
              disabled={currentPage >= totalPages - 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-4 pl-8 border-l border-white/5">
             <button onClick={calculateBestFit} className="text-white/10 hover:text-white transition-all p-2.5 bg-white/5 rounded-2xl" title="Reset View">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
