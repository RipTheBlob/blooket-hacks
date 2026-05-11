# Blooket Hacks - Gold Quest

A Tampermonkey userscript for Blooket's Gold Quest game mode featuring automated question answering, smart chest picking, theft prevention, and gold multipliers.

## Features

- **Auto-Answer Questions** - Automatically answers questions correctly
- **Best Chest Auto-Picker** - Intelligently selects the best reward chests (double/triple gold, unicorn, jester) and avoids bad ones (dragon, slime, theft)
- **Theft Prevention** - Blocks gold theft effects from other players' Blook abilities
- **Gold Multiplier** - Instantly multiply your gold by 1x to 10x
- **Toggle Controls** - Easy on/off buttons for each feature
- **Real-time Status** - Activity log in the control panel

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Copy `blooket-gold-quest.user.js` or `src/index.js` contents into a new Tampermonkey script
3. Save and enable the script
4. Visit blooket.com/play and start Gold Quest
5. Hacks panel appears in top-right corner with ⚡ Gold Quest Hacks header

## Usage

- **Auto-Answer / Best Chests / Block Theft** - Click to toggle on/off
- **Gold Multiplier Buttons** - Select 1x, 2x, 3x, 5x, or 10x
- **Apply Multiplier NOW** - Click to instantly apply multiplier to current gold

## File Structure

- `blooket-gold-quest.user.js` - **Use this** - Single combined script for Tampermonkey
- `src/index.js` - Same as above, source version
- `src/cheats/` - Individual hack modules (for reference)

## How It Works

### Auto-Answer
Watches DOM for question elements and clicks the first answer option immediately when questions appear.

### Best Chest Picker
Scores each chest based on content:
- +10 triple gold, +9 unicorn, +8 double gold, +7 jester
- -10 dragon, -8 slime, -7 wizard, -6 elf/steal

Picks chest with highest score automatically.

### Theft Prevention
Detects and visually blocks theft effects by hiding them and preventing clicks.

### Gold Multiplier
Accesses game state and multiplies your gold by selected amount.

## License

MIT
