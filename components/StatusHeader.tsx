import React from 'react';
import { GameState } from '../types';
import { SHOP_ITEMS, getPassiveIncome } from '../constants';
import { Coins, Flame, Shield, TrendingUp, Clock, Zap } from 'lucide-react';

interface StatusHeaderProps {
  gameState: GameState;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({ gameState }) => {
  // Calculate total passive income
  const totalPassiveIncome = gameState.inventory.reduce((sum, id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return sum + (item ? getPassiveIncome(item.price) : 0);
  }, 0);

  return (
    <div className="w-full bg-slate-900 text-white p-3 shadow-md z-50 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
        {/* Money */}
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <Coins className="text-yellow-400" size={20} />
            <span className="font-black text-xl tracking-wide text-yellow-400">${gameState.money.toLocaleString()}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 md:gap-6">
            {/* Passive Income */}
            {totalPassiveIncome > 0 && (
                <div className="flex items-center gap-1.5 text-green-400 text-sm font-bold animate-pulse">
                    <Zap size={16} fill="currentColor" />
                    <span>+{totalPassiveIncome.toLocaleString()}/s</span>
                </div>
            )}

             {/* Streak */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${gameState.streak > 5 ? 'bg-orange-900/40 border-orange-500/50 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <Flame size={16} className={gameState.streak > 5 ? 'animate-pulse' : ''} />
                <span className="font-bold text-sm">Streak: {gameState.streak}</span>
            </div>

            {/* Active Buffs (Conditional) */}
            {gameState.multiplier > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 text-purple-400 text-sm font-bold">
                    <TrendingUp size={16} />
                    <span>{gameState.multiplier.toFixed(2)}x Cash</span>
                </div>
            )}

            {gameState.shieldActive && (
                <div className="flex items-center gap-1.5 text-blue-400 text-sm font-bold animate-pulse">
                    <Shield size={16} />
                    <span>Shield Up</span>
                </div>
            )}
             
            {gameState.timerBonus > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 text-blue-300 text-sm font-bold">
                    <Clock size={16} />
                    <span>+{gameState.timerBonus}s</span>
                </div>
            )}
        </div>
    </div>
  );
};