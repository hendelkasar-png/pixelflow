import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface MessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export default function Message({
  type,
  message,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
}: MessageProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-success',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-error',
      icon: XCircle,
    },
    info: {
      bg: 'bg-blue-light',
      border: 'border-blue-200',
      text: 'text-blue',
      icon: CheckCircle,
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${style.bg} ${style.border} animate-in slide-in-from-top-2 fade-in`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.text}`} />
      <p className="flex-1 text-sm text-dark">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-white/50 transition-colors ${style.text}`}
          aria-label="Close message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
