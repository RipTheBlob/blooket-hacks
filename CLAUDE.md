# Blooket Hacks - Gold Quest

## Overview

Tampermonkey userscript for Blooket's Gold Quest game mode.
Players answer trivia questions and pick mystery chests with random effects (gold, multipliers, thefts).

## Game Mechanics

- Players answer questions → pick 1 of 3 mystery chests
- Chest effects: gold amounts, double/triple gold, Blook abilities (steal, swap, etc.)
- Goal: Have most gold when timer runs out

## Hacks Implemented

1. **Auto-Answer** - Auto-clicks first answer option
2. **Best Chest Picker** - Scores chests, picks highest scoring one
   - Good: triple/double gold, unicorn, jester (+8 to +10 points)
   - Bad: dragon, slime, wizard, elf/steal (-6 to -10 points)
3. **Theft Prevention** - Blocks/hides gold theft effects
4. **Gold Multiplier** - 1x to 10x multiplier on current gold

## Related Projects

- School iPad App: `C:\Users\alex\school-app` (Firebase-based game platform)

## Technical Notes

- Vanilla JavaScript (Tampermonkey userscript)
- DOM selectors are generic - may need refinement based on Blooket's actual structure
- Game state access: tries multiple window globals and localStorage
- MutationObserver for real-time DOM changes
- Control panel UI: top-right corner, always visible
