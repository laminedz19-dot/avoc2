'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAchri } from '@/context/AchriContext';
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  User,
  ShieldCheck,
  Globe,
  BadgeCheck,
  LogOut,
  CreditCard,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const { lang, setLang, user, setAuthModalOpen, refreshUser, t } = useAchri();

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    await refreshUser();
  };

  return (
    <>
      {/* Golden Mandatory Law Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-900 text-xs sm:text-sm font-extrabold py-2 px-4 shadow-sm border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-amber-300 text-[11px] px-2 py-0.5 rounded-full font-mono font-bold">
              200 DZD
            </span>
            <span>
              {t(
                'المبدأ الأساسي: لا إعلان منشور بدون دفع رسوم النشر 200 دج وتأكيد العملية عبر بريد الجزائر CCP أو BaridiMob.',
                'Règle d’or : Aucune annonce publiée sans paiement des frais de publication 200 DZD et validation manuelle CCP.'
              )}
            </span>
          </div>
          <Link
            href="/payment-guide"
            className="underline hover:text-teal-900 font-bold whitespace-nowrap text-xs flex items-center gap-1"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('طريقة الدفع ومعلومات CCP', 'Guide de paiement CCP')}</span>
          </Link>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-emerald-800 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-teal-700/20">
              DZ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  AchriDZ
                </span>
                <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded-md font-bold">
                  {t('سوق المستعمل', 'Marché Algérien')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {t('منصة البيع والشراء في 69 ولاية جزائرية', 'Achat & Vente en Algérie (69 Wilayas)')}
              </p>
            </div>
          </Link>

          {/* Quick Actions (Desktop & Tablet) */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
              title="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-teal-700" />
              <span>{lang === 'ar' ? 'FR - Français' : 'عربي - RTL'}</span>
            </button>

            {/* Admin Badge link if Admin */}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/payments"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('لوحة الإدارة (CCP)', 'Admin Paiements')}</span>
              </Link>
            )}

            {/* Desktop Sell CTA Button */}
            <Link
              href="/create"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-800 hover:to-emerald-900 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 transition"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>{t('نشر إعلان (+ 200 دج)', 'Publier une annonce (200 DZD)')}</span>
            </Link>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/my-listings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold hover:bg-teal-100 transition"
                >
                  <BadgeCheck className="w-4 h-4 text-teal-700" />
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  {user.isDemo && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-extrabold">
                      تجريبي
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title={t('تسجيل الخروج', 'Déconnexion')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                {t('دخول / إنشاء حساب', 'Connexion')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Bottom App Navigation (Marketplace mobile-first app feel) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl py-1.5 px-4 sm:hidden">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-between text-center relative">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 py-1 text-xs font-bold ${
              pathname === '/' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('الرئيسية', 'Accueil')}</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center gap-0.5 py-1 text-xs font-bold ${
              pathname === '/search' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>{t('البحث', 'Recherche')}</span>
          </Link>

          {/* Center Elevated Sell FAB (اجعل زر «بيع» واضحًا جدًا) */}
          <div className="relative -top-4 flex justify-center">
            <Link
              href="/create"
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-700 via-emerald-700 to-amber-500 text-white flex flex-col items-center justify-center shadow-xl shadow-teal-700/40 border-4 border-white hover:scale-105 transition"
            >
              <PlusCircle className="w-6 h-6 text-amber-300" />
              <span className="text-[10px] font-extrabold leading-none mt-0.5">
                {t('بيع', 'Vendre')}
              </span>
            </Link>
          </div>

          <Link
            href="/messages"
            className={`flex flex-col items-center gap-0.5 py-1 text-xs font-bold ${
              pathname === '/messages' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('الرسائل', 'Messages')}</span>
          </Link>

          <Link
            href={user ? '/my-listings' : '#'}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-0.5 py-1 text-xs font-bold ${
              pathname === '/my-listings' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{t('حسابي', 'Compte')}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
