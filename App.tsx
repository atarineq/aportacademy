
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AIAssistant } from './components/AIAssistant';
import { Auth } from './components/Auth';
import { AdminPanel } from './components/AdminPanel';
import { Profile } from './components/Profile';
import { Toast } from './components/Toast';
import { Dashboard } from './components/Dashboard';
import { aiAssistant } from './services/geminiService';
import { ACADEMY_DATA, CHECKLIST_SCHEMAS, INITIAL_USERS, INITIAL_BRANCHES } from './constants';
import { Category, ChecklistState, InspectionData, User, Role, Branch } from './types';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<Record<string, {password: string, user: User}>>(() => {
    const saved = localStorage.getItem('aport_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('aport_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aport_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [academyView, setAcademyView] = useState<string>('home');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toasts, setToasts] = useState<{id: number, text: string, type: 'ok' | 'error'}[]>([]);
  
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<Category>('Смартфон');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [marketPrice, setMarketPrice] = useState<string>('');
  const [checks, setChecks] = useState<ChecklistState>({});
  const [comment, setComment] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<InspectionData[]>([]);

  useEffect(() => {
    localStorage.setItem('aport_all_users', JSON.stringify(allUsers));
    localStorage.setItem('aport_branches', JSON.stringify(branches));
  }, [allUsers, branches]);

  useEffect(() => {
    const saved = localStorage.getItem('inspection_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToast = (text: string, type: 'ok' | 'error' = 'ok') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('aport_user', JSON.stringify(u));
    addToast(`Мастер на связи. Добро пожаловать, ${u.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aport_user');
    addToast('Сессия завершена');
  };

  const loanAmount = useMemo(() => {
    const price = parseFloat(marketPrice) || 0;
    return Math.floor(price * 0.6);
  }, [marketPrice]);

  const saveInspection = () => {
    if (!model || !marketPrice) return addToast('Заполните модель и цену!', 'error');
    
    const entry: InspectionData = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      branchId: user?.branchId || 'global',
      inspectorId: user?.id || '0',
      inspectorName: user?.name || 'Anon',
      phone,
      category,
      model,
      marketPrice: parseFloat(marketPrice),
      loanAmount: loanAmount,
      checklist: checks,
      comment: `S/N: ${serial}\n${comment}`
    };
    
    const newHistory = [entry, ...history].slice(0, 500);
    setHistory(newHistory);
    localStorage.setItem('inspection_history', JSON.stringify(newHistory));
    
    if (user) {
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats!,
          completedChecks: (user.stats?.completedChecks || 0) + 1,
          xp: (user.stats?.xp || 0) + 50
        }
      };
      setUser(updatedUser);
      addToast('+50 XP Зачислено!');
    }

    setPhone(''); setModel(''); setSerial(''); setMarketPrice(''); setChecks({}); setComment('');
    addToast('Практика сохранена');
    setActiveTab('history');
  };

  const scanSerial = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    addToast('AI сканирует IMEI...');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const extracted = await aiAssistant.scanSerial(base64);
      setSerial(extracted);
      setIsAnalyzing(false);
      addToast('IMEI распознан');
    };
    reader.readAsDataURL(file);
  };

  const navItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Мой Рост', icon: 'fa-house' },
      { id: 'checklist', label: 'Практика', icon: 'fa-circle-plus' },
      { id: 'academy', label: 'Академия', icon: 'fa-graduation-cap' },
      { id: 'history', label: 'Журнал', icon: 'fa-clock-rotate-left' }
    ];
    if (user?.role === 'ADMIN' || user?.role === 'HEAD') {
      items.push({ id: 'analytics', label: 'Аналитика', icon: 'fa-chart-pie' });
    }
    items.push({ id: 'profile', label: 'Профиль', icon: 'fa-circle-user' });
    if (user?.role === 'ADMIN') items.push({ id: 'admin_panel', label: 'Система', icon: 'fa-sliders' });
    return items;
  }, [user]);

  if (!user) return <Auth onLogin={handleLogin} users={allUsers} />;

  const currentBranch = branches.find(b => b.id === user.branchId);

  return (
    <Layout isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} user={user} onLogout={handleLogout}>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="logo-section p-8 mb-4 flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">A</div>
             <span className="logo-text font-black text-xl tracking-tighter uppercase truncate">Aport <span className="text-blue-600">Academy</span></span>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar pb-6">
            {navItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => {setActiveTab(item.id); setAcademyView('home');}} 
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="nav-label truncate">{item.label}</span>
              </div>
            ))}

            <div className="mx-4 mt-8 pt-8 border-t border-gray-50 space-y-2">
               <p className="px-4 text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">Инструменты ИИ</p>
               <div 
                  onClick={() => setIsAiOpen(true)}
                  className="mx-0 flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:bg-blue-50 group border border-dashed border-blue-100/50"
               >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                     <i className="fa fa-wand-magic-sparkles"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[11px] font-black uppercase text-gray-900 leading-none">AI Помощник</p>
                     <p className="text-[8px] text-blue-600 font-bold uppercase tracking-widest mt-1.5">Online Expert</p>
                  </div>
               </div>
            </div>
          </nav>

          <div className="user-info p-8 border-t border-gray-100 mt-auto space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">{user.name[0]}</div>
               <div className="user-details min-w-0">
                  <p className="text-xs font-bold truncate leading-none mb-1">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.stats?.rank}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="nav-label">Выйти</span>
            </button>
          </div>
        </aside>

        <main className="main-stage overflow-y-auto no-scrollbar">
          {activeTab === 'dashboard' && <Dashboard user={user} allUsers={allUsers} branches={branches} />}

          {activeTab === 'academy' && (
            <div className="max-w-5xl mx-auto space-y-12 animate-fade w-full pb-20">
              {academyView === 'home' ? (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">Учебный <span className="text-blue-600">План</span></h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.4em]">Актуальные регламенты и курсы повышения XP</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ACADEMY_DATA.home.grid?.map(item => (
                      <div key={item.id} onClick={() => setAcademyView(item.id)} className="glass-card p-10 flex flex-col items-start gap-6 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all group bg-white border-none shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-blue-600/5 transition-all`}></div>
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <i className={item.icon}></i>
                        </div>
                        <div className="space-y-1 relative z-10">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{item.difficulty}</span>
                          <h4 className="font-black text-xl uppercase tracking-tighter text-gray-900">{item.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.meta}</p>
                        </div>
                        <button className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] group-hover:text-blue-600 flex items-center gap-2">
                          Начать курс <i className="fa fa-arrow-right"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 bg-white w-full border-none shadow-sm animate-in">
                  <button onClick={() => setAcademyView('home')} className="mb-10 text-[10px] font-black text-blue-600 flex items-center gap-3 uppercase tracking-widest hover:translate-x-[-4px] transition-all bg-blue-50 px-6 py-3 rounded-xl w-fit">
                    <i className="fa fa-arrow-left"></i> Назад в меню
                  </button>
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 border-b border-gray-50 pb-8 text-gray-900 leading-tight">{ACADEMY_DATA[academyView].title}</h2>
                  <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: ACADEMY_DATA[academyView].content || '' }} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-fade w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase">Практика</h2>
                  <p className="text-xs text-blue-600 font-black uppercase tracking-[0.3em] mt-2">
                    {currentBranch?.name || 'Academy Node'} • Смена: Активна
                  </p>
                </div>
                <div className="flex gap-3">
                   <label className="bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 shadow-sm">
                      <i className="fa fa-camera"></i> Scan IMEI
                      <input type="file" accept="image/*" onChange={scanSerial} className="hidden" />
                   </label>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card p-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border-none shadow-sm">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Клиент (Телефон)</label>
                      <input placeholder="7707..." value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Категория</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)} className="input-field font-bold">
                        {Object.keys(CHECKLIST_SCHEMAS).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Модель устройства</label>
                      <input placeholder="напр: iPhone 15 Pro" value={model} onChange={e => setModel(e.target.value)} className="input-field" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IMEI / S/N</label>
                      <input placeholder="Серийный номер" value={serial} onChange={e => setSerial(e.target.value)} className="input-field" />
                    </div>
                  </div>

                  <div className="glass-card p-12 bg-blue-600 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl shadow-blue-600/20">
                    <div className="w-full text-center md:text-left">
                       <p className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-3">Оценка залога (60%)</p>
                       <h3 className="text-6xl font-black tracking-tighter">{loanAmount.toLocaleString()} ₸</h3>
                    </div>
                    <div className="w-full">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-3 text-center md:text-right">Рыночная цена (₸)</p>
                      <input type="number" placeholder="0" value={marketPrice} onChange={e => setMarketPrice(e.target.value)} className="bg-transparent border-b-2 border-white/20 w-full text-5xl font-black outline-none focus:border-white transition-all py-2 text-center md:text-right" />
                    </div>
                  </div>

                  <div className="glass-card p-10 space-y-6 bg-white border-none shadow-sm">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Описание и дефекты</label>
                    {/* Fixed onChange to capture event 'e' and pass value to setComment */}
                    <textarea placeholder="Опишите состояние..." value={comment} onChange={e => setComment(e.target.value)} className="input-field h-40 resize-none" />
                    <button onClick={saveInspection} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10">
                      Завершить проверку
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass-card p-10 space-y-8 h-fit sticky top-10 bg-white border-none shadow-sm">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                       <i className="fa fa-list-check text-blue-600"></i> Чек-лист навыков
                    </h4>
                    <div className="space-y-3">
                      {CHECKLIST_SCHEMAS[category].map(item => (
                        <div key={item} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight truncate mr-3">{item}</span>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setChecks(p => ({...p, [item]: 'ok'}))} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${checks[item] === 'ok' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-gray-300 border border-gray-100'}`}><i className="fa fa-check text-[10px]"></i></button>
                            <button onClick={() => setChecks(p => ({...p, [item]: 'bad'}))} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${checks[item] === 'bad' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white text-gray-300 border border-gray-100'}`}><i className="fa fa-times text-[10px]"></i></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade w-full">
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-10">Журнал активностей</h2>
              {history.map(item => (
                <div key={item.id} className="glass-card p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:bg-gray-50 transition-all border-l-4 border-l-blue-600 bg-white border-none shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-inner"><i className="fa fa-mobile-screen"></i></div>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tight">{item.model}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                        {new Date(item.timestamp).toLocaleString('ru-RU')} • {item.inspectorName}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-black text-blue-600 tracking-tighter">{item.loanAmount.toLocaleString()} ₸</p>
                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest mt-1">Check completed</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-32 opacity-20">
                  <i className="fa fa-box-open text-7xl mb-6"></i>
                  <p className="font-black uppercase tracking-[0.5em] text-sm">История пуста</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && <Profile user={user} />}
          {activeTab === 'admin_panel' && <AdminPanel users={allUsers} branches={branches} history={history} onUpdateUser={() => {}} onCreateUser={(u, p, n, r, b) => {
            const newUserObj = { 
              id: Math.random().toString(36).substr(2, 9), 
              username: u, 
              name: n, 
              role: r, 
              branchId: b, 
              joinedAt: Date.now(),
              stats: { xp: 0, level: 1, completedChecks: 0, passedExams: 0, rank: r === 'INTERN' ? 'Стажер' : 'Сотрудник' }
            };
            setAllUsers(prev => ({...prev, [u]: { password: p, user: newUserObj }}));
          }} onCreateBranch={(n, c) => {
             const nb = { id: 'b' + Date.now(), name: n, city: c, createdAt: Date.now() };
             setBranches(prev => [...prev, nb]);
          }} onDeleteBranch={(id) => setBranches(prev => prev.filter(b => b.id !== id))} onDeleteUser={(u) => {
             const next = {...allUsers};
             delete next[u];
             setAllUsers(next);
          }} />}
          {activeTab === 'analytics' && <AnalyticsDashboard history={history} branches={branches} user={user} />}
        </main>
      </div>

      <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      
      <div className="fixed bottom-10 left-10 z-[200] space-y-3 pointer-events-none max-w-xs">
        {toasts.map(t => <Toast key={t.id} text={t.text} type={t.type} />)}
      </div>
    </Layout>
  );
};

export default App;
