
import React, { useState } from 'react';
import { BrainrotItem, GameState } from '../types';
import { getPassiveIncome, SHOP_ITEMS, BASE_INVENTORY_SIZE, getRebirthCost } from '../constants';
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

  const maxInventorySize = BASE_INVENTORY_SIZE + gameState.rebirths;

  // Filter items for inventory view
  const inventoryItems = SHOP_ITEMS.filter(item => gameState.inventory.includes(item.id));
  const isInventoryFull = gameState.inventory.length >= maxInventorySize;

  // Rebirth Cost Calc
  const nextRebirthCost = getRebirthCost(gameState.rebirths + 1);
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

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
        case 'common': return 'border-green-200 hover:border-green-400';
        case 'rare': return 'border-blue-200 hover:border-blue-400';
        case 'epic': return 'border-purple-200 hover:border-purple-400';
        case 'legendary': return 'border-yellow-200 hover:border-yellow-400';
        case 'mythic': return 'border-red-200 hover:border-red-400';
        default: return 'border-slate-200 hover:border-slate-400';
    }
  };

  const renderInventoryGrid = (items: string[], isOwner: boolean) => {
    return (
        <div className="grid grid-cols-2 gap-3 pb-20">
            {Array.from({ length: maxInventorySize }).map((_, index) => {
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
                const rarityBorder = getRarityBorder(item.rarity);
                
                return (
                    <div key={`${item.id}-${index}`} className={`aspect-[3/4] rounded-xl border-2 bg-white shadow-sm flex flex-col relative overflow-hidden group transition-all ${rarityBorder}`}>
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
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors uppercase border border-red-100"
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
                        {inventoryItems.length}/{maxInventorySize}
                    </span>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {viewMode === 'shop' && (
            <div className="grid grid-cols-2 gap-3 pb-20">
                {shopRotation.map((item) => {
                    const isOwned = gameState.inventory.includes(item.id);
                    const canAfford = gameState.money >= item.price;
                    const passiveIncome = getPassiveIncome(item.price);
                    const rarityStyle = getRarityColor(item.rarity);
                    const rarityBorder = getRarityBorder(item.rarity);

                    // Determine card state styles
                    let cardBg = 'bg-white';
                    let opacity = 'opacity-100';
                    let cursor = 'cursor-pointer';

                    if (isOwned) {
                        cardBg = 'bg-green-50';
                        opacity = 'opacity-90'; 
                    } else if (!canAfford || isInventoryFull) {
                         cardBg = 'bg-slate-50';
                         opacity = 'opacity-80';
                         cursor = 'cursor-not-allowed';
                    }

                    return (
                        <div 
                            key={item.id}
                            onClick={() => {
                                if (!isOwned && canAfford && !isInventoryFull) {
                                    onBuyItem(item);
                                }
                            }}
                            className={`
                                relative aspect-[3/4.5] rounded-xl border-2 flex flex-col overflow-hidden transition-all duration-200 group
                                ${rarityBorder} ${cardBg} ${opacity} ${cursor}
                                ${(!isOwned && canAfford && !isInventoryFull) ? 'hover:-translate-y-1 hover:shadow-lg' : ''}
                            `}
                        >
                            {/* Content */}
                            <div className="flex-1 flex flex-col items-center p-2 text-center min-h-0">
                                {/* Emoji */}
                                <div className="text-3xl mb-2 mt-1 drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                                    {item.emoji}
                                </div>
                                
                                {/* Name */}
                                <div className="font-bold text-slate-800 text-[11px] leading-tight line-clamp-2 w-full mb-1">
                                    {item.name}
                                </div>
                                
                                {/* Rarity Badge */}
                                <div className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded mb-1 ${rarityStyle}`}>
                                    {item.rarity}
                                </div>

                                {/* Desc */}
                                <div className="text-[9px] font-medium text-slate-500 leading-tight line-clamp-2 mb-2 px-1">
                                    {item.description}
                                </div>

                                {/* Passive Income */}
                                <div className="mt-auto bg-white/60 border border-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 text-slate-600">
                                    <Zap size={10} fill="currentColor" className="text-yellow-500" />
                                    <span>+${passiveIncome}/s</span>
                                </div>
                            </div>

                            {/* Footer / Action */}
                            <div className="p-2 pt-0 bg-transparent mt-1">
                                {isOwned ? (
                                    <div className="w-full bg-green-100 text-green-700 text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 border border-green-200">
                                        <Check size={12} strokeWidth={3} />
                                        Owned
                                    </div>
                                ) : (
                                    <button 
                                        disabled={!canAfford || isInventoryFull}
                                        className={`w-full text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-1 transition-all border
                                            ${(canAfford && !isInventoryFull) 
                                                ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800' 
                                                : 'bg-slate-200 text-slate-400 border-slate-300'
                                            }
                                        `}
                                    >
                                        {!canAfford && !isOwned ? <Lock size={10} /> : null}
                                        ${item.price.toLocaleString()}
                                    </button>
                                )}
                            </div>
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
