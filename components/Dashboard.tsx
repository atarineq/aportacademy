
import React, { useState, useEffect, useMemo } from 'react';
import { User, Branch } from '../types';

interface DashboardProps {
  user: User;
  allUsers: Record<string, { password: string, user: User }>;
  branches: Branch[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, allUsers, branches }) => {
  const [aiInsight, setAiInsight] = useState('Анализирую вашу активность...');
  
  useEffect(() => {
    setTimeout(() => {
       const insight = `Уровень: ${user.stats?.level || 1}. До следующего ранга осталось ${(1000 - ((user.stats?.xp || 0) % 1000)) / 50} идеальных проверок.`;
       setAiInsight(insight);
    }, 1500);
  }, [user]);

  // Фильтруем ТОП-3 сотрудников ИМЕННО ИЗ ТОГО ЖЕ ГОРОДА, что и текущий юзер
  const cityLeaderboard = useMemo(() => {
    const userBranch = branches.find(b => b.id === user.branchId);
    if (!userBranch) return [];

    return Object.values(allUsers)
      .map(entry => entry.user)
      .filter(u => {
        const uBranch = branches.find(b => b.id === u.branchId);
        return uBranch?.city === userBranch.city;
      })
      .sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0))
      .slice(0, 3);
  }, [user, allUsers, branches]);

  const stats = [
    { label: 'Академия: Опыт', val: `${user.stats?.xp || 0} XP`, color: 'text-blue-600', icon: 'fa-trophy', trend: `Lvl ${user.stats?.level || 1}` },
    { label: 'Качество КПИ', val: '98%', color: 'text-emerald-600', icon: 'fa-shield-heart', trend: 'Professional' },
    { label: 'Практика (Всего)', val: `${user.stats?.completedChecks || 0}`, color: 'text-indigo-600', icon: 'fa-laptop-code', trend: 'Общий итог' },
    { label: 'Ранг', val: user.stats?.rank || 'Стажер', color: 'text-rose-600', icon: 'fa-crown', trend: 'Top Status' }
  ];

  const currentCity = branches.find(b => b.id === user.branchId)?.city || 'Сеть';

  return (
    <div className="space-y-12 animate-fade pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">Личный <span className="text-blue-600">Прогресс</span></h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.4em]">Node ID: {user.branchId || 'GLOBAL'}</p>
        </div>
        
        <div className="glass-card p-5 bg-white border-blue-100 flex items-center gap-5 max-w-md shadow-2xl shadow-blue-500/10">
           <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl shrink-0">
             <i className="fas fa-robot animate-pulse"></i>
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">AI Советник</p>
             <p className="text-[11px] font-bold leading-tight text-gray-700 italic">"{aiInsight}"</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="glass-card p-8 bg-white border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl ${s.color} group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div>
                <h3 className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.val}</h3>
                <p className="text-[10px] uppercase font-black opacity-30 tracking-widest mt-1">{s.label}</p>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.trend}</span>
                <i className="fa fa-arrow-up-right text-gray-200 text-[10px]"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* City Leaderboard */}
         <div className="lg:col-span-4 space-y-6">
            <div className="flex justify-between items-end">
               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Топ города: {currentCity}</h4>
               <span className="text-[9px] font-black text-blue-600 uppercase">Live</span>
            </div>
            <div className="glass-card bg-white border-none shadow-sm overflow-hidden divide-y divide-gray-50">
               {cityLeaderboard.map((u, i) => (
                 <div key={u.id} className={`p-6 flex items-center gap-5 relative ${i === 0 ? 'bg-gradient-to-r from-blue-50/30 to-transparent' : ''}`}>
                    <div className="relative shrink-0">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                         i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 
                         i === 1 ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-600'
                       }`}>
                          {i + 1}
                       </div>
                       {i === 0 && <i className="fa fa-crown absolute -top-2 -right-2 text-blue-600 text-xs drop-shadow-sm"></i>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-black text-sm uppercase tracking-tight truncate">{u.name} {u.id === user.id && '(Вы)'}</p>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{u.stats?.rank}</p>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="font-black text-blue-600 text-sm tracking-tighter">{u.stats?.xp.toLocaleString()} XP</p>
                       {i === 0 && <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">Champion</span>}
                    </div>
                 </div>
               ))}
               <div className="p-6 bg-slate-50 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Чемпиону города полагается <br/> <span className="text-blue-600">бонус +10% к оценке залога</span>
                  </p>
               </div>
            </div>
         </div>

         {/* Knowledge Center */}
         <div className="lg:col-span-8 glass-card p-10 bg-white border-none shadow-sm space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Быстрый старт обучения</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 group cursor-pointer hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><i className="fa fa-fire"></i></div>
                     <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Доступен</span>
                  </div>
                  <h5 className="font-black text-lg uppercase tracking-tight mb-2">Диагностика OLED</h5>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">Как не купить "тетрис": выявление скрытых пятен на матрицах.</p>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                     <div className="h-full bg-emerald-500 rounded-full" style={{width: '0%'}}></div>
                  </div>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group cursor-pointer shadow-xl">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                     <div>
                        <h5 className="font-black text-lg uppercase tracking-tight mb-2">Новый Экзамен</h5>
                        <p className="text-xs text-white/50 leading-relaxed italic">"Протокол Apple 2024"</p>
                     </div>
                     <button className="mt-8 bg-blue-600 text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all">Пройти Тест</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
