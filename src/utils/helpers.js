// Helper utilities for BlooketHacks

window.BlooketHacks = window.BlooketHacks || { HACKS: {} };

const Helpers = {
  // DOM manipulation helpers
  querySelector(selector) {
    return document.querySelector(selector);
  },

  querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  },

  // Wait for element to appear in DOM
  async waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return null;
  },

  // Inject CSS
  injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },

  // Get game state (if available)
  getGameState() {
    // Will be populated once we understand Blooket's game state structure
    return null;
  },
};

window.BlooketHacks.Helpers = Helpers;
