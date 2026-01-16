import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

// Типи повідомлення
type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Автоматично видаляємо через 3 секунди
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* --- ВІЗУАЛЬНА ЧАСТИНА (Самі плашки) --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border 
              transform transition-all duration-300 animate-fade-in-up
              ${toast.type === 'success' 
                ? 'bg-slate-800 border-green-500/50 text-white' 
                : 'bg-slate-800 border-red-500/50 text-white'}
            `}
          >
            {toast.type === 'success' ? <CheckCircle className="text-green-400" /> : <XCircle className="text-red-400" />}
            <p className="font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-slate-500 hover:text-white">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};