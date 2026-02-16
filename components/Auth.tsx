
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  users: Record<string, {password: string, user: User}>;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const entry = users[username.toLowerCase().trim()];
      if (entry && entry.password === password) {
        onLogin(entry.user);
      } else {
        setError('ОШИБКА ДОСТУПА: ПРОВЕРЬТЕ ДАННЫЕ');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc] selection:bg-blue-100">
      <div className="w-full max-w-sm space-y-12 animate-fade">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.8rem] flex items-center justify-center text-white text-4xl font-black mx-auto shadow-2xl shadow-blue-500/20 relative">
            A
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
               <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900 leading-none">Aport <span className="text-blue-600">Academy</span></h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-3">Professional Learning Hub</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Логин сотрудника</label>
              <div className="relative">
                <input 
                  autoFocus
                  placeholder="Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                  disabled={loading}
                />
                <i className="fa fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Ключ безопасности</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                  disabled={loading}
                />
                <i className="fa fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
              </div>
            </div>
            
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                {error}
              </div>
            )}

            <button 
              disabled={loading || !username || !password}
              className="group relative w-full h-[64px] bg-blue-600 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {/* Эффект свечения при ховере */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:${i * 0.1}s]`}></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Авторизоваться</span>
                    <i className="fa fa-arrow-right text-[10px] text-white/50 group-hover:translate-x-1 group-hover:text-white transition-all"></i>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        <div className="text-center pt-4">
          <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em]">Aport Academy Ecosystem</p>
        </div>
      </div>
    </div>
  );
};
