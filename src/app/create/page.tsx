'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAchri } from '@/context/AchriContext';
import {
  ALGERIA_WILAYAS,
  CATEGORIES_SEED,
  CONDITION_LABELS,
  DELIVERY_METHOD_LABELS,
  formatDZD,
} from '@/lib/algeria-data';
import { PaymentModal200Dzd } from '@/components/PaymentModal200Dzd';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';

const STAGE_TITLES = [
  { step: 1, ar: 'المرحلة 1: اختيار الفئة', fr: 'Étape 1 : Catégorie' },
  { step: 2, ar: 'المرحلة 2: إضافة الصور', fr: 'Étape 2 : Photos' },
  { step: 3, ar: 'المرحلة 3: اسم المنتج', fr: 'Étape 3 : Titre' },
  { step: 4, ar: 'المرحلة 4: الوصف', fr: 'Étape 4 : Description' },
  { step: 5, ar: 'المرحلة 5: السعر (دج)', fr: 'Étape 5 : Prix (DZD)' },
  { step: 6, ar: 'المرحلة 6: حالة المنتج', fr: 'Étape 6 : État' },
  { step: 7, ar: 'المرحلة 7: الولاية (69 ولاية)', fr: 'Étape 7 : Wilaya (69)' },
  { step: 8, ar: 'المرحلة 8: البلدية', fr: 'Étape 8 : Commune' },
  { step: 9, ar: 'المرحلة 9: طريقة البيع', fr: 'Étape 9 : Remise / Livraison' },
  { step: 10, ar: 'المرحلة 10: الدفع الإجباري 200 دج', fr: 'Étape 10 : Frais 200 DZD' },
];

