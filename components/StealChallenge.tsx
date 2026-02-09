
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { generateProblem } from '../services/mathGen';
import { SHOP_ITEMS } from '../constants';
import { Timer, SendHorizontal, AlertCircle, CheckCircle2, Siren, Zap } from 'lucide-react';

interface StealChallengeProps {
  targetItem: { botName: string; itemId: string };
  difficulty: number;
  initialTime: number;
  onComplete: (success: boolean) => void;
}

export const StealChallenge: React.FC<StealChallengeProps> = ({ targetItem, difficulty, initialTime, onComplete }) => {
  const [problem, setProblem] = useState<MathProblem>(generateProblem(difficulty)); 
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(initialTime); 
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  const item = SHOP_ITEMS.find(i => i.id === targetItem.itemId);

  useEffect(() => {
    inputRef.current?.focus();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFail = () => {
    setFeedback('wrong');
    setTimeout(() => onComplete(false), 1500);
  };

  const handleSuccess = () => {
    setFeedback('correct');
    setTimeout(() => onComplete(true), 1500);
  };

  const normalizeInput = (input: string): string => {
      return input
        .replace(/\s/g, '')
        .toLowerCase()
        .replace(/(\d)\*([a-z])/g, '$1$2')
        .replace(/([a-z])\*(\d)/g, '$2$1');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (feedback !== 'none') return;

    const normalizedUser = normalizeInput(userAnswer);
    const normalizedAnswer = normalizeInput(problem.answer);

    if (normalizedUser === normalizedAnswer) {
        handleSuccess();
    } else {
        handleFail();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md animate-in fade-in duration-300" />
      
      <div className="relative bg-slate-900 border-4 border-red-500 rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in duration-300 text-white overflow-hidden">
        
        {/* Siren Effect Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

        <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-red-400 font-black text-2xl uppercase tracking-widest animate-pulse mb-2">
                <Siren size={32} />
                Steal in Progress
                <Siren size={32} />
            </div>
            <p className="text-slate-300 font-bold">
                Solve quickly to steal from <span className="text-white">{targetItem.botName}</span>!
            </p>
            {item && (
                <div className={`mt-4 bg-slate-800 p-2 pr-4 rounded-xl inline-flex items-center gap-2 border border-slate-700 ${item.rarity === 'mythic' ? 'ring-2 ring-red-500 animate-pulse' : ''}`}>
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="text-left">
                        <div className="font-bold text-sm leading-tight">{item.name}</div>
                        <div className="text-[10px] uppercase font-black text-slate-400">{item.rarity}</div>
                    </div>
                </div>
            )}
        </div>

        {/* Game Area */}
        <div className="bg-slate-800 rounded-2xl p-6 text-center border-2 border-slate-700 mb-6 relative">
            
            {feedback !== 'none' && (
                <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center z-10 bg-opacity-95 ${feedback === 'correct' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {feedback === 'correct' ? (
                        <>
                            <CheckCircle2 size={64} className="text-white mb-2" />
                            <span className="text-3xl font-black text-white uppercase">STOLEN!</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle size={64} className="text-white mb-2" />
                            <span className="text-3xl font-black text-white uppercase">CAUGHT!</span>
                            <span className="text-white/80 font-bold mt-1">Ans: {problem.answer}</span>
                        </>
                    )}
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Translate & Solve</div>
                 {initialTime <= 5 && <div className="text-xs font-bold text-red-400 flex items-center gap-1"><Zap size={12}/> EXTREME SPEED</div>}
            </div>
            
            <div className="text-3xl font-black text-white mb-6 font-mono">
                "{problem.question}"
            </div>

            <form onSubmit={handleSubmit}>
                <input 
                    ref={inputRef}
                    type="text" 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full h-14 bg-slate-900 border-2 border-slate-600 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-red-500 font-mono mb-4"
                    placeholder="Type answer..."
                    autoFocus
                />
                <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden relative">
                    <div 
                        className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-600' : 'bg-yellow-500'}`}
                        style={{ width: `${(timeLeft / initialTime) * 100}%` }}
                    />
                     <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">
                        {timeLeft}s
                     </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
