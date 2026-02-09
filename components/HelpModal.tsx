import React from 'react';
import { Calculator, ShoppingBag, Zap, Trophy, Swords } from 'lucide-react';

interface HelpModalProps {
  onStart: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-200 animate-in fade-in zoom-in duration-300 h-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-800 mb-2 uppercase tracking-tight">
                Steal the <span className="text-purple-600">Brainrot</span>
            </h1>
            <div className="bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-xs inline-block px-3 py-1 rounded-full">Algebra Edition</div>
        </div>

        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shrink-0">
                    <Calculator size={24} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Translate the Math</h3>
                    <div className="text-slate-500 text-sm font-semibold leading-tight mt-1 space-y-1">
                        <p>Read: "Three times <span className="text-purple-600 font-bold">a number</span>"</p>
                        <p>Type: <span className="font-mono bg-slate-200 px-1 rounded text-slate-700">3x</span> or <span className="font-mono bg-slate-200 px-1 rounded text-slate-700">3*x</span></p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="bg-green-100 p-3 rounded-xl text-green-600 shrink-0">
                    <ShoppingBag size={24} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Buy Brainrot Items</h3>
                    <p className="text-slate-500 text-sm font-semibold leading-tight">Use money to buy items. They give passive income and bonuses.</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="bg-red-100 p-3 rounded-xl text-red-600 shrink-0">
                    <Swords size={24} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Steal from Rivals</h3>
                    <p className="text-slate-500 text-sm font-semibold leading-tight">Check the left sidebar. Steal items from bots by solving hard problems. <span className="text-red-500 font-bold">Warning:</span> If you fail, they steal from you!</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600 shrink-0">
                    <Trophy size={24} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Fill Your Inventory</h3>
                    <p className="text-slate-500 text-sm font-semibold leading-tight">You have 8 slots. Collect the best items to maximize profits!</p>
                </div>
            </div>
        </div>

        <button 
            onClick={onStart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-2xl py-4 rounded-2xl shadow-[0_6px_0_rgb(107,33,168)] border-2 border-purple-800 btn-press transition-all flex items-center justify-center gap-2 group"
        >
            <span>LET'S GO!</span>
            <Zap className="group-hover:animate-pulse" fill="currentColor" />
        </button>
      </div>
    </div>
  );
};