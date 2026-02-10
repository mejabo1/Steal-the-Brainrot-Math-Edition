
import React from 'react';
import { GameState } from '../types';
import { SHOP_ITEMS, getPassiveIncome } from '../constants';
import { Flame, Shield, TrendingUp, Clock, Zap } from 'lucide-react';

interface StatusHeaderProps {
  gameState: GameState;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({ gameState }) => {
  const totalPassiveIncome = gameState.inventory.reduce((sum, id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return sum + (item ? getPassiveIncome(item.price) : 0);
  }, 0);

  return (
    <div className="w-full bg-slate-900 text-white px-4 py-3 shadow-md z-50 flex items-center justify-end gap-6 overflow-x-auto whitespace-nowrap">
        {/* Stats Row */}
        <div className="flex items-center gap-4 md:gap-8 text-sm font-medium">
            {/* Passive Income */}
            {totalPassiveIncome > 0 && (
                <div className="flex items-center gap-1.5 text-green-400 animate-pulse">
                    <Zap size={16} fill="currentColor" />
                    <span>+${totalPassiveIncome.toLocaleString()}/s</span>
                </div>
            )}

             {/* Streak */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${gameState.streak > 5 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <Flame size={14} className={gameState.streak > 5 ? 'animate-pulse' : ''} fill={gameState.streak > 5 ? "currentColor" : "none"} />
                <span className="font-semibold">Streak: {gameState.streak}</span>
            </div>

            {/* Active Buffs (Conditional) */}
            {gameState.multiplier > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 text-purple-400">
                    <TrendingUp size={16} />
                    <span>{gameState.multiplier.toFixed(2)}x Cash</span>
                </div>
            )}

            {gameState.shieldActive && (
                <div className="flex items-center gap-1.5 text-blue-400 animate-pulse">
                    <Shield size={16} fill="currentColor" />
                    <span>Shielded</span>
                </div>
            )}
             
            {gameState.timerBonus > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
                    <Clock size={16} />
                    <span>+{gameState.timerBonus}s</span>
                </div>
            )}
        </div>
    </div>
  );
};
