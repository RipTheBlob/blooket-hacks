// Auto-answer questions for Gold Quest
// Module for BlooketHacks

(function() {
  'use strict';

  const AutoAnswer = {
    enabled: false,
    delay: 500, // ms before auto-answering

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
      // Watch for question elements appearing
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
      // Look for question container (adjust selectors based on Blooket's structure)
      const questionContainer = document.querySelector('[class*="question"]') ||
                                document.querySelector('[class*="Question"]');

      if (!questionContainer) return;

      // Look for answer buttons
      const answerButtons = Array.from(
        document.querySelectorAll('button[class*="answer"], button[class*="option"], div[role="button"][class*="answer"]')
      );

      if (answerButtons.length === 0) return;

      // Pick first answer (can improve logic later)
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

  window.BlooketHacks.HACKS.cheats.autoanswer = AutoAnswer;
})();
