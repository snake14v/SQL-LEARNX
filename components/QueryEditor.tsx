import React, { useState } from 'react';
import { executeVirtualSQL } from '../services/geminiService';
import { QueryResult } from '../types';

interface QueryEditorProps {
  theme: any;
  initialQuery?: string;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ theme }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRun = async () => {
    if (!query.trim()) return;
    setIsExecuting(true);
    setResult(null);
    try {
      const data = await executeVirtualSQL(query, theme);
      setResult(data);
    } catch (e) {
      setResult({ columns: [], rows: [], error: "Execution failed." });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      <div className="flex-shrink-0 space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-black uppercase tracking-wider text-emerald-400">
            💻 Code Zone
          </label>
          <span className="text-xs font-bold opacity-60 text-slate-400">
            DB: School Records
          </span>
        </div>
        
        <div className="relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SELECT * FROM students..."
            className="relative w-full h-40 p-4 rounded-lg font-mono text-base resize-none focus:outline-none focus:ring-2 transition-all shadow-inner bg-slate-900 text-white border-slate-700 focus:ring-emerald-500 placeholder-slate-600 border"
            spellCheck={false}
          />
          <button
            onClick={handleRun}
            disabled={isExecuting || !query.trim()}
            className="absolute bottom-3 right-3 px-6 py-2 rounded-full text-sm font-black shadow-lg transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 text-slate-900 hover:bg-emerald-400"
          >
            {isExecuting ? 'Running...' : '▶ RUN'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 relative">
        {result?.error ? (
          <div className="p-4 flex items-start space-x-3 text-red-300 bg-red-900/20 h-full">
             <span className="text-2xl">🚫</span>
             <div>
               <p className="font-bold">Syntax Error</p>
               <p className="font-mono text-sm">{result.error}</p>
             </div>
          </div>
        ) : result && result.columns.length > 0 ? (
          <div className="h-full overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800 text-emerald-200 sticky top-0">
                <tr>
                  {result.columns.map((col, idx) => (
                    <th key={idx} className="p-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b border-slate-700">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm font-mono text-slate-300">
                {result.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="p-3 whitespace-nowrap">
                        {cell === null ? <span className="text-gray-500 italic">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-4 text-slate-400">
            <div className="text-5xl animate-bounce">📊</div>
            <p className="text-sm font-bold uppercase tracking-widest">Results here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryEditor;
