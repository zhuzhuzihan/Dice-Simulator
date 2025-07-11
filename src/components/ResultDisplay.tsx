import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';

type ResultDisplayProps = {
  result: number | null;
  history: Record<4 | 6 | 16 | 20, number[]>;
  diceType: 4 | 6 | 16 | 20;
};

export default function ResultDisplay({ result, history, diceType }: ResultDisplayProps) {
  const { t } = useI18n();
  
   const getTextColor = () => {
    switch (diceType) {
      case 4: return 'text-[#00F5FF]';
      case 6: return 'text-[#00FF9D]';
      case 16: return 'text-[#FF00F5]';
      case 20: return 'text-[#FFA500]';
      default: return 'text-white';
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        {result !== null && (
          <div className={cn(
            "text-6xl font-orbitron font-bold",
            getTextColor(),
            "text-center",
            "animate-bounce"
          )}>
            {result}
          </div>
        )}

        {history[diceType].length > 0 && (
          <div className="w-full bg-[#1E1E1E]/50 rounded-lg p-4 border border-[#00F5FF]/20">
            <h3 className="text-lg font-orbitron mb-2 text-center text-[#00F5FF]">{t('common.recentRolls')}</h3>
            <div className="flex justify-center gap-2">
              {history[diceType].map((roll, index) => (
                <div 
                  key={index}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "font-orbitron font-bold",
                    getTextColor(),
                    "border border-current"
                  )}
                >
                  {roll}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}