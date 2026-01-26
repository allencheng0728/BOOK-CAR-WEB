
import React, { useState } from 'react';
import { X, Phone, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthModalsProps {
  isOpen: boolean;
  type: 'login' | 'register';
  onClose: () => void;
}

const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, type, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const isLogin = type === 'login';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[40px] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-[modalIn_0.3s_cubic-bezier(0.34, 1.56, 0.64, 1)]">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-3xl font-black text-[#1A365D] mb-2">
                {isLogin ? '歡迎回來' : '立即註冊'}
              </h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                使用 租的e 享受專業租賃服務
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">電話號碼</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input 
                  type="tel"
                  placeholder="請輸入 8 位數香港電話"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">密碼</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="請輸入密碼"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-black text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-black text-sky-500 hover:text-sky-600 uppercase tracking-widest">
                  忘記密碼？
                </button>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-[#1A365D] text-white font-black rounded-2xl text-xs uppercase tracking-[0.25em] hover:bg-sky-900 transition-all shadow-xl shadow-[#1A365D]/20 active:scale-95"
            >
              {isLogin ? '登入帳號' : '建立帳號'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isLogin ? '還沒有帳號？' : '已經有帳號？'}
              <button className="text-sky-500 hover:text-sky-600 ml-2">
                {isLogin ? '立即註冊' : '立即登入'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModals;
