import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DEFAULT_SETTINGS } from '@/lib/diceUtils';
import { useI18n } from '@/i18n/useI18n';

type SettingsType = typeof DEFAULT_SETTINGS;

export default function Settings() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();

  const [settings, setSettings] = useState<SettingsType>(() => {
    const savedSettings = localStorage.getItem('diceSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  const [rollDuration, setRollDuration] = useState<string | number>(settings.rollDuration);
  const [durationError, setDurationError] = useState('');

  useEffect(() => {
    const newSettings: SettingsType = {
      ...settings,
      rollDuration: typeof rollDuration === 'string' ? 
                   (rollDuration === '' ? DEFAULT_SETTINGS.rollDuration : parseInt(rollDuration)) : 
                   rollDuration
    };
    localStorage.setItem('diceSettings', JSON.stringify(newSettings));
  }, [settings, rollDuration]);

  const handleButtonAnimationChange = (value: 'move' | 'hide') => {
    setSettings(prev => ({ ...prev, buttonAnimation: value }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!value) {
      setDurationError('');
      setRollDuration('');
      return;
    }

    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 10) {
      setDurationError(t('errors.invalidInteger'));
      return;
    }

    setDurationError('');
    setRollDuration(num);
  };

  const handleDurationBlur = () => {
    if (!rollDuration) {
      setDurationError(t('errors.enterRollTime'));
    }
  };

  const handleLanguageChange = (lang: 'zh-CN' | 'en-US') => {
    setLocale(lang);
  };

  const handleEasingTypeChange = (easingType: SettingsType['easingType']) => {
    setSettings(prev => ({ ...prev, easingType }));
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

      <div className="container mx-auto px-4 py-8 h-full flex flex-col">
        <button
          onClick={() => navigate('/')}
          className={cn(
            "self-start mb-8 px-4 py-2 rounded-lg font-orbitron",
            "bg-[#1E1E1E] hover:bg-[#00F5FF]/10",
            "transition-all duration-300",
            "flex items-center gap-2"
          )}
        >
          <i className="fas fa-arrow-left"></i> {t('common.back')}
        </button>

        <h1 className="text-3xl font-orbitron mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#00F5FF] to-[#00FF9D]">
          {t('common.settings')}
        </h1>

        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Language selection */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-6 rounded-xl bg-[#1E1E1E]/80 backdrop-blur-sm",
              "border border-[#00F5FF]/20 hover:border-[#00F5FF]/40",
              "transition-all duration-300"
            )}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-orbitron text-lg text-[#00F5FF]">{t('common.language')}</h3>
                <p className="text-gray-400">{t('common.chooseLanguage')}</p>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="language" 
                    value="zh-CN" 
                    checked={locale === 'zh-CN'}
                    onChange={() => handleLanguageChange('zh-CN')}
                    className="accent-[#00F5FF]"
                  />
                  <span>中文</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="language" 
                    value="en-US" 
                    checked={locale === 'en-US'}
                    onChange={() => handleLanguageChange('en-US')}
                    className="accent-[#00F5FF]"
                  />
                  <span>English</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Button Animation */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-6 rounded-xl bg-[#1E1E1E]/80 backdrop-blur-sm",
              "border border-[#00F5FF]/20 hover:border-[#00F5FF]/40",
              "transition-all duration-300"
            )}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-orbitron text-lg text-[#00FF9D]">{t('common.buttonAnimation')}</h3>
                <p className="text-gray-400">{t('common.chooseButtonBehavior')}</p>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="buttonAnimation" 
                    value="move" 
                    checked={settings.buttonAnimation === 'move'}
                    onChange={() => handleButtonAnimationChange('move')}
                    className="accent-[#00F5FF]"
                  />
                  <span>{t('common.moveButton')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="buttonAnimation" 
                    value="hide" 
                    checked={settings.buttonAnimation === 'hide'}
                    onChange={() => handleButtonAnimationChange('hide')}
                    className="accent-[#00F5FF]"
                  />
                  <span>{t('common.hideButton')}</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Easing Type */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-6 rounded-xl bg-[#1E1E1E]/80 backdrop-blur-sm",
              "border border-[#00F5FF]/20 hover:border-[#00F5FF]/40",
              "transition-all duration-300"
            )}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-orbitron text-lg text-[#00FF9D]">{t('common.easingType')}</h3>
                <p className="text-gray-400">{t('common.chooseEasingType')}</p>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="easingType" 
                    value="linear" 
                    checked={settings.easingType === 'linear'}
                    onChange={() => handleEasingTypeChange('linear')}
                    className="accent-[#00F5FF]"
                  />
                  <span>{t('common.linear')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="easingType" 
                    value="quadratic" 
                    checked={settings.easingType === 'quadratic'}
                    onChange={() => handleEasingTypeChange('quadratic')}
                    className="accent-[#00F5FF]"
                  />
                  <span>{t('common.quadratic')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="easingType" 
                    value="exponential" 
                    checked={settings.easingType === 'exponential'}
                    onChange={() => handleEasingTypeChange('exponential')}
                    className="accent-[#00F5FF]"
                  />
                  <span>{t('common.exponential')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="easingType" 
                    value="sine" 
                    checked={settings.easingType === 'sine'}
                    onChange={() => handleEasingTypeChange('sine')}
                    className="accent-[#00F5FF]"
                  />
                  <span>{t('common.sine')}</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Roll duration setting */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
              "p-6 rounded-xl bg-[#1E1E1E]/80 backdrop-blur-sm",
              "border border-[#00F5FF]/20 hover:border-[#00F5FF]/40",
              "transition-all duration-300"
            )}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-orbitron text-lg text-[#00FF9D]">{t('common.rollDuration')}</h3>
                <p className="text-gray-400">{t('common.setRollDuration')}</p>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[1-9]|10"
                  value={rollDuration}
                  onChange={handleDurationChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  onBlur={handleDurationBlur}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg font-orbitron",
                    "bg-[#1E1E1E] border border-[#00F5FF]/30",
                    "focus:outline-none focus:ring-2 focus:ring-[#00F5FF]",
                    durationError && "border-red-500"
                  )}
                />
                {durationError && (
                  <p className="text-red-500 text-sm">{durationError}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}