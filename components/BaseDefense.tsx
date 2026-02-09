
import React, { useEffect, useState, useRef } from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { generateProblem } from '../services/mathGen';
import { MathProblem } from '../types';

interface BaseDefenseProps {
  expiresAt: number;
  onDefend: () => void;
  difficulty: number;
}

export const BaseDefense: React.FC<BaseDefenseProps> = ({ expiresAt, onDefend, difficulty }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [problem] = useState<MathProblem>(generateProblem(difficulty));
  const [userAnswer, setUserAnswer] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const timer = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeft(remaining);
    }, 50);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const secondsDisplay = (timeLeft / 1000).toFixed(1);
  const isUrgent = timeLeft < 3000;
  const initialDuration = useRef(Math.max(0, expiresAt - Date.now()));

  const normalizeInput = (input: string): string => {
      return input
        .replace(/\s/g, '')
        .toLowerCase()
        .replace(/(\d)\*([a-z])/g, '$1$2')
        .replace(/([a-z])\*(\d)/g, '$2$1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUser = normalizeInput(userAnswer);
    const normalizedAnswer = normalizeInput(problem.answer);

    if (normalizedUser === normalizedAnswer) {
        onDefend();
    } else {
        setIsWrong(true);
        setUserAnswer('');
        setTimeout(() => setIsWrong(false), 500);
        inputRef.current?.focus();
    }
  };

  // Calculate percentage for bar
  const percentage = Math.min(100, Math.max(0, (timeLeft / initialDuration.current) * 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-900/90 animate-pulse backdrop-blur-sm" />
      
      <div className="relative flex flex-col items-center animate-bounce-short w-full max-w-md z-10">
        <div className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] tracking-tighter uppercase mb-2 flex items-center justify-center gap-2">
                <ShieldAlert size={36} className="text-red-500" />
                Base Under Attack!
                <ShieldAlert size={36} className="text-red-500" />
            </h1>
            <p className="text-red-200 text-lg font-bold uppercase tracking-widest bg-red-950/50 px-4 py-1 rounded-full inline-block border border-red-500/50">
                Solve to Shield!
            </p>
        </div>

        <div className={`bg-slate-900 border-4 ${isUrgent ? 'border-red-500' : 'border-slate-700'} rounded-3xl p-6 w-full shadow-2xl relative overflow-hidden`}>
            {/* Timer Bar */}
             <div className="absolute top-0 left-0 w-full h-2 bg-slate-800">
                <div 
                    className={`h-full transition-all duration-75 linear ${isUrgent ? 'bg-red-500' : 'bg-yellow-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="text-center mt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Translate & Solve</div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-6 font-mono leading-tight">
                    "{problem.question}"
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className={`w-full h-14 bg-slate-800 border-2 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-blue-500 font-mono mb-4 transition-all ${isWrong ? 'border-red-500 animate-shake bg-red-900/20' : 'border-slate-600'}`}
                        placeholder="Answer..."
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
                        <Shield size={20} />
                        SHIELD ({secondsDisplay}s)
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};
