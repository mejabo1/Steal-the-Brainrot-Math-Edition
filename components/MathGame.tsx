
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem, GameState } from '../types';
import { generateProblem } from '../services/mathGen';
import { BASE_QUESTION_TIME, BASE_MONEY_REWARD } from '../constants';
import { Timer, SendHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(BASE_QUESTION_TIME);
  const [maxTime, setMaxTime] = useState(BASE_QUESTION_TIME);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isShake, setIsShake] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate new problem based on total accumulated money (difficulty score)
  const nextProblem = () => {
    const difficultyScore = gameState.money + (gameState.streak * 50); 
    setProblem(generateProblem(difficultyScore));
    setUserAnswer('');
    
    // Calculate dynamic time:
    // Base 15s. Infinite timer buff checks for value >= 60.
    const calculatedTime = BASE_QUESTION_TIME + gameState.timerBonus;
    
    // Check for "infinite" timer buff (value 60 from constant, usually implies super long)
    const finalTime = gameState.timerBonus >= 60 ? 60 : calculatedTime;

    setTimeLeft(finalTime);
    setMaxTime(finalTime);
    setFeedback('none');
    
    // Focus input
    setTimeout(() => {
        if(inputRef.current && !isPaused) inputRef.current.focus();
    }, 50);
  };

  // Initial load
  useEffect(() => {
    nextProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-focus when unpaused
  useEffect(() => {
    if (!isPaused && feedback === 'none' && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isPaused, feedback]);

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

  const normalizeInput = (input: string): string => {
      return input
        .replace(/\s/g, '') // Remove spaces
        .toLowerCase()
        // Convert explicit multiplication with variable to implicit (2*x -> 2x)
        .replace(/(\d)\*([a-z])/g, '$1$2')
        // Convert reverse implicit to standard (x*2 -> 2x)
        .replace(/([a-z])\*(\d)/g, '$2$1');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (feedback !== 'none' || isPaused) return;

    const normalizedUser = normalizeInput(userAnswer);
    const normalizedAnswer = normalizeInput(problem.answer);

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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 sm:p-8">
      {/* Timer Bar */}
      <div className="w-full max-w-md h-4 bg-gray-200 rounded-full mb-6 overflow-hidden border-2 border-black/10 relative">
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
      <div className={`relative w-full max-w-md bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.1)] border-4 border-slate-100 p-8 text-center transition-transform ${isShake ? 'shake' : ''}`}>
        
        {/* Feedback Overlay */}
        {feedback !== 'none' && (
             <div className={`absolute inset-0 rounded-[20px] flex items-center justify-center z-10 bg-opacity-90 backdrop-blur-sm ${feedback === 'correct' ? 'bg-green-100/80 text-green-600' : 'bg-red-100/80 text-red-600'}`}>
                <div className="pop flex flex-col items-center">
                    {feedback === 'correct' ? <CheckCircle2 size={64} strokeWidth={3} /> : <AlertCircle size={64} strokeWidth={3} />}
                    <span className="text-3xl font-black mt-2 uppercase tracking-wide">
                        {feedback === 'correct' ? 'Nice!' : 'Oof!'}
                    </span>
                    {feedback === 'wrong' && (
                        <span className="text-xl font-bold mt-2 text-slate-700">Answer: {problem.answer}</span>
                    )}
                </div>
             </div>
        )}

        <div className="mb-2 text-slate-400 font-bold tracking-widest text-sm uppercase flex justify-between">
            <span>Translate This</span>
            {gameState.consecutiveTimeouts === 2 && (
                <span className="text-red-500 animate-pulse">⚠️ DANGER</span>
            )}
        </div>
        <div className="text-3xl sm:text-4xl font-black text-slate-800 mb-8 font-mono tracking-tight leading-tight min-h-[4rem] flex items-center justify-center">
          "{problem.question}"
        </div>

        <form onSubmit={handleSubmit} className="relative w-full">
            <input 
                ref={inputRef}
                type="text" 
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="e.g. 2x+5"
                disabled={isPaused}
                className="w-full h-16 bg-slate-100 rounded-xl text-center text-3xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-400 border-2 border-transparent transition-all placeholder-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                autoFocus={!isPaused}
            />
            <button 
                type="submit"
                disabled={isPaused}
                className="mt-4 w-full h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none text-white font-black text-xl rounded-xl btn-press shadow-[0_4px_0_rgb(29,78,216)] border-2 border-blue-600 flex items-center justify-center gap-2"
            >
                <span>SUBMIT</span>
                <SendHorizontal size={20} />
            </button>
        </form>
      </div>

      {/* Timer Text */}
      <div className={`mt-6 flex items-center gap-2 font-bold text-lg ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
        <Timer size={20} />
        <span>{timeLeft}s remaining</span>
      </div>
      
      {gameState.consecutiveTimeouts > 0 && (
          <div className="mt-2 text-red-500 text-xs font-black uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full">
              {3 - gameState.consecutiveTimeouts} timeouts until item loss!
          </div>
      )}
    </div>
  );
};
