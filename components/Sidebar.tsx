import React from 'react';
import { SQL_CURRICULUM } from '../constants';

interface SidebarProps {
  currentTheme: any; // Kept for compatibility but unused
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule }) => {
  return (
    <div className="w-64 flex-shrink-0 flex flex-col h-full border-r bg-slate-900 border-slate-700 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
          SQL School 🎓
        </h2>
        <p className="text-xs opacity-70 mt-1">Master Data like a Pro!</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {SQL_CURRICULUM.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onSelectModule(mod.id)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeModuleId === mod.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                : 'hover:bg-white/10 opacity-80 hover:opacity-100'
            }`}
          >
            {mod.title}
          </button>
        ))}
      </nav>
      
      <div className="p-4 text-xs text-center font-bold tracking-widest opacity-60 text-emerald-200">
        MADE BY VAISHAK NOT GEMINI
      </div>
    </div>
  );
};

export default Sidebar;
