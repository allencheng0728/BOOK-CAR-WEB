import React, { useState, useEffect } from 'react';
import { X, Phone, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface AuthModalsProps {
  isOpen: boolean;
  type: 'login' | 'register';
  onClose: () => void;
}

const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, type, onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Auto-redirect if type is register and modal is open
  useEffect(() => {
    if (isOpen && type === 'register') {
      onClose();
      navigate('/register');
    }
  }, [isOpen, type, onClose, navigate]);

  if (!isOpen || type === 'register') return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[40px] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-[modalIn_0.3s_cubic-bezier(0.34, 1.56, 0.64, 1)] flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-start shrink-0">
          <div>
            <h3 className="text-3xl font-black text-[#1A365D] mb-1">歡迎回來</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              登入 租的e 享受專業租賃服務
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">手機號碼</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="tel"
                placeholder="8 位數香港電話"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-slate-700 focus:border-sky-500 focus:bg-white outline-none transition-all shadow-inner"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">密碼</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="請輸入密碼"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-black text-slate-700 focus:border-sky-500 focus:bg-white outline-none transition-all shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors">忘記密碼？</button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/50 shrink-0 flex flex-col gap-4">
          <button 
            type="submit"
            className="w-full py-5 bg-[#1A365D] text-white font-black rounded-2xl text-xs uppercase tracking-[0.25em] hover:bg-sky-900 transition-all shadow-xl shadow-[#1A365D]/20 active:scale-[0.98]"
          >
            登入帳號
          </button>
          
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              還沒有帳號？
              <button 
                onClick={() => { onClose(); navigate('/register'); }}
                className="text-sky-500 hover:text-sky-600 ml-2 font-black"
              >
                立即註冊司機帳號
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AuthModals;
