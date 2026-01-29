import React, { useMemo } from 'react';
import { Users, Calendar, ShieldCheck, Fuel, MessageSquare, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CarRental } from '../types';

interface CarCardProps {
  car: CarRental;
  onSelect?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onSelect }) => {
  const navigate = useNavigate();
  const colorMap = {
    green: { primary: '#059669', border: 'border-emerald-600', softBg: 'bg-emerald-50/50', priceText: 'text-emerald-600' },
    red: { primary: '#DC2626', border: 'border-red-600', softBg: 'bg-red-50/50', priceText: 'text-red-600' },
    blue: { primary: '#2563EB', border: 'border-blue-600', softBg: 'bg-blue-50/50', priceText: 'text-blue-600' }
  };

  const theme = colorMap[car.companyColor];

  // Deterministic license plate to decide "彈性租金" status in the box
  const licensePlate = useMemo(() => {
    const seeds: Record<string, string> = {
      'store-1': 'YL 8888',
      'store-2': 'ZE 1271',
      'store-3': 'TX 4492',
      'store-4': 'SS 1024',
      'store-5': 'TP 5531',
      'store-12': 'EV 2024'
    };
    return seeds[car.id] || `TX ${car.id?.split('-')[1]?.padStart(4, '0') || '0000'}`;
  }, [car.id]);

  const isFlexibleCar = useMemo(() => {
    return licensePlate.startsWith('ZE') || licensePlate.startsWith('TX') || licensePlate.startsWith('EV');
  }, [licensePlate]);

  // Map fuel type from category for display
  const fuelType = car.category === 'HYBRID' ? '混能' : car.category === 'ELECTRIC' ? '新能源' : '石油氣';

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/booking/${car.id}`);
  };

  const handleStoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/taxi/${car.id}`);
  };

  return (
    <div 
      className={`group relative flex flex-col bg-white rounded-[40px] transition-all duration-500 border-2 ${theme.border} overflow-hidden hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] shadow-sm cursor-pointer`}
      onClick={onSelect}
      style={{ '--theme-color': theme.primary } as React.CSSProperties}
    >
      {/* District Header */}
      <div 
        className="w-full py-2 px-6 flex justify-between items-center relative overflow-hidden shrink-0"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[badge-shimmer_3s_infinite]"></div>
        <div className="flex items-center gap-2 relative z-10">
          <MapPin className="w-3 h-3 text-white/90" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">{car.district}</span>
        </div>
        {isFlexibleCar && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 relative z-10">
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
            <span className="text-[8px] font-black text-white tracking-widest uppercase">
              彈性租金
            </span>
          </div>
        )}
      </div>

      <div className="flex-grow p-6 pb-2 flex flex-col items-center">
        {/* Car Image Area */}
        <div className="h-24 w-full flex items-center justify-center mb-3 relative">
          <div className={`absolute inset-0 opacity-15 blur-3xl rounded-full ${theme.softBg} group-hover:scale-125 transition-transform duration-700`}></div>
          <img 
            src={car.image} 
            alt={`${car.brand} ${car.model} 的士租賃`}
            className="max-h-full max-w-[80%] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out relative z-10"
          />
        </div>
        
        <div className="text-center mb-3">
          <h2 className="m-0 text-xl font-black text-slate-900 leading-tight mb-0.5 group-hover:text-[var(--theme-color)] transition-colors">
            {car.model}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              {car.brand}
            </p>
            <span className="text-[9px] font-black text-slate-300">|</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{car.distanceKm}km</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 w-full gap-1.5 mb-3">
          <div className="flex flex-col items-center gap-0.5 p-2 bg-[#F8FAFC] rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
            <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--theme-color)] transition-colors" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider group-hover:text-[var(--theme-color)] transition-colors">{car.seats} 座車</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 p-2 bg-[#F8FAFC] rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--theme-color)] transition-colors" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider group-hover:text-[var(--theme-color)] transition-colors">{car.ageRange}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 p-2 bg-[#F8FAFC] rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
            <Fuel className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--theme-color)] transition-colors" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider group-hover:text-[var(--theme-color)] transition-colors">{fuelType}</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="w-full space-y-1.5 mb-3 bg-[#F8FAFC] p-4 rounded-[20px] border border-slate-100 group-hover:bg-white transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">早更</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">HK$</span>
              <span className={`text-xl font-black tracking-tighter ${theme.priceText}`}>{car.morningPrice}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#003366]"></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">晚更</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">HK$</span>
              <span className={`text-xl font-black tracking-tighter ${theme.priceText}`}>{car.eveningPrice}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBooking}
          className="w-full py-3 bg-[#003366] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-[#002244] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#003366]/20 active:scale-[0.98] mb-2 shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" /> 
          立即預約
        </button>
      </div>

      {/* Colored Footer Bar - Clickable to Dealership Detail */}
      <div 
        className="w-full py-2.5 px-6 flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 shrink-0 cursor-pointer"
        style={{ backgroundColor: theme.primary }}
        onClick={handleStoreClick}
      >
        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] truncate max-w-[80%]">
          {car.companyName}
        </span>
        <ExternalLink className="w-3 h-3 text-white/70" />
      </div>
    </div>
  );
};

export default CarCard;