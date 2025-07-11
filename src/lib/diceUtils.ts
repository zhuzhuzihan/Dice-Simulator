export function getDiceColor(type: 4 | 6 | 16 | 20): string {
  switch (type) {
    case 4: return '#3b82f6';
    case 6: return '#10b981';
    case 16: return '#ec4899';
    case 20: return '#f97316';
    default: return '#FFFFFF';
  }
}

export function getDiceName(type: 4 | 6 | 16 | 20): string {
  switch (type) {
    case 4: return 'D4';
    case 6: return 'D6';
    case 16: return 'D16';
    case 20: return 'D20';
    default: return 'Dice';
  }
}

export function generateRandomNumber(type: 4 | 6 | 16 | 20): number {
  return Math.floor(Math.random() * type) + 1;
}

// Easing functions
export const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  quadratic: (t: number) => t * (2 - t),
  exponential: (t: number) => 1 - Math.pow(2, -10 * t),
  sine: (t: number) => Math.sin(t * Math.PI / 2)
};

// Default settings
export const DEFAULT_SETTINGS = {
  buttonAnimation: 'move', // 'move' or 'hide'
  rollDuration: 5, // 1-10 seconds
  easingType: 'linear' // 'linear', 'quadratic', 'exponential', 'sine'
};