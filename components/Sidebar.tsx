
import React, { useState } from 'react';
import { FilterState } from '../types';
// Fixed missing import: Added 'X' to lucide-react icons
import { Settings, Calendar, Filter, Newspaper, ArrowRight, X } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

// Define CheckboxItem as a separate component with React.FC to handle standard React props like 'key'
const CheckboxItem: React.FC<{ label: string, isChecked: boolean, onChange: () => void }> = ({ label, isChecked, onChange }) => (
  <label className="flex items-center gap-3 group cursor-pointer py-2">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="peer h-5 w-5 rounded-lg border-2 border-slate-200 text-sky-500 focus:ring-0 transition-all cursor-pointer checked:border-sky-500"
        checked={isChecked}
        onChange={onChange}
      />
    </div>
    <span className={`text-sm transition-all ${isChecked ? 'text-sky-600 font-black' : 'text-slate-600 font-bold group-hover:text-slate-900'}`}>
      {label}
    </span>
  </label>
);

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const taxiTypes = ['紅的', '綠的', '藍的'];
  const brandModels = ['豐田 Comfort Hybrid', '日產 NV200', '福特 Transit Connect', 'Tesla Model 3', '日產 NOTE e-POWER'];
  const carCategories = ['混能', '石油氣', '新能源'];
  const carSpecs = ['4座', '5座'];
  const ages = ['1-2年', '3-5年', '6-10年', '10年以上'];

  const toggleArrayItem = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange({ [key]: next });
  };

  const clearAll = () => {
    onFilterChange({
      brands: [],
      ageRanges: [],
      taxiTypes: [],
      specs: [],
      features: [],
      categories: [],
    });
  };

  return (
    <>
      <aside className="w-full lg:w-72 space-y-8 lg:sticky lg:top-[128px]">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-2">
               <Filter className="w-4 h-4 text-[#1A365D]" />
               <h3 className="text-[11px] font-black text-slate-800 tracking-widest uppercase">篩選條件</h3>
            </div>
            <button onClick={clearAll} className="text-[10px] font-black text-sky-500 hover:text-sky-600 uppercase tracking-widest transition-colors">
              重置
            </button>
          </div>

          <div className="p-8 space-y-10">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">的士類型 (區域)</h4>
              <div className="space-y-1">
                {taxiTypes.map(t => (
                  <CheckboxItem 
                    key={t} 
                    label={t} 
                    isChecked={filters.taxiTypes.includes(t)} 
                    onChange={() => toggleArrayItem('taxiTypes', t)} 
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">廠名</h4>
              <div className="space-y-1">
                {brandModels.map(b => (
                  <CheckboxItem 
                    key={b} 
                    label={b} 
                    isChecked={filters.brands.includes(b)} 
                    onChange={() => toggleArrayItem('brands', b)} 
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">車型</h4>
              <div className="space-y-1">
                {carCategories.map(c => (
                  <CheckboxItem 
                    key={c} 
                    label={c} 
                    isChecked={filters.categories.includes(c)} 
                    onChange={() => toggleArrayItem('categories', c)} 
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsAdvancedOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#1A365D] hover:bg-sky-900 border border-[#1A365D] py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#1A365D]/20"
            >
              <Settings className="w-4 h-4" />
              <span>進階篩選</span>
            </button>
          </div>
        </div>

        {/* Updated Widget Title */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/40 p-8 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="w-4 h-4 text-sky-500" />
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">租的e 新聞</h4>
          </div>
          <div className="space-y-5">
            {[
              { title: '氣價調整公告：九月 LPG 上限維持不變', date: '今日' },
              { title: '特區政府：新增電動的士充電位計劃', date: '2天前' },
            ].map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <p className="text-xs font-bold text-slate-600 group-hover:text-sky-500 transition-colors leading-relaxed mb-1.5 line-clamp-2">
                  {news.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{news.date}</span>
                  <ArrowRight className="w-3 h-3 text-slate-200 group-hover:text-sky-500 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Advanced Search Modal */}
      {isAdvancedOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAdvancedOpen(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden animate-[modalIn_0.3s_cubic-bezier(0.34, 1.56, 0.64, 1)]">
            <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#1A365D]">進階篩選</h3>
              <button onClick={() => setIsAdvancedOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">座位數量</h4>
                <div className="grid grid-cols-2 gap-4">
                  {carSpecs.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleArrayItem('specs', s)}
                      className={`px-6 py-4 rounded-2xl border-2 text-sm font-black transition-all ${filters.specs.includes(s) ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">車齡範圍</h4>
                <div className="grid grid-cols-2 gap-4">
                  {ages.map(a => (
                    <button
                      key={a}
                      onClick={() => toggleArrayItem('ageRanges', a)}
                      className={`px-6 py-4 rounded-2xl border-2 text-sm font-black transition-all ${filters.ageRanges.includes(a) ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setIsAdvancedOpen(false)}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl text-sm uppercase tracking-widest"
              >
                應用篩選
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
