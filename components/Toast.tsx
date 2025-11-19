
import React, { useEffect, useState } from 'react';
import { CheckIcon } from './Icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000, type = 'success' }) => {
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

  let bgColor = 'bg-green-600';
  let icon = <CheckIcon className="w-5 h-5 mr-2" />;

  if (type === 'error') {
    bgColor = 'bg-red-600';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    );
  } else if (type === 'info') {
    bgColor = 'bg-blue-600';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      <div className={`flex items-center ${bgColor} text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg`}>
        {icon}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
