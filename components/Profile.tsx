
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <div className="glass-card p-12 bg-white border-none shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2.3rem] flex items-center justify-center text-5xl font-black text-blue-600">
              {user.name[0]}
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-4">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                {user.role} ACCESS
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">{user.name}</h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2 justify-center md:justify-start">
                <i className="fa fa-calendar-alt text-blue-500"></i> С {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-10 justify-center md:justify-start pt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 tracking-tighter">{user.stats?.completedChecks || 0}</div>
                <div className="text-[9px] uppercase font-black text-gray-300 tracking-[0.2em] mt-1">Checklists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 tracking-tighter">{user.stats?.passedExams || 0}</div>
                <div className="text-[9px] uppercase font-black text-gray-300 tracking-[0.2em] mt-1">Exams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 bg-white border-none shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <i className="fas fa-building text-xl"></i>
            </div>
            <h4 className="font-black uppercase text-xs tracking-widest">Локация</h4>
          </div>
          <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Рабочий филиал закреплен системой.</p>
          <div className="mt-4 p-4 rounded-2xl bg-gray-50 text-[10px] font-black text-blue-600 uppercase tracking-widest">
            NODE ID: {user.branchId || 'GLOBAL_ROOT'}
          </div>
        </div>

        <div className="glass-card p-8 bg-white border-none shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <i className="fas fa-fingerprint text-xl"></i>
            </div>
            <h4 className="font-black uppercase text-xs tracking-widest">Безопасность</h4>
          </div>
          <button className="text-[10px] font-black uppercase text-indigo-600 border border-indigo-100 px-6 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
            Обновить ключ доступа
          </button>
        </div>
      </div>
    </div>
  );
};
