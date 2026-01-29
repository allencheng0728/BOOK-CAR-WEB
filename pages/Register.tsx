import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  X, Phone, Lock, Eye, EyeOff, Camera, Calendar, User, 
  CreditCard, Banknote, QrCode, Smartphone, CheckCircle2, 
  ChevronDown, ShieldCheck, ArrowLeft, Clock, Info, Check,
  UserPlus, Sun, Moon, Sparkles, Building2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HK_BANKS = [
  { code: '003', name: '渣打銀行(香港)有限公司' },
  { code: '004', name: '香港上海匯豐銀行有限公司' },
  { code: '012', name: '中國銀行(香港)有限公司' },
  { code: '024', name: '恒生銀行有限公司' },
  { code: '250', name: '花旗銀行(香港)有限公司' },
  { code: '015', name: '東亞銀行有限公司' },
  { code: '020', name: '永隆銀行有限公司' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Form States
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    chineseName: '',
    englishName: '',
    birthYear: '',
    gender: 'M',
    shift: '早更',
    shiftStartTime: '04:00',
    shiftEndTime: '16:00',
    licenseNo: '',
    licenseExpiry: '',
    driverIdNo: '',
    driverIdExpiry: '',
    bankCode: '',
    bankAccountName: '',
    bankAccountNo: '',
  });

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleShiftChange = (shift: string) => {
    let startTime = '04:00';
    let endTime = '16:00';
    if (shift === '晚更') {
      startTime = '16:00';
      endTime = '04:00';
    } else if (shift === '特更') {
      startTime = '00:00';
      endTime = '23:59';
    }
    setFormData(prev => ({ ...prev, shift, shiftStartTime: startTime, shiftEndTime: endTime }));
  };

  const getOtp = () => {
    if (!formData.phone || formData.phone.length !== 8) {
      alert('請先輸入 8 位數香港手機號碼');
      return;
    }
    setOtpTimer(60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8 || formData.password.length > 20 || !/[0-9]/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      alert('密碼必須為 8-20 個字元，且包含數字及字母');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('兩次輸入的密碼不一致');
      return;
    }
    alert('註冊申請已提交！我們將在 1-3 個工作天內完成審核。');
    navigate('/');
  };

  const SectionHeader = ({ title, required, icon: Icon }: { title: string; required?: boolean; icon: any }) => (
    <div className="flex items-center gap-3 mb-6 mt-12 first:mt-0">
      <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-black text-[#1A365D] tracking-tight">{title}</h4>
          {required && <span className="bg-rose-100 text-rose-500 font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-widest">必須</span>}
        </div>
        <div className="h-[1px] bg-slate-100 mt-1"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Helmet>
        <title>司機入駐註冊 | 租的e</title>
      </Helmet>

      {/* Hero Header */}
      <div className="bg-[#1A365D] pt-20 pb-40 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-400 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-sky-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            Join Our Professional Network
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            入駐租的e       揸的士話咁易!
          </h1>
          <p className="text-sky-100/60 text-lg font-medium max-w-2xl mx-auto">
            立即建立您的專業司機檔案，全港首創彈性租金機制，助您輕鬆管理工作時間。
          </p>
        </div>
      </div>

      {/* Form Section */}
      <main className="max-w-7xl mx-auto w-full px-4 -mt-24 pb-24 relative z-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Form Fields */}
          <div className="lg:col-span-8 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-200">
            
            {/* Section: Basic Info */}
            <SectionHeader title="基本資料" required icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">姓名 (中文) <span className="text-rose-500">*</span></label>
                <input 
                  required
                  type="text" 
                  placeholder="如: 李大文"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                  value={formData.chineseName}
                  onChange={(e) => handleInputChange('chineseName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">英文姓名 (大寫) <span className="text-rose-500">*</span></label>
                <input 
                  required
                  type="text" 
                  placeholder="如: LI TAI MAN"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all uppercase"
                  value={formData.englishName}
                  onChange={(e) => handleInputChange('englishName', e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">出生年份</label>
                <input 
                  type="number" 
                  placeholder="1990"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                  value={formData.birthYear}
                  onChange={(e) => handleInputChange('birthYear', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">性別</label>
                <div className="flex gap-2">
                  {['M', 'F'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleInputChange('gender', g)}
                      className={`flex-1 py-4 rounded-2xl border-2 font-black text-sm transition-all ${formData.gender === g ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      {g === 'M' ? '男' : '女'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">更數選擇</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: '早更', icon: Sun },
                  { id: '晚更', icon: Moon },
                  { id: '特更', icon: Clock }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleShiftChange(s.id)}
                    className={`flex flex-col items-center p-6 rounded-[32px] border-2 transition-all relative overflow-hidden ${formData.shift === s.id ? 'bg-sky-50 border-sky-500 ring-4 ring-sky-500/10' : 'bg-slate-50 border-slate-100'}`}
                  >
                    {formData.shift === s.id && <div className="absolute top-2 right-2 text-sky-500"><Check className="w-4 h-4" /></div>}
                    <s.icon className={`w-8 h-8 mb-3 ${formData.shift === s.id ? 'text-sky-600' : 'text-slate-300'}`} />
                    <span className={`text-sm font-black ${formData.shift === s.id ? 'text-sky-600' : 'text-slate-600'}`}>{s.id}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">開始時間</label>
                   <input 
                    type="time"
                    className="w-full bg-white border-2 border-slate-200 rounded-xl py-3 px-4 text-xs font-black text-slate-700 outline-none focus:border-sky-500"
                    value={formData.shiftStartTime}
                    onChange={(e) => handleInputChange('shiftStartTime', e.target.value)}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">結束時間</label>
                   <input 
                    type="time"
                    className="w-full bg-white border-2 border-slate-200 rounded-xl py-3 px-4 text-xs font-black text-slate-700 outline-none focus:border-sky-500"
                    value={formData.shiftEndTime}
                    onChange={(e) => handleInputChange('shiftEndTime', e.target.value)}
                   />
                </div>
              </div>
            </div>

            {/* Section: Professional Docs */}
            <SectionHeader title="專業證照" required icon={ShieldCheck} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group h-48 relative overflow-hidden">
                  <Camera className="w-10 h-10 text-slate-300 group-hover:text-sky-500 mb-3" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">上傳駕駛執照 <span className="text-rose-500">*</span></p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">駕駛執照編號 <span className="text-rose-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    placeholder="如: A123456(7)"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                    value={formData.licenseNo}
                    onChange={(e) => handleInputChange('licenseNo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">屆滿日期 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="date" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                      value={formData.licenseExpiry}
                      onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group h-48 relative overflow-hidden">
                  <Camera className="w-10 h-10 text-slate-300 group-hover:text-sky-500 mb-3" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">上傳的士司機證 <span className="text-rose-500">*</span></p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">司機證編號 No. <span className="text-rose-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    placeholder="如: TX12345"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                    value={formData.driverIdNo}
                    onChange={(e) => handleInputChange('driverIdNo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">屆滿日期 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="date" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                      value={formData.driverIdExpiry}
                      onChange={(e) => handleInputChange('driverIdExpiry', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Payout Account */}
            <SectionHeader title="收款賬戶" icon={Banknote} />
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6 mb-12">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                    <Building2 className="w-4 h-4" />
                 </div>
                 <p className="text-xs font-black text-slate-500 uppercase tracking-widest">銀行帳戶資料 (非必須，可用於結算租金)</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">選擇銀行</label>
                <div className="relative group">
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                  <select 
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none appearance-none focus:border-sky-500 transition-all"
                    value={formData.bankCode}
                    onChange={(e) => handleInputChange('bankCode', e.target.value)}
                  >
                    <option value="">選擇香港銀行...</option>
                    {HK_BANKS.map(b => (
                      <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">戶口持有人姓名 (大寫英文)</label>
                <input 
                  type="text" 
                  placeholder="如: LI TAI MAN"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 uppercase transition-all"
                  value={formData.bankAccountName}
                  onChange={(e) => handleInputChange('bankAccountName', e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">戶口號碼</label>
                <input 
                  type="text" 
                  placeholder="如: 123-456789-001"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                  value={formData.bankAccountNo}
                  onChange={(e) => handleInputChange('bankAccountNo', e.target.value)}
                />
              </div>
            </div>

            {/* Section: Security */}
            <SectionHeader title="安全驗證" required icon={Lock} />
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">手機號碼 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="tel" 
                      placeholder="8 位數香港手機號碼"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:pt-6">
                  <button 
                    type="button"
                    onClick={getOtp}
                    disabled={otpTimer > 0}
                    className="h-[56px] px-8 rounded-2xl bg-sky-50 text-sky-600 font-black text-xs uppercase tracking-widest border border-sky-100 disabled:opacity-50 hover:bg-sky-100 transition-all whitespace-nowrap"
                  >
                    {otpTimer > 0 ? `重發驗證碼 (${otpTimer}s)` : '獲取驗證碼'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">驗證碼 <span className="text-rose-500">*</span></label>
                <input 
                  required
                  type="text" 
                  placeholder="輸入 6 位數短訊驗證碼"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">設定密碼 <span className="text-rose-500">*</span></label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="8-20 位數字及字母"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">再次輸入密碼 <span className="text-rose-500">*</span></label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="password"
                      placeholder="請再次輸入密碼"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-slate-700 outline-none focus:border-sky-500 transition-all"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic ml-1">* 密碼長度須為 8-20 位，且必須包含數字及字母</p>
            </div>

            <div className="mt-16 flex flex-col md:flex-row items-center gap-6">
              <button 
                type="submit"
                className="w-full md:w-auto px-16 py-6 bg-[#1A365D] text-white font-black rounded-3xl text-sm uppercase tracking-[0.2em] hover:bg-sky-900 transition-all shadow-2xl shadow-[#1A365D]/20 active:scale-[0.98]"
              >
                立即提交註冊資料
              </button>
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-sm">
                點擊「立即提交」即表示您同意我們的 <a href="#" className="text-sky-500 underline">服務協議</a> 及 <a href="#" className="text-sky-500 underline">隱私政策</a>。
              </p>
            </div>
          </div>

          {/* Right Side: Sticky Info Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-xl space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900">註冊須知</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { title: '審核機制', desc: '我們的工作人員將在 24-48 小時內驗證您的證照資料。' },
                  { title: '實名認證', desc: '租的e 要求所有司機進行實名登記，以確保交易安全透明。' },
                  { title: '資料加密', desc: '您的個人敏感資料將經過多重加密處理，絕不外洩給無關第三方。' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Register via Phone QR */}
            <div className="bg-[#1A365D] rounded-[40px] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-125"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="bg-white p-3 rounded-[32px] shadow-2xl relative">
                  <QrCode className="w-32 h-32 text-[#1A365D]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-[10px] font-black text-[#1A365D]">租的</span>
                     </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <Smartphone className="w-5 h-5 text-sky-400" />
                    <h4 className="text-xl font-black tracking-tight">手機註冊更快速</h4>
                  </div>
                  <p className="text-xs text-sky-100/60 font-medium mb-8">
                    掃描二維碼下載「租的e (司機版)」<br/>
                    支援 OCR 自動識別身份證，免手動輸入。
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-colors flex flex-col items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      App Store
                    </button>
                    <button type="button" className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-colors flex flex-col items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      Google Play
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                已經有司機帳號？
                <Link to="/" className="text-sky-500 hover:text-sky-600 ml-2 font-black">立即登入</Link>
              </p>
            </div>
          </div>
        </form>
      </main>

      <footer className="mt-auto py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">© 2025 租的e - Professional Taxi Marketplace | 版權所有</p>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
