import React, { useEffect, useState } from 'react';
import { CheckIcon } from './Icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      // Allow for fade-out animation before calling onClose
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      <div className="flex items-center bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg">
        <CheckIcon className="w-5 h-5 mr-2" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;