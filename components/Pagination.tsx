
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Basic logic to show pages with dots
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, 4, 5, '...', totalPages - 1, totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 py-8 overflow-x-auto no-scrollbar">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((p, idx) => (
        <button
          key={idx}
          onClick={() => typeof p === 'number' && onPageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-black transition-all ${
            p === currentPage 
            ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg shadow-sky-500/30' 
            : p === '...' 
            ? 'text-slate-300 cursor-default' 
            : 'bg-white text-slate-500 border border-slate-100 hover:border-sky-300'
          }`}
        >
          {p}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30"
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="ml-4 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">共 {totalPages} 頁</span>
      </div>
    </div>
  );
};

export default Pagination;
