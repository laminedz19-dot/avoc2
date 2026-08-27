'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'fr';

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  phoneVerified: boolean;
  isDemo?: boolean;
  role: 'USER' | 'ADMIN';
  avatarUrl: string;
  wilayaCode: string;
  wilayaName: string;
  communeName: string;
  ratingSum?: number;
  ratingCount?: number;
}

export interface PlatformSettings {
  id: number;
  publicationFeeDzd: number;
  beneficiaryName: string;
  ccpAccount: string;
  ccpKey: string;
  baridimobRib: string;
  instructionsAr: string;
  instructionsFr: string;
}

interface AchriContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  settings: PlatformSettings | null;
  refreshUser: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  t: (arText: string, frText: string) => string;
}

const AchriContext = createContext<AchriContextType | undefined>(undefined);

export function AchriProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('achridz_lang') as Language;
    if (saved === 'fr' || saved === 'ar') {
      setLangState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
    refreshUser();
    refreshSettings();
  }, []);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    localStorage.setItem('achridz_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const t = (arText: string, frText: string) => (lang === 'ar' ? arText : frText);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings || null);
    } catch {
      // ignore
    }
  };

  return (
    <AchriContext.Provider
      value={{
        lang,
        setLang,
        user,
        setUser,
        settings,
        refreshUser,
        refreshSettings,
        authModalOpen,
        setAuthModalOpen,
        t,
      }}
    >
      {children}
    </AchriContext.Provider>
  );
}

export function useAchri() {
  const ctx = useContext(AchriContext);
  if (!ctx) throw new Error('useAchri must be used inside AchriProvider');
  return ctx;
}
