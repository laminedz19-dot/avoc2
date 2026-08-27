'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAchri } from '@/context/AchriContext';
import {
  CONDITION_LABELS,
  DELIVERY_METHOD_LABELS,
  LISTING_STATUS_FLOW,
  formatDZD,
} from '@/lib/algeria-data';
import {
  MapPin,
  Heart,
  Share2,
  Flag,
  MessageCircle,
  TrendingDown,
  Star,
  Eye,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Send,
  UserCheck,
} from 'lucide-react';

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { lang, user, setAuthModalOpen, t } = useAchri();

  const [listing, setListing] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reportReason, setReportReason] = useState('سلعة مشبوهة');
  const [reportDetails, setReportDetails] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchListing = async () => {
    const res = await fetch(`/api/listings/${id}`);
    if (res.ok) {
      const data = await res.json();
      setListing(data.listing);
      setIsFavorite(data.listing.isFavorite);
      if (data.listing.priceDzd) {
        setOfferPrice(
          Math.floor(data.listing.priceDzd * 0.9).toString()
        );
      }
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleToggleFav = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: listing.id }),
    });
    const data = await res.json();
    setIsFavorite(data.isFavorite);
    showToast(data.isFavorite ? 'تمت إضافة الإعلان إلى مفضلتك' : 'تم إزالة الإعلان من المفضلة');
  };

  const handleSendPriceOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: listing.id,
        sellerId: listing.seller.id,
        offerPriceDzd: Number(offerPrice),
        text: `عرض شراء مالي بقيمة ${Number(offerPrice).toLocaleString('en-US')} دج (السعر المطلوب ${listing.priceDzd.toLocaleString('en-US')} دج)`,
      }),
    });
    if (res.ok) {
      setShowOfferModal(false);
      showToast(`تم إرسال عرضك المالي ${formatDZD(Number(offerPrice))} للبائع بنجاح!`);
      router.push('/messages');
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: listing.id,
        sellerId: listing.seller.id,
        text: `السلام عليكم، أستفسر عن إعلان: ${listing.title}`,
      }),
    });
    router.push('/messages');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: listing.id,
        revieweeId: listing.seller.id,
        rating: reviewRating,
        comment: reviewComment,
      }),
    });
    if (res.ok) {
      setShowReviewModal(false);
      showToast('تم تسجيل تقييمك للبائع بنجاح!');
      fetchListing();
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: listing.id,
        reportedUserId: listing.seller.id,
        reason: reportReason,
        details: reportDetails,
      }),
    });
    if (res.ok) {
      setShowReportModal(false);
      showToast('تم استلام بلاغك وإحالته للمشرفين للمراجعة');
    }
  };

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500 text-sm">جاري تحميل الإعلان...</p>
      </div>
    );
  }

  const cond = CONDITION_LABELS[listing.condition] || CONDITION_LABELS.GOOD;
  const delivery =
    DELIVERY_METHOD_LABELS[listing.deliveryMethod] ||
    DELIVERY_METHOD_LABELS.HAND_TO_HAND;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-teal-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Listing Status State Machine Tracker (visible if Owner or Admin) */}
      {(user?.id === listing.seller.id || user?.role === 'ADMIN') && (
        <div className="bg-white rounded-2xl border border-teal-200 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-teal-800">
              حالة الإعلان الرسمية في دورة الحياة (AchriDZ State Machine):
            </span>
            <span className="bg-teal-700 text-white px-2.5 py-0.5 rounded-full font-mono">
              {listing.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {LISTING_STATUS_FLOW.map((s) => (
              <span
                key={s.code}
                className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${
                  listing.status === s.code
                    ? 'bg-teal-700 text-white border-teal-700 ring-2 ring-amber-400'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                {lang === 'ar' ? s.ar : s.fr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Images + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={listing.images[activeImage] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 right-4 rtl:right-4 rtl:left-auto px-3 py-1 rounded-full text-xs font-bold border shadow ${cond.badgeColor}`}
            >
              {lang === 'ar' ? cond.ar : cond.fr}
            </span>
          </div>

          {listing.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {listing.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                    activeImage === idx
                      ? 'border-teal-600 scale-95 shadow'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="صورة" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Seller details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-lg">
                {lang === 'ar'
                  ? listing.category.nameAr
                  : listing.category.nameFr}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5" />
                {listing.viewsCount} مشاهدة
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {listing.title}
            </h1>

            {listing.isDemoPost && (
              <div className="p-3 bg-sky-50 border border-sky-300 rounded-2xl text-xs font-bold text-sky-900 flex items-center justify-between">
                <span>تنبيه: هذا إعلان تجريبي (Démo Sandbox) أُنشئ لتجريب التطبيق ولا يُنشر فعلياً للعامة في السوق.</span>
                <span className="bg-sky-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px]">
                  تجريبي
                </span>
              </div>
            )}

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  {t('السعر المطلوب', 'Prix demandé')}
                </span>
                <span className="font-mono text-3xl font-extrabold text-teal-800">
                  {formatDZD(listing.priceDzd)}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                ✓ إعلان معتمد (200 دج مدفوعة)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2">
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                {listing.wilayaName} • {listing.communeName}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                طريقة التسليم: {lang === 'ar' ? delivery.ar : delivery.fr}
              </span>
            </div>

            {/* Negotiation Comparison Preview (نظام التفاوض) */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>مثال التفاوض على السعر:</span>
                <span className="text-amber-800">قابل للمساومة</span>
              </div>
              <p className="text-slate-600">
                السعر المطلوب: <strong className="font-mono">{formatDZD(listing.priceDzd)}</strong> — يمكنك تقديم عرضك المالي (مثلاً{' '}
                <strong className="font-mono">
                  {formatDZD(Math.floor(listing.priceDzd * 0.9))}
                </strong>
                ) للبائع عبر زر تقديم عرض.
              </p>
            </div>

            {/* Action Buttons Bar */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartChat}
                className="py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-4 h-4 text-amber-300" />
                <span>{t('مراسلة البائع', 'Contacter vendeur')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOfferModal(true)}
                className="py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition"
              >
                <TrendingDown className="w-4 h-4" />
                <span>{t('تقديم عرض مالي', 'Faire une offre')}</span>
              </button>
            </div>

            {/* Secondary Toolbar (Fav, Share, Report) */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleToggleFav}
                className={`py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isFavorite
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>المفضلة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('تم نسخ رابط الإعلان للمشاركة');
                }}
                className="py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="py-2 rounded-xl border border-slate-200 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>إبلاغ</span>
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg">
                  {listing.seller.name.slice(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {listing.seller.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    عضو موثوق في {listing.seller.wilayaName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-bold text-amber-800 text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{listing.seller.rating.toFixed(1)} / 5</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="text-teal-700 font-bold hover:underline flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5" />
                <span>تقييم البائع بعد الشراء (1-5 نجوم)</span>
              </button>
              <span className="font-mono text-slate-500">
                الهاتف: {listing.seller.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Full Description & Mutual Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {t('وصف الإعلان والتفاصيل', 'Description complète')}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">
              {t('تقييمات المشترين والبائعين', 'Avis après transaction')}
            </h3>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-xs font-bold text-teal-700 underline"
            >
              + إضافة تقييم
            </button>
          </div>

          {listing.reviews && listing.reviews.length > 0 ? (
            <div className="space-y-3">
              {listing.reviews.map((r: any) => (
                <div
                  key={r.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{r.reviewerName}</span>
                    <span className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              لا توجد تقييمات مسجلة بعد لهذا الإعلان.
            </p>
          )}
        </div>
      </div>

      {/* Modal: Negotiation / Make Offer */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">
              تقديم عرض مالي لشراء السلعة (نظام المساومة)
            </h3>
            <p className="text-xs text-slate-500">
              السعر المطلوب من البائع هو{' '}
              <strong className="font-mono text-teal-700">
                {formatDZD(listing.priceDzd)}
              </strong>
              . يمكنك اقتراح السعر المناسب لك:
            </p>
            <form onSubmit={handleSendPriceOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عرضك المقترح (دج):
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl font-mono text-xl font-bold text-teal-700"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 rounded-xl font-extrabold text-sm"
                >
                  إرسال العرض المالي للبائع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rate Seller (1 - 5 stars) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">
              تقييم البائع بعد إتمام عملية البيع
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  اختر عدد النجوم (1 إلى 5):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base border transition ${
                        reviewRating >= star
                          ? 'bg-amber-400 text-slate-950 border-amber-500'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تعليق التقييم:
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="بائع صادق ومطابق للوصف..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-700 text-white rounded-xl font-bold text-xs"
                >
                  حفظ التقييم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Listing */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">
              إبلاغ عن هذا الإعلان أو البائع
            </h3>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="إعلان وهمي أو مكرر">إعلان وهمي أو مكرر</option>
                <option value="سعر مضلل">سعر مضلل</option>
                <option value="سلعة ممنوعة أو مخالفة">سلعة ممنوعة أو مخالفة</option>
                <option value="احتيال في الدفع أو التواصل">احتيال في الدفع أو التواصل</option>
              </select>
              <textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="أضف تفاصيل البلاغ..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs"
                >
                  إرسال البلاغ للإدارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
