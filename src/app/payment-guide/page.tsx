'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAchri } from '@/context/AchriContext';
import {
  ShieldCheck,
  Building2,
  Smartphone,
  CheckCircle2,
  Copy,
  PlusCircle,
} from 'lucide-react';

export default function PaymentGuidePage() {
  const { settings, t } = useAchri();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Title */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-8 text-white space-y-3 shadow-xl">
        <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full">
          Frais de publication : 200 DZD
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          {t(
            'دليل دفع رسوم نشر الإعلان (200 دج) على AchriDZ',
            'Guide de paiement des frais de publication (200 DZD)'
          )}
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
          {t(
            'ضمانًا لجودة الإعلانات ومكافحة الإعلانات الوهمية، يتطلب كل إعلان جديد دفع رسوم رمزية وثابتة بقيمة 200 دج لحساب المنصة.',
            'Pour éliminer les annonces frauduleuses, des frais fixes de 200 DZD sont obligatoires par annonce.'
          )}
        </p>
      </div>

      {/* Dynamic CCP Account Details Card */}
      <div className="bg-white rounded-3xl border-2 border-teal-600 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">
              معلومات الدفع المعتمدة (قابلة للتحديث من إدارة المنصة)
            </h2>
            <p className="text-xs text-slate-500">
              ارسل مبلغ 200 دج بالضبط ثم احتفظ بصورة الإيصال أو لقطة الشاشة
            </p>
          </div>
          <span className="font-mono text-xl font-extrabold bg-slate-900 text-amber-400 px-4 py-1.5 rounded-xl">
            200 DZD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Building2 className="w-5 h-5 text-teal-700" />
              <span>حوالة بريد الجزائر CCP</span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-slate-500">Nom du bénéficiaire :</p>
              <p className="font-bold text-slate-900 text-sm">
                {settings?.beneficiaryName || 'سفيان بومدين (AchriDZ SARL)'}
              </p>
              <p className="text-slate-500 mt-2">Compte CCP + Clé :</p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border">
                <span className="font-mono font-extrabold text-base text-teal-800">
                  {settings?.ccpAccount || '0024987654'} Clé{' '}
                  {settings?.ccpKey || '89'}
                </span>
                <button
                  onClick={() =>
                    copyText(
                      'CCP',
                      `${settings?.ccpAccount || '0024987654'} Clé ${
                        settings?.ccpKey || '89'
                      }`
                    )
                  }
                  className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  {copiedKey === 'CCP' ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Smartphone className="w-5 h-5 text-teal-700" />
              <span>تطبيق بريدي موب (BaridiMob)</span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-slate-500">RIB BaridiMob :</p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border mt-2">
                <span className="font-mono font-extrabold text-xs text-teal-800 break-all">
                  {settings?.baridimobRib || '00799999002498765489'}
                </span>
                <button
                  onClick={() =>
                    copyText(
                      'RIB',
                      settings?.baridimobRib || '00799999002498765489'
                    )
                  }
                  className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 ml-2"
                >
                  {copiedKey === 'RIB' ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 11 Rules Checklist */}
        <div className="space-y-2 pt-2">
          <h3 className="font-extrabold text-sm text-slate-900">
            قواعد النظام المالي في AchriDZ:
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. كل إعلان يتطلب دفع 200 دج (Frais de publication)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>2. لا يمكن نشر الإعلان قبل تأكيد الدفع من الإدارة</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3. لا تطلب المنصة أبدًا كلمة السر أو الرمز السري BaridiMob</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>4. يمنع تكرار استخدام نفس وصل الدفع لإعلانات متعددة</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Link
            href="/create"
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>ابدأ نشر إعلانك الآن</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
