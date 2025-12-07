import React from 'react';

interface NumberGridProps {
  onGuess: (num: number) => void;
  disabled: boolean;
  previousGuesses: number[];
}

const NumberGrid: React.FC<NumberGridProps> = ({ onGuess, disabled, previousGuesses }) => {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-3 max-w-sm mx-auto">
      {numbers.map((num) => {
        const isGuessed = previousGuesses.includes(num);
        return (
          <button
            key={num}
            onClick={() => onGuess(num)}
            disabled={disabled || isGuessed}
            className={`
              relative h-14 rounded-xl font-bold text-lg transition-all duration-200
              ${isGuessed 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed scale-95 border-2 border-slate-800' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50 hover:scale-105 active:scale-95 border-b-4 border-indigo-800 hover:border-indigo-700 active:border-b-0 active:translate-y-1'
              }
              ${disabled && !isGuessed ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
};

export default NumberGrid;