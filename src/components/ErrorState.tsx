import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-black uppercase tracking-widest text-slate-500">{message}</p>
        <p className="text-xs text-slate-700 uppercase tracking-widest">Check your connection and try again</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 h-9 px-5 rounded-xl border border-white/[0.08] text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/[0.15] transition-all"
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}
