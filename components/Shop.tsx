
import React, { useState } from 'react';
import { BrainrotItem, GameState } from '../types';
import { getPassiveIncome, SHOP_ITEMS, MAX_INVENTORY_SIZE, BASE_REBIRTH_COST } from '../constants';
import { ShoppingBag, Lock, Check, Timer, Backpack, Zap, Trash2, Crown } from 'lucide-react';
import { RebirthModal } from './RebirthModal';

interface ShopProps {
  gameState: GameState;
  shopRotation: BrainrotItem[];
  shopTimer: number;
  onBuyItem: (item: BrainrotItem) => void;
  onSellItem: (item: BrainrotItem) => void;
  onRebirth: () => void;
}

export const Shop: React.FC<ShopProps> = ({ gameState, shopRotation, shopTimer, onBuyItem, onSellItem, onRebirth }) => {
  const [viewMode, setViewMode] = useState<'shop' | 'inventory'>('shop');
  const [showRebirthModal, setShowRebirthModal] = useState(false);

  // Filter items for inventory view
  const inventoryItems = SHOP_ITEMS.filter(item => gameState.inventory.includes(item.id));
  const isInventoryFull = gameState.inventory.length >= MAX_INVENTORY_SIZE;

  // Rebirth Cost Calc
  const nextRebirthCost = BASE_REBIRTH_COST * (gameState.rebirths + 1);
  const canAffordRebirth = gameState.money >= nextRebirthCost;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'common': return 'bg-green-100 text-green-700';
        case 'rare': return 'bg-blue-100 text-blue-700';
        case 'epic': return 'bg-purple-100 text-purple-700';
        case 'legendary': return 'bg-yellow-100 text-yellow-700';
        case 'mythic': return 'bg-red-100 text-red-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const renderInventoryGrid = (items: string[], isOwner: boolean) => {
    return (
        <div className="grid grid-cols-2 gap-4 pb-20">
            {Array.from({ length: MAX_INVENTORY_SIZE }).map((_, index) => {
                const itemId = items[index];
                const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null;
                
                if (!item) {
                     return (
                         <div key={`empty-${index}`} className="aspect-[3/4] rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-300">
                             <div className="bg-white p-2 rounded-full mb-2 shadow-sm">
                                <Lock size={16} />
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-wide">Empty</span>
                         </div>
                     );
                }

                const passiveIncome = getPassiveIncome(item.price);
                const rarityStyle = getRarityColor(item.rarity);
                
                return (
                    <div key={`${item.id}-${index}`} className="aspect-[3/4] rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col relative overflow-hidden group hover:border-blue-300 transition-colors">
                         <div className="flex-1 flex flex-col items-center justify-center p-3 text-center min-h-0">
                              <div className="text-2xl mb-3 drop-shadow-sm transform group-hover:scale-110 transition-transform">{item.emoji}</div>
                              
                              <div className="font-semibold text-slate-800 text-xs leading-tight line-clamp-2 w-full mb-2">
                                {item.name}
                              </div>
                              
                              <div className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mb-2 ${rarityStyle}`}>
                                    {item.rarity}
                              </div>

                              <div className="bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                  <Zap size={10} fill="currentColor" className="text-yellow-500" />
                                  <span>+${passiveIncome}/s</span>
                              </div>
                         </div>
                         
                         <div className="p-2 pt-0">
                             {isOwner && (
                                 <button 
                                    onClick={() => onSellItem(item)}
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase"
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
    <div className="flex flex-col w-full h-full bg-blue-50/80">
      {showRebirthModal && (
          <RebirthModal 
            currentRebirths={gameState.rebirths}
            money={gameState.money}
            onConfirm={() => {
                onRebirth();
                setShowRebirthModal(false);
            }}
            onCancel={() => setShowRebirthModal(false)}
          />
      )}

      <div className="bg-blue-100/80 border-b border-blue-200 z-10">
        <div className="p-4 pb-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="text-purple-600" size={20} />
                    <span>Marketplace</span>
                </h2>
                
                <button 
                    onClick={() => setShowRebirthModal(true)}
                    className={`
                        text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border-2 flex items-center gap-1.5 transition-all btn-press
                        ${canAffordRebirth 
                            ? 'bg-yellow-400 border-yellow-500 text-yellow-900 animate-pulse shadow-lg shadow-yellow-400/50' 
                            : 'bg-slate-800 border-slate-700 text-yellow-500'}
                    `}
                >
                    <Crown size={12} fill="currentColor" />
                    Rebirth
                </button>
            </div>
            
            <div className="flex gap-1 bg-white/50 p-1 rounded-lg mb-4">
                <button 
                    onClick={() => setViewMode('shop')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${viewMode === 'shop' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-600 hover:text-blue-800'}`}
                >
                    <ShoppingBag size={14} /> Buy
                </button>
                <button 
                    onClick={() => setViewMode('inventory')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${viewMode === 'inventory' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-600 hover:text-blue-800'}`}
                >
                    <Backpack size={14} /> Inventory
                </button>
            </div>
        </div>
        
        <div className="px-4 pb-3">
            {viewMode === 'shop' && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/50 border border-blue-100 p-2 rounded-lg">
                    <Timer size={14} className="animate-spin-slow text-blue-500" />
                    <span>Restock in:</span>
                    <span className={`font-bold ${shopTimer <= 3 ? 'text-red-500' : 'text-slate-700'}`}>
                        {shopTimer}s
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full ml-2 overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${(shopTimer / 10) * 100}%` }}
                        />
                    </div>
                </div>
            )}
            {viewMode === 'inventory' && (
                <div className="text-xs font-medium text-slate-500 flex justify-between items-center bg-white/50 border border-blue-100 p-2 rounded-lg">
                    <span>Capacity</span>
                    <span className={`font-bold ${isInventoryFull ? "text-red-500" : "text-green-600"}`}>
                        {inventoryItems.length}/{MAX_INVENTORY_SIZE}
                    </span>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {viewMode === 'shop' && (
            <div className="grid grid-cols-1 gap-4 pb-20">
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
                                relative p-4 rounded-xl border transition-all duration-200
                                ${isOwned 
                                    ? 'bg-green-50 border-green-200' 
                                    : (!canAfford || isInventoryFull)
                                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                                        : 'bg-white border-blue-100 cursor-pointer hover:shadow-md hover:border-purple-200 btn-press active:translate-y-0'
                                }
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-slate-50 border border-slate-100`}>
                                    {item.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
                                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${rarityStyle}`}>
                                            {item.rarity}
                                        </span>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 leading-snug mb-2">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                            <Zap size={10} className="text-yellow-500" fill="currentColor" />
                                            +${passiveIncome}/s
                                        </div>

                                        {isOwned ? (
                                            <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                <Check size={12} /> Owned
                                            </span>
                                        ) : (
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${canAfford && !isInventoryFull ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                ${item.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!canAfford && !isOwned && (
                                <div className="absolute top-3 right-3 text-slate-300">
                                    <Lock size={14} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
        
        {viewMode === 'inventory' && renderInventoryGrid(gameState.inventory, true)}
      </div>
    </div>
  );
};
