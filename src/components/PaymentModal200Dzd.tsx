'use client';

import React, { useState } from 'react';
import { useAchri } from '@/context/AchriContext';
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  Lock,
  Copy,
  AlertTriangle,
  FileCheck,
  Building2,
  Smartphone,
} from 'lucide-react';

interface PaymentModalProps {
  listingId: number;
  listingTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal200Dzd({
  listingId,
  listingTitle,
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { settings, t } = useAchri();
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BARIDIMOB' | 'CCP_TRANSFER'>('BARIDIMOB');
  const [transactionReference, setTransactionReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [proofImage, setProofImage] = useState('/images/sample-receipt.jpg');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const copyText = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProofImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${listingId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 200, // Fixed 200 DZD enforced
          paymentMethod,
          transactionReference,
          paymentDate,
          proofImage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في إرسال الإيصال');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden my-8">
        {/* Strict Mandatory Header */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Frais de publication obligatoires</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                {t('رسوم نشر الإعلان: 200 دج', 'Frais de publication : 200 DZD')}
              </h2>
              <p className="text-xs text-teal-100 mt-1">
                {t(
                  'لإتمام نشر إعلانك، يجب دفع 200 دج إلى حساب صاحب المنصة.',
                  'Pour valider votre annonce, le paiement de 200 DZD est obligatoire.'
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Ad summary */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">
              {t('الإعلان المستهدف:', 'Annonce :')}
            </span>
            <span className="text-sm font-bold text-slate-800 truncate max-w-[260px]">
              {listingTitle}
            </span>
          </div>

          {/* Admin Beneficiary CCP Info Card */}
          <div className="bg-gradient-to-br from-teal-950 to-emerald-900 rounded-2xl p-5 text-white shadow-lg space-y-3.5 border border-teal-700">
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {t('معلومات حساب بريد الجزائر (CCP / BaridiMob)', 'Coordonnées CCP / BaridiMob')}
              </span>
              <span className="text-xs font-mono font-extrabold bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                200 DZD
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <span className="text-teal-200 font-bold">
                  Nom du bénéficiaire :
                </span>
                <span className="font-bold text-white">
                  {settings?.beneficiaryName || 'سفيان بومدين (AchriDZ SARL)'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <div>
                  <span className="text-teal-200 font-bold block">
                    Compte CCP :
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
                    {settings?.ccpAccount || '0024987654'}
                  </span>
                  <span className="text-teal-200 ml-2">
                    Clé :{' '}
                    <strong className="text-amber-300">
                      {settings?.ccpKey || '89'}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      'CCP',
                      `${settings?.ccpAccount || '0024987654'} Clé ${
                        settings?.ccpKey || '89'
                      }`
                    )
                  }
                  className="px-2.5 py-1.5 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedKey === 'CCP' ? 'تم النسخ!' : 'نسخ'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                <div>
                  <span className="text-teal-200 font-bold block">
                    RIB BaridiMob :
                  </span>
                  <span className="font-mono text-xs font-extrabold text-amber-300">
                    {settings?.baridimobRib || '00799999002498765489'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      'RIB',
                      settings?.baridimobRib || '00799999002498765489'
                    )
                  }
                  className="px-2.5 py-1.5 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedKey === 'RIB' ? 'تم النسخ!' : 'نسخ'}
                </button>
              </div>
            </div>

            {/* Anti-phishing Security Law */}
            <div className="p-2.5 bg-amber-400/20 border border-amber-400/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                {t(
                  'أمان إلزامي: لا تطلب المنصة أبدًا كلمة مرور CCP أو الرمز السري BaridiMob أو أي بيانات بطاقة ذهبية.',
                  'Sécurité : Ne communiquez jamais votre code secret BaridiMob ou mot de passe CCP.'
                )}
              </span>
            </div>
          </div>

          {!showReceiptForm ? (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReceiptForm(true)}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl font-extrabold text-base shadow-lg flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
                <span>
                  {t(
                    'J\'ai effectué le paiement — لقد قمت بدفع 200 دج',
                    'J\'ai effectué le paiement (200 DZD)'
                  )}
                </span>
              </button>
              <p className="text-center text-xs text-slate-500">
                {t(
                  'لا يظهر الإعلان للعامة إلا بعد التحقق اليدوي من الإيصال بواسطة المشرف.',
                  'Votre annonce sera visible par le public après validation du justificatif.'
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>{t('المبلغ الثابت الإلزامي:', 'Montant fixe obligatoire :')}</span>
                <span className="font-mono text-base font-extrabold bg-slate-900 text-amber-400 px-3 py-0.5 rounded-lg">
                  200 DZD
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BARIDIMOB')}
                  className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'BARIDIMOB'
                      ? 'border-teal-600 bg-teal-50 text-teal-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-teal-700" />
                  <span>تطبيق BaridiMob</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CCP_TRANSFER')}
                  className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'CCP_TRANSFER'
                      ? 'border-teal-600 bg-teal-50 text-teal-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span>حوالة بريدية CCP</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t(
                    'رقم العملية البنكية / Référence (فريد لكل إعلان)',
                    'Référence de la transaction (unique)'
                  )}
                </label>
                <input
                  type="text"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="مثال: BM-20260317-889104"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono text-sm uppercase focus:ring-2 focus:ring-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('تاريخ الدفع', 'Date du paiement')}
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('المبلغ (مغلق)', 'Montant (verrouillé)')}
                  </label>
                  <input
                    type="text"
                    value="200 DZD"
                    disabled
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('صورة إثبات الدفع (وصل التحويل أو BaridiMob)', 'Justificatif de paiement')}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-3 text-center bg-teal-50/50 transition">
                    <Upload className="w-5 h-5 text-teal-700 mx-auto mb-1" />
                    <span className="text-xs font-bold text-teal-900 block">
                      {t('اختر صورة وصل الدفع من جهازك', 'Télécharger capture d’écran')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview sample receipt image */}
                {proofImage && (
                  <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={proofImage}
                        alt="إيصال الدفع"
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          وصل دفع 200 دج جاهز للإرسال
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          ✓ صورة وصل مرفقة
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReceiptForm(false)}
                  className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {t('رجوع', 'Retour')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-700/20 transition"
                >
                  {loading
                    ? t('جاري رفع الوصل والمراجعة...', 'Envoi du justificatif...')
                    : t(
                        'إرسال إثبات دفع 200 دج للمشرف',
                        'Envoyer justificatif 200 DZD'
                      )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
