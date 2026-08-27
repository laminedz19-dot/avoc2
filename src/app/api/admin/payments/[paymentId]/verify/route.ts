import { NextResponse } from 'next/server';
import { db } from '@/db';
import {
  payments,
  listings,
  notifications,
  adminLogs,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function POST(
  req: Request,
  context: { params: Promise<{ paymentId: string }> }
) {
  await ensureSeeded();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'صلاحيات المشرف (Admin) مطلوبة للتحقق من الدفع' },
      { status: 403 }
    );
  }

  const { paymentId } = await context.params;
  const idNum = Number(paymentId);

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.paymentId, idNum))
    .limit(1);

  if (!payment) {
    return NextResponse.json({ error: 'سجل الدفع غير موجود' }, { status: 404 });
  }

  const body = await req.json();
  const { action, rejectionReason } = body; // action: 'APPROVE' | 'REJECT'

  if (action === 'APPROVE') {
    // 1. Payment = VERIFIED
    const [updatedPayment] = await db
      .update(payments)
      .set({
        status: 'VERIFIED',
        verifiedBy: admin.id,
        verifiedAt: new Date(),
      })
      .where(eq(payments.paymentId, idNum))
      .returning();

    // 2. Listing = PUBLISHED
    await db
      .update(listings)
      .set({
        status: 'PUBLISHED',
        publishedAt: new Date(),
      })
      .where(eq(listings.id, payment.listingId));

    // 3. Exact user notification specified in user requirement
    await db.insert(notifications).values({
      userId: payment.userId,
      titleAr: 'تم تأكيد دفع 200 دج وتم نشر إعلانك بنجاح.',
      titleFr: 'Paiement de 200 DZD validé, votre annonce est publiée.',
      bodyAr: `تم التحقق من الحوالة رقم ${payment.transactionReference} من قبل المشرف وأصبح الإعلان منشورًا ومتاحًا للجميع.`,
      bodyFr: `Votre paiement (${payment.transactionReference}) a été validé. Annonce en ligne.`,
      link: `/listings/${payment.listingId}`,
    });

    // 4. Audit log
    await db.insert(adminLogs).values({
      adminId: admin.id,
      action: 'PAYMENT_VERIFIED',
      targetType: 'PAYMENT',
      targetId: idNum,
      details: `تمت الموافقة على الدفع (200 دج) وتفعيل الإعلان #${payment.listingId}`,
    });

    return NextResponse.json({
      payment: updatedPayment,
      message: 'تم تأكيد دفع 200 دج ونشر الإعلان فوراً',
    });
  } else {
    // REJECT
    const [updatedPayment] = await db
      .update(payments)
      .set({
        status: 'REJECTED',
        rejectionReason: rejectionReason || 'وصل غير واضح أو رقم عملية غير مطابق',
        verifiedBy: admin.id,
        verifiedAt: new Date(),
      })
      .where(eq(payments.paymentId, idNum))
      .returning();

    // Listing stays / reverts to REJECTED / PAYMENT_REQUIRED
    await db
      .update(listings)
      .set({
        status: 'REJECTED',
      })
      .where(eq(listings.id, payment.listingId));

    // Exact user notification specified in user requirement
    await db.insert(notifications).values({
      userId: payment.userId,
      titleAr: 'تعذر التحقق من عملية الدفع. يرجى مراجعة إثبات الدفع وإعادة الإرسال.',
      titleFr: 'Paiement non vérifiable. Veuillez soumettre un nouveau justificatif.',
      bodyAr:
        rejectionReason ||
        'تعذر التحقق من عملية الدفع. يرجى مراجعة إثبات الدفع وإعادة الإرسال.',
      bodyFr:
        rejectionReason ||
        'Impossible de vérifier la transaction. Veuillez renvoyer une preuve de paiement valide.',
      link: `/listings/${payment.listingId}`,
    });

    await db.insert(adminLogs).values({
      adminId: admin.id,
      action: 'PAYMENT_REJECTED',
      targetType: 'PAYMENT',
      targetId: idNum,
      details: `تم رفض إثبات الدفع لإعلان #${payment.listingId}: ${
        rejectionReason || 'غير مطابق'
      }`,
    });

    return NextResponse.json({
      payment: updatedPayment,
      message: 'تم رفض الإيصال وإشعار المعلن لإعادة إرسال إثبات الدفع',
    });
  }
}
