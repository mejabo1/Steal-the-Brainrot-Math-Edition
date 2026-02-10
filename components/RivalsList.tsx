
import React, { useState, useEffect } from 'react';
import { GameState, Bot } from '../types';
import { SHOP_ITEMS, getPassiveIncome, MAX_BOT_INVENTORY_SIZE } from '../constants';
import { Swords, Lock, Zap, AlertTriangle, Users, Shield, Moon } from 'lucide-react';

interface RivalsListProps {
  gameState: GameState;
  onStealAttempt: (bot: Bot, itemId: string) => void;
}

export const RivalsList: React.FC<RivalsListProps> = ({ gameState, onStealAttempt }) => {
  const [expandedBotId, setExpandedBotId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderInventoryGrid = (items: string[], bot: Bot) => {
    const isVulnerable = bot.isVulnerable;

    return (
        <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: MAX_BOT_INVENTORY_SIZE }).map((_, index) => {
                const itemId = items[index];
                const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null;
                
                if (!item) {
                     return (
                         <div key={`empty-${index}`} className="aspect-square rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300">
                             <Lock size={14} />
                         </div>
                     );
                }

                const passiveIncome = getPassiveIncome(item.price);
                
                return (
                    <div key={`${item.id}-${index}`} className="aspect-[3/4] rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col relative overflow-hidden">
                         <div className="flex-1 flex flex-col items-center justify-center p-2 text-center min-h-0">
                              <div className="text-xl mb-1">{item.emoji}</div>
                              
                              <div className="font-semibold text-slate-800 text-[10px] leading-tight line-clamp-1 w-full px-1">
                                {item.name}
                              </div>
                              
                              <div className="text-slate-400 text-[9px] font-medium mt-1">
                                  +${passiveIncome}/s
                              </div>
                         </div>
                         
                         <div className="p-1.5 pt-0">
                            <button 
                                onClick={() => {
                                    if (isVulnerable) onStealAttempt(bot, item.id);
                                }}
                                disabled={!isVulnerable}
                                className={`w-full text-[9px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all uppercase
                                    ${isVulnerable 
                                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm cursor-pointer' 
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {isVulnerable ? <Swords size={10} /> : <Lock size={10} />}
                                {isVulnerable ? "Steal" : "Guarded"}
                            </button>
                         </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-orange-50/80">
      <div className="bg-orange-100/80 border-b border-orange-200 p-4 z-10">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            <span>Rivals</span>
        </h2>
        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
             <AlertTriangle size={12} className="text-yellow-600"/>
             <span>Steal items when they sleep</span>
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
                    <div key={bot.id} className={`rounded-xl border transition-all ${isVulnerable ? 'border-green-300 shadow-sm bg-white' : 'border-slate-200 bg-white'}`}>
                        <div 
                            onClick={() => setExpandedBotId(isExpanded ? null : bot.id)}
                            className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl`}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg border border-slate-200 shrink-0">
                                    {bot.avatar}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white ${isVulnerable ? 'bg-green-500 text-white' : 'bg-slate-300 text-white'}`}>
                                    {isVulnerable ? <Moon size={8} fill="currentColor" /> : <Shield size={8} fill="currentColor" />}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className="font-bold text-slate-800 text-sm leading-none truncate">{bot.name}</h3>
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isVulnerable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {isVulnerable ? 'Asleep' : 'Awake'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                    <span>{bot.inventory.length} Items</span>
                                    <span className="text-slate-300">•</span>
                                    <span>
                                        {isVulnerable ? `Wakes in ${secondsLeft}s` : `Sleeps in ${secondsLeft}s`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                                {bot.inventory.length === 0 ? (
                                    <div className="text-center text-slate-400 font-medium py-4 text-xs">
                                        No items to steal
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
