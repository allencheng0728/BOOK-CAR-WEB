
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PROMOS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200",
    title: "春季租車大優惠",
    subtitle: "全線豐田車型連租3天或以上即享 85 折優惠！",
    badge: "限時優惠"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    title: "新店開張：大埔區",
    subtitle: "大埔區新取車點正式啟用，首週按金減半！",
    badge: "新消息"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1542362567-b05503f3af15?auto=format&fit=crop&q=80&w=1200",
    title: "電動車 LTO 全面到貨",
    subtitle: "最新 2024 款電動的士現已接受預約，體驗綠色出行。",
    badge: "最新車型"
  }
];

const PromoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % PROMOS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);

  return (
    <div className="w-full h-[280px] md:h-[360px] relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">
      {PROMOS.map((promo, idx) => (
        <div
          key={promo.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">
            <span className="bg-sky-500 text-white text-xs font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full w-fit mb-4">
              {promo.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg leading-tight max-w-lg">
              {promo.title}
            </h2>
            <p className="text-slate-200 text-sm md:text-lg max-w-md mb-8 drop-shadow-md">
              {promo.subtitle}
            </p>
            <button className="bg-white text-[#1A365D] hover:bg-sky-500 hover:text-white px-8 py-3.5 rounded-xl font-black transition-all active:scale-95 shadow-xl w-fit">
              立即了解
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prev} className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-full text-white transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={next} className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-full text-white transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {PROMOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-sky-500' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;
