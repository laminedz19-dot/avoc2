'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAchri } from '@/context/AchriContext';
import { ListingCard } from '@/components/ListingCard';
import { PaymentModal200Dzd } from '@/components/PaymentModal200Dzd';
import {
  User,
  Heart,
  Bell,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  MapPin,
  Star,
} from 'lucide-react';

export default function MyListingsDashboardPage() {
  const { user, setAuthModalOpen, t } = useAchri();
  const [tab, setTab] = useState<'ADS' | 'FAVORITES' | 'NOTIFICATIONS'>('ADS');
  const [myListings, setMyListings] = useState<any[]>([]);
  const [favoritesList, setFavoritesList] = useState<any[]>([]);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [payTarget, setPayTarget] = useState<{ id: number; title: string } | null>(null);

  const fetchMyData = async () => {
    const resAds = await fetch('/api/listings?mine=true');
    if (resAds.ok) {
      const data = await resAds.json();
      setMyListings(data.listings || []);
    }
    const resFavs = await fetch('/api/favorites');
    if (resFavs.ok) {
      const data = await resFavs.json();
      setFavoritesList(data.favorites || []);
    }
    const resNotif = await fetch('/api/notifications');
    if (resNotif.ok) {
      const data = await resNotif.json();
      setNotificationsList(data.notifications || []);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 my-10">
        <User className="w-12 h-12 text-teal-700 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">
          يرجى تسجيل الدخول لعرض حسابك وإعلاناتك
        </h2>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-3 bg-teal-700 text-white rounded-xl font-bold text-xs shadow"
        >
          تسجيل الدخول برقم الهاتف OTP
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow">
            {user.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold">{user.name}</h1>
              {user.role === 'ADMIN' && (
                <span className="bg-amber-400 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  ADMIN CCP
                </span>
              )}
              {user.isDemo && (
                <span className="bg-sky-400 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  حساب تجريبي (لا ينشر فعليًا للعامة)
                </span>
              )}
            </div>
            <p className="text-xs text-teal-100 font-mono mt-0.5">
              الهاتف: {user.phone} • {user.wilayaName} ({user.communeName})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 rounded-xl font-extrabold text-xs shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ نشر إعلان جديد (200 دج)</span>
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              href="/admin/payments"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-bold text-xs shadow flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>مراجعة إيصالات الدفع (Admin)</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setTab('ADS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            tab === 'ADS'
              ? 'bg-teal-700 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          إعلاناتي ({myListings.length})
        </button>
        <button
          onClick={() => setTab('FAVORITES')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            tab === 'FAVORITES'
              ? 'bg-teal-700 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          المفضلة ({favoritesList.length})
        </button>
        <button
          onClick={() => setTab('NOTIFICATIONS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
            tab === 'NOTIFICATIONS'
              ? 'bg-teal-700 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>الإشعارات ({notificationsList.length})</span>
        </button>
      </div>

      {/* ADS TAB */}
      {tab === 'ADS' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">
                لم تنشر أي إعلان بعد
              </h3>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-bold text-xs"
              >
                + نشر أول إعلان لك (رسوم 200 دج)
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {myListings.map((item) => (
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
                  isDemoPost={item.isDemoPost}
                  showStatusBadge
                  onPayNow={(adId, adTitle) =>
                    setPayTarget({ id: adId, title: adTitle })
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAVORITES TAB */}
      {tab === 'FAVORITES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {favoritesList.map((item) => (
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
            />
          ))}
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {tab === 'NOTIFICATIONS' && (
        <div className="space-y-3">
          {notificationsList.map((n) => (
            <div
              key={n.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {n.titleAr}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{n.bodyAr}</p>
                </div>
              </div>
              {n.link && (
                <Link
                  href={n.link}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold shrink-0"
                >
                  عرض الإعلان →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal triggered from unpaid listings */}
      {payTarget && (
        <PaymentModal200Dzd
          listingId={payTarget.id}
          listingTitle={payTarget.title}
          isOpen={Boolean(payTarget)}
          onClose={() => setPayTarget(null)}
          onSuccess={() => {
            setPayTarget(null);
            fetchMyData();
          }}
        />
      )}
    </div>
  );
}
