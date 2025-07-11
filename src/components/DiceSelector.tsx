import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';

type DiceSelectorProps = {
  diceType: 4 | 6 | 16 | 20;
  setDiceType: (type: 4 | 6 | 16 | 20) => void;
  disabled: boolean;
};

export default function DiceSelector({ diceType, setDiceType, disabled }: DiceSelectorProps) {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const diceOptions = [
    { value: 4, label: t('diceTypes.d4'), color: 'from-[#3b82f6] to-[#2563eb]' },
    { value: 6, label: t('diceTypes.d6'), color: 'from-[#10b981] to-[#059669]' },
    { value: 16, label: t('diceTypes.d16'), color: 'from-[#ec4899] to-[#db2777]' },
    { value: 20, label: t('diceTypes.d20'), color: 'from-[#f97316] to-[#ea580c]' }
  ];

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={disabled}
          className={cn(
            "px-6 py-3 rounded-lg font-orbitron",
            "bg-gradient-to-r from-[#00F5FF] to-[#00FF9D]",
            "transition-all duration-300",
            "flex items-center gap-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {t('common.selectDice')} <i className="fas fa-chevron-down"></i>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-full bg-[#1E1E1E] rounded-lg shadow-lg z-10 border border-[#00F5FF]/20">
            {diceOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setDiceType(option.value);
                  setShowDropdown(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left font-orbitron",
                  "hover:bg-[#00F5FF]/10",
                  "transition-colors duration-200",
                  diceType === option.value && "bg-[#00F5FF]/20"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {diceOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setDiceType(option.value)}
          disabled={disabled}
          className={cn(
            "px-6 py-3 rounded-lg font-orbitron",
            `bg-gradient-to-r ${option.color}`,
            "transition-all duration-300 hover:scale-105",
            "hover:shadow-[0_0_15px_2px_rgba(0,245,255,0.5)]",
            "active:scale-95",
            disabled && "opacity-50 cursor-not-allowed",
            diceType === option.value && "ring-2 ring-white scale-110"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}