// ==UserScript==
// @name         Blooket Gold Quest Hacks
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Auto-answer questions and stat cheats for Blooket Gold Quest
// @author       alex
// @match        https://www.blooket.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const HACKS = {
    bots: {},
    cheats: {},
  };

  // ===== HELPERS =====
  const Helpers = {
    querySelector(selector) {
      return document.querySelector(selector);
    },
    querySelectorAll(selector) {
      return document.querySelectorAll(selector);
    },
    async waitForElement(selector, timeout = 5000) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return null;
    },
  };

  // ===== AUTO-ANSWER =====
  const AutoAnswer = {
    enabled: false,
    delay: 500,

    init() {
      this.setupObserver();
      console.log('[AutoAnswer] Initialized');
    },

    start() {
      this.enabled = true;
      console.log('[AutoAnswer] Started');
      this.updateUI();
    },

    stop() {
      this.enabled = false;
      console.log('[AutoAnswer] Stopped');
      this.updateUI();
    },

    setupObserver() {
      const observer = new MutationObserver(() => {
        if (this.enabled) {
          this.checkForQuestion();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    },

    checkForQuestion() {
      const questionContainer = document.querySelector('[class*="question"]') ||
                                document.querySelector('[class*="Question"]');

      if (!questionContainer) return;

      const answerButtons = Array.from(
        document.querySelectorAll('button[class*="answer"], button[class*="option"], div[role="button"][class*="answer"]')
      );

      if (answerButtons.length === 0) return;

      const correctAnswer = answerButtons[0];

      if (correctAnswer && !correctAnswer.dataset.hacksAnswered) {
        setTimeout(() => {
          if (this.enabled) {
            correctAnswer.click();
            correctAnswer.dataset.hacksAnswered = 'true';
            console.log('[AutoAnswer] Answered question');
          }
        }, this.delay);
      }
    },

    setDelay(ms) {
      this.delay = ms;
      console.log(`[AutoAnswer] Delay set to ${ms}ms`);
    },

    updateUI() {
      const status = document.getElementById('hack-status');
      if (status) {
        status.textContent = this.enabled ? '✓ Auto-Answer ON' : 'Auto-Answer OFF';
        status.style.color = this.enabled ? '#4ade80' : '#ef4444';
      }
    },
  };

  // ===== STATS CHEATS =====
  const StatsCheats = {
    enabled: false,

    init() {
      console.log('[StatsCheats] Initialized');
    },

    modifyStats(stat, value) {
      const gameState = this.getGameState();

      if (!gameState) {
        console.warn('[StatsCheats] Could not find game state');
        return false;
      }

      const statNames = {
        level: ['level', 'playerLevel'],
        gold: ['gold', 'coins', 'currency'],
        health: ['health', 'hp'],
        defense: ['defense', 'def'],
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

    getGameState() {
      if (window.__game) return window.__game;
      if (window.gameState) return window.gameState;
      if (window.game) return window.game;

      const rootEl = document.querySelector('#root');
      if (rootEl && rootEl.__react) {
        return rootEl.__react;
      }

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

    addLevel(amount = 1) {
      const gameState = this.getGameState();
      if (gameState && 'level' in gameState) {
        gameState.level += amount;
        console.log(`[StatsCheats] Added ${amount} levels`);
        return true;
      }
      return false;
    },

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

    maxStats() {
      const gameState = this.getGameState();
      if (!gameState) return false;

      const maxValue = 999999;

      if ('level' in gameState) gameState.level = maxValue;
      if ('health' in gameState) gameState.health = maxValue;
      if ('attack' in gameState) gameState.attack = maxValue;
      if ('defense' in gameState) gameState.defense = maxValue;

      for (const key of Object.keys(gameState)) {
        if (['gold', 'coins', 'currency', 'money'].includes(key.toLowerCase())) {
          gameState[key] = maxValue;
        }
      }

      console.log('[StatsCheats] Maxed out all stats');
      return true;
    },
  };

  // ===== CONTROL PANEL =====
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'blooket-hacks-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #1a1a1a;
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      z-index: 10000;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    const title = document.createElement('h3');
    title.textContent = 'Blooket Hacks';
    title.style.cssText = 'margin: 0 0 10px 0; font-size: 14px; color: #60a5fa;';
    panel.appendChild(title);

    const aaButton = createButton('Auto-Answer', () => {
      AutoAnswer.enabled ? AutoAnswer.stop() : AutoAnswer.start();
    });
    panel.appendChild(aaButton);

    const maxStatsButton = createButton('Max Stats', () => {
      StatsCheats.maxStats();
      updateStatus('Stats maxed!');
    });
    panel.appendChild(maxStatsButton);

    const goldButton = createButton('Add 10K Gold', () => {
      StatsCheats.addGold(10000);
      updateStatus('Added 10K gold!');
    });
    panel.appendChild(goldButton);

    const status = document.createElement('div');
    status.id = 'hack-status';
    status.textContent = 'Ready';
    status.style.cssText = 'font-size: 11px; color: #4ade80; margin-top: 10px; border-top: 1px solid #333; padding-top: 10px;';
    panel.appendChild(status);

    document.body.appendChild(panel);
  }

  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px;
      margin: 5px 0;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: background 0.2s;
    `;
    button.onmouseenter = () => button.style.background = '#1d4ed8';
    button.onmouseleave = () => button.style.background = '#2563eb';
    button.onclick = onClick;
    return button;
  }

  function updateStatus(text) {
    const status = document.getElementById('hack-status');
    if (status) {
      status.textContent = text;
      status.style.color = '#4ade80';
      setTimeout(() => {
        status.textContent = 'Ready';
      }, 3000);
    }
  }

  // ===== INIT =====
  function init() {
    AutoAnswer.init();
    StatsCheats.init();
    createControlPanel();
    console.log('[Blooket Hacks] Loaded - Open browser console for debug info');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
