
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Calendar, Clock, User, UserPlus, Search as SearchIcon, Repeat } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FilterState } from '../types';
import AuthModals from './AuthModals';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const Header: React.FC<HeaderProps> = ({ filters, onFilterChange }) => {
  const navigate = useNavigate();
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean, type: 'login' | 'register' }>({ open: false, type: 'login' });
  const shiftRef = useRef<HTMLDivElement>(null);
  const weeklyRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const shifts: FilterState['shift'][] = ['早更', '晚更', '特更'];
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
  
  const catalogMenu = [
    { name: '的士', path: '/' },
    { name: '貨車', path: '/van' },
    { name: '廣告車', path: '/ad-car' },
    { name: '車隊ERP', path: '/erp' },
    { name: '新消息', path: '/news' },
    { name: '聯絡我們', path: '/contact' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shiftRef.current && !shiftRef.current.contains(event.target as Node)) {
        setIsShiftOpen(false);
      }
      if (weeklyRef.current && !weeklyRef.current.contains(event.target as Node)) {
        setIsWeeklyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '選擇日期';
    return dateStr.split('-').reverse().join('/');
  };

  const toggleWeeklyDay = (day: string) => {
    const current = filters.weeklyDays || [];
    const next = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    onFilterChange({ weeklyDays: next });
  };

  const isMarketplace = location.pathname === '/' || location.pathname.startsWith('/taxi');

  return (
    <div className="w-full flex flex-col sticky top-0 z-[100] bg-white">
      {/* Catalog Navigation Bar */}
      <div className="w-full bg-[#003366] text-white py-2.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <nav className="flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar">
            {catalogMenu.map((item, idx) => (
              <React.Fragment key={item.name}>
                <Link 
                  to={item.path} 
                  className={`text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap hover:text-sky-300 ${location.pathname === item.path ? 'text-sky-400' : 'text-slate-300'}`}
                >
                  {item.name}
                </Link>
                {idx < catalogMenu.length - 1 && <span className="text-white/10 font-thin text-xs mx-1">|</span>}
              </React.Fragment>
            ))}
          </nav>
          
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 ml-4">
            <button 
              onClick={() => setAuthModal({ open: true, type: 'login' })}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest hover:text-sky-300 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              登入
            </button>
            <Link 
              to="/register"
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-sky-500 hover:bg-sky-600 px-4 py-1.5 rounded-lg transition-all shadow-lg shadow-sky-500/20 active:scale-95 text-white"
            >
              <UserPlus className="w-3.5 h-3.5" />
              註冊
            </Link>
          </div>
        </div>
      </div>

      {/* Main Search Header */}
      <header className="w-full bg-white py-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Link to="/" className="flex items-center gap-3 mr-4 flex-shrink-0 mb-2 lg:mb-0 cursor-pointer group">
              <h1 className="m-0 flex items-baseline origin-left transition-transform group-hover:scale-105">
                <span className="text-4xl font-black text-[#00AEEF] italic tracking-tighter select-none">租的</span>
                <span className="text-5xl font-black text-[#00AEEF] lowercase leading-none select-none -ml-1">e</span>
              </h1>
              <div className="hidden sm:flex flex-col ml-3 border-l border-slate-200 pl-4">
                <span className="text-sm font-black text-[#003366] tracking-tight leading-none uppercase">專業租賃</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Hong Kong</span>
              </div>
            </Link>

            {isMarketplace && (
              <div className="flex-grow w-full bg-[#F5F8FA] rounded-[24px] border border-[#E1E8ED] p-1.5 flex flex-col md:flex-row items-stretch gap-1 shadow-[0_4px_20px_-8px_rgba(0,174,239,0.15)] focus-within:border-[#00AEEF]/30 transition-all">
                <div className="flex-[1.2] min-w-0 px-4 py-2.5 hover:bg-white transition-all group rounded-2xl relative">
                  <label htmlFor="location-input" className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-[#00AEEF]">取車地點</label>
                  <div className="flex items-center gap-2">
                    <SearchIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00AEEF] transition-colors" />
                    <input 
                      id="location-input"
                      type="text" 
                      placeholder="元朗、九龍、香港島..."
                      className="w-full text-[13px] font-black text-slate-700 outline-none placeholder:text-slate-300 bg-transparent"
                      value={filters.location}
                      onChange={(e) => onFilterChange({ location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Dates Block */}
                <div className="flex-[1.5] flex items-stretch border-l border-slate-200">
                  <div className="flex-1 min-w-0 px-4 py-2.5 hover:bg-white transition-all group rounded-2xl relative cursor-pointer">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-[#00AEEF]">取車日期</label>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-black text-slate-700">{formatDateDisplay(filters.pickupDate)}</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00AEEF] transition-colors" />
                    </div>
                    <input 
                      type="date"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      value={filters.pickupDate}
                      onChange={(e) => onFilterChange({ pickupDate: e.target.value })}
                    />
                  </div>

                  <div className="flex-1 min-w-0 border-l border-slate-100 px-4 py-2.5 hover:bg-white transition-all group rounded-2xl relative cursor-pointer">
                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-[#00AEEF]">還車日期</label>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-black text-slate-700">{formatDateDisplay(filters.returnDate)}</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00AEEF] transition-colors" />
                    </div>
                    <input 
                      type="date"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      value={filters.returnDate}
                      onChange={(e) => onFilterChange({ returnDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* 每週過濾 Segment - Click to expand / collapse */}
                <div 
                  ref={weeklyRef}
                  className="w-32 border-l border-slate-200 px-4 py-2.5 hover:bg-white transition-all group cursor-pointer relative rounded-2xl"
                  onClick={() => setIsWeeklyOpen(!isWeeklyOpen)}
                >
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-[#00AEEF]">每週過濾</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-[11px] font-black text-slate-700 whitespace-nowrap truncate max-w-[50px]">
                        {filters.weeklyDays.length > 0 ? filters.weeklyDays.join(',') : '未選'}
                      </span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isWeeklyOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isWeeklyOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 min-w-[220px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-4 animate-[fadeInDown_0.2s_ease-out]">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">固定出車日</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onFilterChange({ weeklyDays: [] }); }}
                          className="text-[8px] font-black text-sky-500 uppercase hover:underline"
                        >
                          清除
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {weekDays.map(day => (
                          <button
                            key={day}
                            onClick={(e) => { e.stopPropagation(); toggleWeeklyDay(day); }}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-black transition-all ${
                              filters.weeklyDays.includes(day)
                                ? 'bg-[#003366] text-white shadow-lg'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-[8px] font-bold text-slate-400 leading-relaxed italic border-t border-slate-50 pt-2">
                        * 選取的日子將套用於每週週期性搜尋
                      </p>
                    </div>
                  )}
                </div>

                {/* Shifts Block */}
                <div 
                  ref={shiftRef}
                  className="w-32 border-l border-slate-200 px-4 py-2.5 hover:bg-white transition-all group cursor-pointer relative rounded-2xl"
                  onClick={() => setIsShiftOpen(!isShiftOpen)}
                >
                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-[#00AEEF]">租更時段</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#00AEEF]" />
                      <span className="text-[13px] font-black text-slate-700 whitespace-nowrap">{filters.shift}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isShiftOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isShiftOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-[fadeInDown_0.2s_ease-out]">
                      {shifts.map((s) => (
                        <button
                          key={s}
                          className={`w-full text-left px-4 py-2.5 text-xs font-black transition-colors border-b border-slate-50 last:border-0 ${filters.shift === s ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFilterChange({ shift: s });
                            setIsShiftOpen(false);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="bg-[#003366] hover:bg-[#002244] text-white px-8 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ml-1">
                  <SearchIcon className="w-4 h-4" />
                  <span className="font-black text-xs uppercase tracking-widest">搜尋</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModals 
        isOpen={authModal.open} 
        type={authModal.type} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
      />

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Header;
