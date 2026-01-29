
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import VanPage from './pages/Van';
import NewsPage from './pages/News';
import BookingPage from './pages/BookingPage';
import RegisterPage from './pages/Register';
import StoreDetailView from './components/StoreDetailView';
import { FilterState } from './types';
import { MOCK_CARS } from './data';

/**
 * Wrapper for the Store Detail route to handle slug lookup and error states gracefully.
 */
const StoreDetailRouteWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const store = MOCK_CARS.find(c => c.id === slug);
  
  if (!store) {
    return (
      <div className="p-20 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">找不到車行資料</h2>
        <p className="text-slate-500 mb-8 font-bold">該車行可能已下架或網址不正確。</p>
        <Link to="/" className="bg-[#1A365D] text-white px-8 py-4 rounded-2xl font-black shadow-lg">
          返回首頁
        </Link>
      </div>
    );
  }

  return <StoreDetailView store={store} onBack={() => navigate(-1)} />;
};

const App: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [filters, setFilters] = useState<FilterState>({
    onlyTopRated: false,
    location: '',
    pickupDate: today,
    returnDate: nextWeek,
    shift: '早更',
    weeklyDays: [], // Initial state for recurring days
    brands: [],
    categories: [],
    features: [],
    specs: [],
    ageRanges: [],
    taxiTypes: [],
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <HelmetProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Header filters={filters} onFilterChange={handleFilterChange} />
          
          <main className="flex-grow">
            <ErrorBoundary>
              <Routes>
                {/* Standard Route Rendering */}
                <Route path="/" element={<Home filters={filters} onFilterChange={handleFilterChange} />} />
                <Route path="/van" element={<VanPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/taxi/:slug" element={<StoreDetailRouteWrapper />} />
                <Route path="/booking/:carId" element={<BookingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Information/Placeholder Pages */}
                <Route path="/ad-car" element={
                  <div className="p-40 text-center bg-white border-y border-slate-100">
                    <h2 className="text-4xl font-black text-[#1A365D] mb-4">廣告車租賃</h2>
                    <p className="text-slate-500 font-bold italic">服務即將上線，敬請期待。</p>
                  </div>
                } />
                <Route path="/erp" element={
                  <div className="p-40 text-center bg-white border-y border-slate-100">
                    <h2 className="text-4xl font-black text-[#1A365D] mb-4">車隊 ERP 管理系統</h2>
                    <p className="text-slate-500 font-bold italic">專業車行管理解決方案，即將開放預約演示。</p>
                  </div>
                } />
                <Route path="/contact" element={
                  <div className="p-40 text-center bg-white border-y border-slate-100">
                    <h2 className="text-4xl font-black text-[#1A365D] mb-4">聯絡我們</h2>
                    <p className="text-slate-500 font-bold">熱線: +852 2345 6789 <br/> 電郵: support@taxie.hk</p>
                  </div>
                } />
                
                {/* Fallback Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>

          {/* Fixed: Completed truncated footer and added default export */}
          <footer className="bg-white border-t border-slate-200 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="md:col-span-2 space-y-6">
                    <Link to="/" className="flex items-baseline group">
                      <span className="text-3xl font-black text-[#00AEEF] italic tracking-tighter select-none">租的</span>
                      <span className="text-4xl font-black text-[#00AEEF] lowercase leading-none select-none -ml-1">e</span>
                    </Link>
                    <p className="text-slate-400 font-bold text-xs mt-4">
                      香港領先的專業的士租賃平台，提供最透明、最高效率的媒合服務。
                    </p>
                  </div>
               </div>
               <div className="pt-8 border-t border-slate-100 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                   © 2025 租的e - Professional Taxi Rental Platform
                 </p>
               </div>
            </div>
          </footer>
        </div>
      </HashRouter>
    </HelmetProvider>
  );
};

export default App;
