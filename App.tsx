
import React, { useState, useEffect } from 'react';
import { GameState, BrainrotItem, Bot } from './types';
import { MathGame } from './components/MathGame';
import { Shop } from './components/Shop';
import { RivalsList } from './components/RivalsList';
import { StatusHeader } from './components/StatusHeader';
import { HelpModal } from './components/HelpModal';
import { StealChallenge } from './components/StealChallenge';
import { BaseDefense } from './components/BaseDefense';
import { AdminPanel } from './components/AdminPanel';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { SHOP_ITEMS, getPassiveIncome, BASE_INVENTORY_SIZE, MAX_BOT_INVENTORY_SIZE, BOT_PROFILES, getRebirthCost, REBIRTH_MULTIPLIER_BONUS } from './constants';
import { ShieldAlert, Play, Terminal } from 'lucide-react';

const INITIAL_STATE: GameState = {
  money: 0,
  inventory: [],
  streak: 0,
  totalAnswered: 0,
  multiplier: 1,
  baseMoney: 0,
  timerBonus: 0,
  shieldActive: false,
  godMode: false,
  streakBonusMult: 1,
  bots: [],
  nextAttackTime: Date.now() + 60000, // Start with 60s grace period
  consecutiveTimeouts: 0,
  rebirths: 0
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
            // Give 2-3 random items to start (so they don't start full)
            const count = 2 + Math.floor(Math.random() * 2);
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
            nextBuyTime: bot.nextBuyTime ?? (Date.now() + Math.random() * 60000),
            // Enforce new limit on existing bots
            inventory: bot.inventory.slice(0, MAX_BOT_INVENTORY_SIZE)
        }));
    }

    // Migration for nextAttackTime
    if (!state.nextAttackTime) {
        state.nextAttackTime = Date.now() + 60000;
    }
    
    // Migration for consecutiveTimeouts
    if (state.consecutiveTimeouts === undefined) {
        state.consecutiveTimeouts = 0;
    }

    // Migration for rebirths
    if (state.rebirths === undefined) {
        state.rebirths = 0;
    }
    
    // Migration for godMode
    if (state.godMode === undefined) {
        state.godMode = false;
    }

    return state;
  });

  const [showHelp, setShowHelp] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false); // New State for Confirmation
  const [earnedAnimation, setEarnedAnimation] = useState<{value: number, id: number} | null>(null);
  const [attackNotification, setAttackNotification] = useState<{message: string, success: boolean} | null>(null);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [lastPauseTime, setLastPauseTime] = useState<number | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
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

  // Pause Toggle Logic
  const togglePause = () => {
    if (isGamePaused) {
        // Resume
        const now = Date.now();
        const diff = lastPauseTime ? now - lastPauseTime : 0;

        setGameState(prev => ({
            ...prev,
            nextAttackTime: prev.nextAttackTime + diff,
            bots: prev.bots.map(b => ({
                ...b,
                nextVulnerableTime: b.nextVulnerableTime + diff,
                vulnerableUntil: b.vulnerableUntil > 0 ? b.vulnerableUntil + diff : 0,
                nextBuyTime: b.nextBuyTime + diff
            }))
        }));

        if (activeAttack) {
            setActiveAttack(prev => prev ? ({ ...prev, expiresAt: prev.expiresAt + diff }) : null);
        }

        setIsGamePaused(false);
        setLastPauseTime(null);
    } else {
        // Pause
        setIsGamePaused(true);
        setLastPauseTime(Date.now());
    }
  };

  // Full Reset Logic Steps
  // 1. Trigger Modal
  const requestFullReset = () => {
      setShowResetConfirm(true);
      setShowAdminPanel(false); // Close admin panel if open
  };

  // 2. Perform Reset
  const executeFullReset = () => {
      localStorage.removeItem('brainrot-math-save');
      window.location.reload();
  };

  // Admin Actions
  const handleAdminAction = (action: string) => {
      if (gameState.rebirths < 8) return;

      switch(action) {
          case 'add_money_small':
              setGameState(prev => ({ ...prev, money: prev.money + 1000000 }));
              setAttackNotification({ message: "ADMIN: +1M CASH", success: true });
              break;
          case 'add_money_large':
              setGameState(prev => ({ ...prev, money: prev.money + 100000000 }));
              setAttackNotification({ message: "ADMIN: +100M CASH", success: true });
              break;
          case 'infinite_shield':
              setGameState(prev => ({ ...prev, godMode: !prev.godMode }));
              setAttackNotification({ message: `ADMIN: GOD MODE ${!gameState.godMode ? 'ENABLED' : 'DISABLED'}`, success: true });
              break;
          case 'trigger_attack':
              setActiveAttack({ expiresAt: Date.now() + 14000 });
              setShowAdminPanel(false);
              break;
          case 'clear_bots':
               setGameState(prev => ({
                   ...prev,
                   bots: prev.bots.map(b => ({ ...b, inventory: [] }))
               }));
               setAttackNotification({ message: "ADMIN: BOTS RESET", success: true });
              break;
          case 'give_random_item':
              const mythics = SHOP_ITEMS.filter(i => i.rarity === 'mythic');
              const randomMythic = mythics[Math.floor(Math.random() * mythics.length)];
              handleBuyItem({...randomMythic, price: 0}); // Free buy
              setAttackNotification({ message: `ADMIN: GAVE ${randomMythic.name}`, success: true });
              break;
          case 'hard_reset':
              requestFullReset();
              break;
      }
      setTimeout(() => setAttackNotification(null), 2000);
  };

  // Helper to generate a new shop rotation
  const generateNewShopRotation = () => {
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

        return [...selectedCommons, ...selectedRandoms];
  };

  // Initial Shop Load
  useEffect(() => {
    if (shopRotation.length === 0) {
        setShopRotation(generateNewShopRotation());
    }
  }, []);

  // Shop Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
        if (showHelp || activeSteal || activeAttack || isGamePaused || showAdminPanel || showResetConfirm) return;

        setShopTimer((prev) => {
            if (prev <= 1) {
                setShopRotation(generateNewShopRotation());
                return SHOP_ROTATION_TIME;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [showHelp, activeSteal, activeAttack, isGamePaused, showAdminPanel, showResetConfirm]);

  // Passive Income Logic & Bot AI & Vulnerability Loop & Attack Loop
  useEffect(() => {
    const loop = setInterval(() => {
        if (showHelp || activeSteal || isGamePaused || showAdminPanel || showResetConfirm) return; // Don't process if busy stealing or paused
        
        const now = Date.now();

        // 0. Base Defense Check
        // Only trigger if not already under attack, help closed, and not currently stealing
        if (!activeAttack && now > gameState.nextAttackTime) {
            setActiveAttack({ expiresAt: now + 14000 }); // 14 seconds
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
                    
                    // Default Duration: 5-10s (Max 10s)
                    let duration = 5000 + Math.random() * 5000;
                    
                    // Mr. Gremillion: sleeps for 3-5s (Harder/Faster)
                    if (updatedBot.name === "Mr. Gremillion") {
                        duration = 3000 + Math.random() * 2000;
                    }

                    updatedBot.vulnerableUntil = now + duration;
                }
            }

            // Buying Logic: Every 60 seconds (Fixed)
            if (updatedBot.inventory.length < MAX_BOT_INVENTORY_SIZE && now > updatedBot.nextBuyTime) {
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
  }, [gameState.inventory, showHelp, activeSteal, gameState.bots, activeAttack, gameState.nextAttackTime, isGamePaused, showAdminPanel, showResetConfirm]);

  // Calculate stats including Rebirth Bonus
  const calculateStats = (inventoryIds: string[], currentRebirths: number) => {
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

    // Add Rebirth Multiplier Bonus (Permanent +0.5x per rebirth)
    multiplier += (currentRebirths * REBIRTH_MULTIPLIER_BONUS);

    return { multiplier, baseMoney, timerBonus, streakBonusMult };
  };

  const handleStartGame = () => {
    setShowHelp(false);
    // Reset attack timer when starting game to ensure 60s grace period
    setGameState(prev => ({
        ...prev,
        nextAttackTime: Date.now() + 60000
    }));
  };

  const handleDefendBase = () => {
      setActiveAttack(null);
      // Reset timer to random between 60s and 90s
      setGameState(prev => ({
          ...prev,
          nextAttackTime: Date.now() + 60000 + Math.random() * 30000
      }));
      setAttackNotification({ message: "BASE DEFENDED!", success: true });
      setTimeout(() => setAttackNotification(null), 2000);
  };

  const handleAttackFail = () => {
      // If God Mode is on, don't lose items!
      if (gameState.godMode) {
          setActiveAttack(null);
          setGameState(prev => ({
               ...prev,
               nextAttackTime: Date.now() + 60000 + Math.random() * 30000
          }));
          setAttackNotification({ message: "BASE SHIELDED BY GOD MODE!", success: true });
          setTimeout(() => setAttackNotification(null), 3000);
          return;
      }

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
                  const validBots = newBots.filter(b => b.inventory.length < MAX_BOT_INVENTORY_SIZE);
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

          const stats = calculateStats(newInventory, prev.rebirths);
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
              nextAttackTime: Date.now() + 60000 + Math.random() * 30000 // Reset timer (60-90s)
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
        if (prev.godMode) return prev; // GOD MODE PROTECTION

        if (prev.shieldActive) {
            return { ...prev, shieldActive: false };
        } else {
            return { ...prev, streak: 0 };
        }
    });
  };

  const handleTimeOut = () => {
    setGameState(prev => {
        if (prev.godMode) return prev; // GOD MODE PROTECTION

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
                if (bot.inventory.length < MAX_BOT_INVENTORY_SIZE) {
                    const newBots = [...nextState.bots];
                    newBots[botIndex] = {
                        ...bot,
                        inventory: [...bot.inventory, itemToSteal.id]
                    };
                    nextState.bots = newBots;
                }
                
                // Recalculate Stats
                const stats = calculateStats(nextState.inventory, prev.rebirths);
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
    const maxInventorySize = BASE_INVENTORY_SIZE + gameState.rebirths;

    // Admin overwrite if needed (handled in calling function, here is standard buy)
    // If price is 0, it's an admin gift
    if (gameState.money < item.price) return;
    if (gameState.inventory.length >= maxInventorySize && item.price > 0) return;
    if (gameState.inventory.includes(item.id)) return;

    setGameState(prev => {
        // If it's an admin gift (price 0) and inventory is full, replace first item
        let newInventory = [...prev.inventory];
        if (item.price === 0 && newInventory.length >= maxInventorySize) {
            newInventory.shift(); 
        }
        newInventory.push(item.id);

        const stats = calculateStats(newInventory, prev.rebirths);
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
        const stats = calculateStats(newInventory, prev.rebirths);
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

  const handleRebirth = () => {
      const nextRebirthCost = getRebirthCost(gameState.rebirths + 1);
      
      if (gameState.money < nextRebirthCost) return;

      setGameState(prev => {
          // Calculate new rebirth count
          const newRebirthCount = prev.rebirths + 1;
          
          // Reset inventory and calculate new base stats (which will just be the rebirth bonus)
          const newStats = calculateStats([], newRebirthCount);
          
          // Clear bots' inventories to reset the playing field
          const resetBots = prev.bots.map(bot => ({
              ...bot,
              inventory: [],
              isVulnerable: false,
              nextVulnerableTime: Date.now() + Math.random() * 30000,
          }));

          setAttackNotification({ message: `REBIRTH ${newRebirthCount} ACHIEVED!`, success: true });
          setTimeout(() => setAttackNotification(null), 3000);

          return {
              ...prev,
              money: 0, // Lose money
              inventory: [], // Lose brainrots
              streak: 0,
              multiplier: newStats.multiplier,
              baseMoney: newStats.baseMoney,
              timerBonus: newStats.timerBonus,
              streakBonusMult: newStats.streakBonusMult,
              shieldActive: false,
              godMode: prev.godMode, // Preserve God Mode status
              consecutiveTimeouts: 0,
              bots: resetBots,
              rebirths: newRebirthCount,
              nextAttackTime: Date.now() + 60000 // 60s grace
          };
      });
  };

  const startSteal = (bot: Bot, itemId: string) => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (!item) return;

      let difficulty = 2000;
      let timeLimit = 20; // STARTING at 20s for common

      // Scaling based on rarity
      switch (item.rarity) {
          case 'common':
              difficulty = 2000; 
              timeLimit = 20;
              break;
          case 'rare':
              difficulty = 4000; 
              timeLimit = 18;
              break;
          case 'epic':
              difficulty = 8000; 
              timeLimit = 16;
              break;
          case 'legendary':
              difficulty = 15000; 
              timeLimit = 14;
              break;
          case 'mythic':
              difficulty = 30000; 
              timeLimit = 12;
              break;
      }

      // MR GREMILLION MODIFIER: HARDER
      if (bot.name === "Mr. Gremillion") {
          difficulty += 5000; 
          timeLimit = Math.max(5, timeLimit - 4); 
      }

      // COACH MODIFIER: EASIER
      if (bot.name.includes("Coach")) {
          difficulty = Math.max(1000, difficulty - 1500); 
          timeLimit += 8; // Extra time
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
              
              const maxInventorySize = BASE_INVENTORY_SIZE + prev.rebirths;

              // If player has space, give item. Else give cash value.
              if (newInventory.length < maxInventorySize) {
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

              // God Mode Protection for fails? Maybe, but let's keep risk for stealing active. 
              // Actually, god mode usually prevents ALL negative effects.
              if (!prev.godMode && prev.inventory.length > 0) {
                  const randomIdx = Math.floor(Math.random() * prev.inventory.length);
                  const lostItemId = prev.inventory[randomIdx];
                  
                  newInventory.splice(randomIdx, 1);
                  
                  if (targetBotIndex > -1) {
                      if (newBots[targetBotIndex].inventory.length < MAX_BOT_INVENTORY_SIZE) {
                          if (!newBots[targetBotIndex].inventory.includes(lostItemId)) {
                             newBots[targetBotIndex].inventory.push(lostItemId);
                          }
                      }
                  }
              }
          }

          const stats = calculateStats(newInventory, prev.rebirths);
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 font-sans relative">
        {showHelp && <HelpModal onStart={handleStartGame} />}
        
        {/* New Reset Confirmation Modal */}
        {showResetConfirm && (
            <ResetConfirmModal 
                onConfirm={executeFullReset} 
                onCancel={() => setShowResetConfirm(false)} 
            />
        )}
        
        {/* Admin Button (Visible only at Rebirth 8+) */}
        {gameState.rebirths >= 8 && !showHelp && (
            <button 
                onClick={() => setShowAdminPanel(true)}
                className="fixed bottom-4 right-4 z-[90] bg-green-900/80 border-2 border-green-500 text-green-400 p-3 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-800 transition-all btn-press"
                title="Admin Panel"
            >
                <Terminal size={24} />
            </button>
        )}

        {showAdminPanel && (
            <AdminPanel 
                onClose={() => setShowAdminPanel(false)} 
                onAction={handleAdminAction}
            />
        )}
        
        {isGamePaused && !showHelp && !showAdminPanel && !showResetConfirm && (
            <div 
                className="fixed inset-0 z-[100] flex items-center justify-center"
                style={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)'
                }}
            >
                <div className="bg-white rounded-2xl p-8 shadow-2xl text-center border-4 border-slate-200 animate-in zoom-in duration-200">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">PAUSED</h2>
                    <p className="text-slate-500 font-bold mb-6">Take a breather!</p>
                    <button 
                        onClick={togglePause}
                        className="bg-slate-900 text-white font-bold text-xl px-8 py-3 rounded-xl hover:bg-slate-800 btn-press flex items-center gap-2 mx-auto transition-colors"
                    >
                        <Play size={20} fill="currentColor" />
                        Resume
                    </button>
                </div>
            </div>
        )}

        {activeAttack && (
            <BaseDefense 
                expiresAt={activeAttack.expiresAt}
                onDefend={handleDefendBase}
                difficulty={Math.max(2000, gameState.money)} // Scale difficulty
                isPaused={isGamePaused || showAdminPanel || showResetConfirm}
            />
        )}
        
        {attackNotification && (
             <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-150 animate-bounce-short pointer-events-none">
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
                isPaused={isGamePaused || showAdminPanel || showResetConfirm}
            />
        )}
        
        {/* Main Game Content - Blurred when paused */}
        <div className={`flex flex-col w-full h-full transition-all duration-300 ${isGamePaused || showResetConfirm ? 'filter blur-[15px] opacity-25 pointer-events-none select-none' : ''}`}>
            <StatusHeader 
                gameState={gameState} 
                isPaused={isGamePaused}
                onTogglePause={togglePause}
            />
            
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
                <aside className="w-full md:w-shop h-30pct md:h-full order-3 md:order-1 z-20 shadow-xl bg-white border-r border-slate-200">
                    <Shop 
                        gameState={gameState} 
                        shopRotation={shopRotation}
                        shopTimer={shopTimer}
                        onBuyItem={handleBuyItem} 
                        onSellItem={handleSellItem}
                        onRebirth={handleRebirth}
                    />
                </aside>

                <main className="flex-1 relative order-1 md:order-2 h-40pct md:h-full overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]">
                    <MathGame 
                        gameState={gameState} 
                        isPaused={showHelp || !!activeSteal || !!activeAttack || isGamePaused || showAdminPanel || showResetConfirm}
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

                <aside className="w-full md:w-sidebar h-30pct md:h-full order-2 md:order-3 z-20 shadow-xl bg-white border-l border-slate-200">
                    <RivalsList 
                        gameState={gameState}
                        onStealAttempt={startSteal}
                    />
                </aside>
            </div>
        </div>
    </div>
  );
}
