
import React, { useState, useMemo } from 'react';
import { User, Role, Branch, InspectionData } from '../types';

interface AdminPanelProps {
  users: Record<string, {password: string, user: User}>;
  branches: Branch[];
  history: InspectionData[];
  onUpdateUser: (username: string, updates: Partial<User>) => void;
  onDeleteUser: (username: string) => void;
  onCreateUser: (username: string, password: string, name: string, role: Role, branchId: string) => void;
  onCreateBranch: (name: string, city: string) => void;
  onDeleteBranch: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  users, branches, history, onDeleteUser, onCreateUser, onCreateBranch, onDeleteBranch 
}) => {
  const [view, setView] = useState<'users' | 'branches' | 'performance'>('users');
  
  const [newU, setNewU] = useState('');
  const [newP, setNewP] = useState('');
  const [newN, setNewN] = useState('');
  const [newR, setNewR] = useState<Role>('MANAGER');
  const [newB, setNewB] = useState('');

  const [brN, setBrN] = useState('');
  const [brC, setBrC] = useState('');

  const roles: Role[] = ['ADMIN', 'HEAD', 'MANAGER', 'INTERN'];

  const branchPerformance = useMemo(() => {
    return branches.map(b => {
      const branchHistory = history.filter(h => h.branchId === b.id);
      const branchUsers = (Object.values(users) as { password: string, user: User }[]).filter(u => u.user.branchId === b.id);
      const totalVolume = branchHistory.reduce((sum, h) => sum + (h.loanAmount || 0), 0);
      return {
        ...b,
        userCount: branchUsers.length,
        checkCount: branchHistory.length,
        totalVolume,
        avgTicket: branchHistory.length > 0 ? Math.floor(totalVolume / branchHistory.length) : 0
      };
    });
  }, [branches, history, users]);

  const getRoleBadge = (role: Role) => {
    const styles = {
      ADMIN: 'bg-purple-600 text-white shadow-purple-200',
      HEAD: 'bg-blue-600 text-white shadow-blue-200',
      MANAGER: 'bg-emerald-600 text-white shadow-emerald-200',
      INTERN: 'bg-amber-500 text-white shadow-amber-200'
    };
    return (
      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm tracking-widest ${styles[role] || 'bg-gray-600 text-white'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-12 animate-in max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">Консоль <span className="text-blue-600">Системы</span></h2>
          <p className="text-[11px] font-black uppercase text-blue-600 tracking-[0.4em] mt-4 flex items-center gap-3">
             <i className="fa fa-globe-asia"></i> Глобальное управление кадрами
          </p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl shadow-inner">
           <button onClick={() => setView('users')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'users' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Команда</button>
           <button onClick={() => setView('branches')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'branches' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Филиалы</button>
           <button onClick={() => setView('performance')} className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'performance' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}>Активность</button>
        </div>
      </div>

      {view === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-10 bg-white border-none shadow-sm space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Регистрация нового таланта</h3>
              <div className="space-y-4">
                <input placeholder="Username (Login)" value={newU} onChange={e => setNewU(e.target.value)} className="input-field bg-gray-50/50" />
                <input type="password" placeholder="Пароль" value={newP} onChange={e => setNewP(e.target.value)} className="input-field bg-gray-50/50" />
                <input placeholder="Полное имя" value={newN} onChange={e => setNewN(e.target.value)} className="input-field bg-gray-50/50" />
                <select value={newR} onChange={e => setNewR(e.target.value as Role)} className="input-field font-bold bg-gray-50/50">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={newB} onChange={e => setNewB(e.target.value)} className="input-field font-bold bg-gray-50/50">
                  <option value="">Глобальный доступ (HQ)</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.city}: {b.name}</option>)}
                </select>
                
                <button 
                  onClick={() => { if(newU && newP && newN) { onCreateUser(newU, newP, newN, newR, newB); setNewU(''); setNewP(''); setNewN(''); } }} 
                  className="group relative w-full h-[64px] bg-gray-900 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 shadow-2xl shadow-gray-900/10"
                >
                  {/* Эффект свечения */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Активировать аккаунт</span>
                    <i className="fa fa-sparkles text-[10px] text-white/50 group-hover:text-white transition-all"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-card bg-white border-none shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-[10px] uppercase font-black opacity-30">Сотрудник</th>
                  <th className="p-6 text-[10px] uppercase font-black opacity-30">Филиал</th>
                  <th className="p-6 text-right text-[10px] uppercase font-black opacity-30">Контроль</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(Object.entries(users) as [string, {password: string, user: User}][]).map(([username, data]) => (
                  <tr key={username} className="hover:bg-gray-50/30 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-sm font-black shadow-sm group-hover:rotate-12 transition-all">{data.user.name[0]}</div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-sm text-gray-900 tracking-tight">{data.user.name}</p>
                                {getRoleBadge(data.user.role)}
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">@{username}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <i className="fa fa-building-circle-check text-blue-500/40"></i>
                          {branches.find(b => b.id === data.user.branchId)?.name || 'Central Command (HQ)'}
                        </p>
                    </td>
                    <td className="p-6 text-right">
                      {username !== 'master' && (
                        <button onClick={() => onDeleteUser(username)} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center ml-auto">
                          <i className="fa fa-trash-alt"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'branches' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 bg-white border-none shadow-sm space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Добавление узла</h3>
                <div className="space-y-4">
                   <input placeholder="Название филиала" value={brN} onChange={e => setBrN(e.target.value)} className="input-field bg-gray-50/50" />
                   <input placeholder="Город (напр. Алматы)" value={brC} onChange={e => setBrC(e.target.value)} className="input-field bg-gray-50/50" />
                   <button onClick={() => { if(brN && brC) { onCreateBranch(brN, brC); setBrN(''); setBrC(''); } }} className="group w-full py-5 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Интегрировать</button>
                </div>
              </div>
           </div>

           <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {branches.map(b => (
                <div key={b.id} className="glass-card p-8 bg-white border-none shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
                   <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-all">
                           <i className="fa fa-building-circle-check"></i>
                        </div>
                        <button onClick={() => onDeleteBranch(b.id)} className="opacity-0 group-hover:opacity-100 transition-all text-red-200 hover:text-red-500 p-2"><i className="fa fa-trash-alt"></i></button>
                      </div>
                      <h4 className="font-black text-xl text-gray-900 uppercase tracking-tighter">{b.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                        <i className="fa fa-location-dot text-blue-500"></i> {b.city}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
