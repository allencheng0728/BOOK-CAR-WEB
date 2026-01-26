
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('React ErrorBoundary Caught');
    console.error("Error:", error);
    console.error("Info:", errorInfo);
    console.groupEnd();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 p-6 text-center">
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-200 max-w-xl w-full">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h2 className="text-3xl font-black text-[#1A365D] mb-4 tracking-tight">發生意外錯誤</h2>
            <p className="text-slate-500 mb-8 font-bold leading-relaxed">
              很抱歉，此頁面無法正常顯示。
              <br/>
              這可能是由於組件渲染失敗或數據異常導致的。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#1A365D] text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:opacity-90 transition-all active:scale-95"
              >
                重新整理
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                返回首頁
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}

export default ErrorBoundary;
