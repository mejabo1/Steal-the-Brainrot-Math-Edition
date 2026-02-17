
import React from 'react';
import { Terminal, Shield, DollarSign, RefreshCw, Skull, X, Zap, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onAction: (action: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onAction }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-slate-900 border-2 border-green-500/50 rounded-lg max-w-md w-full p-6 shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-in zoom-in duration-200 font-mono">
        <div className="flex justify-between items-center mb-6 border-b border-green-500/30 pb-4">
            <h2 className="text-xl font-bold text-green-500 flex items-center gap-2 tracking-wider">
                <Terminal size={20} />
                ADMIN_PANEL_V8.0
            </h2>
            <button onClick={onClose} className="text-green-500/50 hover:text-green-400">
                <X size={20} />
            </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => onAction('add_money_small')}
                className="bg-green-900/20 hover:bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded text-xs font-bold flex flex-col items-center gap-2 transition-all active:scale-95"
            >
                <DollarSign size={16} />
                +1,000,000 CASH
            </button>

            <button 
                onClick={() => onAction('add_money_large')}
                className="bg-green-900/20 hover:bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded text-xs font-bold flex flex-col items-center gap-2 transition-all active:scale-95"
            >
                <DollarSign size={16} />
                +100,000,000 CASH
            </button>

            <button 
                onClick={() => onAction('infinite_shield')}
                className="bg-blue-900/20 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 p-3 rounded text-xs font-bold flex flex-col items-center gap-2 transition-all active:scale-95"
            >
                <Shield size={16} />
                TOGGLE GOD MODE
            </button>

             <button 
                onClick={() => onAction('trigger_attack')}
                className="bg-red-900/20 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded text-xs font-bold flex flex-col items-center gap-2 transition-all active:scale-95"
            >
                <Skull size={16} />
                TRIGGER ATTACK
            </button>
            
            <button 
                onClick={() => onAction('give_random_item')}
                className="bg-purple-900/20 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 p-3 rounded text-xs font-bold flex flex-col items-center gap-2 transition-all active:scale-95"
            >
                <Zap size={16} />
                GIVE MYTHIC ITEM
            </button>

            <button 
                onClick={() => onAction('clear_bots')}
                className="bg-orange-900/20 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 p-3 rounded text-xs font-bold flex flex-col items-center gap-2 transition-all active:scale-95"
            >
                <RefreshCw size={16} />
                RESET BOTS
            </button>
            
            {/* Full Reset Button - Spans full width */}
            <button 
                onClick={() => onAction('hard_reset')}
                className="col-span-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-500 p-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 mt-2"
            >
                <Trash2 size={16} />
                FULL RESET SAVE (DANGER)
            </button>
        </div>

        <div className="mt-4 text-[10px] text-green-500/40 text-center uppercase tracking-widest">
            Authorized Access Only • ID: ROOT_USER
        </div>
      </div>
    </div>
  );
};
