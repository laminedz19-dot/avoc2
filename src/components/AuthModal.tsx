'use client';

import React, { useState } from 'react';
import { useAchri } from '@/context/AchriContext';
import {
  Smartphone,
  ShieldCheck,
  X,
  UserCheck,
  Sparkles,
  KeyRound,
  Crown,
} from 'lucide-react';

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, refreshUser, t } = useAchri();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('0661234567');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_otp',
          phone,
          name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في إرسال الرمز');
      setDemoOtp(data.demoOtp);
      setOtpCode(data.demoOtp || '123456');
      setStep('OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          phone,
          code: otpCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'رمز OTP غير صحيح');
      await refreshUser();
      setAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSwitch = async (demoPhone: string) => {
    setLoading(true);
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'switch_demo_user',
          phone: demoPhone,
        }),
      });
      await refreshUser();
      setAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {t('تسجيل الدخول في AchriDZ', 'Connexion AchriDZ')}
              </h3>
              <p className="text-xs text-teal-100">
                {t(
                  'تحقق فوري عبر رقم الهاتف الجزائري OTP',
                  'Vérification par numéro de téléphone OTP'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick 1-Click Demo Persona Switcher */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                {t(
                  'تجربة فورية بضغطة زر (بدون انتظار):',
                  'Changement rapide de rôle pour test :'
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('0550000000')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('إدارة CCP (Admin)', 'Admin (Validation CCP)')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('0661234567')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t('حساب تجريبي (Démo)', 'Compte Démo (Test)')}</span>
              </button>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              {t(
                'تنبيه: حسابات التجريب تمكنك من تجريب جميع المراحل والدفع الرمزي، لكنها لا تنشر الإعلان فعليًا للعامة في 69 ولاية.',
                'Remarque : Les comptes Démo permettent de tester l’appli mais ne publient pas réellement les annonces pour le public (69 Wilayas).'
              )}
            </p>
          </div>

          {step === 'PHONE' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('رقم الهاتف الجزائري', 'Numéro de téléphone algérien')}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0661234567"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 font-mono text-base"
                    required
                  />
                  <Smartphone className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('الاسم الكامل (اختياري)', 'Nom complet (optionnel)')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('مثال: سفيان بومدين', 'Ex: Sofiane Boumediene')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-sm"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-md shadow-teal-700/20 transition"
              >
                {loading
                  ? t('جاري إرسال الرمز...', 'Envoi du code...')
                  : t('إرسال رمز التحقق OTP', 'Envoyer le code OTP')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {demoOtp && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span>{t('رمز التحقق السريع للمعاينة:', 'Code OTP de test :')}</span>
                  <span className="font-mono font-bold text-sm bg-emerald-700 text-white px-2.5 py-0.5 rounded">
                    {demoOtp}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('أدخل رمز الـ 6 أرقام المرسل إلى ', 'Entrez le code OTP reçu sur ')}
                  <span className="font-mono text-teal-700">{phone}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                    required
                  />
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-md shadow-teal-700/20 transition"
              >
                {loading
                  ? t('جاري التحقق...', 'Vérification...')
                  : t('تأكيد الدخول الآن', 'Vérifier & Se Connecter')}
              </button>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full text-xs text-slate-500 hover:text-teal-700 underline text-center"
              >
                {t('تغيير رقم الهاتف', 'Modifier le numéro')}
              </button>
            </form>
          )}

          {/* Core financial security reminder */}
          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              {t(
                'منصة AchriDZ لا تطلب أبدًا كلمتك السرية لحساب CCP أو رمز البطاقة الذهبية أو تطبيق بريدي موب.',
                'AchriDZ ne demande jamais votre mot de passe CCP, code Edahabia ou code secret BaridiMob.'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
