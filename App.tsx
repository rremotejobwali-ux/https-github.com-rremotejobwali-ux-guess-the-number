import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, GuessRecord, AIResponse, GuessResult } from './types';
import { generateGameCommentary } from './services/geminiService';
import NumberGrid from './components/NumberGrid';
import AIHost from './components/AIHost';

const App: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  const startNewGame = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 10) + 1;
    setTargetNumber(newTarget);
    setGameStatus(GameStatus.PLAYING);
    setGuesses([]);
    setAiResponse({ text: "I've picked a number between 1 and 10. Can you guess it?", mood: 'neutral' });
    setLoadingAI(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = async (guessedNumber: number) => {
    if (gameStatus !== GameStatus.PLAYING) return;

    let result: GuessResult;
    if (guessedNumber === targetNumber) {
      result = 'correct';
      setGameStatus(GameStatus.WON);
    } else if (guessedNumber < targetNumber) {
      result = 'low';
    } else {
      result = 'high';
    }

    const newGuess: GuessRecord = {
      number: guessedNumber,
      result,
      id: Date.now().toString(),
    };

    setGuesses((prev) => [...prev, newGuess]);

    // AI Feedback
    setLoadingAI(true);
    const feedback = await generateGameCommentary(
      targetNumber,
      guessedNumber,
      result,
      guesses.length + 1
    );
    setAiResponse(feedback);
    setLoadingAI(false);
  };

  const getResultColor = (result: GuessResult) => {
    switch (result) {
      case 'correct': return 'text-green-400';
      case 'low': return 'text-blue-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md bg-slate-900/50 rounded-3xl p-6 border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 tracking-tight">
            Guess the Number
          </h1>
          <p className="text-slate-500 text-sm mt-2">Range: 1 to 10</p>
        </header>

        {/* AI Host */}
        <AIHost response={aiResponse} loading={loadingAI} />

        {/* Game Area */}
        <div className="mb-8">
          {gameStatus === GameStatus.WON ? (
            <div className="text-center animate-fade-in py-8">
              <div className="text-6xl mb-4 animate-bounce-short">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">You Won!</h2>
              <p className="text-slate-400 mb-6">The number was {targetNumber}.</p>
              <button
                onClick={startNewGame}
                className="bg-green-500 hover:bg-green-600 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Play Again
              </button>
            </div>
          ) : (
            <NumberGrid
              onGuess={handleGuess}
              disabled={loadingAI}
              previousGuesses={guesses.map((g) => g.number)}
            />
          )}
        </div>

        {/* History */}
        {guesses.length > 0 && (
          <div className="mt-8 border-t border-slate-800 pt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">History</h3>
            <div className="flex flex-col-reverse gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {guesses.map((guess) => (
                <div key={guess.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg text-sm border border-slate-700/50">
                  <span className="text-slate-300 font-medium">Guessed: <span className="text-white">{guess.number}</span></span>
                  <span className={`font-bold ${getResultColor(guess.result)} uppercase text-xs tracking-wide`}>
                    {guess.result === 'correct' ? 'Correct' : `Too ${guess.result}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-slate-600 text-xs text-center">
        Powered by React & Gemini AI
      </div>
    </div>
  );
};

export default App;