
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, ShieldCheck, MapPin, Phone, 
  CheckCircle2, Info, Users, Calendar, Fuel, 
  ChevronRight, MessageSquare, Quote, Camera,
  Clock, CreditCard, ExternalLink
} from 'lucide-react';
import { CarRental } from '../types';

interface StoreDetailViewProps {
  store: CarRental;
  onBack: () => void;
}

const StoreDetailView: React.FC<StoreDetailViewProps> = ({ store, onBack }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'fleet' | 'policy'>('reviews');

  const themeColors = {
    green: { primary: '#059669', glow: 'rgba(5, 150, 105, 0.5)' },
    red: { primary: '#DC2626', glow: 'rgba(220, 38, 38, 0.5)' },
    blue: { primary: '#2563EB', glow: 'rgba(37, 99, 235, 0.5)' },
  };

  const theme = themeColors[store.companyColor];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-[fadeIn_0.5s_ease-out]">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .aggressive-glow-btn {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .aggressive-glow-btn:hover {
          box-shadow: 0 0 25px 5px ${theme.glow};
          transform: scale(1.04) translateY(-2px);
          filter: brightness(1.1);
        }

        .booking-card:hover {
          border-color: ${theme.primary};
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-[480px] bg-[#1A365D] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1600" 
          alt={`${store.companyName} 外部景觀 - ${store.district}`} 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A365D] via-[#1A365D]/20 to-transparent"></div>
        
        {/* Navigation Bar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-white/20 transition-all border border-white/10 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            返回列表
          </button>
        </div>

        <div className="absolute bottom-16 left-0 right-0 max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-sky-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-sky-500/30">
                  租的e 優質夥伴
                </span>
                {store.isVerifiedStore && (
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    平台實名認證
                  </div>
                )}
              </div>
              {/* Changed to h1 for SEO on detail page */}
              <h1 className="m-0 text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-xl">
                {store.companyName}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-200">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                  <MapPin className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-sm tracking-wide">{store.district}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-amber-400 text-[#1A365D] px-3 py-1 rounded-lg font-black text-lg">
                    <Star className="w-5 h-5 fill-[#1A365D] mr-1.5" />
                    {store.rating}
                  </div>
                  <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">
                    {store.reviewCount.toLocaleString()} 則真實評論
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('fleet')}
              className="aggressive-glow-btn bg-sky-500 text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-sky-500/40 flex items-center gap-3"
            >
              立即預約
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Tabs & Main Content */}
      <main className="max-w-7xl mx-auto w-full px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Detail Sections */}
        <div className="flex-grow space-y-10">
          
          {/* Section Selector */}
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl w-fit border border-slate-200 shadow-sm">
            {[
              { id: 'reviews', label: '評論牆', icon: MessageSquare },
              { id: 'fleet', label: '可用車隊', icon: Users },
              { id: 'policy', label: '安全守則', icon: ShieldCheck },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[#1A365D] text-white shadow-xl shadow-[#1A365D]/20' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content: Review Wall */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Rating Card */}
                <div className="md:col-span-4 bg-white p-10 rounded-[40px] border border-slate-200 text-center shadow-sm">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">車行評分</p>
                  <p className="text-7xl font-black text-[#1A365D] mb-4">{store.rating}</p>
                  <div className="flex justify-center gap-1.5 mb-6">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    由 <span className="text-[#1A365D] font-black">{store.reviewCount.toLocaleString()}</span> 名司機認證
                  </p>
                </div>
                {/* Distribution Card */}
                <div className="md:col-span-8 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-center space-y-4">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-6">
                      <span className="text-[11px] font-black text-slate-400 w-6">{star}★</span>
                      <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${star === 5 ? 88 : star === 4 ? 9 : 3}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-black text-slate-800 w-10">
                        {star === 5 ? '88%' : star === 4 ? '9%' : '3%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-8">
                {[
                  {
                    id: 1,
                    user: '阿輝 (專業司機)',
                    rating: 5,
                    comment: '車行啲車真係無得頂，次次攞車都好似新車一樣。交收流程好快，唔使浪費時間。',
                    date: '2026-03-15',
                    images: [store.image],
                    reply: '多謝輝哥支持！我地好重視每架車嘅清潔，祝你客似雲來！'
                  },
                  {
                    id: 2,
                    user: 'Sarah Wong',
                    rating: 4,
                    comment: '元朗店位置好方便，老闆好傾。車箱無煙味，呢點好重要。',
                    date: '2026-02-28',
                    reply: '多謝Sarah！我地全線車隊都係禁煙車，確保大家坐得舒服。'
                  }
                ].map(review => (
                  <div key={review.id} className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <Quote className="absolute -top-6 -right-6 w-32 h-32 text-slate-50 transition-colors group-hover:text-sky-50" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl border-2 border-slate-50">
                            {review.user[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="m-0 text-xl font-black text-[#1A365D]">{review.user}</h4>
                              <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase border border-emerald-100">
                                實名司機
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-2" />
                          <span className="text-lg font-black text-amber-700">{review.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-slate-700 text-xl font-medium leading-relaxed mb-8 italic">
                        "{review.comment}"
                      </p>

                      {review.images && (
                        <div className="flex flex-wrap gap-4 mb-8">
                          {review.images.map((img, i) => (
                            <div key={i} className="group/img relative w-48 h-32 rounded-3xl overflow-hidden border-2 border-slate-100">
                              <img 
                                src={img} 
                                alt={`${store.companyName} 的士車況照片`} 
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" 
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                <Camera className="text-white w-6 h-6" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {review.reply && (
                        <div className="bg-slate-50/70 rounded-3xl p-8 border-l-4 border-sky-500 ml-6 relative">
                           <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                               <span className="text-white font-black text-[10px]">租的e</span>
                             </div>
                             <span className="text-[11px] font-black text-sky-600 uppercase tracking-[0.2em]">車行官方回覆</span>
                           </div>
                           <p className="text-slate-600 font-bold leading-relaxed">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <h2 className="m-0 text-2xl font-black text-[#1A365D] mb-8 uppercase tracking-wider">車隊詳情</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'f1', name: store.model, type: store.taxiType, price: store.morningPrice, seats: store.seats, fuel: store.category, year: store.year, image: store.image },
                ].map(item => (
                  <div key={item.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-sky-200 transition-all flex flex-col items-center text-center">
                    <img src={item.image} alt={`${item.name} 租賃`} className="h-32 object-contain mb-6 drop-shadow-lg" />
                    <h3 className="m-0 text-xl font-black text-[#1A365D] mb-2">{item.name}</h3>
                    <div className="flex gap-2 mb-6">
                      <span className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                      <span className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.seats} Seats</span>
                    </div>
                    <p className="text-3xl font-black text-sky-600 tracking-tighter mb-1">HK$ {item.price}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Daily Morning Shift</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="bg-white rounded-[40px] border border-slate-200 p-12 space-y-16 shadow-sm animate-[fadeIn_0.4s_ease-out]">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h2 className="m-0 text-2xl font-black text-[#1A365D]">保險與保障</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                    <p className="font-black text-[#1A365D] text-lg mb-2">商業第三者責任險</p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      全線車輛均受租的e認可之商業保險保障，最高賠償額達 HK$1,000,000。
                    </p>
                  </div>
                  <div className="p-8 bg-sky-50/50 rounded-3xl border border-sky-100/50">
                    <p className="font-black text-[#1A365D] text-lg mb-2">事故墊底費上限</p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      租的e 實名認證司機於非重大事故中之賠償責任上限為 HK$15,000。
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="w-full lg:w-[400px] flex-shrink-0 space-y-8">
          <div className="bg-[#1A365D] text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-125"></div>
            <div className="relative z-10">
              <h3 className="m-0 text-2xl font-black mb-8">直接聯絡車行</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                    <Phone className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">24小時調度熱線</p>
                    <p className="text-xl font-black tracking-tight">+852 2988 3442</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-12 py-5 bg-white text-[#1A365D] font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-sky-50 transition-all shadow-xl active:scale-95">
                開始與店主對話
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Bottom CTA */}
      <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 py-6 px-8 z-[100] animate-[fadeIn_0.6s_ease-out]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden hidden sm:block">
                 <img 
                    src={store.image} 
                    alt={`${store.companyName} 代表車輛`} 
                    className="w-full h-full object-contain p-2" 
                  />
               </div>
               <div>
                 <p className="m-0 text-2xl font-black text-[#1A365D]">{store.companyName}</p>
                 <p className="text-xs font-bold text-slate-400">租的e 認證優質車行</p>
               </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <button 
                  onClick={() => setActiveTab('fleet')}
                  className="flex-grow md:flex-none px-12 py-5 bg-sky-500 text-white font-black rounded-3xl aggressive-glow-btn shadow-2xl shadow-sky-500/30"
               >
                 立即預約
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StoreDetailView;
