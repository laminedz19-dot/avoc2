'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Heart,
  Eye,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { CONDITION_LABELS, formatDZD } from '@/lib/algeria-data';
import { useAchri } from '@/context/AchriContext';

export interface ListingCardProps {
  id: number;
  title: string;
  priceDzd: number;
  condition: string;
  wilayaName: string;
  communeName: string;
  images: string[];
  viewsCount: number;
  status: string;
  isDemoPost?: boolean;
  seller?: {
    name: string;
    rating: number;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  showStatusBadge?: boolean;
  onPayNow?: (id: number, title: string) => void;
}

export function ListingCard({
  id,
  title,
  priceDzd,
  condition,
  wilayaName,
  communeName,
  images,
  viewsCount,
  status,
  seller,
  isFavorite,
  onToggleFavorite,
  showStatusBadge,
  onPayNow,
}: ListingCardProps) {
  const { lang } = useAchri();
  const cond = CONDITION_LABELS[condition] || CONDITION_LABELS.GOOD;
  const firstImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Product Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link href={`/listings/${id}`} className="block w-full h-full">
          <img
            src={firstImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Condition badge */}
        <span
          className={`absolute top-2.5 right-2.5 rtl:right-2.5 rtl:left-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${cond.badgeColor}`}
        >
          {lang === 'ar' ? cond.ar : cond.fr}
        </span>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(id)}
            className="absolute top-2.5 left-2.5 rtl:left-2.5 rtl:right-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-slate-500 hover:text-rose-500'
              }`}
            />
          </button>
        )}

        {/* Status Overlay if in User's own Dashboard */}
        {showStatusBadge && (
          <div className="absolute bottom-2.5 inset-x-2.5">
            {status === 'PUBLISHED' && (
              <span className="flex items-center justify-center gap-1 bg-emerald-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>منشور (تم دفع 200 دج)</span>
              </span>
            )}
            {status === 'PAYMENT_PENDING' && (
              <span className="flex items-center justify-center gap-1 bg-blue-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow">
                <Clock className="w-3.5 h-3.5" />
                <span>Paiement à vérifier (بانتظار الإدارة)</span>
              </span>
            )}
            {status === 'PAYMENT_REQUIRED' && (
              <button
                type="button"
                onClick={() => onPayNow && onPayNow(id, title)}
                className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-lg transition"
              >
                <span>دفع 200 دج ونشر الإعلان</span>
              </button>
            )}
            {status === 'REJECTED' && (
              <button
                type="button"
                onClick={() => onPayNow && onPayNow(id, title)}
                className="w-full flex items-center justify-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>مرفوض الوصل — إعادة إرسال الإيصال</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Body details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <Link
            href={`/listings/${id}`}
            className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 line-clamp-2 transition"
          >
            {title}
          </Link>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-mono font-extrabold text-lg text-teal-700 tracking-tight">
              {formatDZD(priceDzd)}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {viewsCount}
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">
              {wilayaName} • {communeName}
            </span>
          </span>

          {seller && (
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{seller.rating.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
