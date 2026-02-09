import React, { useState } from 'react';
import { BrainrotItem, GameState } from '../types';
import { getPassiveIncome, SHOP_ITEMS, MAX_INVENTORY_SIZE } from '../constants';
import { ShoppingBag, Lock, Check, Timer, Backpack, Zap, Trash2 } from 'lucide-react';

interface ShopProps {
  gameState: GameState;
  shopRotation: BrainrotItem[];
  shopTimer: number;
  onBuyItem: (item: BrainrotItem) => void;
  onSellItem: (item: BrainrotItem) => void;
}

export const Shop: React.FC<ShopProps> = ({ gameState, shopRotation, shopTimer, onBuyItem, onSellItem }) => {
  const [viewMode, setViewMode] = useState<'shop' | 'inventory'>('shop');

  // Filter items for inventory view
  const inventoryItems = SHOP_ITEMS.filter(item => gameState.inventory.includes(item.id));
  const isInventoryFull = gameState.inventory.length >= MAX_INVENTORY_SIZE;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'common': return 'border-green-200 text-green-600';
        case 'rare': return 'border-blue-200 text-blue-600';
        case 'epic': return 'border-purple-200 text-purple-600';
        case 'legendary': return 'border-yellow-200 text-yellow-600';
        case 'mythic': return 'border-red-200 text-red-600';
        default: return 'border-slate-200 text-slate-600';
    }
  };

  const renderInventoryGrid = (items: string[], isOwner: boolean) => {
    return (
        <div className="grid grid-cols-2 gap-3 pb-20">
            {Array.from({ length: MAX_INVENTORY_SIZE }).map((_, index) => {
                const itemId = items[index];
                const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null;
                
                if (!item) {
                     return (
                         <div key={`empty-${index}`} className="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-300">
                             <div className="bg-slate-100 p-3 rounded-full mb-2">
                                <Lock size={20} />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-wider">Empty Slot</span>
                         </div>
                     );
                }

                const passiveIncome = getPassiveIncome(item.price);
                const rarityStyle = getRarityColor(item.rarity);
                
                return (
                    <div key={`${item.id}-${index}`} className="aspect-[4/5] rounded-2xl border-2 border-slate-200 bg-white shadow-sm flex flex-col relative overflow-hidden group hover:border-blue-300 transition-colors">
                         {/* Header Color Strip */}
                         <div className={`absolute top-0 left-0 w-full h-1.5 ${item.color}`} />
                         
                         <div className="flex-1 flex flex-col items-center justify-center p-2 text-center min-h-0">
                              <div className="text-3xl mb-2 drop-shadow-sm transform group-hover:scale-110 transition-transform">{item.emoji}</div>
                              
                              <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 w-full mb-1 h-10 flex items-center justify-center">
                                {item.name}
                              </div>
                              
                              <div className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded border mb-2 bg-opacity-10 bg-white scale-90 origin-center ${rarityStyle}`}>
                                    {item.rarity}
                              </div>

                              <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 mb-1">
                                  <Zap size={12} fill="currentColor" />
                                  <span>+${passiveIncome}/s</span>
                              </div>
                         </div>
                         
                         <div className="p-2 pt-0">
                             {isOwner && (
                                 <button 
                                    onClick={() => onSellItem(item)}
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase border border-red-100 hover:border-red-200"
                                 >
                                    <Trash2 size={12} />
                                    Sell
                                 </button>
                             )}
                         </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 border-l border-slate-200">
      <div className="bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="p-4 pb-0">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
                <ShoppingBag className="text-purple-500" />
                <span>Brainrot Shop</span>
            </h2>
            
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4">
                <button 
                    onClick={() => setViewMode('shop')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${viewMode === 'shop' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    <ShoppingBag size={14} /> Shop
                </button>
                <button 
                    onClick={() => setViewMode('inventory')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${viewMode === 'inventory' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    <Backpack size={14} /> Bag
                </button>
            </div>
        </div>
        
        <div className="px-4 pb-2">
            {viewMode === 'shop' && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 p-2 rounded-lg">
                    <Timer size={14} className="animate-spin-slow" />
                    <span>Restock in:</span>
                    <span className={`text-sm ${shopTimer <= 3 ? 'text-red-500' : 'text-blue-500'}`}>
                        {shopTimer}s
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full ml-2 overflow-hidden">
                        <div 
                            className="h-full bg-blue-400 transition-all duration-1000 ease-linear"
                            style={{ width: `${(shopTimer / 10) * 100}%` }}
                        />
                    </div>
                </div>
            )}
            {viewMode === 'inventory' && (
                <div className="text-xs font-bold text-slate-500 flex justify-between items-center bg-slate-100 p-2 rounded-lg">
                    <span>Inventory Slots</span>
                    <span className={isInventoryFull ? "text-red-500" : "text-green-600"}>
                        {inventoryItems.length}/{MAX_INVENTORY_SIZE} Used
                    </span>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {viewMode === 'shop' && (
            <div className="grid grid-cols-1 gap-3 pb-20">
                {shopRotation.map((item) => {
                    const isOwned = gameState.inventory.includes(item.id);
                    const canAfford = gameState.money >= item.price;
                    const passiveIncome = getPassiveIncome(item.price);
                    const rarityStyle = getRarityColor(item.rarity);

                    return (
                        <div 
                            key={item.id}
                            onClick={() => {
                                if (!isOwned && canAfford && !isInventoryFull) {
                                    onBuyItem(item);
                                }
                            }}
                            className={`
                                relative group p-3 rounded-2xl border-2 transition-all duration-200
                                ${isOwned 
                                    ? 'bg-green-50 border-green-200 opacity-90' 
                                    : (!canAfford || isInventoryFull)
                                        ? 'bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed grayscale-[0.3]'
                                        : 'bg-white border-slate-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-purple-300 btn-press active:translate-y-0'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${item.color} text-white`}>
                                    {item.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800 leading-tight truncate pr-2">{item.name}</h3>
                                        <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded border ${rarityStyle} bg-opacity-10 bg-white`}>
                                            {item.rarity}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mt-1 mb-1">
                                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            <Zap size={10} /> +${passiveIncome}/s
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        {isOwned ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                                <Check size={12} /> COLLECTED
                                            </span>
                                        ) : (
                                            <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${canAfford && !isInventoryFull ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
                                                ${item.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!canAfford && !isOwned && (
                                <div className="absolute top-2 right-2 text-slate-300">
                                    <Lock size={16} />
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {shopRotation.length === 0 && (
                    <div className="text-center p-4 text-slate-400 font-bold">Loading shop...</div>
                )}
            </div>
        )}
        
        {viewMode === 'inventory' && renderInventoryGrid(gameState.inventory, true)}
      </div>
    </div>
  );
};