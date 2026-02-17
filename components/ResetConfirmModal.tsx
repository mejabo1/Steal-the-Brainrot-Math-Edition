
import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ResetConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onCancel} />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 border-4 border-red-600 rounded-2xl max-w-md w-full p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-in zoom-in duration-300 text-center overflow-hidden">
        
        {/* Striped Warning Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)] opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)] opacity-50" />

        <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-red-600/20 border-2 border-red-500 text-red-500 animate-bounce-short">
                <AlertTriangle size={48} strokeWidth={2.5} />
            </div>
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
            Hard Reset?
        </h2>
        
        <p className="text-red-200 font-medium mb-8 leading-relaxed">
            Are you sure you want to wipe your save? <br/>
            <span className="text-red-500 font-bold uppercase text-sm">You will lose everything.</span>
            <br/>
            This action cannot be undone.
        </p>

        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={onCancel}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-colors border-2 border-slate-700 flex items-center justify-center gap-2 btn-press"
            >
                <X size={20} />
                Cancel
            </button>
            
            <button 
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl transition-colors border-2 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 btn-press"
            >
                <Trash2 size={20} />
                Wipe Save
            </button>
        </div>
      </div>
    </div>
  );
};
