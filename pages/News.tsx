
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Newspaper, 
  Calendar, 
  ChevronRight, 
  Zap, 
  Bell, 
  ArrowRight, 
  Store, 
  Info, 
  Download,
  Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 3;

// Synchronized with index.html AD_SLOTS
const DEALERSHIP_PROMOTIONS = (window as any).AD_SLOTS || [
  {
    id: 1,
    dealershipId: 'store-1',
    dealershipName: '誠信車行 (元朗店)',
    title: '春季租車大優惠：豐田混能 85 折',
    summary: '誠信車行元朗旗艦店慶祝春季來臨，全線豐田 Comfort Hybrid 連租 3 天或以上即享租金 85 折優惠！',
    date: '今日'
  },
  {
    id: 2,
    dealershipId: 'store-5',
    dealershipName: '新界動力 (大埔區)',
    title: '新店開張：大埔區取車點首月按金減半',
    summary: '新界動力大埔取車點正式啟用！為回饋司機支持，首月新預約客戶按金即享 50% 減免。',
    date: '1天前'
  },
  {
    id: 3,
    dealershipId: 'store-3',
    dealershipName: '桑富貿易 (荃灣)',
    title: '最新 2024 款電動的士 LTO 全面到貨',
    summary: '最新款 2024 年份電動的士現已抵達荃灣總店。極速充電、超長續航。',
    date: '2天前'
  },
  {
    id: 4,
    dealershipId: 'store-12',
    dealershipName: '港島電力的',
    title: '港島區 Tesla 的士租賃推廣計劃',
    summary: '港島電力的推出高端 Tesla Model 3 租賃方案，專業調度系統助您鎖定優質訂單。',
    date: '3天前'
  },
  {
    id: 5,
    dealershipId: 'store-2',
    dealershipName: '聯樂的士管理 (黃大仙)',
    title: '優質司機免按金計劃：立即加入',
    summary: '聯樂推出業界首創「信用租車」計劃，具備良好紀錄之司機可申請免按金租賃。',
    date: '4天前'
  }
];

const GENERAL_NEWS = [
  {
    id: 1,
    title: '全港專用加氣站九月上限價格公布',
    summary: '機電工程署公布最新氣價調幅，九月氣價維持平穩，部分站點輕微下調 $0.02。',
    date: '2025-08-30'
  },
  {
    id: 2,
    title: '運輸署：的士業界優質服務計劃獎項揭曉',
    summary: '本年度優質的士司機及車行名單已公布，租的e 多間合作夥伴榜上有名。',
    date: '2025-08-28'
  },
  {
    id: 3,
    title: '深水埗臨時交通改道：桂林街封閉施工',
    summary: '因應渠務工程，桂林街部分路段將實施臨時封閉，請在該區交收車輛的司機留意。',
    date: '2025-08-26'
  },
  {
    id: 4,
    title: '政府公布新款輪椅的士資助擴展計劃',
    summary: '環境及生態局宣布將增加斜台的士購車資助，預計明年度將有更多無障礙車型投入市場。',
    date: '2025-08-24'
  },
  {
    id: 5,
    title: '東涌一帶突發路面緊急維修工程',
    summary: '往機場方向主要幹道出現緊急路陷維修，預計交通顯著擠塞，建議司機選用替代路線。',
    date: '2025-08-22'
  },
  {
    id: 6,
    title: '電子支付手續費補貼計劃申請最後召集',
    summary: '的士業界電子支付普及化資助將於本月底截止，尚未安裝讀卡器之司機請儘快提交申請。',
    date: '2025-08-20'
  }
];

