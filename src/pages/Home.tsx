import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DiceSelector from '@/components/DiceSelector';
import ResultDisplay from '@/components/ResultDisplay';
import { cn } from '@/lib/utils';
import useSound from 'use-sound';
import { generateRandomNumber, DEFAULT_SETTINGS } from '@/lib/diceUtils';
import { useI18n } from '@/i18n/useI18n';

type DiceType = 4 | 6 | 16 | 20;

export default function Home() {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [diceType, setDiceType] = useState<DiceType>(6);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<DiceType, number[]>>(() => ({
    4: [],
    6: [],
    16: [],
    20: []
  }));
  const [isRolling, setIsRolling] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('diceSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rollingNumbers, setRollingNumbers] = useState<number[]>([]);

  const rollDice = () => {
    if (isRolling) return;
    
    console.log('Starting dice roll animation...');
    setIsRolling(true);
    setResult(null);
    
    // Generate rolling animation numbers (100 numbers for animation)
    const numbers = [];
    for (let i = 0; i < 100; i++) {
      numbers.push(generateRandomNumber(diceType));
    }
    setRollingNumbers(numbers);
    setCurrentIndex(0);
    
    const startTime = performance.now();
    const duration = settings.rollDuration * 1000;
    let lastFrameTime = startTime;
    let animationFrameId: number;
    let isFinalPhase = false;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate dynamic interval (50ms to 300ms)
      let interval = 50;
      if (duration >= 4000) {
        if (duration - elapsed <= 500) {
          // Final 0.5 seconds phase
          if (!isFinalPhase) {
            isFinalPhase = true;
            interval = 300;
          }
        } else {
          // Gradually increase interval from 50ms to 300ms
          const phaseProgress = Math.min(elapsed / (duration - 500), 1);
          interval = 50 + (250 * phaseProgress);
        }
      }

      if (currentTime - lastFrameTime >= interval) {
        const newIndex = Math.floor(progress * numbers.length);
        setCurrentIndex(newIndex);
        lastFrameTime = currentTime;
        console.log(`Animation progress: ${(progress * 100).toFixed(1)}%`, numbers[newIndex]);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Final result
        const rollResult = generateRandomNumber(diceType);
        console.log('Animation completed with result:', rollResult);
         setResult(rollResult);
         setHistory(prev => ({
           ...prev,
           [diceType]: [rollResult, ...prev[diceType]].slice(0, 5)
         }));
        setIsRolling(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      console.log('Cleaning up animation');
      cancelAnimationFrame(animationFrameId);
    };
  };

  return (
    <div className={cn(
      "min-h-screen bg-[#121212] text-white",
      "bg-[url('@/assets/images/grid-pattern.png')] bg-repeat",
      "relative overflow-hidden"
    )}>
      <div className="absolute inset-0 border-4 border-transparent rounded-lg pointer-events-none">
        <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_5px_rgba(0,245,255,0.3)] mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-4 py-8 h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-orbitron mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00F5FF] via-[#00FF9D] to-[#FF00F5]">
          {t('common.diceSimulator')}
        </h1>

        <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
          <DiceSelector 
            diceType={diceType} 
            setDiceType={setDiceType}
            disabled={isRolling}
          />

          <div className="w-full h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "text-8xl font-orbitron font-bold",
                    diceType === 4 ? 'text-[#00F5FF]' : 
                    diceType === 6 ? 'text-[#00FF9D]' : 'text-[#FF00F5]'
                  )}
                >
                  {rollingNumbers[currentIndex] || rollingNumbers[0]}
                </motion.div>
              ) : result !== null && (
                <motion.div
                  key="result"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "text-8xl font-orbitron font-bold",
                    diceType === 4 ? 'text-[#00F5FF]' : 
                    diceType === 6 ? 'text-[#00FF9D]' : 'text-[#FF00F5]'
                  )}
                >
                  {result}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full max-w-md space-y-4 relative">
            <div className="flex justify-between items-center">
               <motion.div
                  className={cn(
                    "flex-1 flex justify-center",
                    isRolling && settings.buttonAnimation === 'hide' && "hidden"
                  )}
                  style={isRolling && settings.buttonAnimation === 'hide' ? { display: 'none' } : {}}
                 animate={isRolling && settings.buttonAnimation === 'move' ? { x: -150 } : { x: 0 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
               >
                 <button
                   onClick={rollDice}
                   disabled={isRolling}
                   className={cn(
                     "px-8 py-4 rounded-full font-orbitron text-xl",
                     "bg-gradient-to-r from-[#00F5FF] to-[#00FF9D]",
                     "hover:from-[#00FF9D] hover:to-[#FF00F5]",
                     "transition-all duration-300 hover:scale-105",
                     "active:scale-95 active:shadow-inner",
                     "disabled:opacity-50 disabled:cursor-not-allowed",
                     "relative overflow-hidden flex items-center justify-center gap-2",
                     isRolling && settings.buttonAnimation === 'hide' && "hidden"
                   )}
                 >
                   {isRolling ? (
                     <>
                       <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                         className="text-xl"
                       >
                         <i className="fas fa-spinner"></i>
                       </motion.div>
                       {t('common.rolling')}
                     </>
                   ) : t('common.rollDice')}
                   <span className="absolute inset-0 rounded-full shadow-[0_0_15px_5px_rgba(0,245,255,0.5)] animate-pulse"></span>
                 </button>
               </motion.div>
               
               <button 
                 onClick={() => navigate('/settings')}
                 className="p-3 text-[#00F5FF] hover:text-[#00FF9D] transition-colors"
               >
                 <i className="fas fa-cog text-xl"></i>
               </button>
            </div>
  
            {isRolling && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-gray-800 rounded-full h-2.5"
              >
                <motion.div 
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#FF00F5]"
                  initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: settings.rollDuration, ease: "linear" }}
                 />
               </motion.div>
            )}
          </div>

          <ResultDisplay 
            result={result}
            history={history}
            diceType={diceType}
          />
        </div>
      </div>
    </div>
  );
}