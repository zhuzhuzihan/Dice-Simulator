export function getDiceColor(type: 4 | 6 | 16): string {
  switch (type) {
    case 4: return '#00F5FF';
    case 6: return '#00FF9D';
    case 16: return '#FF00F5';
    default: return '#FFFFFF';
  }
}

export function getDiceName(type: 4 | 6 | 16): string {
  switch (type) {
    case 4: return 'D4';
    case 6: return 'D6';
    case 16: return 'D16';
    default: return 'Dice';
  }
}

export function generateRandomNumber(type: 4 | 6 | 16): number {
  return Math.floor(Math.random() * type) + 1;
}

// Default settings
export const DEFAULT_SETTINGS = {
  particleIntensity: 50,
  buttonAnimation: 'move', // 'move' or 'hide'
  rollDuration: 5 // 1-10 seconds
};