'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Copy,
  Terminal,
  Smartphone,
  ShieldCheck,
  GitBranch,
  Play,
  Download,
  ExternalLink,
} from 'lucide-react';

export default function ReleasePublishPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitPushCommand = `git remote add origin https://github.com/USERNAME/AchriDZ-Marketplace.git
git branch -M main
git push -u origin main`;

  const capacitorAabCommand = `npm install
npx cap add android
npx cap sync android
cd android && ./gradlew bundleRelease`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-8 text-white shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full">
            حزمة الإطلاق الجاهزة v1.0.0 — الخيار أ (69 ولاية)
          </span>
          <span className="font-mono text-xs text-teal-200">
            Package ID: dz.achridz.marketplace
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
          مركز النشر والإطلاق الفوري: GitHub & Google Play Store 🇩🇿
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 max-w-3xl leading-relaxed">
          جميع التغييرات (دعم 69 ولاية جزائرية + الحسابات التجريبية Sandbox + نظام التحقق اليدوي من رسوم النشر 200 دج CCP / BaridiMob) محفوظة على Git ومجهزة بحزمة Capacitor للأندرويد.
        </p>
      </div>

      {/* Step 1: GitHub Push Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                1. نشر الكود مباشرة على مستودعك في GitHub
              </h2>
              <p className="text-xs text-slate-500">
                نفّذ هذا الأمر في الطرفية (Terminal) بعد إنشاء مستودع فارغ على GitHub
              </p>
            </div>
          </div>
          <button
            onClick={() => copyText('GITHUB', gitPushCommand)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Copy className="w-4 h-4" />
            <span>{copiedKey === 'GITHUB' ? 'تم نسخ الأمر!' : 'نسخ أوامر الرفع'}</span>
          </button>
        </div>

        <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto select-all border border-slate-800">
          <pre className="whitespace-pre-wrap">{gitPushCommand}</pre>
        </div>
      </div>

      {/* Step 2: Google Play Store AAB Card */}
      <div className="bg-white rounded-3xl border-2 border-teal-600 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                2. إصدار حزمة Android App Bundle (.aab) لمتجر Google Play Store
              </h2>
              <p className="text-xs text-slate-500">
                بناء ملف الأندرويد الموقّع لرفعه في Google Play Console
              </p>
            </div>
          </div>
          <button
            onClick={() => copyText('CAPACITOR', capacitorAabCommand)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Copy className="w-4 h-4" />
            <span>{copiedKey === 'CAPACITOR' ? 'تم نسخ الأمر!' : 'نسخ أوامر البناء'}</span>
          </button>
        </div>

        <div className="bg-slate-950 text-amber-300 p-4 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto select-all border border-slate-800">
          <pre className="whitespace-pre-wrap">{capacitorAabCommand}</pre>
        </div>

        {/* Google Play Reviewer App Access Card */}
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-amber-950 text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span>بيانات الحساب التجريبي لمراجعي Google Play Store (App Access):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-slate-500 block font-bold">رقم الهاتف التجريبي:</span>
              <span className="font-mono font-extrabold text-teal-800 text-sm">
                0661234567
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-slate-500 block font-bold">رمز التحقق OTP:</span>
              <span className="font-mono font-extrabold text-teal-800 text-sm">
                123456
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-slate-500 block font-bold">سلوك الحساب:</span>
              <span className="font-bold text-slate-800">
                حساب Démo يمكنه تجريب إنشاء إعلان ودفع 200 دج دون النشر في السوق العام.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          قائمة التحقق المكتملة في الإصدار (الخيار أ):
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>69 ولاية جزائرية كاملة (01 أدرار → 69 دبدو)</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>رسوم نشر ثابتة وإلزامية 200 دج (CCP / BaridiMob)</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>حسابات التجريب (Compte Démo Sandbox معزولة عن العامة)</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>لوحة الإدارة CCP وإحصائية إيرادات 200 دج</span>
          </div>
        </div>
      </div>
    </div>
  );
}
