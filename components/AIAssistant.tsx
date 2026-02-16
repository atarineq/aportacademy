
import React, { useState, useRef, useEffect } from 'react';
import { aiAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const result = await aiAssistant.chat(messages, input);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: result.text, 
      groundingUrls: result.urls 
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in">
      <div className="w-full max-w-2xl h-[85vh] glass-card overflow-hidden flex flex-col bg-white shadow-2xl border-none">
        <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <i className="fas fa-robot animate-pulse"></i>
             </div>
             <div>
               <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Aport AI Engine</h4>
               <p className="text-[9px] text-blue-600 font-black uppercase mt-1 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                 Система активна • v6.2
               </p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all group"
          >
            <i className="fas fa-times text-xs opacity-50 group-hover:opacity-100"></i>
          </button>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white">
          {messages.length === 0 && (
            <div className="text-center py-24 space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-wand-magic-sparkles text-blue-400 text-3xl"></i>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">Интеллектуальный помощник</p>
                <p className="text-[11px] text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">Задайте вопрос по оценке техники, диагностике или регламентам Казахстана.</p>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {m.text}
                {m.groundingUrls && m.groundingUrls.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dashed border-current/10 flex flex-wrap gap-2">
                    {m.groundingUrls.map((url, idx) => (
                      <a key={idx} href={url.uri} target="_blank" className="bg-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                        <i className="fa fa-link"></i> Источник {idx+1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-blue-50 px-5 py-3 rounded-2xl text-[10px] font-black uppercase text-blue-600 flex items-center gap-3">
                 <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 </div>
                 Анализирую...
               </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Спроси про iPhone 15 Pro или Samsung S24..."
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim()}
            className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
