// Level/stat cheats for Gold Quest
// Module for BlooketHacks

(function() {
  'use strict';

  const StatsCheats = {
    enabled: false,

    init() {
      console.log('[StatsCheats] Initialized');
      this.createControlUI();
    },

    // Try to find and modify player stats
    modifyStats(stat, value) {
      // Try to access game state through different possible paths
      const gameState = this.getGameState();

      if (!gameState) {
        console.warn('[StatsCheats] Could not find game state');
        return false;
      }

      // Common stat names
      const statNames = {
        level: ['level', 'playerLevel', 'level'],
        gold: ['gold', 'coins', 'currency', 'gold'],
        health: ['health', 'hp', 'health'],
        defense: ['defense', 'def', 'defense'],
        attack: ['attack', 'atk', 'damage'],
      };

      const possibleNames = statNames[stat] || [stat];

      for (const name of possibleNames) {
        if (name in gameState) {
          gameState[name] = value;
          console.log(`[StatsCheats] Set ${stat} to ${value}`);
          return true;
        }
      }

      console.warn(`[StatsCheats] Could not find stat: ${stat}`);
      return false;
    },

    // Try multiple approaches to get game state
    getGameState() {
      // Check window globals
      if (window.__game) return window.__game;
      if (window.gameState) return window.gameState;
      if (window.game) return window.game;

      // Check React/Vue dev tools
      const rootEl = document.querySelector('#root');
      if (rootEl && rootEl.__react) {
        return rootEl.__react;
      }

      // Try to find in localStorage
      try {
        const saved = localStorage.getItem('gameState');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('[StatsCheats] Error reading localStorage:', e);
      }

      return null;
    },

    // Add level
    addLevel(amount = 1) {
      const gameState = this.getGameState();
      if (gameState && 'level' in gameState) {
        gameState.level += amount;
        console.log(`[StatsCheats] Added ${amount} levels`);
        return true;
      }
      return false;
    },

    // Add gold/currency
    addGold(amount = 1000) {
      const gameState = this.getGameState();
      if (gameState) {
        const goldKey = Object.keys(gameState).find(k =>
          ['gold', 'coins', 'currency'].includes(k.toLowerCase())
        );

        if (goldKey) {
          gameState[goldKey] += amount;
          console.log(`[StatsCheats] Added ${amount} gold`);
          return true;
        }
      }
      return false;
    },

    // Max out stats
    maxStats() {
      const gameState = this.getGameState();
      if (!gameState) return false;

      const maxValue = 999999;

      if ('level' in gameState) gameState.level = maxValue;
      if ('health' in gameState) gameState.health = maxValue;
      if ('attack' in gameState) gameState.attack = maxValue;
      if ('defense' in gameState) gameState.defense = maxValue;

      // Gold variations
      for (const key of Object.keys(gameState)) {
        if (['gold', 'coins', 'currency', 'money'].includes(key.toLowerCase())) {
          gameState[key] = maxValue;
        }
      }

      console.log('[StatsCheats] Maxed out all stats');
      return true;
    },

    createControlUI() {
      // Will add control panel buttons later
    },
  };

  window.BlooketHacks.HACKS.cheats.stats = StatsCheats;
})();
