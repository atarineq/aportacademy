
import React from 'react';

interface ToastProps {
  text: string;
  type?: 'ok' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ text, type = 'ok' }) => {
  return (
    <div className={`toast-animate pointer-events-auto px-6 py-4 rounded-[20px] shadow-2xl flex items-center gap-4 border glass-card ${
      type === 'ok' ? 'border-green-500/30' : 'border-red-500/30'
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        type === 'ok' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
      }`}>
        <i className={`fas ${type === 'ok' ? 'fa-check' : 'fa-exclamation-triangle'} text-xs`}></i>
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest opacity-90">{text}</p>
    </div>
  );
};
