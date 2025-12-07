import React from 'react';
import { AIResponse } from '../types';

interface AIHostProps {
  response: AIResponse | null;
  loading: boolean;
}

const AIHost: React.FC<AIHostProps> = ({ response, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8 space-y-4 min-h-[120px]">
      <div className="relative">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl ${loading ? 'animate-pulse-fast' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
      </div>

      <div className="max-w-xs text-center">
        {loading ? (
          <span className="inline-block text-slate-400 text-sm animate-pulse">Thinking...</span>
        ) : response ? (
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 px-4 py-3 rounded-2xl rounded-t-none animate-fade-in relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rotate-45 border-l border-t border-slate-700"></div>
            <p className={`text-sm font-medium ${
              response.mood === 'celebratory' ? 'text-yellow-400' : 
              response.mood === 'sassy' ? 'text-pink-400' : 
              'text-blue-300'
            }`}>
              "{response.text}"
            </p>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">I'm watching your moves...</p>
        )}
      </div>
    </div>
  );
};

export default AIHost;