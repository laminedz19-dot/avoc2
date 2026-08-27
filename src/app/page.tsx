'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAchri } from '@/context/AchriContext';
import {
  ALGERIA_WILAYAS,
  CATEGORIES_SEED,
} from '@/lib/algeria-data';
import { ListingCard } from '@/components/ListingCard';
import {
  Search,
  MapPin,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Smartphone,
  Car,
  Camera,
  Home as HomeIcon,
  Gamepad2,
  CheckCircle2,
  CreditCard,
  Building2,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { lang, t, setAuthModalOpen } = useAchri();
  const [listings, setListings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedWilaya && selectedWilaya !== 'ALL')
        params.set('wilaya', selectedWilaya);
      if (selectedCategory)
        params.set('category', selectedCategory.toString());

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedWilaya, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}&wilaya=${selectedWilaya}`
    );
  };

  const handleToggleFavorite = async (listingId: number) => {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    });
    if (res.status === 401) {
      setAuthModalOpen(true);
      return;
    }
    const data = await res.json();
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, isFavorite: data.isFavorite } : l
      )
    );
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Algerian Marketplace Hero Header */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/marketplace-banner.jpg)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md">
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>
                {t(
                  'أكبر سوق جزائري للمنتجات المستعملة عبر 69 ولاية',
                  'Marketplace d’occasion N°1 en Algérie (69 Wilayas)'
                )}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              {t(
                'بيع واشترِ بذكاء وموثوقية عبر 69 ولاية جزائرية',
                'Achetez et Vendez vos objets d’occasion dans les 69 Wilayas'
              )}
            </h1>

            <p className="text-sm sm:text-base text-teal-100 leading-relaxed max-w-2xl">
              {t(
                'نظام إعلانات محمي مع التحقق الإلزامي من رسوم النشر (200 دج) وتفاوض مباشر آمن بين المشتري والبائع في 69 ولاية جزائرية.',
                'Plateforme sécurisée avec vérification manuelle CCP (200 DZD) et messagerie de négociation dans les 69 Wilayas.'
              )}
            </p>

            {/* Instant Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-stretch gap-2 text-slate-900"
            >
              <div className="flex-1 flex items-center px-3 gap-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(
                    'ابحث عن هاتف، سيارة، كاميرا، دراجة، لابتوب...',
                    'Rechercher un iPhone, voiture, caméra...'
                  )}
                  className="w-full py-2.5 text-sm sm:text-base focus:outline-none"
                />
              </div>

              <div className="sm:w-56 border-t sm:border-t-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-slate-200 flex items-center px-3 gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full py-2 text-xs sm:text-sm font-bold bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">كل الولايات (69 ولاية جزائرية)</option>
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.nameAr} ({w.nameFr})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-extrabold text-sm sm:text-base shadow-md transition whitespace-nowrap"
              >
                {t('ابحث الآن', 'Rechercher')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg sm:text-xl text-slate-900">
            {t('تصفح حسب الفئة', 'Catégories populaires')}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-teal-700 font-bold underline"
            >
              {t('عرض جميع التصنيفات', 'Tout afficher')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES_SEED.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(active ? null : cat.id)
                }
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                  active
                    ? 'bg-teal-700 text-white border-teal-700 shadow-md scale-105'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active
                      ? 'bg-white/20 text-amber-300'
                      : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  {cat.id === 1 && <Smartphone className="w-5 h-5" />}
                  {cat.id === 2 && <Car className="w-5 h-5" />}
                  {cat.id === 3 && <HomeIcon className="w-5 h-5" />}
                  {cat.id === 5 && <Camera className="w-5 h-5" />}
                  {cat.id === 6 && <Gamepad2 className="w-5 h-5" />}
                  {![1, 2, 3, 5, 6].includes(cat.id) && (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-bold line-clamp-1">
                  {lang === 'ar' ? cat.nameAr : cat.nameFr}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Explainer Banner: Mandatory 200 DZD Fee Rule */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl border-2 border-amber-300/80 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shrink-0 shadow">
                200
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {t(
                      'نظام رسوم نشر الإعلان الإلزامي: 200 دج ثابتة',
                      'Frais de publication : 200 DZD obligatoires'
                    )}
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    مكافحة الإعلانات الوهمية
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t(
                    'كل إعلان يتطلب دفع 200 دج ثابتة لحساب بريد الجزائر CCP أو BaridiMob وتأكيده من المشرف لضمان جدية البائعين وجودة السلع في السوق الجزائري.',
                    'Chaque annonce nécessite le paiement de 200 DZD validé par un administrateur pour garantir la qualité des annonces.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/payment-guide"
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <CreditCard className="w-4 h-4 text-teal-700" />
                <span>{t('طريقة الدفع وحساب CCP', 'Coordonnées CCP')}</span>
              </Link>
              <Link
                href="/create"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>{t('انشر إعلانك الآن (+ 200 دج)', 'Publier (200 DZD)')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Grid (Only PUBLISHED verified listings appear here) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t('الإعلانات المنشورة المعتمدة', 'Annonces vérifiées & publiées')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                'جميع هذه الإعلانات تم التحقق من دفع رسوم 200 دج الخاصة بها',
                'Toutes ces annonces ont validé le paiement de 200 DZD'
              )}
            </p>
          </div>

          <Link
            href="/search"
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            <span>{t('بحث متقدم وفلاتر', 'Recherche avancée')}</span>
            <span>←</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-square bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">
              {t('لم يتم العثور على إعلانات بهذه الفلاتر', 'Aucune annonce trouvée')}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t(
                'جرب تغيير الفئة أو الولاية، أو كن أول من ينشر إعلانًا في هذه المنطقة بدفع 200 دج.',
                'Essayez de modifier la Wilaya ou la catégorie.'
              )}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>{t('نشر إعلان جديد الآن', 'Publier une annonce')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                priceDzd={item.priceDzd}
                condition={item.condition}
                wilayaName={item.wilayaName}
                communeName={item.communeName}
                images={item.images}
                viewsCount={item.viewsCount}
                status={item.status}
                seller={item.seller}
                isFavorite={item.isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      {/* Seller Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              AchriDZ Seller Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t(
                'هل لديك هاتف أو سيارة أو أثاث مستعمل للبيع عبر 69 ولاية؟',
                'Vous avez des objets d’occasion à vendre dans les 69 Wilayas ?'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t(
                'أضف صور منتجك، حدد السعر في 69 ولاية جزائرية، ادفع رسوم 200 دج وتواصل مباشرة مع المشترين الجادين.',
                'Publiez votre annonce en 10 étapes et touchez des acheteurs dans les 69 Wilayas.'
              )}
            </p>
          </div>
          <Link
            href="/create"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl font-extrabold text-base shadow-lg shrink-0 transition"
          >
            + {t('نشر إعلان جديد (+ 200 دج)', 'Publier une annonce (200 DZD)')}
          </Link>
        </div>
      </section>
    </div>
  );
}
