import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Типи сповіщень
type ToastType = 'success' | 'error' | 'info';

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

  // Видалення конкретного сповіщення
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Додавання нового сповіщення
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Автоматичне видалення через 4 секунди
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Мемоізація значення контексту
  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* ПАНЕЛЬ СПОВІЩЕНЬ */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div 
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`
                pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl
                ${toast.type === 'success' 
                  ? 'bg-slate-900/90 border-green-500/30 text-white shadow-green-500/5' 
                  : toast.type === 'error'
                  ? 'bg-slate-900/90 border-red-500/30 text-white shadow-red-500/5'
                  : 'bg-slate-900/90 border-blue-500/30 text-white shadow-blue-500/5'}
              `}
            >
              {/* Іконки за типом */}
              <div className="flex-shrink-0">
                {toast.type === 'success' && <CheckCircle className="text-green-400" size={24} />}
                {toast.type === 'error' && <XCircle className="text-red-400" size={24} />}
                {toast.type === 'info' && <Info className="text-blue-400" size={24} />}
              </div>

              {/* Текст */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold uppercase tracking-tight leading-tight">
                  {toast.type === 'success' ? 'System Success' : toast.type === 'error' ? 'System Error' : 'Notification'}
                </p>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                  {toast.message}
                </p>
              </div>

              {/* Кнопка закриття */}
              <button 
                onClick={() => removeToast(toast.id)} 
                className="flex-shrink-0 p-1 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};