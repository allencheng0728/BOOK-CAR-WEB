
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const VanPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[70vh]">
      <Helmet>
        <title>物流貨車租賃 | 租的e</title>
      </Helmet>
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-white p-24 rounded-[50px] shadow-sm border border-slate-200">
            <div className="w-32 h-32 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-10">
              <Truck className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-black text-[#003366] mb-6 tracking-tight">貨車租賃服務即將上線</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto italic leading-relaxed font-medium">
              專業客貨車、5.5噸貨車及合約物流租賃解決方案，目前正在進行最後測試階段，敬請期待。
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              {/* 使用Lik */}
               <Link 
                  to="/" 
                  className="px-12 py-5 bg-[#003366] text-white font-black rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-95">
                  返回的士租賃
               </Link>
               <button className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all">
                  聯絡我們了解更多
               </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default VanPage;
