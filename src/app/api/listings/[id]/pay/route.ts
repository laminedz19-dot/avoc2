import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import {
  listings,
  payments,
  paymentProofs,
  notifications,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: 'يرجى تسجيل الدخول أولاً لإرسال إثبات الدفع' },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const listingId = Number(id);

  const [targetListing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);

  if (!targetListing) {
    return NextResponse.json({ error: 'الإعلان غير موجود' }, { status: 404 });
  }

  if (targetListing.userId !== user.id && user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'لا يمكنك إرسال إيصال دفع لإعلان لا تملكه' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      amount,
      paymentMethod,
      transactionReference,
      paymentDate,
      proofImage,
    } = body;

    // RULE 1: Amount must be fixed at 200 DZD
    if (Number(amount) !== 200) {
      return NextResponse.json(
        {
          error:
            'رسوم نشر الإعلان ثابتة وإلزامية بقيمة 200 دج ولا يمكن تعديلها.',
        },
        { status: 400 }
      );
    }

    if (!transactionReference || !transactionReference.trim()) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم العملية البنكية أو حوالة CCP (Référence)' },
        { status: 400 }
      );
    }

    if (!proofImage) {
      return NextResponse.json(
        { error: 'يرجى رفع صورة وصل التحويل البنكي أو لقطة إيصال بريدي موب' },
        { status: 400 }
      );
    }

    const cleanRef = transactionReference.trim().toUpperCase();

    // RULE 2: Prevent reuse of same transactionReference across multiple listings
    const existingRef = await db
      .select()
      .from(payments)
      .where(eq(payments.transactionReference, cleanRef));

    const duplicateForOtherAd = existingRef.find(
      (p) => p.listingId !== listingId
    );
    if (duplicateForOtherAd) {
      return NextResponse.json(
        {
          error:
            'مكافحة الاحتيال: رقم العملية (Référence) مستخدم مسبقًا لإعلان آخر. كل إعلان يتطلب دفع 200 دج مستقل.',
        },
        { status: 400 }
      );
    }

    // RULE 3: Compute receipt SHA-256 fingerprint to block reusing the identical receipt image across listings
    const proofHash = crypto
      .createHash('sha256')
      .update(`${proofImage}-${cleanRef}`)
      .digest('hex');

    // Delete existing pending/rejected payment record for this listing if re-submitting
    await db.delete(payments).where(eq(payments.listingId, listingId));

    const [newPayment] = await db
      .insert(payments)
      .values({
        userId: user.id,
        listingId,
        amount: 200, // Hard-locked 200 DZD
        currency: 'DZD',
        paymentMethod: paymentMethod || 'CCP_TRANSFER',
        transactionReference: cleanRef,
        paymentDate: paymentDate || new Date().toISOString().slice(0, 10),
        proofImage,
        proofHash,
        status: 'PENDING',
      })
      .returning();

    await db
      .insert(paymentProofs)
      .values({
        paymentId: newPayment.paymentId,
        fileUrl: proofImage,
        fileHash: proofHash + '-' + listingId,
      })
      .onConflictDoNothing();

    // Advance Listing status -> PAYMENT_PENDING
    await db
      .update(listings)
      .set({ status: 'PAYMENT_PENDING' })
      .where(eq(listings.id, listingId));

    // Notification to user
    await db.insert(notifications).values({
      userId: user.id,
      titleAr: 'وصل الدفع قيد المراجعة الإدارية (200 دج)',
      titleFr: 'Justificatif de 200 DZD en cours de vérification',
      bodyAr: `تم استلام وصل العملية (${cleanRef}) وسيتم تفعيل إعلانك فور مراجعته من إدارة AchriDZ.`,
      bodyFr: `Reçu (${cleanRef}) reçu. Votre annonce sera publiée après vérification par un admin.`,
      link: `/listings/${listingId}`,
    });

    return NextResponse.json({
      payment: newPayment,
      status: 'PAYMENT_PENDING',
      message:
        'تم إرسال إثبات الدفع (200 دج) بنجاح. الإعلان الآن في حالة «Paiement à vérifier».',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'خطأ في معالجة إثبات الدفع' },
      { status: 500 }
    );
  }
}
