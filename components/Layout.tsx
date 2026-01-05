
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">FlipAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Product</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Templates</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Pricing</a>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 FlipAI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest font-bold">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest font-bold">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest font-bold">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
