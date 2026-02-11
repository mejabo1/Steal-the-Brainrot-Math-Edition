
import React from 'react';
import { Crown, AlertTriangle, TrendingUp, Check, X, Terminal, Lock } from 'lucide-react';
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

  // Check if this is the special Admin Panel rebirth
  const isAdminUnlock = nextRebirth === 8;
  const showAdminTeaser = nextRebirth < 8;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" />
      
      {/* Content */}
      <div className={`relative border-4 rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in duration-300 text-white overflow-hidden ${isAdminUnlock ? 'bg-black border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'bg-gradient-to-br from-indigo-900 to-purple-900 border-yellow-500'}`}>
        
        {/* Glow Effects */}
        <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] pointer-events-none ${isAdminUnlock ? 'from-green-500/10 via-transparent to-transparent' : 'from-yellow-500/10 via-transparent to-transparent'}`} />

        <div className="relative z-10 text-center">
            <div className="mb-6 flex justify-center">
                <div className={`p-4 rounded-full ${isAdminUnlock ? 'bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.8)]' : 'bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]'}`}>
                    {isAdminUnlock ? <Terminal size={48} className="text-white" /> : <Crown size={48} className="text-white fill-white" />}
                </div>
            </div>

            <h1 className={`text-4xl font-black text-transparent bg-clip-text uppercase tracking-tighter mb-2 drop-shadow-md ${isAdminUnlock ? 'bg-gradient-to-b from-green-300 to-green-600' : 'bg-gradient-to-b from-yellow-200 to-yellow-600'}`}>
                Rebirth {nextRebirth}?
            </h1>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-6 backdrop-blur-sm">
                <p className={`text-lg font-bold mb-1 ${isAdminUnlock ? 'text-green-300' : 'text-yellow-200'}`}>Cost: ${cost.toLocaleString()}</p>
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
                        {isAdminUnlock && (
                            <li className="text-green-300 font-black mt-2 text-sm animate-pulse">🔓 ADMIN PANEL</li>
                        )}
                        {!isAdminUnlock && <li className="text-yellow-300 font-bold mt-1">+1 Inventory Slot</li>}
                    </ul>
                </div>
            </div>

            {/* Admin Panel Teaser Advertisement */}
            {showAdminTeaser && (
                <div className="mb-6 bg-black/40 border border-green-500/30 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden group">
                     {/* Subtle matrix-like glow effect */}
                     <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                     
                    <div className="bg-green-900/30 border border-green-500/20 p-2.5 rounded-lg shrink-0">
                        <Lock size={20} className="text-green-400" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <div className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                            <Terminal size={10} />
                            Upcoming Unlock
                        </div>
                        <div className="text-xs font-bold text-slate-200 truncate">
                            Admin Panel Access
                        </div>
                         <div className="text-[10px] font-medium text-slate-400">
                            Grants: God Mode, Free Cash & More
                        </div>
                    </div>
                    <div className="text-right pl-2 border-l border-white/10 shrink-0">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Unlock at
                        </div>
                        <div className="text-sm font-black text-green-400">
                            Rank 8
                        </div>
                    </div>
                </div>
            )}

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
                            ? (isAdminUnlock ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-yellow-500 hover:bg-yellow-400 text-yellow-950 shadow-[0_0_20px_rgba(234,179,8,0.4)]')
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
