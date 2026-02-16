
import React, { useState, useMemo } from 'react';
import { InspectionData, Branch, User } from '../types';

interface AnalyticsDashboardProps {
  history: InspectionData[];
  branches: Branch[];
  user: User;
}

type Period = 'day' | 'month' | 'custom';

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ history, branches, user }) => {
  const [period, setPeriod] = useState<Period>('day');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Calculate statistics for the dashboard based on history, active period filter, and selected branch
  const stats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const filtered = history.filter(item => {
      // Branch Filtering
      const matchesBranch = selectedBranchId === 'all' || item.branchId === selectedBranchId;
      if (!matchesBranch) return false;

      // Period Filtering
      if (period === 'day') return item.timestamp >= startOfDay;
      if (period === 'month') return item.timestamp >= startOfMonth;
      if (period === 'custom' && customRange.start && customRange.end) {
        const s = new Date(customRange.start).getTime();
        const e = new Date(customRange.end).getTime() + 86400000; // include full end day
        return item.timestamp >= s && item.timestamp <= e;
      }
      return true;
    });

    const totalLoans = filtered.reduce((sum, item) => sum + (Number(item.loanAmount) || 0), 0);
    const totalChecks = filtered.length;
    
    const categories: Record<string, number> = {};
    filtered.forEach(h => { categories[h.category] = (categories[h.category] || 0) + 1; });

    return { totalLoans, totalChecks, categories };
  }, [history, period, selectedBranchId, customRange]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-gray-900">Аналитика</h2>
            <p className="text-[11px] font-black uppercase text-blue-600 tracking-[0.4em] mt-3 flex items-center gap-3">
               <i className="fa fa-chart-line"></i> Контроль оборота и продуктивности
            </p>
          </div>
          
          {/* Branch Selector Dropdown */}
          <div className="relative inline-block w-full md:w-auto">
            <select 
              value={selectedBranchId} 
              onChange={e => setSelectedBranchId(e.target.value)}
              className="w-full md:w-auto appearance-none bg-white border border-gray-100 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer pr-12 transition-all"
            >
              <option value="all">Сеть: Все филиалы</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.city}: {b.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-600">
              <i className="fa fa-chevron-down text-[8px]"></i>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl shadow-inner">
          {(['day', 'month', 'custom'] as Period[]).map(p => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p === 'day' ? 'Сегодня' : p === 'month' ? 'Месяц' : 'Период'}
            </button>
          ))}
        </div>
      </div>

      {period === 'custom' && (
        <div className="glass-card p-6 bg-white flex flex-wrap gap-4 items-center animate-fade w-full md:w-fit">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Начало</p>
            <input 
              type="date" 
              className="input-field bg-gray-50 text-[10px] font-bold py-3" 
              onChange={e => setCustomRange(p => ({...p, start: e.target.value}))} 
            />
          </div>
          <span className="text-gray-200 mt-4 hidden md:block">—</span>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Конец</p>
            <input 
              type="date" 
              className="input-field bg-gray-50 text-[10px] font-bold py-3" 
              onChange={e => setCustomRange(p => ({...p, end: e.target.value}))} 
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-10 bg-white border-none shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Оборот займов</p>
          <h3 className="text-4xl font-black text-blue-600 tracking-tighter">{stats.totalLoans.toLocaleString()} ₸</h3>
          <p className="text-[9px] font-bold text-blue-400 mt-2 uppercase tracking-widest">Выдано в узле</p>
        </div>

        <div className="glass-card p-10 bg-white border-none shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Общее кол-во сделок</p>
          <h3 className="text-4xl font-black text-purple-600 tracking-tighter">{stats.totalChecks}</h3>
          <p className="text-[9px] font-bold text-purple-400 mt-2 uppercase tracking-widest">Проверок выполнено</p>
        </div>

        <div className="glass-card p-10 bg-white border-none shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Средний чек</p>
          <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">
            {stats.totalChecks > 0 ? Math.floor(stats.totalLoans / stats.totalChecks).toLocaleString() : '0'} ₸
          </h3>
          <p className="text-[9px] font-bold text-emerald-400 mt-2 uppercase tracking-widest">Конверсия залога</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 bg-white border-none shadow-sm space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4 flex justify-between">
            Распределение по категориям
            <span className="text-blue-500">{selectedBranchId === 'all' ? 'Все филиалы' : branches.find(b => b.id === selectedBranchId)?.name}</span>
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.categories).map(([cat, count]) => {
              const percent = stats.totalChecks > 0 ? Math.round((count / stats.totalChecks) * 100) : 0;
              return (
                <div key={cat} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase text-gray-700 tracking-tight group-hover:text-blue-600 transition-colors">{cat}</span>
                    <span className="text-[10px] font-black text-blue-600">{count} шт • {percent}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.categories).length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-10">
                <i className="fa fa-chart-bar text-6xl"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Нет транзакций</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-10 bg-white border-none shadow-sm flex flex-col justify-center items-center text-center space-y-8 group">
           <div className="w-24 h-24 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 text-4xl shadow-inner group-hover:scale-110 transition-all duration-500">
              <i className="fa fa-bullseye animate-pulse"></i>
           </div>
           <div>
              <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">Производительность</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4 px-10 leading-relaxed">
                 {selectedBranchId === 'all' 
                   ? 'Сводная статистика по всей экосистеме филиалов Aport Pro' 
                   : `Детальная аналитика по подразделению: ${branches.find(b => b.id === selectedBranchId)?.name}`
                 }
              </p>
           </div>
           <div className="p-6 rounded-[1.5rem] bg-emerald-50 border border-emerald-100/50 w-full max-w-xs shadow-sm group-hover:shadow-emerald-100 transition-all">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">Status Report</p>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">Operational Excellent</p>
           </div>
        </div>
      </div>
    </div>
  );
};