const PLATFORM_UPDATES = [
  {
    id: 1,
    type: 'ERP',
    title: '車隊 ERP 管理系統 v2.4 發佈',
    summary: '新增自動化結算報表與司機信用評分系統，助車行主更精準管理財務。',
    date: '2025-09-01'
  },
  {
    id: 2,
    type: 'APP',
    title: '租的e App 3.0 正式進入公測階段',
    summary: '全新 UI 設計與秒速預約引擎，現誠邀 100 名活躍司機參與首輪測試。',
    date: '2025-08-22'
  },
  {
    id: 3,
    type: 'PRODUCT',
    title: '「租的e 認證」二手車交易平台即將啟動',
    summary: '為車行提供更便捷的車隊汰換渠道，專業驗證，買賣無憂。',
    date: '2025-08-15'
  }
];

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [generalPage, setGeneralPage] = useState(1);
  const [promoPage, setPromoPage] = useState(1);

  const paginatedGeneral = useMemo(() => {
    const start = (generalPage - 1) * ITEMS_PER_PAGE;
    return GENERAL_NEWS.slice(start, start + ITEMS_PER_PAGE);
  }, [generalPage]);

  const paginatedPromo = useMemo(() => {
    const start = (promoPage - 1) * ITEMS_PER_PAGE;
    return DEALERSHIP_PROMOTIONS.slice(start, start + ITEMS_PER_PAGE);
  }, [promoPage]);

  const totalGeneralPages = Math.ceil(GENERAL_NEWS.length / ITEMS_PER_PAGE);
  const totalPromoPages = Math.ceil(DEALERSHIP_PROMOTIONS.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Helmet>
        <title>最新消息 | 租的e - 專業的士租賃平台</title>
      </Helmet>

      {/* Hero Banner */}
      <section className="bg-[#1A365D] py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-400 font-black text-xs uppercase tracking-[0.3em]">
              <Bell className="w-4 h-4" />
              <span>News & Announcements</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white m-0 tracking-tighter leading-tight">
              資訊與更新中心
            </h1>
            <p className="text-slate-300 font-medium text-lg max-w-xl">
              獲取最新的行業快報、車行優惠及 租的e 平台最新技術進展。
            </p>
          </div>
          <div className="hidden md:block">
            <Newspaper className="w-48 h-48 text-white/5" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Zone 1: News Information Zone (行業資訊快報) */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-sky-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">行業資訊快報</h2>
              </div>
              
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {paginatedGeneral.map(news => (
                  <div key={news.id} className="p-8 hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Industry Brief</span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black">{news.date}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-sky-500 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-sm italic">
                      {news.summary}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Pagination 
                  currentPage={generalPage} 
                  totalPages={totalGeneralPages} 
                  onPageChange={setGeneralPage} 
                />
              </div>
            </section>

            {/* Zone 2: Car Dealership News (車行動態) - Promotions only */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 m-0 uppercase tracking-tight">車行動態</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {paginatedPromo.map(news => (
                  <div 
                    key={news.id} 
                    onClick={() => navigate(`/taxi/${news.dealershipId}`)}
                    className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200">
                          {news.dealershipName}
                        </span>
                        <span className="text-slate-300 font-black text-[10px]">{news.date}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 m-0 group-hover:text-emerald-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-slate-500 font-medium leading-relaxed italic text-sm">
                        {news.summary}
                      </p>
                    </div>
                    <div className="shrink-0 bg-slate-50 p-4 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Pagination 
                  currentPage={promoPage} 
                  totalPages={totalPromoPages} 
                  onPageChange={setPromoPage} 
                />
              </div>
            </section>
          </div>

          {/* Right Column: Platform Updates Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1A365D] rounded-xl flex items-center justify-center shadow-lg shadow-[#1A365D]/20">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 m-0 uppercase tracking-tight">租的e 平台公告</h3>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Official Updates</p>
                </div>
              </div>

              <div className="space-y-6">
                {PLATFORM_UPDATES.map(update => (
                  <div key={update.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-sky-200 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                        update.type === 'ERP' ? 'bg-indigo-100 text-indigo-600' : 
                        update.type === 'APP' ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {update.type}
                      </span>
                      <span className="text-[8px] font-black text-slate-300">{update.date}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mb-2 group-hover:text-sky-500 transition-colors">
                      {update.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed line-clamp-3">
                      {update.summary}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A365D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-900 transition-all shadow-xl shadow-[#1A365D]/20">
                  <Download className="w-3.5 h-3.5" />
                  下載司機端 App
                </button>
              </div>
            </div>

            <div className="bg-sky-500 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <h3 className="text-xl font-black mb-4 relative z-10">即時推播</h3>
              <p className="text-sky-50 text-sm font-medium mb-6 relative z-10">
                獲取氣價變動及車隊最新 LTO 上線通知。
              </p>
              <div className="flex flex-col gap-3 relative z-10">
                <input 
                  type="email" 
                  placeholder="您的電郵地址" 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm text-white placeholder:text-sky-200 outline-none focus:bg-white/20 transition-all"
                />
                <button className="w-full bg-white text-sky-600 hover:bg-sky-50 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-sky-600/20">
                  立即訂閱
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsPage;
