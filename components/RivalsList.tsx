
import React, { useState, useEffect } from 'react';
import { GameState, Bot } from '../types';
import { SHOP_ITEMS, getPassiveIncome, MAX_INVENTORY_SIZE } from '../constants';
import { Swords, Lock, Zap, AlertTriangle, Users, Shield, Moon } from 'lucide-react';

interface RivalsListProps {
  gameState: GameState;
  onStealAttempt: (bot: Bot, itemId: string) => void;
}

export const RivalsList: React.FC<RivalsListProps> = ({ gameState, onStealAttempt }) => {
  const [expandedBotId, setExpandedBotId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update timer every second for UI countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderInventoryGrid = (items: string[], bot: Bot) => {
    const isVulnerable = bot.isVulnerable;

    return (
        <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: MAX_INVENTORY_SIZE }).map((_, index) => {
                const itemId = items[index];
                const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null;
                
                if (!item) {
                     return (
                         <div key={`empty-${index}`} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300">
                             <Lock size={16} />
                         </div>
                     );
                }

                const passiveIncome = getPassiveIncome(item.price);
                
                return (
                    <div key={`${item.id}-${index}`} className="aspect-[4/5] rounded-xl border-2 border-slate-200 bg-white shadow-sm flex flex-col relative overflow-hidden group">
                         <div className={`absolute top-0 left-0 w-full h-1 ${item.color}`} />
                         
                         <div className="flex-1 flex flex-col items-center justify-center p-1 text-center min-h-0">
                              <div className="text-2xl mb-1">{item.emoji}</div>
                              
                              <div className="font-bold text-slate-800 text-[10px] leading-tight line-clamp-1 w-full px-1">
                                {item.name}
                              </div>
                              
                              <div className="bg-green-50 text-green-700 px-1 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 mt-1">
                                  <Zap size={10} fill="currentColor" />
                                  <span>{passiveIncome}</span>
                              </div>
                              <div className={`mt-1 text-[9px] uppercase font-black px-1 rounded border bg-opacity-10 bg-white`}>
                                {item.rarity}
                              </div>
                         </div>
                         
                         <div className="p-1">
                            <button 
                                onClick={() => {
                                    if (isVulnerable) onStealAttempt(bot, item.id);
                                }}
                                disabled={!isVulnerable}
                                className={`w-full text-[10px] font-black py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase shadow-sm border-b-2 active:translate-y-0.5 active:border-b-0
                                    ${isVulnerable 
                                        ? 'bg-red-600 hover:bg-red-500 text-white border-red-800 cursor-pointer animate-pulse' 
                                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                {isVulnerable ? <Swords size={10} /> : <Lock size={10} />}
                                {isVulnerable ? "STEAL" : "GUARDED"}
                            </button>
                         </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 border-r border-slate-200">
      <div className="bg-white border-b border-slate-200 shadow-sm z-10 p-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="text-red-500" />
            <span>Rivals</span>
        </h2>
        <div className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
             <AlertTriangle size={12} className="text-yellow-500"/>
             <span>Wait for them to sleep!</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
            {gameState.bots.map(bot => {
                const isExpanded = expandedBotId === bot.id;
                const isVulnerable = bot.isVulnerable;
                const secondsLeft = isVulnerable 
                    ? Math.max(0, Math.ceil((bot.vulnerableUntil - now) / 1000))
                    : Math.max(0, Math.ceil((bot.nextVulnerableTime - now) / 1000));
                
                return (
                    <div key={bot.id} className={`rounded-xl border-2 overflow-hidden shadow-sm transition-all ${isVulnerable ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-200'}`}>
                        <div 
                            onClick={() => setExpandedBotId(isExpanded ? null : bot.id)}
                            className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl border-2 border-slate-200 shrink-0">
                                    {bot.avatar}
                                </div>
                                {/* Status Indicator Badge */}
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${isVulnerable ? 'bg-green-500 text-white' : 'bg-slate-400 text-slate-200'}`}>
                                    {isVulnerable ? <Moon size={10} fill="currentColor" /> : <Shield size={10} fill="currentColor" />}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-black text-slate-800 text-sm leading-none truncate">{bot.name}</h3>
                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isVulnerable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                                        {isVulnerable ? 'SLEEPING' : 'GUARDING'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                        {bot.inventory.length} Items
                                    </span>
                                    <span>
                                        {isVulnerable ? `Wakes in ${secondsLeft}s` : `Sleeps in ${secondsLeft}s`}
                                    </span>
                                </div>
                            </div>
                            <div className={`text-slate-400 transition-transform duration-200 text-xs ${isExpanded ? 'rotate-180' : ''}`}>
                                ▼
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="p-3 bg-slate-50 border-t border-slate-200">
                                {bot.inventory.length === 0 ? (
                                    <div className="text-center text-slate-400 font-bold py-4 italic text-xs">
                                        Empty Pockets!
                                    </div>
                                ) : (
                                    renderInventoryGrid(bot.inventory, bot)
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
      </div>
    </div>
  );
};
