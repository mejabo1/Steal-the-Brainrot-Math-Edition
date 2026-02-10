
import React, { useState, useEffect } from 'react';
import { MathProblem, GameState } from '../types';
import { generateProblem } from '../services/mathGen';
import { BASE_QUESTION_TIME, BASE_MONEY_REWARD } from '../constants';
import { Timer, AlertCircle, CheckCircle2, Flame } from 'lucide-react';

interface MathGameProps {
  gameState: GameState;
  isPaused: boolean;
  onCorrectAnswer: (earned: number) => void;
  onWrongAnswer: () => void;
  onTimeUp: () => void;
}

export const MathGame: React.FC<MathGameProps> = ({ 
  gameState, 
  isPaused,
  onCorrectAnswer, 
  onWrongAnswer,
  onTimeUp
}) => {
  const [problem, setProblem] = useState<MathProblem>(generateProblem(0));
  const [timeLeft, setTimeLeft] = useState(BASE_QUESTION_TIME);
  const [maxTime, setMaxTime] = useState(BASE_QUESTION_TIME);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isShake, setIsShake] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Generate new problem based on total accumulated money (difficulty score)
  const nextProblem = () => {
    // Difficulty increases as you get richer
    const difficultyScore = gameState.money + (gameState.streak * 50); 
    setProblem(generateProblem(difficultyScore));
    setSelectedOption(null);
    
    // Calculate dynamic time:
    // HARD MODE: If money >= 1,000,000, base time drops to 10s (from 30s)
    let currentBaseTime = gameState.money >= 1000000 ? 10 : BASE_QUESTION_TIME;
    
    // No Rebirth Penalty anymore
    const calculatedTime = currentBaseTime + gameState.timerBonus;
    
    // Capping at 300s (5 mins)
    const finalTime = Math.min(300, calculatedTime);

    setTimeLeft(finalTime);
    setMaxTime(finalTime);
    setFeedback('none');
  };

  // Initial load
  useEffect(() => {
    nextProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer Logic
  useEffect(() => {
    if (feedback !== 'none' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, problem, isPaused]);

  const handleTimeUp = () => {
    setFeedback('wrong');
    onTimeUp();
    setTimeout(nextProblem, 1500);
  };

  const handleOptionClick = (option: string) => {
    if (feedback !== 'none' || isPaused) return;
    
    setSelectedOption(option);

    // Normalize for safety, though generator handles it
    const normalizedUser = option.replace(/\s/g, '').toLowerCase();
    const normalizedAnswer = problem.answer.replace(/\s/g, '').toLowerCase();

    if (normalizedUser === normalizedAnswer) {
        // Correct
        setFeedback('correct');
        // Calculate Money
        const base = BASE_MONEY_REWARD + gameState.baseMoney;
        const streakBonus = Math.min(gameState.streak, 10) * gameState.streakBonusMult;
        const total = Math.round((base * gameState.multiplier) + streakBonus);
        
        onCorrectAnswer(total);
        setTimeout(nextProblem, 800);
    } else {
        // Wrong
        setFeedback('wrong');
        setIsShake(true);
        onWrongAnswer();
        setTimeout(() => setIsShake(false), 500);
        setTimeout(nextProblem, 1500);
    }
  };

  // Dynamic progress bar color
  const timerPercentage = (timeLeft / maxTime) * 100;
  let timerColor = 'bg-green-500';
  if (timerPercentage < 50) timerColor = 'bg-yellow-500';
  if (timerPercentage < 20) timerColor = 'bg-red-500';
  
  // Hard Mode Indicator Color
  const isHardMode = gameState.money >= 1000000;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 sm:p-8">
      {/* Timer Bar */}
      <div className={`w-full max-w-lg h-3 rounded-full mb-8 overflow-hidden relative backdrop-blur-sm ${isHardMode ? 'bg-red-900/30' : 'bg-black/20'}`}>
        <div 
            className={`h-full transition-all duration-1000 ease-linear ${timerColor}`} 
            style={{ width: `${timerPercentage}%` }}
        />
        {gameState.consecutiveTimeouts > 0 && (
            <div className="absolute top-0 right-0 h-full flex items-center pr-1">
                {Array.from({length: gameState.consecutiveTimeouts}).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-red-600 ml-1 animate-pulse" />
                ))}
            </div>
        )}
      </div>

      {/* Card */}
      <div className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 ${isHardMode ? 'border-red-500/50 shadow-red-500/20' : 'border-white/20'} p-8 sm:p-12 text-center transition-transform ${isShake ? 'shake' : ''}`}>
        
        {/* Feedback Overlay */}
        {feedback !== 'none' && (
             <div className={`absolute inset-0 rounded-3xl flex items-center justify-center z-10 bg-opacity-95 backdrop-blur-sm ${feedback === 'correct' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <div className="pop flex flex-col items-center">
                    {feedback === 'correct' ? <CheckCircle2 size={64} strokeWidth={3} /> : <AlertCircle size={64} strokeWidth={3} />}
                    <span className="text-3xl font-black mt-4 tracking-tight">
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                    </span>
                    {feedback === 'wrong' && (
                        <span className="text-xl font-medium mt-2 text-slate-600">Answer: {problem.answer}</span>
                    )}
                </div>
             </div>
        )}

        <div className="mb-6 text-slate-400 font-bold tracking-widest text-sm uppercase flex justify-between items-center">
            <span className="flex items-center gap-2">
                Translate Expression
                {isHardMode && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Flame size={10} fill="currentColor"/> HARD MODE</span>}
            </span>
            {gameState.consecutiveTimeouts === 2 && (
                <span className="text-red-500 animate-pulse flex items-center gap-1"><AlertCircle size={14}/> Danger</span>
            )}
        </div>
        
        <div className="text-4xl sm:text-5xl font-black text-slate-800 mb-10 leading-snug min-h-[5rem] flex items-center justify-center">
          "{problem.question}"
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {problem.options.map((option, index) => {
                const isSelected = selectedOption === option;
                return (
                    <button
                        key={index}
                        disabled={isPaused || feedback !== 'none'}
                        onClick={() => handleOptionClick(option)}
                        className={`
                            h-20 rounded-2xl text-2xl font-bold font-mono transition-all btn-press shadow-md
                            ${isSelected 
                                ? 'bg-slate-800 text-white scale-95' 
                                : 'bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-600 border-2 border-slate-200 hover:border-blue-200'
                            }
                            ${isHardMode ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' : ''}
                        `}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Timer Text */}
      <div className={`mt-8 flex items-center gap-2 font-bold text-lg ${timeLeft <= 5 ? 'text-red-200 animate-pulse' : 'text-indigo-100'}`}>
        <Timer size={20} />
        <span>{timeLeft}s remaining</span>
      </div>
      
      {gameState.consecutiveTimeouts > 0 && (
          <div className="mt-4 text-red-600 text-xs font-black uppercase tracking-widest bg-red-50 border border-red-100 px-4 py-2 rounded-full animate-bounce">
              ⚠️ {3 - gameState.consecutiveTimeouts} timeouts until item loss!
          </div>
      )}
    </div>
  );
};