export default function CreateListingWizardPage() {
  const router = useRouter();
  const { lang, user, setAuthModalOpen, t } = useAchri();

  const [currentStep, setCurrentStep] = useState(1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceDzd, setPriceDzd] = useState<string>('50000');
  const [condition, setCondition] = useState<string>('GOOD');
  const [wilayaCode, setWilayaCode] = useState<string>('16');
  const [communeName, setCommuneName] = useState<string>('باب الزوار - Bab Ezzouar');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('HAND_TO_HAND');

  // Step 10 payment modal state
  const [createdListingId, setCreatedListingId] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState('');

  const selectedWilayaObj =
    ALGERIA_WILAYAS.find((w) => w.code === wilayaCode) || ALGERIA_WILAYAS[15];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [event.target!.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProceedToStep10Payment = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!title.trim() || !description.trim() || !priceDzd) {
      setError('يرجى ملء اسم المنتج والوصف والسعر قبل الانتقال للمرحلة 10');
      return;
    }

    setError('');
    setLoadingSave(true);
    try {
      // Create listing in PAYMENT_REQUIRED status
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          title,
          description,
          priceDzd: Number(priceDzd),
          condition,
          wilayaCode: selectedWilayaObj.code,
          wilayaName: selectedWilayaObj.nameAr,
          communeName,
          deliveryMethod,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ في إنشاء الإعلان');

      setCreatedListingId(data.listing.id);
      setPaymentModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  const handlePaymentProofSubmitted = () => {
    setPaymentModalOpen(false);
    router.push(`/my-listings?paymentSuccess=1`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Wizard Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="text-teal-700 font-extrabold">
            {lang === 'ar'
              ? STAGE_TITLES[currentStep - 1].ar
              : STAGE_TITLES[currentStep - 1].fr}
          </span>
          <span className="font-mono text-slate-400">
            {currentStep} / 10
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-600 to-amber-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="grid grid-cols-10 gap-1 pt-1">
          {STAGE_TITLES.map((st) => (
            <button
              key={st.step}
              type="button"
              onClick={() => setCurrentStep(st.step)}
              className={`h-2 rounded-full transition ${
                st.step === currentStep
                  ? 'bg-teal-700'
                  : st.step < currentStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-200'
              }`}
              title={st.ar}
            />
          ))}
        </div>
      </div>

      {/* Main Stage Content Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Stage 1: Category */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 1: اختر فئة المنتج', 'Étape 1 : Choisissez la catégorie')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES_SEED.map((cat) => {
                const active = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setCurrentStep(2);
                    }}
                    className={`p-4 rounded-2xl border text-center transition font-bold text-xs flex flex-col items-center gap-2 ${
                      active
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow'
                        : 'border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    <span>{lang === 'ar' ? cat.nameAr : cat.nameFr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 2: Photos */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 2: إضافة صور المنتج', 'Étape 2 : Ajoutez des photos')}
            </h2>
            <p className="text-xs text-slate-500">
              {t(
                'الصور الواضحة تزيد فرص بيع منتجك بـ 4 أضعاف في السوق الجزائري.',
                'Des photos nettes augmentent vos chances de vente.'
              )}
            </p>

            <label className="block border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-2xl p-6 text-center cursor-pointer bg-teal-50/40 transition">
              <Upload className="w-8 h-8 text-teal-700 mx-auto mb-2" />
              <span className="text-sm font-bold text-teal-900 block">
                {t('اضغط هنا لرفع صور منتجك من هاتفك أو حاسوبك', 'Télécharger des photos')}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                  <img src={img} alt="صورة" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                      الرئيسية
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Title */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 3: اسم المنتج', 'Étape 3 : Titre de l’annonce')}
            </h2>
            <label className="block text-xs font-bold text-slate-600">
              {t('عنوان واضح وجذاب للإعلان', 'Titre clair et précis')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t(
                'مثال: iPhone 15 Pro Max 256GB تيتانيوم أصلي بالعلبة',
                'Ex: iPhone 15 Pro Max 256GB Titane comme neuf'
              )}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-xl text-base font-bold focus:ring-2 focus:ring-teal-600"
            />
          </div>
        )}

        {/* Stage 4: Description */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 4: الوصف التفصيلي', 'Étape 4 : Description détaillée')}
            </h2>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(
                'اكتب حالة المنتج، الملحقات المتوفرة، سبب البيع، وإمكانية التفاوض...',
                'Décrivez l’état, les accessoires inclus, la raison de la vente...'
              )}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-600"
            />
          </div>
        )}

        {/* Stage 5: Price */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 5: تحديد السعر بالدينار الجزائري (DZD)', 'Étape 5 : Prix en DZD')}
            </h2>
            <div className="relative">
              <input
                type="number"
                value={priceDzd}
                onChange={(e) => setPriceDzd(e.target.value)}
                className="w-full px-4 py-4 border border-slate-300 rounded-xl font-mono text-2xl font-extrabold text-teal-700"
              />
              <span className="absolute left-4 top-5 rtl:right-auto rtl:left-4 font-bold text-slate-500">
                دج (DZD)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t('السعر المعروض: ', 'Prix affiché : ')}
              <strong className="text-teal-700 font-mono">
                {formatDZD(Number(priceDzd) || 0)}
              </strong>
            </p>
          </div>
        )}

        {/* Stage 6: Product Condition */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 6: حالة المنتج', 'Étape 6 : État du produit')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { code: 'NEW', ar: 'جديد (تحت التغليف)', fr: 'Neuf (Sous emballage)' },
                { code: 'LIKE_NEW', ar: 'شبه جديد', fr: 'Comme neuf' },
                { code: 'GOOD', ar: 'مستعمل بحالة جيدة', fr: 'Bon état' },
                { code: 'USED', ar: 'مستعمل', fr: 'État d’usage' },
                { code: 'NEEDS_REPAIR', ar: 'يحتاج إلى إصلاح', fr: 'À réparer' },
              ].map((c) => {
                const active = condition === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCondition(c.code)}
                    className={`p-4 rounded-xl border text-start font-bold text-sm flex items-center justify-between transition ${
                      active
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{lang === 'ar' ? c.ar : c.fr}</span>
                    {active && <CheckCircle2 className="w-5 h-5 text-teal-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 7: Wilaya */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 7: الولاية (من 69 ولاية جزائرية)', 'Étape 7 : Wilaya (69 Wilayas)')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('اختر ولايتك من ضمن 69 ولاية معتمدة في الجزائر', 'Choisissez parmi les 69 Wilayas')}
            </p>
            <select
              value={wilayaCode}
              onChange={(e) => {
                const code = e.target.value;
                setWilayaCode(code);
                const wObj = ALGERIA_WILAYAS.find((w) => w.code === code);
                if (wObj && wObj.communes.length > 0) {
                  setCommuneName(wObj.communes[0]);
                }
              }}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-xl font-bold text-sm"
            >
              {ALGERIA_WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {w.nameAr} ({w.nameFr})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stage 8: Commune */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 8: البلدية', 'Étape 8 : Commune')}
            </h2>
            <select
              value={communeName}
              onChange={(e) => setCommuneName(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-xl font-bold text-sm"
            >
              {selectedWilayaObj.communes.map((commune) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stage 9: Delivery Method */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('المرحلة 9: طريقة البيع والتسليم', 'Étape 9 : Remise ou Livraison')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: 'HAND_TO_HAND', ar: 'يدًا بيد', fr: 'Main propre' },
                { code: 'DELIVERY', ar: 'توصيل للمنزل / المكتب', fr: 'Livraison 58 Wilayas' },
                { code: 'BOTH', ar: 'الاثنين (يدًا بيد + توصيل)', fr: 'Les deux' },
              ].map((m) => {
                const active = deliveryMethod === m.code;
                return (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => setDeliveryMethod(m.code)}
                    className={`p-4 rounded-xl border text-center font-bold text-sm transition ${
                      active
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {lang === 'ar' ? m.ar : m.fr}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 10: Mandatory 200 DZD Fee Step */}
        {currentStep === 10 && (
          <div className="space-y-6">
            {user?.isDemo && (
              <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-2xl text-sky-950 text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-sky-800">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>وضع الحساب التجريبي (Compte Démo Sandbox):</span>
                </div>
                <p>
                  حسابات التجريب تمكنك من تجريب جميع المراحل حتى خطوة دفع 200 دج الرمزية، لكن إعلانات الحساب التجريبي لا تُنشر فعليًا للعامة في السوق (للتجربة لا غير).
                </p>
              </div>
            )}
            <div className="p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-2xl text-slate-950 space-y-2 shadow-md">
              <div className="flex items-center gap-2 font-extrabold text-base">
                <Lock className="w-5 h-5" />
                <span>المرحلة 10: الدفع الإجباري لرسوم نشر الإعلان (200 دج)</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                كل مستخدم يريد نشر إعلان للبيع يجب أن يدفع 200 دج ثابتة إلى حساب CCP الخاص بصاحب المنصة. لا يمكن نشر الإعلان أو جعله ظاهرًا للعامة قبل تأكيد دفع 200 دج من الإدارة.
              </p>
            </div>

            {/* Ad Review Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <span>اسم المنتج:</span>
                <span>{title || 'لم يُدخل بعد'}</span>
              </div>
              <div className="flex justify-between font-mono font-bold text-teal-700">
                <span>السعر المطلوب:</span>
                <span>{formatDZD(Number(priceDzd) || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>المكان:</span>
                <span>
                  {selectedWilayaObj.nameAr} • {communeName}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-amber-700 border-t border-slate-200 pt-2">
                <span>رسوم نشر الإعلان (Frais de publication):</span>
                <span className="font-mono text-sm">200 DZD (ثابتة)</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200">
                {error}
              </div>
            )}

            {/* Exact Required Button: «دفع 200 دج ونشر الإعلان» */}
            <button
              type="button"
              disabled={loadingSave}
              onClick={handleProceedToStep10Payment}
              className="w-full py-4 bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 hover:from-teal-800 hover:to-emerald-950 text-white rounded-2xl font-extrabold text-base sm:text-lg shadow-xl flex items-center justify-center gap-2.5 transition"
            >
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <span>
                {loadingSave
                  ? 'جاري حفظ الإعلان...'
                  : t('دفع 200 دج ونشر الإعلان', 'Payer 200 DZD et Publier')}
              </span>
            </button>
            <p className="text-center text-xs text-slate-500">
              لا يظهر الإعلان للعامة إلا بعد التحقق من الدفع.
            </p>
          </div>
        )}

        {/* Previous / Next Footer Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
          >
            ← {t('السابق', 'Précédent')}
          </button>

          {currentStep < 10 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(10, s + 1))}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow transition"
            >
              {t('التالي', 'Suivant')} →
            </button>
          )}
        </div>
      </div>

      {/* Step 10 Payment Modal */}
      {createdListingId && (
        <PaymentModal200Dzd
          listingId={createdListingId}
          listingTitle={title}
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentProofSubmitted}
        />
      )}
    </div>
  );
}
