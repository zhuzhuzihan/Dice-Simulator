import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/useI18n';

export default function Dice() {
  const { t } = useI18n();
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div 
        className={cn(
          "w-32 h-32 bg-white rounded-lg shadow-lg",
          "flex items-center justify-center",
          "text-4xl font-bold"
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {t('common.diceSimulator')}
      </motion.div>
    </div>
  );
}