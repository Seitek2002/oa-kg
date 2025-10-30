import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import ky from '../locales/ky.json';
import ru from '../locales/ru.json';

type Lang = 'ky' | 'ru';
type Dict = Record<string, string>;

interface LocaleContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const dicts: Record<Lang, Dict> = { ky, ru };

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  // Default language is Kyrgyz
  const [lang, setLangState] = useState<Lang>('ky');

  useEffect(() => {
    const saved = (localStorage.getItem('lang') as Lang) || 'ky';
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = useMemo(() => {
    const d = dicts[lang] || dicts.ky;
    return (key: string) => d[key] ?? '';
  }, [lang]);

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
};
