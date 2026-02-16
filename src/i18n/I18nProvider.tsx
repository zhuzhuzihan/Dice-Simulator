import { createContext, useState, useEffect, ReactNode } from 'react';
import zhCN from '@/i18n/locales/zh-CN';
import enUS from '@/i18n/locales/en-US';

type Locale = 'zh-CN' | 'en-US';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'en-US',
  setLocale: () => {},
  t: () => ''
});

const translationsMap = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale) return savedLocale;
    
    const browserLang = navigator.language;
    return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translationsMap[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation is missing
        const enValue = translationsMap['en-US'];
        let fallbackValue: any = enValue;
        for (const k of keys) {
          fallbackValue = fallbackValue?.[k];
          if (fallbackValue === undefined) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
          }
        }
        return fallbackValue || key;
      }
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}