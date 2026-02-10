
import React from 'react';
import { Crown, AlertTriangle, TrendingUp, Check, X } from 'lucide-react';
import { REBIRTH_MULTIPLIER_BONUS, getRebirthCost } from '../constants';

interface RebirthModalProps {
  currentRebirths: number;
  money: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RebirthModal: React.FC<RebirthModalProps> = ({ currentRebirths, money, onConfirm, onCancel }) => {
  const nextRebirth = currentRebirths + 1;
  const cost = getRebirthCost(nextRebirth);
  const canAfford = money >= cost;

  // Stats
  const currentBonus = currentRebirths * REBIRTH_MULTIPLIER_BONUS;
  const nextBonus = nextRebirth * REBIRTH_MULTIPLIER_BONUS;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" />
      
      {/* Content */}
      <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 border-4 border-yellow-500 rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in duration-300 text-white overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 text-center">
            <div className="mb-6 flex justify-center">
                <div className="bg-yellow-500 p-4 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                    <Crown size={48} className="text-white fill-white" />
                </div>
            </div>

            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 uppercase tracking-tighter mb-2 drop-shadow-md">
                Rebirth {nextRebirth}?
            </h1>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-6 backdrop-blur-sm">
                <p className="text-lg font-bold text-yellow-200 mb-1">Cost: ${cost.toLocaleString()}</p>
                {!canAfford && (
                    <p className="text-xs text-red-300 font-bold uppercase tracking-widest bg-red-900/50 inline-block px-2 py-1 rounded">
                        (You need ${(cost - money).toLocaleString()} more)
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl flex flex-col items-center">
                    <AlertTriangle className="text-red-400 mb-2" size={24} />
                    <span className="text-xs font-bold text-red-200 uppercase tracking-widest mb-1">You Lose</span>
                    <ul className="text-xs font-medium text-red-100/80 text-center leading-relaxed">
                        <li>All Money</li>
                        <li>All Brainrot Items</li>
                        <li>Current Streak</li>
                    </ul>
                </div>

                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-xl flex flex-col items-center">
                    <TrendingUp className="text-green-400 mb-2" size={24} />
                    <span className="text-xs font-bold text-green-200 uppercase tracking-widest mb-1">You Gain</span>
                     <ul className="text-xs font-medium text-green-100/80 text-center leading-relaxed">
                        <li>Rank {nextRebirth} Crown</li>
                        <li><span className="text-white font-bold">+{REBIRTH_MULTIPLIER_BONUS}x</span> Permanent Multiplier</li>
                        <li>Current: {currentBonus.toFixed(1)}x → <span className="text-green-300 font-bold">{nextBonus.toFixed(1)}x</span></li>
                        <li className="text-yellow-300 font-bold mt-1">+1 Inventory Slot</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={onCancel}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl btn-press flex items-center justify-center gap-2"
                >
                    <X size={20} />
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    disabled={!canAfford}
                    className={`flex-1 font-bold py-3 rounded-xl btn-press flex items-center justify-center gap-2 transition-all
                        ${canAfford 
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-yellow-950 shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}
                    `}
                >
                    <Check size={20} />
                    {canAfford ? 'Rebirth Now' : 'Too Poor'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
