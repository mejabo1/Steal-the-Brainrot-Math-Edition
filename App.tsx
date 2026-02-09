
import React, { useState, useEffect } from 'react';
import { GameState, BrainrotItem, Bot } from './types';
import { MathGame } from './components/MathGame';
import { Shop } from './components/Shop';
import { RivalsList } from './components/RivalsList';
import { StatusHeader } from './components/StatusHeader';
import { HelpModal } from './components/HelpModal';
import { StealChallenge } from './components/StealChallenge';
import { BaseDefense } from './components/BaseDefense';
import { SHOP_ITEMS, getPassiveIncome, MAX_INVENTORY_SIZE, BOT_PROFILES } from './constants';
import { ShieldAlert } from 'lucide-react';

const INITIAL_STATE: GameState = {
  money: 0,
  inventory: [],
  streak: 0,
  totalAnswered: 0,
  multiplier: 1,
  baseMoney: 0,
  timerBonus: 0,
  shieldActive: false,
  streakBonusMult: 1,
  bots: [],
  nextAttackTime: Date.now() + 30000,
  consecutiveTimeouts: 0
};

const SHOP_ROTATION_TIME = 10; // 10 seconds

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('brainrot-math-save');
    let state = saved ? JSON.parse(saved) : INITIAL_STATE;
    
    // Check if bots need initialization or migration (old bot names or empty)
    const oldBotNames = ["Calculus Chad", "Algebra Al", "Ms. Pythagorean", "Sir Isaac", "The Divider"];
    const hasOldBots = state.bots && state.bots.some((b: Bot) => oldBotNames.includes(b.name));
    const incorrectBotCount = state.bots && state.bots.length !== 5;
    
    // Initialize or migrate bots if missing or old or incorrect count
    if (!state.bots || state.bots.length === 0 || hasOldBots || incorrectBotCount) {
        // Randomly select 5 profiles
        const shuffled = [...BOT_PROFILES].sort(() => 0.5 - Math.random());
        const selectedProfiles = shuffled.slice(0, 5);
        
        state.bots = selectedProfiles.map((profile, index) => ({
            id: `bot-${index}-${Date.now()}`,
            name: profile.name,
            avatar: profile.avatar,
            inventory: [],
            isVulnerable: false,
            nextVulnerableTime: Date.now() + Math.random() * 30000,
            vulnerableUntil: 0,
            nextBuyTime: Date.now() + (Math.random() * 60000)
        }));
        
        // Give bots some starter items
        state.bots.forEach((bot: Bot) => {
            // Give 3-5 random items
            const count = 3 + Math.floor(Math.random() * 3);
            for(let i=0; i<count; i++) {
                let pool = SHOP_ITEMS.filter(item => item.price < 1000);
                
                // Coaches only start with Commons
                if (bot.name.includes("Coach")) {
                    pool = pool.filter(item => item.rarity === 'common');
                }
                
                if (pool.length > 0) {
                    const item = pool[Math.floor(Math.random() * pool.length)];
                    if(!bot.inventory.includes(item.id)) {
                        bot.inventory.push(item.id);
                    }
                }
            }
        });
    } else {
        // Migration for existing saves
        state.bots = state.bots.map((bot: any) => ({
            ...bot,
            isVulnerable: bot.isVulnerable ?? false,
            nextVulnerableTime: bot.nextVulnerableTime ?? (Date.now() + Math.random() * 30000),
            vulnerableUntil: bot.vulnerableUntil ?? 0,
            nextBuyTime: bot.nextBuyTime ?? (Date.now() + Math.random() * 60000)
        }));
    }

    // Migration for nextAttackTime
    if (!state.nextAttackTime) {
        state.nextAttackTime = Date.now() + 30000;
    }
    
    // Migration for consecutiveTimeouts
    if (state.consecutiveTimeouts === undefined) {
        state.consecutiveTimeouts = 0;
    }

    return state;
  });

  const [showHelp, setShowHelp] = useState(true);
  const [earnedAnimation, setEarnedAnimation] = useState<{value: number, id: number} | null>(null);
  const [attackNotification, setAttackNotification] = useState<{message: string, success: boolean} | null>(null);
  
  // Steal State
  const [activeSteal, setActiveSteal] = useState<{ 
      bot: Bot; 
      itemId: string; 
      difficulty: number; 
      timeLimit: number; 
  } | null>(null);

  // Base Defense State
  const [activeAttack, setActiveAttack] = useState<{ expiresAt: number } | null>(null);
  
  // Shop Rotation State
  const [shopRotation, setShopRotation] = useState<BrainrotItem[]>([]);
  const [shopTimer, setShopTimer] = useState(SHOP_ROTATION_TIME);
  
  // Auto-save
  useEffect(() => {
    localStorage.setItem('brainrot-math-save', JSON.stringify(gameState));
  }, [gameState]);

  // Shop Rotation Logic
  useEffect(() => {
    const shuffleShop = () => {
        // Separation by rarity
        const commons = SHOP_ITEMS.filter(i => i.rarity === 'common');
        const cheapCommons = commons.filter(i => i.price <= 100);
        const starterPool = cheapCommons.length > 0 ? cheapCommons : commons;
        const starterItem = starterPool[Math.floor(Math.random() * starterPool.length)];
        const remainingCommons = commons.filter(i => i.id !== starterItem.id);
        const shuffledRemaining = [...remainingCommons].sort(() => 0.5 - Math.random());
        const otherCommons = shuffledRemaining.slice(0, 2);
        const selectedCommons = [starterItem, ...otherCommons];
        
        const selectedRandoms: BrainrotItem[] = [];
        const selectedIds = new Set(selectedCommons.map(i => i.id));
        
        for(let i=0; i<3; i++) {
            const r = Math.random();
            let targetRarity: string;
            
            if (r < 0.40) targetRarity = 'common';
            else if (r < 0.70) targetRarity = 'rare';
            else if (r < 0.90) targetRarity = 'epic';
            else if (r < 0.99) targetRarity = 'legendary';
            else targetRarity = 'mythic';
            
            const pool = SHOP_ITEMS.filter(item => item.rarity === targetRarity && !selectedIds.has(item.id));
            const finalPool = pool.length > 0 ? pool : SHOP_ITEMS.filter(item => !selectedIds.has(item.id));
            
            if (finalPool.length > 0) {
                const randomItem = finalPool[Math.floor(Math.random() * finalPool.length)];
                selectedRandoms.push(randomItem);
                selectedIds.add(randomItem.id);
            }
        }

        setShopRotation([...selectedCommons, ...selectedRandoms]);
        setShopTimer(SHOP_ROTATION_TIME);
    };

    shuffleShop();

    const timer = setInterval(() => {
        if (showHelp || activeSteal || activeAttack) return;

        setShopTimer((prev) => {
            if (prev <= 1) {
                shuffleShop();
                return SHOP_ROTATION_TIME;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [showHelp, activeSteal, activeAttack]);

  // Passive Income Logic & Bot AI & Vulnerability Loop & Attack Loop
  useEffect(() => {
    const loop = setInterval(() => {
        if (showHelp || activeSteal) return; // Don't process if busy stealing
        
        const now = Date.now();

        // 0. Base Defense Check
        // Only trigger if not already under attack, help closed, and not currently stealing
        if (!activeAttack && now > gameState.nextAttackTime) {
            setActiveAttack({ expiresAt: now + 8000 }); // 8 seconds to solve math
        }

        // Check for Attack Fail
        if (activeAttack && now > activeAttack.expiresAt) {
            handleAttackFail();
        }

        // 1. Player Passive Income
        // Don't generate income while under attack
        const totalPassive = gameState.inventory.reduce((sum, id) => {
            const item = SHOP_ITEMS.find(i => i.id === id);
            return sum + (item ? getPassiveIncome(item.price) : 0);
        }, 0);

        // 2. Bot Updates (Buying & Vulnerability)
        const newBots = gameState.bots.map(bot => {
            let updatedBot = { ...bot };

            // Vulnerability Logic
            if (updatedBot.isVulnerable) {
                // Check if time is up
                if (now > updatedBot.vulnerableUntil) {
                    updatedBot.isVulnerable = false;
                    // Cooldown between 30s and 60s
                    updatedBot.nextVulnerableTime = now + (30000 + Math.random() * 30000);
                }
            } else {
                // Check if ready to become vulnerable
                if (now > updatedBot.nextVulnerableTime) {
                    updatedBot.isVulnerable = true;
                    
                    // Default Duration: 10-20s
                    let duration = 10000 + Math.random() * 10000;
                    
                    // Mr. Gremillion: sleeps for 3-5s (Harder/Faster)
                    if (updatedBot.name === "Mr. Gremillion") {
                        duration = 3000 + Math.random() * 2000;
                    }

                    updatedBot.vulnerableUntil = now + duration;
                }
            }

            // Buying Logic: Every 60 seconds (Fixed)
            if (updatedBot.inventory.length < MAX_INVENTORY_SIZE && now > updatedBot.nextBuyTime) {
                let pool = SHOP_ITEMS.filter(i => !updatedBot.inventory.includes(i.id));
                
                // Coaches ONLY buy common items
                if (updatedBot.name.includes("Coach")) {
                    pool = pool.filter(i => i.rarity === 'common');
                }

                if (pool.length > 0) {
                    const randomItem = pool[Math.floor(Math.random() * pool.length)];
                    updatedBot.inventory = [...updatedBot.inventory, randomItem.id];
                }
                
                // Set next buy time to 60 seconds from now
                updatedBot.nextBuyTime = now + 60000;
            }
            return updatedBot;
        });

        // Update State
        setGameState(prev => ({
            ...prev,
            money: prev.money + totalPassive,
            bots: newBots
        }));

    }, 1000);

    return () => clearInterval(loop);
  }, [gameState.inventory, showHelp, activeSteal, gameState.bots, activeAttack, gameState.nextAttackTime]);

  const calculateStats = (inventoryIds: string[]) => {
    let multiplier = 1;
    let baseMoney = 0;
    let timerBonus = 0;
    let streakBonusMult = 1;
    let shieldActive = false;

    inventoryIds.forEach(id => {
        const item = SHOP_ITEMS.find(i => i.id === id);
        if (!item) return;

        switch (item.effectType) {
            case 'multiplier': multiplier += item.value; break;
            case 'base_money': baseMoney += item.value; break;
            case 'timer': timerBonus += item.value; break;
            case 'streak_bonus': streakBonusMult *= item.value; break;
        }
    });

    return { multiplier, baseMoney, timerBonus, streakBonusMult };
  };

  const handleStartGame = () => {
    setShowHelp(false);
    // Reset attack timer when starting game to ensure 30s grace period
    setGameState(prev => ({
        ...prev,
        nextAttackTime: Date.now() + 30000
    }));
  };

  const handleDefendBase = () => {
      setActiveAttack(null);
      setGameState(prev => ({
          ...prev,
          nextAttackTime: Date.now() + 30000 // Reset timer
      }));
      setAttackNotification({ message: "BASE DEFENDED!", success: true });
      setTimeout(() => setAttackNotification(null), 2000);
  };

  const handleAttackFail = () => {
      setActiveAttack(null);
      setGameState(prev => {
          // Logic: Steal one random item from player and give to a random bot
          let newInventory = [...prev.inventory];
          let newBots = [...prev.bots];
          let stolenItemName = null;
          let thiefName = "Unknown";

          if (newInventory.length > 0) {
              const itemIdx = Math.floor(Math.random() * newInventory.length);
              const itemId = newInventory[itemIdx];
              const item = SHOP_ITEMS.find(i => i.id === itemId);
              
              if (item) {
                  stolenItemName = item.name;
                  newInventory.splice(itemIdx, 1);
                  
                  // Give to random bot if they have space
                  const validBots = newBots.filter(b => b.inventory.length < MAX_INVENTORY_SIZE);
                  if (validBots.length > 0) {
                      const thiefIndex = Math.floor(Math.random() * validBots.length);
                      const realBotIndex = newBots.findIndex(b => b.id === validBots[thiefIndex].id);
                      if (realBotIndex > -1) {
                          newBots[realBotIndex].inventory.push(itemId);
                          thiefName = newBots[realBotIndex].name;
                      }
                  }
              }
          }

          const stats = calculateStats(newInventory);
          const hasShieldItem = newInventory.some(id => 
            SHOP_ITEMS.find(i => i.id === id)?.effectType === 'shield'
          );
          
          if (stolenItemName) {
            setAttackNotification({ message: `${thiefName} STOLE YOUR ${stolenItemName}!`, success: false });
          } else {
             setAttackNotification({ message: "BASE BREACHED! (Nothing to steal)", success: false });
          }
          setTimeout(() => setAttackNotification(null), 4000);

          return {
              ...prev,
              inventory: newInventory,
              bots: newBots,
              multiplier: stats.multiplier,
              baseMoney: stats.baseMoney,
              timerBonus: stats.timerBonus,
              streakBonusMult: stats.streakBonusMult,
              shieldActive: hasShieldItem ? prev.shieldActive : false,
              nextAttackTime: Date.now() + 30000 // Reset timer
          };
      });
  };

  const handleCorrectAnswer = (earnedAmount: number) => {
    setGameState(prev => {
        let newStreak = prev.streak + 1;
        let newShieldActive = prev.shieldActive;
        const hasShieldItem = prev.inventory.some(id => 
            SHOP_ITEMS.find(i => i.id === id)?.effectType === 'shield'
        );

        if (hasShieldItem && !prev.shieldActive) {
            newShieldActive = true; 
        }

        return {
            ...prev,
            money: prev.money + earnedAmount,
            streak: newStreak,
            totalAnswered: prev.totalAnswered + 1,
            shieldActive: newShieldActive,
            consecutiveTimeouts: 0 // Reset timeouts on correct answer
        };
    });

    setEarnedAnimation({ value: earnedAmount, id: Date.now() });
    setTimeout(() => setEarnedAnimation(null), 1000);
  };

  const handleWrongAnswer = () => {
    setGameState(prev => {
        if (prev.shieldActive) {
            return { ...prev, shieldActive: false };
        } else {
            return { ...prev, streak: 0 };
        }
    });
  };

  const handleTimeOut = () => {
    setGameState(prev => {
        // Break Streak
        let nextState = { ...prev };
        if (prev.shieldActive) {
            nextState.shieldActive = false;
        } else {
            nextState.streak = 0;
        }

        // Increment Timeouts
        const newTimeouts = prev.consecutiveTimeouts + 1;
        
        // Check for 3 strikes
        if (newTimeouts >= 3 && prev.inventory.length > 0) {
            // Find most expensive item
            const playerItems = prev.inventory.map(id => SHOP_ITEMS.find(i => i.id === id)).filter(Boolean) as BrainrotItem[];
            playerItems.sort((a, b) => b.price - a.price); // Sort desc
            
            const itemToSteal = playerItems[0];
            
            if (itemToSteal) {
                // Remove from player
                nextState.inventory = prev.inventory.filter(id => id !== itemToSteal.id);
                
                // Give to random bot (if space)
                const botIndex = Math.floor(Math.random() * nextState.bots.length);
                const bot = nextState.bots[botIndex];
                if (bot.inventory.length < MAX_INVENTORY_SIZE) {
                    const newBots = [...nextState.bots];
                    newBots[botIndex] = {
                        ...bot,
                        inventory: [...bot.inventory, itemToSteal.id]
                    };
                    nextState.bots = newBots;
                }
                
                // Recalculate Stats
                const stats = calculateStats(nextState.inventory);
                nextState.multiplier = stats.multiplier;
                nextState.baseMoney = stats.baseMoney;
                nextState.timerBonus = stats.timerBonus;
                nextState.streakBonusMult = stats.streakBonusMult;
                // Re-check shield
                const hasShieldItem = nextState.inventory.some(id => 
                    SHOP_ITEMS.find(i => i.id === id)?.effectType === 'shield'
                );
                nextState.shieldActive = hasShieldItem ? nextState.shieldActive : false;

                // Notify
                setAttackNotification({ 
                    message: `TOO SLOW! ${itemToSteal.name} STOLEN BY ${bot.name.toUpperCase()}!`, 
                    success: false 
                });
                setTimeout(() => setAttackNotification(null), 4000);
            }
            
            nextState.consecutiveTimeouts = 0;
        } else {
            nextState.consecutiveTimeouts = newTimeouts;
        }

        return nextState;
    });
  };

  const handleBuyItem = (item: BrainrotItem) => {
    if (gameState.money < item.price) return;
    if (gameState.inventory.length >= MAX_INVENTORY_SIZE) return;
    if (gameState.inventory.includes(item.id)) return;

    setGameState(prev => {
        const newInventory = [...prev.inventory, item.id];
        const stats = calculateStats(newInventory);
        let newShieldActive = prev.shieldActive;
        if (item.effectType === 'shield') newShieldActive = true;

        return {
            ...prev,
            money: prev.money - item.price,
            inventory: newInventory,
            multiplier: stats.multiplier,
            baseMoney: stats.baseMoney,
            timerBonus: stats.timerBonus,
            streakBonusMult: stats.streakBonusMult,
            shieldActive: newShieldActive
        };
    });
  };

  const handleSellItem = (item: BrainrotItem) => {
    setGameState(prev => {
        const newInventory = prev.inventory.filter(id => id !== item.id);
        const stats = calculateStats(newInventory);
        const hasShieldItem = newInventory.some(id => 
            SHOP_ITEMS.find(i => i.id === id)?.effectType === 'shield'
        );
        const newShieldActive = hasShieldItem ? prev.shieldActive : false;

        return {
            ...prev,
            money: prev.money + item.price, 
            inventory: newInventory,
            multiplier: stats.multiplier,
            baseMoney: stats.baseMoney,
            timerBonus: stats.timerBonus,
            streakBonusMult: stats.streakBonusMult,
            shieldActive: newShieldActive
        };
    });
  };

  const startSteal = (bot: Bot, itemId: string) => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (!item) return;

      let difficulty = 2000;
      let timeLimit = 12;

      // Scaling based on rarity
      switch (item.rarity) {
          case 'common':
              difficulty = 2000; // Level 3/4
              timeLimit = 12;
              break;
          case 'rare':
              difficulty = 4000; // Level 4
              timeLimit = 10;
              break;
          case 'epic':
              difficulty = 8000; // Level 5
              timeLimit = 8;
              break;
          case 'legendary':
              difficulty = 15000; // High Level 5
              timeLimit = 5; // Very fast
              break;
          case 'mythic':
              difficulty = 30000; // Max Difficulty
              timeLimit = 3; // Extreme
              break;
      }

      // MR GREMILLION MODIFIER: HARDER
      if (bot.name === "Mr. Gremillion") {
          difficulty += 5000; 
          timeLimit = Math.max(3, timeLimit - 4); // Reduce time drastically
      }

      // COACH MODIFIER: EASIER
      if (bot.name.includes("Coach")) {
          difficulty = Math.max(1000, difficulty - 1500); 
          timeLimit += 5; // Extra time
      }

      setActiveSteal({ bot, itemId, difficulty, timeLimit });
  };

  const finishSteal = (success: boolean) => {
      if (!activeSteal) return;

      const { bot, itemId } = activeSteal;
      
      setGameState(prev => {
          let newBots = [...prev.bots];
          let newInventory = [...prev.inventory];
          let newMoney = prev.money;
          
          const targetBotIndex = newBots.findIndex(b => b.id === bot.id);
          
          if (success) {
              // SUCCESS: Remove from bot, add to player
              if (targetBotIndex > -1) {
                  // Wake bot up immediately after being robbed
                  newBots[targetBotIndex] = {
                      ...newBots[targetBotIndex],
                      isVulnerable: false,
                      nextVulnerableTime: Date.now() + 30000,
                      inventory: newBots[targetBotIndex].inventory.filter(id => id !== itemId)
                  };
              }
              
              // If player has space, give item. Else give cash value.
              if (newInventory.length < MAX_INVENTORY_SIZE) {
                  if (!newInventory.includes(itemId)) { // Ensure unique
                      newInventory.push(itemId);
                  } else {
                      const item = SHOP_ITEMS.find(i => i.id === itemId);
                      if (item) newMoney += item.price;
                  }
              } else {
                   const item = SHOP_ITEMS.find(i => i.id === itemId);
                   if (item) newMoney += item.price;
              }
          } else {
              // FAIL: Remove random item from player, give to bot
              // Wake bot up as they caught you
              if (targetBotIndex > -1) {
                  newBots[targetBotIndex] = {
                      ...newBots[targetBotIndex],
                      isVulnerable: false,
                      nextVulnerableTime: Date.now() + 30000,
                  };
              }

              if (prev.inventory.length > 0) {
                  const randomIdx = Math.floor(Math.random() * prev.inventory.length);
                  const lostItemId = prev.inventory[randomIdx];
                  
                  newInventory.splice(randomIdx, 1);
                  
                  if (targetBotIndex > -1) {
                      if (newBots[targetBotIndex].inventory.length < MAX_INVENTORY_SIZE) {
                          if (!newBots[targetBotIndex].inventory.includes(lostItemId)) {
                             newBots[targetBotIndex].inventory.push(lostItemId);
                          }
                      }
                  }
              }
          }

          const stats = calculateStats(newInventory);
          const hasShieldItem = newInventory.some(id => 
            SHOP_ITEMS.find(i => i.id === id)?.effectType === 'shield'
          );
          const newShieldActive = hasShieldItem ? prev.shieldActive : false;
          
          return {
              ...prev,
              bots: newBots,
              inventory: newInventory,
              money: newMoney,
              multiplier: stats.multiplier,
              baseMoney: stats.baseMoney,
              timerBonus: stats.timerBonus,
              streakBonusMult: stats.streakBonusMult,
              shieldActive: newShieldActive
          };
      });

      setActiveSteal(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans">
        {showHelp && <HelpModal onStart={handleStartGame} />}
        
        {activeAttack && (
            <BaseDefense 
                expiresAt={activeAttack.expiresAt}
                onDefend={handleDefendBase}
                difficulty={Math.max(2000, gameState.money)} // Scale difficulty
            />
        )}
        
        {attackNotification && (
             <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[150] animate-bounce-short">
                <div className={`px-6 py-4 rounded-xl shadow-xl border-4 font-black text-xl uppercase flex items-center gap-3 ${attackNotification.success ? 'bg-green-500 border-green-700 text-white' : 'bg-red-600 border-red-800 text-white'}`}>
                    {attackNotification.success ? <ShieldAlert size={24} /> : <ShieldAlert size={24} />}
                    {attackNotification.message}
                </div>
             </div>
        )}

        {activeSteal && (
            <StealChallenge 
                targetItem={{ botName: activeSteal.bot.name, itemId: activeSteal.itemId }}
                difficulty={activeSteal.difficulty}
                initialTime={activeSteal.timeLimit}
                onComplete={finishSteal}
            />
        )}
        
        <StatusHeader gameState={gameState} />
        
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
            <aside className="w-full md:w-[300px] h-[30%] md:h-full order-2 md:order-1 z-20 shadow-xl bg-white border-r border-slate-200">
                <RivalsList 
                    gameState={gameState}
                    onStealAttempt={startSteal}
                />
            </aside>

            <main className="flex-1 relative order-1 md:order-2 h-[40%] md:h-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 to-slate-200">
                <MathGame 
                    gameState={gameState} 
                    isPaused={showHelp || !!activeSteal || !!activeAttack}
                    onCorrectAnswer={handleCorrectAnswer}
                    onWrongAnswer={handleWrongAnswer}
                    onTimeUp={handleTimeOut}
                />

                {earnedAnimation && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none z-50">
                        <div className="animate-bounce text-4xl font-black text-green-500 stroke-black drop-shadow-lg">
                            +${earnedAnimation.value}
                        </div>
                    </div>
                )}
            </main>

            <aside className="w-full md:w-[350px] h-[30%] md:h-full order-3 z-20 shadow-xl bg-white border-l border-slate-200">
                <Shop 
                    gameState={gameState} 
                    shopRotation={shopRotation}
                    shopTimer={shopTimer}
                    onBuyItem={handleBuyItem} 
                    onSellItem={handleSellItem}
                />
            </aside>
        </div>
    </div>
  );
}
