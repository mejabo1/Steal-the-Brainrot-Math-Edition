
import React from 'react';
import { Calculator, ShoppingBag, Zap, Trophy, Swords } from 'lucide-react';

interface HelpModalProps {
  onStart: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                Steal the <span className="text-purple-600">Brainrot</span>
            </h1>
            <div className="bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[10px] inline-block px-3 py-1 rounded-full">Algebra Edition</div>
        </div>

        <div className="space-y-4 mb-8">
            <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600 shrink-0 h-fit">
                    <Calculator size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Translate the Math</h3>
                    <div className="text-slate-500 text-xs font-medium leading-relaxed">
                        <p>Read: "Three times <span className="text-purple-600 font-bold">a number</span>"</p>
                        <p className="mt-1">Type: <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">3x</span> or <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">3*x</span></p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="bg-green-100 p-2.5 rounded-lg text-green-600 shrink-0 h-fit">
                    <ShoppingBag size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Buy Upgrades</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">Spend money on items to earn passive income and boost your stats.</p>
                </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="bg-red-100 p-2.5 rounded-lg text-red-600 shrink-0 h-fit">
                    <Swords size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Steal from Rivals</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">Steal items from bots when they are sleeping. <span className="text-red-500 font-bold">Warning:</span> If you fail, they will steal from you!</p>
                </div>
            </div>
        </div>

        <button 
            onClick={onStart}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-slate-900/20 btn-press transition-all flex items-center justify-center gap-2 group"
        >
            <span>Play Now</span>
            <Zap className="group-hover:text-yellow-400 transition-colors" size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
