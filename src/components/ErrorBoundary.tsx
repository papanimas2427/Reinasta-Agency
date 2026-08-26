import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

/**
 * Global error boundary — prevents a crash in one module from blanking the
 * whole portal. Shows a friendly recovery screen instead.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('reinasta_agency_v1'));
    keys.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-red-200 dark:border-red-900/60 max-w-md w-full p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/50 text-[#ED1C24] flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Terjadi kendala teknis
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ada kesalahan tak terduga saat menampilkan halaman. Coba muat ulang aplikasi,
                atau reset data demo jika masalah berlanjut.
              </p>
              {this.state.message && (
                <p className="text-[11px] text-red-500 mt-2 font-mono break-all">
                  {this.state.message}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-[#ED1C24] hover:bg-red-700 text-white text-xs font-bold rounded cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Muat Ulang Aplikasi
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded cursor-pointer"
              >
                Reset Data Demo
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
