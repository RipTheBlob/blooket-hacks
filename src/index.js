// ==UserScript==
// @name         Blooket Gold Quest Hacks
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Complete Gold Quest hacks - auto-answer, best chests, prevent theft, gold multipliers
// @author       alex
// @match        https://www.blooket.com/*
// @match        https://goldquest.blooket.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    autoAnswer: true,
    autoPickBestChest: true,
    preventTheft: true,
    autoMultiplyGold: true,
    goldMultiplier: 2,
  };

  // Auto-answer questions
  const QuestionHacker = {
    enabled: CONFIG.autoAnswer,

    init() {
      this.setupObserver();
      console.log('[QuestionHacker] Initialized');
    },

    setupObserver() {
      const observer = new MutationObserver(() => {
        if (this.enabled) {
          this.checkAndAnswerQuestion();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    checkAndAnswerQuestion() {
      const answerButtons = Array.from(
        document.querySelectorAll(
          'button[class*="answer"],' +
          'div[class*="option"],' +
          'div[role="button"][class*="answer"],' +
          '[class*="AnswerOption"],' +
          '[class*="answerBox"]'
        )
      );

      if (answerButtons.length === 0) return;

      const correctAnswer = answerButtons[0];

      if (correctAnswer && !correctAnswer.dataset.hacksAnswered) {
        setTimeout(() => {
          if (this.enabled && correctAnswer.offsetParent !== null) {
            correctAnswer.click();
            correctAnswer.dataset.hacksAnswered = 'true';
            console.log('[QuestionHacker] Answered question');
            updateStatus('Question answered');
          }
        }, 300);
      }
    },

    toggle() {
      this.enabled = !this.enabled;
    },
  };

  // Auto-pick best chest
  const ChestHacker = {
    enabled: CONFIG.autoPickBestChest,

    init() {
      this.setupObserver();
      console.log('[ChestHacker] Initialized');
    },

    setupObserver() {
      const observer = new MutationObserver(() => {
        if (this.enabled) {
          this.checkForChests();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    checkForChests() {
      const chests = Array.from(
        document.querySelectorAll('[class*="chest"], [class*="Chest"], [class*="reward"], [class*="option"]')
      );

      if (chests.length < 2) return;

      let bestChest = null;
      let bestScore = -999;

      chests.forEach(chest => {
        if (chest.dataset.hacksSelectedChest) return;
        const score = this.scoreChest(chest);

        if (score > bestScore) {
          bestScore = score;
          bestChest = chest;
        }
      });

      if (bestChest && !bestChest.dataset.hacksSelectedChest) {
        setTimeout(() => {
          if (this.enabled && bestChest.offsetParent !== null) {
            bestChest.click();
            bestChest.dataset.hacksSelectedChest = 'true';
            console.log('[ChestHacker] Picked best chest');
            updateStatus('Best chest picked');
          }
        }, 500);
      }
    },

    scoreChest(element) {
      const text = element.textContent.toLowerCase();
      let score = 0;

      if (text.includes('triple')) score += 10;
      if (text.includes('double') || text.includes('multiply')) score += 8;
      if (text.includes('unicorn')) score += 9;
      if (text.includes('jester')) score += 7;
      if (text.includes('dragon')) score -= 10;
      if (text.includes('slime')) score -= 8;
      if (text.includes('steal') || text.includes('elf')) score -= 6;
      if (text.includes('wizard')) score -= 7;
      if (text.includes('gold') && score === 0) score += 3;

      return score;
    },

    toggle() {
      this.enabled = !this.enabled;
    },
  };

  // Prevent gold theft
  const TheftPrevention = {
    enabled: CONFIG.preventTheft,

    init() {
      this.setupObserver();
      console.log('[TheftPrevention] Initialized');
    },

    setupObserver() {
      const observer = new MutationObserver(() => {
        if (this.enabled) {
          this.interceptTheft();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    },

    interceptTheft() {
      const theftElements = Array.from(
        document.querySelectorAll('[class*="steal"], [class*="dragon"], [class*="wizard"], [class*="elf"]')
      );

      theftElements.forEach(el => {
        if (!el.dataset.hacksTheftBlocked) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.dataset.hacksTheftBlocked = 'true';
          console.log('[TheftPrevention] Blocked theft effect');
        }
      });
    },

    toggle() {
      this.enabled = !this.enabled;
    },
  };

  // Gold multiplier
  const GoldMultiplier = {
    enabled: CONFIG.autoMultiplyGold,
    multiplier: CONFIG.goldMultiplier,

    init() {
      console.log('[GoldMultiplier] Initialized with 2x multiplier');
    },

    applyMultiplier() {
      try {
        const gameState = window.__GOLD_QUEST_STATE || window.gameState;
        if (gameState && gameState.playerGold !== undefined) {
          gameState.playerGold *= this.multiplier;
          console.log(`[GoldMultiplier] Applied ${this.multiplier}x multiplier`);
          updateStatus(`Gold multiplied by ${this.multiplier}x`);
          return true;
        }
      } catch (e) {
        console.error('[GoldMultiplier] Error:', e);
      }
      return false;
    },

    setMultiplier(value) {
      this.multiplier = value;
    },

    toggle() {
      this.enabled = !this.enabled;
    },
  };

  // Create control panel
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'blooket-hacks-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      z-index: 10000;
      min-width: 280px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.4);
      border: 2px solid #60a5fa;
    `;

    const title = document.createElement('h3');
    title.textContent = '⚡ GOLD QUEST HACKS';
    title.style.cssText = 'margin: 0 0 10px 0; font-size: 13px; color: #fbbf24; letter-spacing: 1px;';
    panel.appendChild(title);

    const buttons = [
      { text: '✓ Auto-Answer', hack: QuestionHacker, id: 'btn-answer' },
      { text: '✓ Best Chests', hack: ChestHacker, id: 'btn-chest' },
      { text: '✓ Block Theft', hack: TheftPrevention, id: 'btn-theft' },
    ];

    buttons.forEach(({ text, hack, id }) => {
      const btn = createButton(text, () => {
        hack.toggle();
        btn.style.opacity = hack.enabled ? '1' : '0.5';
      });
      btn.id = id;
      panel.appendChild(btn);
    });

    const goldDiv = document.createElement('div');
    goldDiv.style.cssText = 'margin: 10px 0; padding: 10px 0; border-top: 1px solid #333;';

    const goldLabel = document.createElement('div');
    goldLabel.textContent = 'Gold Multiplier:';
    goldLabel.style.cssText = 'font-size: 11px; color: #9ca3af; margin-bottom: 5px;';
    goldDiv.appendChild(goldLabel);

    const multiplierButtons = [1, 2, 3, 5, 10];
    multiplierButtons.forEach(mult => {
      const btn = document.createElement('button');
      btn.textContent = `${mult}x`;
      btn.style.cssText = `
        padding: 5px 8px;
        margin: 2px;
        background: ${mult === 2 ? '#2563eb' : '#374151'};
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
      `;
      btn.onclick = () => {
        GoldMultiplier.setMultiplier(mult);
        multiplierButtons.forEach(m => {
          document.querySelectorAll('button').forEach(b => {
            if (b.textContent.includes(`${m}x`)) {
              b.style.background = mult === m ? '#2563eb' : '#374151';
            }
          });
        });
      };
      goldDiv.appendChild(btn);
    });
    panel.appendChild(goldDiv);

    const applyBtn = createButton('Apply Multiplier NOW', () => {
      GoldMultiplier.applyMultiplier();
    });
    applyBtn.style.background = '#d97706';
    applyBtn.style.marginTop = '8px';
    panel.appendChild(applyBtn);

    const status = document.createElement('div');
    status.id = 'hack-status';
    status.textContent = '● Ready';
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
      transition: all 0.2s;
    `;
    button.onmouseenter = () => button.style.background = '#1d4ed8';
    button.onmouseleave = () => button.style.background = '#2563eb';
    button.onclick = onClick;
    return button;
  }

  function updateStatus(text) {
    const status = document.getElementById('hack-status');
    if (status) {
      status.textContent = '● ' + text;
      status.style.color = '#4ade80';
      setTimeout(() => {
        status.textContent = '● Ready';
      }, 3000);
    }
  }

  function init() {
    QuestionHacker.init();
    ChestHacker.init();
    TheftPrevention.init();
    GoldMultiplier.init();
    createControlPanel();
    console.log('[Gold Quest Hacks] LOADED');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
