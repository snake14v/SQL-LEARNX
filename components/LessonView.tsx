import React from 'react';
import { LessonContent } from '../types';

interface LessonViewProps {
  content: LessonContent | null;
  isLoading: boolean;
  theme: any;
}

const LessonView: React.FC<LessonViewProps> = ({ content, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-pulse space-y-4">
        <div className="text-6xl">🚀</div>
        <div className="text-2xl font-bold text-emerald-400">
          Loading Level...
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center opacity-50 text-xl font-medium text-white">
        👈 Pick a lesson to start!
      </div>
    );
  }

  const cardClass = "rounded-xl p-6 shadow-xl mb-6 backdrop-blur-sm border bg-slate-800/50 border-slate-600 text-slate-100";
  const headerClass = "text-xl font-bold mb-3 uppercase tracking-wide text-emerald-400";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="text-center py-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          {content.title}
        </h1>
      </div>

      <div className={cardClass}>
        <h3 className={headerClass}>💡 The Idea</h3>
        <p className="leading-relaxed text-lg">{content.analogy}</p>
      </div>

      <div className={cardClass}>
        <h3 className={headerClass}>🛠️ How It Works</h3>
        <p className="leading-relaxed whitespace-pre-line text-lg">{content.explanation}</p>
      </div>

      <div className={cardClass}>
        <h3 className={headerClass}>👀 Example</h3>
        <p className="mb-4 text-lg">{content.exampleExplanation}</p>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-25"></div>
          <pre className="relative rounded-lg bg-slate-900 p-4 overflow-x-auto border border-slate-700">
            <code className="text-emerald-300 font-mono text-base font-bold">
              {content.exampleQuery}
            </code>
          </pre>
        </div>
      </div>

      <div className="p-6 rounded-xl border-l-8 shadow-lg bg-emerald-900/30 border-emerald-500">
        <h4 className="font-black uppercase text-sm tracking-wider mb-2 text-emerald-400">
          🔥 Your Challenge
        </h4>
        <p className="font-bold text-xl text-white">{content.challengePrompt}</p>
      </div>
    </div>
  );
};

export default LessonView;
