'use client';

import React, { useState, useEffect } from 'react';
import { useAchri } from '@/context/AchriContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  DollarSign,
  Users,
  FileText,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react';

export default function AdminPaymentsDashboard() {
  const { user, settings, refreshSettings, setAuthModalOpen } = useAchri();
  const [stats, setStats] = useState<any>(null);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [receiptLightbox, setReceiptLightbox] = useState<string | null>(null);
  const [rejectModalPaymentId, setRejectModalPaymentId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState(
    'صورة الوصل غير واضحة أو رقم العملية غير مطابق'
  );
  const [toastMessage, setToastMessage] = useState('');

  // Editable bank/CCP fields
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [ccpAccount, setCcpAccount] = useState('');
  const [ccpKey, setCcpKey] = useState('');
  const [baridimobRib, setBaridimobRib] = useState('');
  const [publicationFeeDzd, setPublicationFeeDzd] = useState(200);

  const fetchAdminData = async () => {
    const resStats = await fetch('/api/admin/stats');
    if (resStats.ok) {
      const data = await resStats.json();
      setStats(data.stats);
      if (data.settings) {
        setBeneficiaryName(data.settings.beneficiaryName);
        setCcpAccount(data.settings.ccpAccount);
        setCcpKey(data.settings.ccpKey);
        setBaridimobRib(data.settings.baridimobRib);
        setPublicationFeeDzd(data.settings.publicationFeeDzd || 200);
      }
    }

    const resPayments = await fetch('/api/admin/payments');
    if (resPayments.ok) {
      const data = await resPayments.json();
      setPaymentsList(data.payments || []);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleApprovePayment = async (paymentId: number) => {
    const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'APPROVE' }),
    });
    const data = await res.json();
    if (res.ok) {
      showToast(
        '✓ تم تأكيد دفع 200 دج ونشر الإعلان بنجاح وإرسال إشعار للمستخدم'
      );
      fetchAdminData();
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectModalPaymentId) return;
    const res = await fetch(
      `/api/admin/payments/${rejectModalPaymentId}/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          rejectionReason,
        }),
      }
    );
    if (res.ok) {
      setRejectModalPaymentId(null);
      showToast(
        'تم رفض الوصل وإشعار المعلن بضرورة مراجعة إثبات الدفع وإعادة الإرسال'
      );
      fetchAdminData();
    }
  };

  const handleSaveBankSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        beneficiaryName,
        ccpAccount,
        ccpKey,
        baridimobRib,
        publicationFeeDzd,
        instructionsAr:
          'يرجى تحويل 200 دج لحساب CCP أو BaridiMob ورفع إيصال العملية.',
        instructionsFr:
          'Veuillez transférer 200 DZD au compte CCP ou BaridiMob.',
      }),
    });
    if (res.ok) {
      await refreshSettings();
      showToast('تم تحديث بيانات حساب CCP ورسوم النشر بنجاح من لوحة الإدارة');
    }
  };

  const handleQuickDemoAdminSwitch = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'switch_demo_user',
        phone: '0550000000',
      }),
    });
    window.location.reload();
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 my-10">
        <ShieldCheck className="w-14 h-14 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">
          صلاحيات المشرف (Admin CCP) مطلوبة
        </h2>
        <p className="text-xs text-slate-500">
          يمكنك التبديل فورًا إلى حساب الإدارة لمراجعة واختبار تأكيد أو رفض
          إيصالات الدفع (200 دج).
        </p>
        <button
          onClick={handleQuickDemoAdminSwitch}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-bold text-xs shadow"
        >
          الدخول بحساب الإدارة (Admin CCP - 0550000000)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-300 px-6 py-3.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow">
            CCP
          </div>
          <div>
            <span className="text-amber-400 font-extrabold text-xs">
              لوحة الإدارة والمراقبة المالية
            </span>
            <h1 className="text-2xl font-extrabold">
              Paiements & Vérification des Annonces (200 DZD)
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              مراجعة إيصالات دفع رسوم النشر (200 دج)، تفعيل الإعلانات فورًا، وتعديل بيانات حساب CCP.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Highlight KPI: Revenus des frais de publication */}
          <div className="col-span-2 bg-gradient-to-br from-amber-500 to-amber-400 rounded-2xl p-5 text-slate-950 shadow-md space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider block">
              Revenus des frais de publication
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold">
              {stats.publicationFeesRevenueDzd.toLocaleString('en-US')} DZD
            </div>
            <p className="text-[11px] font-bold text-slate-900">
              المعادلة: {stats.publicationFeesFormula}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
            <span className="text-xs text-slate-500 font-bold block">
              المدفوعات المنتظرة
            </span>
            <span className="font-mono text-2xl font-extrabold text-blue-700">
              {stats.pendingPayments}
            </span>
            <span className="text-[10px] text-blue-600 block font-bold">
              En attente de validation
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
            <span className="text-xs text-slate-500 font-bold block">
              المدفوعات المقبولة
            </span>
            <span className="font-mono text-2xl font-extrabold text-emerald-700">
              {stats.approvedPayments}
            </span>
            <span className="text-[10px] text-emerald-600 block font-bold">
              Validés (× 200 DZD)
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
            <span className="text-xs text-slate-500 font-bold block">
              الإعلانات المنشورة
            </span>
            <span className="font-mono text-2xl font-extrabold text-teal-800">
              {stats.publishedListings} / {stats.totalListings}
            </span>
            <span className="text-[10px] text-slate-500 block">
              المستخدمين: {stats.totalUsers}
            </span>
          </div>
        </div>
      )}

      {/* Section: «Paiements» (Review Payment Proofs) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>قسم المراجعة: «Paiements» (إيصالات دفع 200 دج)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              عند الضغط على «Valider le paiement» يصبح الإعلان المنشور متاحًا للعامة فورًا ويصل إشعار للمعلن.
            </p>
          </div>
        </div>

        {paymentsList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-10">
            لا توجد إيصالات دفع مسجلة بعد.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                  <th className="p-3">رقم العملية (Référence)</th>
                  <th className="p-3">المستخدم</th>
                  <th className="p-3">الإعلان</th>
                  <th className="p-3">المبلغ</th>
                  <th className="p-3">تاريخ الدفع</th>
                  <th className="p-3">صورة إثبات الدفع</th>
                  <th className="p-3">حالة الدفع</th>
                  <th className="p-3 text-end">إجراءات المراجعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsList.map((row) => {
                  const p = row.payment;
                  return (
                    <tr key={p.paymentId} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {p.transactionReference}
                        <span className="block text-[10px] text-slate-400">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {row.userName}
                        <span className="block font-mono text-slate-500 text-[11px]">
                          {row.userPhone}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 max-w-[200px] truncate">
                        {row.listingTitle}
                      </td>
                      <td className="p-3 font-mono font-extrabold text-amber-700">
                        200 DZD
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {p.paymentDate}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setReceiptLightbox(p.proofImage)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-teal-50 text-teal-800 rounded-xl font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Voir le justificatif</span>
                        </button>
                      </td>
                      <td className="p-3">
                        {p.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                            En attente
                          </span>
                        )}
                        {p.status === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                            Validé
                          </span>
                        )}
                        {p.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2.5 py-1 rounded-full font-bold">
                            Refusé
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-end">
                        {p.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            {/* Exact required button: «Valider le paiement» */}
                            <button
                              onClick={() => handleApprovePayment(p.paymentId)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm transition"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Valider le paiement</span>
                            </button>

                            {/* Exact required button: «Refuser» */}
                            <button
                              onClick={() => setRejectModalPaymentId(p.paymentId)}
                              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Refuser</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold text-[11px]">
                            تمت مراجعته
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic Editable Bank/CCP Account Settings Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="w-5 h-5 text-teal-700" />
          <h2 className="text-lg font-extrabold text-slate-900">
            إدارة بيانات الحساب البنكي CCP / BaridiMob ورسوم النشر (مباشر من لوحة الإدارة)
          </h2>
        </div>

        <form onSubmit={handleSaveBankSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nom du bénéficiaire (اسم صاحب الحساب):
            </label>
            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-bold text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              قيمة رسوم نشر الإعلان (دج):
            </label>
            <input
              type="number"
              value={publicationFeeDzd}
              onChange={(e) => setPublicationFeeDzd(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Compte CCP:
            </label>
            <input
              type="text"
              value={ccpAccount}
              onChange={(e) => setCcpAccount(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clé (المفتاح):
            </label>
            <input
              type="text"
              value={ccpKey}
              onChange={(e) => setCcpKey(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-xs"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              RIB BaridiMob:
            </label>
            <input
              type="text"
              value={baridimobRib}
              onChange={(e) => setBaridimobRib(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-xs"
              required
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow"
            >
              حفظ وتحديث معلومات الحساب CCP فورًا
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox for Payment Justificatif */}
      {receiptLightbox && (
        <div
          onClick={() => setReceiptLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-4 max-w-lg w-full space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">
                صورة وصل إثبات الدفع (Justificatif 200 DZD)
              </span>
              <button
                onClick={() => setReceiptLightbox(null)}
                className="p-1 rounded-lg bg-slate-100 text-slate-600"
              >
                ✕
              </button>
            </div>
            <img
              src={receiptLightbox}
              alt="Justificatif"
              className="w-full max-h-[70vh] object-contain rounded-xl border"
            />
          </div>
        </div>
      )}

      {/* Modal: Refuser (Rejection Reason) */}
      {rejectModalPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">
              رفض إيصال الدفع وإشعار المعلن
            </h3>
            <p className="text-xs text-slate-600">
              سيصل الإشعار التالي للمستخدم: «تعذر التحقق من عملية الدفع. يرجى مراجعة إثبات الدفع وإعادة الإرسال.»
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-xs"
              placeholder="سبب الرفض (مثلاً: رقم الحوالة غير مطابق)"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectModalPaymentId(null)}
                className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejectPayment}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-xs"
              >
                تأكيد الرفض (Refuser)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
