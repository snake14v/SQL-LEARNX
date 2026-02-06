import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LessonView from './components/LessonView';
import QueryEditor from './components/QueryEditor';
import { LessonContent, SQLModule } from './types';
import { SQL_CURRICULUM } from './constants';
import { generateLesson } from './services/geminiService';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>(SQL_CURRICULUM[0].id);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const module = SQL_CURRICULUM.find(m => m.id === activeModuleId);
      if (module) {
        // null passed for theme as it is deprecated
        const content = await generateLesson(module.title, module.topics, null);
        setLessonContent(content);
      }
      setLoading(false);
    };

    fetchContent();
  }, [activeModuleId]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      <Sidebar 
        currentTheme={null} 
        activeModuleId={activeModuleId} 
        onSelectModule={setActiveModuleId} 
      />

      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">👨‍💻</span>
            <h1 className="font-extrabold tracking-tight text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Generic SQL Tutor
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
             <LessonView 
               content={lessonContent} 
               isLoading={loading} 
               theme={null} 
             />
          </div>

          <div className="md:w-[450px] lg:w-[550px] flex-shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/20 p-4">
             <QueryEditor theme={null} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
