'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAchri } from '@/context/AchriContext';
import {
  ALGERIA_WILAYAS,
  CATEGORIES_SEED,
  CONDITION_LABELS,
} from '@/lib/algeria-data';
import { ListingCard } from '@/components/ListingCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { lang, user, t } = useAchri();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [wilaya, setWilaya] = useState(searchParams.get('wilaya') || 'ALL');
  const [commune, setCommune] = useState('');
  const [condition, setCondition] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest'); // newest, views, closest, price_asc
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category !== 'ALL') params.set('category', category);
      if (wilaya !== 'ALL') params.set('wilaya', wilaya);
      if (commune) params.set('commune', commune);
      if (condition !== 'ALL') params.set('condition', condition);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('sort', sort);
      if (user?.wilayaCode) params.set('userWilaya', user.wilayaCode);

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [category, wilaya, condition, sort]);

  const handleResetFilters = () => {
    setQ('');
    setCategory('ALL');
    setWilaya('ALL');
    setCommune('');
    setCondition('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  const selectedWilayaObj = ALGERIA_WILAYAS.find((w) => w.code === wilaya);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchResults();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <div className="sm:col-span-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="اسم المنتج أو كلمة مفتاحية..."
              className="w-full px-10 py-3 border border-slate-300 rounded-xl text-sm font-bold"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-3 border border-slate-300 rounded-xl text-xs font-bold"
            >
              <option value="ALL">جميع الفئات</option>
              {CATEGORIES_SEED.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {lang === 'ar' ? cat.nameAr : cat.nameFr}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={wilaya}
              onChange={(e) => {
                setWilaya(e.target.value);
                setCommune('');
              }}
              className="w-full px-3 py-3 border border-slate-300 rounded-xl text-xs font-bold"
            >
              <option value="ALL">كل الولايات (69 ولاية جزائرية)</option>
              {ALGERIA_WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {w.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow"
            >
              تطبيق الفلاتر
            </button>
          </div>
        </form>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Condition Filter */}
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
            >
              <option value="ALL">كل الحالات</option>
              <option value="NEW">جديد</option>
              <option value="LIKE_NEW">شبه جديد</option>
              <option value="GOOD">مستعمل بحالة جيدة</option>
              <option value="USED">مستعمل</option>
              <option value="NEEDS_REPAIR">يحتاج إلى إصلاح</option>
            </select>

            {/* Min Price */}
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="أقل سعر (دج)"
              className="w-28 px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs"
            />
            <span>—</span>
            {/* Max Price */}
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="أعلى سعر (دج)"
              className="w-28 px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs"
            />

            {selectedWilayaObj && (
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold"
              >
                <option value="">كل بلديات {selectedWilayaObj.nameAr}</option>
                {selectedWilayaObj.communes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">الترتيب:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-teal-300 rounded-xl bg-teal-50 text-teal-900 font-bold"
            >
              <option value="newest">الأحدث</option>
              <option value="views">الأكثر مشاهدة</option>
              <option value="closest">الأقرب إليّ</option>
              <option value="price_asc">الأقل سعرًا أولاً</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-slate-500 hover:text-red-600 flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 bg-white rounded-2xl border p-4 animate-pulse"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">
            لا توجد إعلانات منشورة ومؤكدة الدفع مطابقة لهذه الفلاتر.
          </p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
