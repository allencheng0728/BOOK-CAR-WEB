
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronRight, Sun, Moon, Clock, 
  Camera, MapPin, Usb, CreditCard, Wifi, 
  ArrowUpToLine, ShieldCheck, CheckCircle2,
  Phone, Calendar as CalendarIcon, 
  ChevronLeft, Users, Zap, AlertCircle,
  Info,
  Lock,
  ArrowDownCircle,
  CircleDollarSign,
  Banknote
} from 'lucide-react';
import { MOCK_CARS } from '../data';
import AuthModals from '../components/AuthModals';

type ShiftType = '早更' | '晚更' | '特更';

// Hong Kong Public Holidays 2024
const HK_HOLIDAYS_2024 = [
  '2024-01-01', '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13',
  '2024-03-29', '2024-03-30', '2024-04-01', '2024-04-04', '2024-05-01',
  '2024-05-15', '2024-06-10', '2024-07-01', '2024-09-18', '2024-10-01',
  '2024-10-11', '2024-12-25', '2024-12-26'
];

const MOCK_OCCUPIED_DATES = ['2024-04-10', '2024-04-15'];

const BookingPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const car = MOCK_CARS.find(c => c.id === carId);
  const flexiblePolicyRef = useRef<HTMLDivElement>(null);

  // Deterministic license plate based on car ID
  const licensePlate = useMemo(() => {
    const seeds: Record<string, string> = {
      'store-1': 'YL 8888',
      'store-2': 'ZE 1271',
      'store-3': 'TX 4492',
      'store-4': 'SS 1024',
      'store-5': 'TP 5531',
      'store-12': 'EV 2024'
    };
    return seeds[carId || ''] || `TX ${carId?.split('-')[1]?.padStart(4, '0') || '0000'}`;
  }, [carId]);

  // Deciding "彈性租金" (Flexible Rent) based on the license plate
  const isFlexibleCar = useMemo(() => {
    return licensePlate.startsWith('ZE') || licensePlate.startsWith('TX') || licensePlate.startsWith('EV');
  }, [licensePlate]);

  // Badge Color Mapper
  const taxiTypeColors: Record<string, string> = {
    '紅的': 'bg-red-600',
    '綠的': 'bg-emerald-600',
    '藍的': 'bg-blue-600'
  };

  // --- States ---
  const [activeShiftMode, setActiveShiftMode] = useState<ShiftType>('早更');
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  
  // Selection state
  const [selections, setSelections] = useState<Record<string, { morning: boolean; evening: boolean; special: boolean }>>({});
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Drag selection states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragEnd, setDragEnd] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!car) {
    return (
      <div className="p-20 text-center bg-white min-h-screen">
        <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-4">找不到車輛資料</h2>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#1A365D] text-white font-black rounded-2xl">返回首頁</button>
      </div>
    );
  }

  const scrollToPolicy = () => {
    flexiblePolicyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- Calculations ---
  const calculateTotal = useMemo(() => {
    let total = 0;
    const items: { date: string; label: string; price: number }[] = [];
    
    Object.entries(selections).forEach(([date, shiftsValue]) => {
      const shifts = shiftsValue as { morning: boolean; evening: boolean; special: boolean };
      if (shifts.special) {
        const price = car.morningPrice + car.eveningPrice - 40;
        total += price;
        items.push({ date, label: '特更 (全日)', price });
      } else {
        if (shifts.morning) {
          total += car.morningPrice;
          items.push({ date, label: '早更', price: car.morningPrice });
        }
        if (shifts.evening) {
          total += car.eveningPrice;
          items.push({ date, label: '晚更', price: car.eveningPrice });
        }
      }
    });
    
    return { total, items };
  }, [selections, car]);

  const platformFee = Math.round(calculateTotal.total * 0.01 * 10) / 10;
  const grandTotal = calculateTotal.total + platformFee;

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, dateStr: '', isSunday: false, isHoliday: false, isOccupied: false, isPast: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const date = new Date(year, month, i);
      const isSunday = date.getDay() === 0;
      const isHoliday = HK_HOLIDAYS_2024.includes(dateStr);
      const isOccupied = MOCK_OCCUPIED_DATES.includes(dateStr);
      const isPast = date < today;
      days.push({ day: i, dateStr, isSunday, isHoliday, isOccupied, isPast, dayOfWeek: date.getDay() });
    }
    return days;
  }, [currentMonth]);

  const handleShiftSelection = (dateStr: string, mode: ShiftType, setForce: boolean | null = null) => {
    if (!dateStr || MOCK_OCCUPIED_DATES.includes(dateStr)) return;
    const dateObj = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) return;

    setSelections(prev => {
      const current = prev[dateStr] || { morning: false, evening: false, special: false };
      if (mode === '早更' && current.special) return prev;
      if (mode === '晚更' && current.special) return prev;
      if (mode === '特更' && (current.morning || current.evening)) return prev;

      const next = { ...current };
      const toggle = (val: boolean) => (setForce !== null ? setForce : !val);

      if (mode === '早更') next.morning = toggle(next.morning);
      else if (mode === '晚更') next.evening = toggle(next.evening);
      else if (mode === '特更') next.special = toggle(next.special);

      const newMap = { ...prev };
      if (!next.morning && !next.evening && !next.special) delete newMap[dateStr];
      else newMap[dateStr] = next;
      return newMap;
    });
  };

  const applyRangeAction = (startStr: string, endStr: string) => {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const isCancel = endDate < startDate;
    const actualStart = startDate < endDate ? startDate : endDate;
    const actualEnd = startDate < endDate ? endDate : startDate;

    const curr = new Date(actualStart);
    while (curr <= actualEnd) {
      const dateStr = curr.toISOString().split('T')[0];
      handleShiftSelection(dateStr, activeShiftMode, !isCancel);
      curr.setDate(curr.getDate() + 1);
    }
  };

  const onMouseDown = (dateStr: string) => {
    if (!dateStr || MOCK_OCCUPIED_DATES.includes(dateStr)) return;
    const dObj = new Date(dateStr);
    const today = new Date(); today.setHours(0,0,0,0);
    if (dObj < today) return;
    setIsDragging(true);
    setDragStart(dateStr);
    setDragEnd(dateStr);
  };

  const onMouseEnter = (dateStr: string) => {
    if (isDragging) setDragEnd(dateStr);
  };

  const onMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      if (dragStart === dragEnd) handleShiftSelection(dragStart, activeShiftMode);
      else applyRangeAction(dragStart, dragEnd);
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // Helper component for Flexible Rent Policy
  const FlexibleRentPolicy = ({ blurred }: { blurred: boolean }) => (
    <div className="space-y-8 mt-8" ref={flexiblePolicyRef}>
      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
        <h3 className="text-xl font-black text-[#1A365D] uppercase tracking-tight flex items-center gap-2 mb-8">
          <Banknote className="w-5 h-5" />
          車行彈性租金細則
        </h3>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${blurred ? 'blur-md select-none pointer-events-none opacity-40' : 'blur-0 opacity-100'}`}>
          <div className="p-6 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">當日取消政策</p>
            <p className="text-sm font-bold text-slate-600">凡於取車前 2 小時取消預約，需支付 20% 租金作為行政費用。</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">延遲還車寬限</p>
            <p className="text-sm font-bold text-slate-600">提供 30 分鐘免費寬限期，其後每小時按 $50 加收費用。</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">燃油補給協議</p>
            <p className="text-sm font-bold text-slate-600">還車時氣量需與取車時一致，否則將按市價加收 10% 服務費。</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">按金退還時效</p>
            <p className="text-sm font-bold text-slate-600">如無交通意外或罰單紀錄，按金將於還車後 3 個工作天內退還。</p>
          </div>
        </div>

        {blurred && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-slate-800 bg-white/5 backdrop-blur-[2px] mt-16">
            <div className="bg-white/90 p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center animate-bounce">
              <Lock className="w-8 h-8 mb-3 text-sky-500" />
              <p className="text-xs font-black uppercase tracking-widest">登入後即可查看細則</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 rounded-[40px] border-2 border-amber-200 p-12 space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Info className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-900 m-0 uppercase tracking-tight">什麼是彈性租金？</h3>
            <p className="text-xs font-black text-amber-600 uppercase tracking-widest mt-1">Flexible Renting Guide</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-amber-600 border border-amber-100 shadow-sm">1</div>
            <h4 className="font-black text-amber-900 text-lg">隨心預約，按日結算</h4>
            <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
              打破傳統「長租死約」限制。司機可根據當日工作排程，靈活選擇早/晚更。
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-amber-600 border border-amber-100 shadow-sm">2</div>
            <h4 className="font-black text-amber-900 text-lg">免長期綑綁</h4>
            <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
              租金按單次預約天數計算，無須簽署繁複的長期租賃合約，給予司機最大的營運自由。
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-amber-600 border border-amber-100 shadow-sm">3</div>
            <h4 className="font-black text-amber-900 text-lg">信用支付保障</h4>
            <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
              透過 租的e 平台預約，所有彈性租金訂單均受平台信用體系保障，確保交易公平透明。
            </p>
          </div>
        </div>

        <div className="bg-white/50 p-6 rounded-3xl border border-amber-200/50 flex items-start gap-4">
          <div className="shrink-0 bg-amber-200 rounded-lg p-2">
            <ArrowDownCircle className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-xs text-amber-900/60 font-bold leading-relaxed italic">
            * 彈性租金僅適用於標示有「彈性租金」徽章之車輛。具體租金金額及細則由各合作車行自行訂定並受 租的e 平台監管。
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32" onMouseUp={onMouseUp}>
      <Helmet>
        <title>預約 {car.model} | 租的e</title>
      </Helmet>

      {/* Header Context */}
      <div className="bg-white border-b border-slate-100 py-4 shadow-sm sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-sky-500">首頁</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">車輛詳情與預定</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-600">
              <Zap className="w-4 h-4 fill-emerald-600" />
              <span>本月熱租中</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          
          {/* Vehicle Info Card */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col md:flex-row">
            <div className="md:w-5/12 p-8 flex items-center justify-center bg-slate-50/50 relative overflow-hidden">
               <div className="absolute inset-0 bg-sky-400/5 blur-3xl rounded-full scale-150"></div>
               <img src={car.image} alt={car.model} className="w-full h-auto drop-shadow-2xl relative z-10" />
            </div>
            <div className="md:w-7/12 p-10 space-y-6 self-center">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{licensePlate}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 uppercase flex items-center gap-1"><Users className="w-3 h-3"/> {car.seats}座</span>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase shadow-md flex items-center justify-center min-w-[60px] ${taxiTypeColors[car.taxiType] || 'bg-slate-500'}`}>{car.taxiType}</span>
                  {isFlexibleCar && (
                    <button 
                      onClick={scrollToPolicy}
                      className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 hover:bg-amber-200 transition-all border-2 border-amber-200 shadow-sm active:scale-95 group"
                    >
                      <CircleDollarSign className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      彈性租金 (查看詳情)
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { icon: CreditCard, label: '電子支付', active: true },
                  { icon: Camera, label: '車CAM', active: true },
                  { icon: MapPin, label: 'GPS', active: true },
                  { icon: Usb, label: 'USB', active: true },
                  { icon: Wifi, label: 'Wi-Fi', active: true },
                  { icon: ArrowUpToLine, label: '斜台', active: false },
                ].map((f, i) => (
                  <div key={i} className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all ${f.active ? 'bg-sky-50/50 border-sky-100 text-sky-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                    <f.icon className="w-4 h-4 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-tighter text-center">{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">早更租金</p>
                  <p className="text-xl font-black text-slate-900">HK$ {car.morningPrice}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">晚更租金</p>
                  <p className="text-xl font-black text-slate-900">HK$ {car.eveningPrice}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-[300px] font-black leading-none select-none">
              {currentMonth.getMonth() + 1}
            </div>

            {/* Shift selection header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <h3 className="text-2xl font-black text-slate-900 border-l-8 border-sky-500 pl-6 tracking-tight">預定排期表</h3>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
                {[
                  { id: '早更', icon: Sun, color: 'text-amber-500' },
                  { id: '晚更', icon: Moon, color: 'text-indigo-500' },
                  { id: '特更', icon: Clock, color: 'text-rose-500' }
                ].map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setActiveShiftMode(s.id as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
                      activeShiftMode === s.id ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
                    }`}
                  >
                    <s.icon className={`w-4 h-4 ${activeShiftMode === s.id ? s.color : 'text-slate-300'}`} />
                    <span className="text-xs uppercase tracking-widest">{s.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start relative z-10">
              <div className="xl:col-span-8 p-6 bg-slate-50/20 rounded-[40px] border border-slate-100 select-none">
                <div className="flex justify-between items-center mb-8 px-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100"><ChevronLeft className="w-5 h-5"/></button>
                    <h4 className="text-lg font-black text-slate-900 min-w-[120px] text-center">
                      {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                    </h4>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100"><ChevronRight className="w-5 h-5"/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center">
                  {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <span key={d} className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-300">{d}</span>
                  ))}
                  {calendarDays.map((item, idx) => {
                    const status = selections[item.dateStr] || { morning: false, evening: false, special: false };
                    const isHolidayOrSunday = item.isSunday || item.isHoliday;
                    const isPastOrOccupied = item.isPast || item.isOccupied;
                    const isExcluded = (activeShiftMode === '特更' && (status.morning || status.evening)) ||
                                       (activeShiftMode === '早更' && status.special) ||
                                       (activeShiftMode === '晚更' && status.special);
                    const isDisabled = isPastOrOccupied || isExcluded;
                    let bgColor = 'hover:bg-white';
                    if (activeShiftMode === '早更' && status.morning) bgColor = 'bg-amber-400 text-white shadow-md';
                    else if (activeShiftMode === '晚更' && status.evening) bgColor = 'bg-indigo-600 text-white shadow-md';
                    else if (activeShiftMode === '特更' && status.special) bgColor = 'bg-emerald-500 text-white shadow-md';
                    if (!item.day) return <div key={`empty-${idx}`} className="py-2" />;
                    return (
                      <div 
                        key={item.dateStr}
                        onMouseDown={() => onMouseDown(item.dateStr)}
                        onMouseEnter={() => onMouseEnter(item.dateStr)}
                        className={`group relative py-6 flex flex-col items-center justify-center transition-all rounded-2xl overflow-hidden ${
                          isPastOrOccupied ? 'opacity-20 grayscale cursor-not-allowed bg-slate-100' : 
                          isExcluded ? 'bg-slate-300 opacity-60 grayscale cursor-not-allowed border border-slate-400/20' : 
                          bgColor
                        }`}
                        style={{ cursor: isDisabled ? 'not-allowed' : (isDragging ? 'e-resize' : 'pointer') }}
                      >
                        <span className={`text-sm font-black relative z-10 ${
                          (bgColor !== 'hover:bg-white' && !isDisabled) ? 'text-white' : (isHolidayOrSunday ? 'text-rose-600' : 'text-slate-800')
                        }`}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="xl:col-span-4 space-y-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">已選項目 ({calculateTotal.items.length})</p>
                 <div className="bg-slate-50 rounded-[32px] border border-slate-100 max-h-[440px] overflow-y-auto no-scrollbar p-4 space-y-2 shadow-inner">
                   {calculateTotal.items.map((it, i) => (
                     <div key={i} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-200/30">
                       <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-800">{it.date}</p>
                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                           it.label.includes('特更') ? 'bg-emerald-100 text-emerald-600' : it.label === '早更' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                         }`}>{it.label}</span>
                       </div>
                       <p className="text-xs font-black text-slate-900">${it.price}</p>
                     </div>
                   ))}
                   {calculateTotal.items.length === 0 && (
                     <div className="py-20 text-center opacity-30 flex flex-col items-center">
                        <CalendarIcon className="w-12 h-12 mb-2" />
                        <p className="text-xs font-bold leading-relaxed">
                          滑鼠左至右拖動選擇<br/>
                          右至左拖動取消<br/>
                          單擊可獨立選擇早/晚更
                        </p>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>

          {/* Login and Policy Section */}
          {!isLoggedIn ? (
            <div className="space-y-8">
              <div className="bg-[#1A365D] rounded-[40px] p-12 text-center space-y-6 shadow-2xl relative overflow-hidden group border-4 border-sky-400/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125"></div>
                <ShieldCheck className="w-16 h-16 text-sky-400 mx-auto relative z-10" />
                <h3 className="text-3xl font-black text-white relative z-10">登入以填寫租車人資料</h3>
                <p className="text-sky-200/60 font-medium max-w-sm mx-auto relative z-10">為了保障您的租賃權益，請先登入帳號以核對您的司機證及實名資料。</p>
                <button 
                  onClick={() => setIsAuthModalOpen(true)} 
                  className="relative z-10 bg-sky-500 hover:bg-sky-400 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 active:scale-95 transition-all"
                >
                  立即登入 / 註冊
                </button>
              </div>

              {isFlexibleCar && <FlexibleRentPolicy blurred={true} />}
            </div>
          ) : (
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
               <div className="bg-white rounded-[40px] border-2 border-emerald-100 p-10 shadow-lg space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                     <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900">已確認身分資訊</h3>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">姓名</p>
                      <p className="text-sm font-black text-slate-800">李大文 (WONG TAI MAN)</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">電話</p>
                      <p className="text-sm font-black text-slate-800">9876 5432</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">司機證編號</p>
                      <p className="text-sm font-black text-slate-800">TX-2025-XXXX</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">有效期至</p>
                      <p className="text-sm font-black text-emerald-600">2027-12-31</p>
                    </div>
                 </div>
               </div>

               {isFlexibleCar && <FlexibleRentPolicy blurred={false} />}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 space-y-4">
              <Link to={`/taxi/${car.id}`} className="flex items-center gap-3 hover:text-sky-600 transition-colors group">
                <CalendarIcon className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-black leading-tight">{car.companyName}</h4>
              </Link>
            </div>

            <div className="p-10 space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">訂單結算</h4>
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                  <span>租金小計</span>
                  <span className="text-slate-900 font-black">HK$ {calculateTotal.total.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                  <span>平台服務費 (1%)</span>
                  <span className="text-slate-900 font-black">HK$ {platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                  <span>車輛按金</span>
                  <span className="text-emerald-500 font-black flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> 取車支付</span>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">應付總額</p>
                  <p className="text-4xl font-black text-[#1A365D] tracking-tighter">HK$ {grandTotal.toLocaleString()}</p>
                </div>
              </div>

              <button 
                onClick={() => isLoggedIn ? alert('預定成功') : setIsAuthModalOpen(true)}
                disabled={calculateTotal.items.length === 0}
                className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-600/30 transition-all active:scale-95 group"
              >
                立即預定
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">租的e 認證彈性租金夥伴: {car.companyName}</p>
        </div>
      </footer>

      <AuthModals 
        isOpen={isAuthModalOpen} 
        type="login" 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default BookingPage;
