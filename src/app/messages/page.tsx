'use client';

import React, { useState, useEffect } from 'react';
import { useAchri } from '@/context/AchriContext';
import { formatDZD } from '@/lib/algeria-data';
import {
  Send,
  MessageCircle,
  TrendingDown,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export default function MessagesChatPage() {
  const { user, setAuthModalOpen } = useAchri();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [inputText, setInputText] = useState('');
  const [counterPrice, setCounterPrice] = useState('');

  const fetchConversations = async () => {
    const res = await fetch('/api/conversations');
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations || []);
      if (!activeConv && data.conversations?.length > 0) {
        setActiveConv(data.conversations[0]);
      } else if (activeConv) {
        const updated = data.conversations.find((c: any) => c.id === activeConv.id);
        if (updated) setActiveConv(updated);
      }
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    const peerId =
      activeConv.buyerId === user?.id ? activeConv.sellerId : activeConv.buyerId;

    await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: activeConv.listingId,
        sellerId: peerId,
        text: inputText,
      }),
    });
    setInputText('');
    fetchConversations();
  };

  const handleRespondToOffer = async (offerId: number, action: string) => {
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        action,
        counterPriceDzd: counterPrice ? Number(counterPrice) : undefined,
      }),
    });
    setCounterPrice('');
    fetchConversations();
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 my-10">
        <MessageCircle className="w-12 h-12 text-teal-700 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">
          يرجى تسجيل الدخول للوصول إلى رسائل الدردشة والتفاوض
        </h2>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-3 bg-teal-700 text-white rounded-xl font-bold text-xs shadow"
        >
          تسجيل الدخول الآن
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Conversations Sidebar */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-slate-200 p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-extrabold text-base text-slate-900">
              المحادثات والتفاوض المالي
            </h2>
            <button
              onClick={fetchConversations}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              title="تحديث"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">
              لا توجد محادثات بعد. تواصل مع أي بائع من صفحة الإعلان.
            </p>
          ) : (
            conversations.map((c) => {
              const active = activeConv?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`w-full text-start p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-teal-700 text-white border-teal-700 shadow'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold text-xs block truncate">
                      {c.listing.title}
                    </span>
                    <span className="text-[11px] opacity-80 block font-mono mt-0.5">
                      {formatDZD(c.listing.priceDzd)}
                    </span>
                  </div>
                  {c.latestOffer && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      مساومة
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Chat Feed */}
        <div className="md:col-span-8 flex flex-col justify-between bg-slate-50/50">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {activeConv.listing.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    الطرف الآخر: {activeConv.peer?.name || 'مستخدم جزائري'} • السعر المطلوب:{' '}
                    <strong className="font-mono text-teal-700">
                      {formatDZD(activeConv.listing.priceDzd)}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Price Negotiation Offer Card if active */}
              {activeConv.latestOffer && (
                <div className="p-4 bg-amber-50/90 border-b border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs space-y-1">
                    <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-amber-700" />
                      <span>عرض مساومة على السعر (نظام التفاوض)</span>
                    </div>
                    <div className="font-mono text-sm font-extrabold text-teal-800">
                      العرض المقترح: {formatDZD(activeConv.latestOffer.offerPriceDzd)}
                      {' • '}
                      <span className="text-slate-600">
                        الحالة: {activeConv.latestOffer.status}
                      </span>
                    </div>
                  </div>

                  {activeConv.latestOffer.status === 'PENDING' &&
                    user.id === activeConv.sellerId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleRespondToOffer(
                              activeConv.latestOffer.id,
                              'ACCEPT'
                            )
                          }
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>قبول</span>
                        </button>
                        <button
                          onClick={() =>
                            handleRespondToOffer(
                              activeConv.latestOffer.id,
                              'REJECT'
                            )
                          }
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رفض</span>
                        </button>
                      </div>
                    )}
                </div>
              )}

              {/* Messages list */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4 max-h-[420px]">
                {activeConv.messages?.map((m: any) => {
                  const mine = m.senderId === user.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                          mine
                            ? 'bg-teal-700 text-white rounded-bl-sm'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-br-sm'
                        }`}
                      >
                        {m.offerPriceDzd && (
                          <div className="mb-1 text-[11px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-bold">
                            عرض شراء: {formatDZD(m.offerPriceDzd)}
                          </div>
                        )}
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Send Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب رسالتك للمشتري أو البائع..."
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              اختر محادثة من القائمة
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
