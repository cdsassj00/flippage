
import React, { useRef, useState } from 'react';

interface PdfUploaderProps {
  onUploadStart: () => void;
  onPagesGenerated: (pages: string[], aspectRatio: number) => void;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({ onUploadStart, onPagesGenerated }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') return;
    onUploadStart();

    try {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const pageImages: string[] = [];
      let detectedRatio = 1.414;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        // 선명도를 위해 2.5배 스케일 렌더링
        const viewport = page.getViewport({ scale: 2.5 });
        
        if (i === 1) {
          // 2페이지 펼침 기준 비율: (너비 * 2) / 높이
          detectedRatio = (viewport.width * 2) / viewport.height;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          pageImages.push(canvas.toDataURL('image/jpeg', 0.9));
        }
      }

      onPagesGenerated(pageImages, detectedRatio);
    } catch (error) {
      console.error(error);
      alert('PDF 변환 중 오류가 발생했습니다.');
    }
  };

  return (
    <div 
      className={`w-full max-w-3xl p-16 rounded-[40px] border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center gap-8 ${
        dragActive 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-[0_0_50px_rgba(99,102,241,0.2)]' 
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); e.dataTransfer.files?.[0] && processFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
      
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">PDF 업로드 및 플립북 생성</h2>
        <p className="text-gray-400 font-medium">드래그하거나 클릭하여 상용 수준의 인터랙티브 북을 만드세요.</p>
      </div>
    </div>
  );
};
