
import React from 'react';
import { Users, Calendar, Star, ShieldCheck, Fuel, Wallet, MessageSquare, MapPin, ExternalLink } from 'lucide-react';
import { CarRental } from '../types';

interface CarCardProps {
  car: CarRental;
  onSelect?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onSelect }) => {
  const colorMap = {
    green: { primary: '#059669', border: 'border-emerald-600', softBg: 'bg-emerald-50/50', priceText: 'text-emerald-600' },
    red: { primary: '#DC2626', border: 'border-red-600', softBg: 'bg-red-50/50', priceText: 'text-red-600' },
    blue: { primary: '#2563EB', border: 'border-blue-600', softBg: 'bg-blue-50/50', priceText: 'text-blue-600' }
  };

  const theme = colorMap[car.companyColor];

  // Map fuel type from category for display
  const fuelType = car.category === 'HYBRID' ? '混能' : car.category === 'ELECTRIC' ? '新能源' : '石油氣';

  // Schema Markup for SEO
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${car.brand} ${car.model} (${car.taxiType})`,
    "description": `${car.companyName} 提供之 ${car.district} 的士租賃服務。${car.tagline}`,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": car.rating,
      "reviewCount": car.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div 
      className={`group relative flex flex-col bg-white rounded-[40px] transition-all duration-500 border-2 ${theme.border} overflow-hidden hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] shadow-sm cursor-pointer`}
      onClick={onSelect}
      style={{ '--theme-color': theme.primary } as React.CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <style>{`
        @keyframes badge-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

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
        {car.isVerifiedStore && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 relative z-10">
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
            <span className="text-[8px] font-black text-white tracking-widest uppercase">租的e 認證</span>
          </div>
        )}
      </div>

      <div className="flex-grow p-6 pb-2 flex flex-col items-center">
        {/* Car Image Area - Reduced height */}
        <div className="h-24 w-full flex items-center justify-center mb-3 relative">
          <div className={`absolute inset-0 opacity-15 blur-3xl rounded-full ${theme.softBg} group-hover:scale-125 transition-transform duration-700`}></div>
          <img 
            src={car.image} 
            alt={`${car.brand} ${car.model} 的士租賃 - ${car.companyName}`}
            loading="lazy"
            className="max-h-full max-w-[80%] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out relative z-10"
          />
        </div>
        
        <div className="text-center mb-3">
          {/* Changed to h2 for SEO with margin-0 */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_6px_rgba(255,215,0,0.4)]"></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">早更</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">HK$</span>
              <span className={`text-xl font-black tracking-tighter ${theme.priceText}`}>{car.morningPrice}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#003366] shadow-[0_0_6px_rgba(0,51,102,0.3)]"></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">晚更</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">HK$</span>
              <span className={`text-xl font-black tracking-tighter ${theme.priceText}`}>{car.eveningPrice}</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-200/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wallet className="w-3 h-3 text-slate-400 group-hover:text-[var(--theme-color)] transition-colors" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">租車按金</span>
            </div>
            <span className="text-xs font-black text-slate-700">
              {car.deposit > 0 ? `HK$ ${car.deposit.toLocaleString()}` : '免按金'}
            </span>
          </div>
        </div>

        <button className="w-full py-3 bg-[#003366] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-[#002244] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#003366]/20 active:scale-[0.98] mb-2 shrink-0">
          <MessageSquare className="w-3.5 h-3.5" /> 
          立即預約
        </button>
      </div>

      {/* Colored Footer Bar */}
      <div 
        className="w-full py-2.5 px-6 flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 shrink-0"
        style={{ backgroundColor: theme.primary }}
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
