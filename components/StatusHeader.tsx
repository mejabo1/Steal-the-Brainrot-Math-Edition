
import React from 'react';
import { GameState } from '../types';
import { SHOP_ITEMS, getPassiveIncome } from '../constants';
import { Flame, Shield, TrendingUp, Clock, Zap, Coins, Crown, Pause, Play } from 'lucide-react';

interface StatusHeaderProps {
  gameState: GameState;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({ gameState, isPaused, onTogglePause }) => {
  const totalPassiveIncome = gameState.inventory.reduce((sum, id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return sum + (item ? getPassiveIncome(item.price) : 0);
  }, 0);

  return (
    <div className="w-full bg-slate-900 text-white px-4 py-3 shadow-md z-50 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap custom-scrollbar">
        
        {/* Left Side: Money & Passive Income */}
        <div className="flex items-center gap-4">
            {/* Money Display - Gold */}
            <div className="flex items-center gap-2 text-yellow-400 font-black text-xl tracking-tight filter drop-shadow-md">
                <Coins size={24} fill="currentColor" className="text-yellow-500" />
                <span>${gameState.money.toLocaleString()}</span>
            </div>

            {/* Passive Income */}
            {totalPassiveIncome > 0 && (
                <div className="flex items-center gap-1 text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded-lg border border-green-500/20">
                    <Zap size={14} fill="currentColor" />
                    <span>+${totalPassiveIncome.toLocaleString()}/s</span>
                </div>
            )}
        </div>

        {/* Right Side: Stats Row */}
        <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
             
             {/* Rebirth Rank */}
             <div className="flex items-center gap-1.5 text-yellow-500">
                 <Crown size={16} fill="currentColor" />
                 <span className="font-bold">Rank {gameState.rebirths}</span>
             </div>

             {/* Streak */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${gameState.streak > 5 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <Flame size={14} className={gameState.streak > 5 ? 'animate-pulse' : ''} fill={gameState.streak > 5 ? "currentColor" : "none"} />
                <span className="font-semibold hidden sm:inline">Streak: {gameState.streak}</span>
                <span className="font-semibold sm:hidden">{gameState.streak}</span>
            </div>

            {/* Active Buffs (Conditional) */}
            {gameState.multiplier > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 text-purple-400">
                    <TrendingUp size={16} />
                    <span>{gameState.multiplier.toFixed(2)}x</span>
                </div>
            )}

            {gameState.shieldActive && (
                <div className="flex items-center gap-1.5 text-blue-400 animate-pulse">
                    <Shield size={16} fill="currentColor" />
                    <span className="hidden sm:inline">Shielded</span>
                </div>
            )}
             
            {gameState.timerBonus > 0 && (
                <div className="hidden md:flex items-center gap-1.5 text-slate-300">
                    <Clock size={16} />
                    <span>+{gameState.timerBonus}s</span>
                </div>
            )}

            {/* Pause Button - UPDATED to be larger and distinct */}
            <button 
                onClick={onTogglePause}
                className={`
                    flex items-center gap-1.5 font-black uppercase tracking-wider text-xs px-4 py-2 rounded-xl border-2 transition-all btn-press shrink-0
                    ${isPaused 
                        ? 'bg-yellow-400 border-yellow-600 text-yellow-900 shadow-lg animate-pulse' 
                        : 'bg-red-600 border-red-800 text-white hover:bg-red-50 shadow-md'
                    }
                `}
                title={isPaused ? "Resume Game" : "Pause Game"}
            >
                {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>
        </div>
    </div>
  );
};
