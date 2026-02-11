
import React, { useEffect, useState, useRef } from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { generateProblem } from '../services/mathGen';
import { MathProblem } from '../types';

interface BaseDefenseProps {
  expiresAt: number;
  onDefend: () => void;
  difficulty: number;
  isPaused: boolean;
}

export const BaseDefense: React.FC<BaseDefenseProps> = ({ expiresAt, onDefend, difficulty, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [problem] = useState<MathProblem>(generateProblem(difficulty));
  const [isWrong, setIsWrong] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeft(remaining);
    }, 50);
    return () => clearInterval(timer);
  }, [expiresAt, isPaused]);

  const secondsDisplay = (timeLeft / 1000).toFixed(1);
  const isUrgent = timeLeft < 3000;
  const initialDuration = useRef(Math.max(0, expiresAt - Date.now()));

  const handleOptionClick = (option: string) => {
    if (isPaused) return;

    setSelectedOption(option);
    
    const normalizedUser = option.replace(/\s/g, '').toLowerCase();
    const normalizedAnswer = problem.answer.replace(/\s/g, '').toLowerCase();

    if (normalizedUser === normalizedAnswer) {
        onDefend();
    } else {
        setIsWrong(true);
        setTimeout(() => {
            setIsWrong(false);
            setSelectedOption(null);
        }, 500);
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

        <div className={`bg-slate-900 border-4 ${isUrgent ? 'border-red-500' : 'border-slate-700'} rounded-3xl p-6 w-full shadow-2xl relative overflow-hidden transition-all ${isWrong ? 'animate-shake border-red-600 bg-red-900/40' : ''}`}>
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

                <div className="grid grid-cols-2 gap-3">
                    {problem.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className={`
                                    h-16 rounded-xl text-xl font-bold font-mono transition-all btn-press shadow-md flex items-center justify-center
                                    ${isSelected && isWrong
                                        ? 'bg-red-600 text-white border-2 border-red-400' 
                                        : 'bg-slate-800 border-2 border-slate-600 text-white hover:bg-blue-600 hover:border-blue-400'
                                    }
                                `}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-4 text-center text-xs font-bold text-slate-400 uppercase">
                    Time Left: {secondsDisplay}s
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
