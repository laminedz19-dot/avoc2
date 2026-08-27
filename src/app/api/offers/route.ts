import { NextResponse } from 'next/server';
import { db } from '@/db';
import { offers, messages, conversations, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 });
  }

  const body = await req.json();
  const { offerId, action, counterPriceDzd } = body; // action: 'ACCEPT' | 'REJECT' | 'COUNTER'

  const [offer] = await db
    .select()
    .from(offers)
    .where(eq(offers.id, Number(offerId)))
    .limit(1);

  if (!offer) {
    return NextResponse.json({ error: 'العرض غير موجود' }, { status: 404 });
  }

  if (action === 'ACCEPT') {
    const [updated] = await db
      .update(offers)
      .set({ status: 'ACCEPTED' })
      .where(eq(offers.id, offer.id))
      .returning();

    await db.insert(notifications).values({
      userId: offer.buyerId,
      titleAr: 'تم قبول عرضك المالي على AchriDZ!',
      titleFr: 'Votre offre a été acceptée !',
      bodyAr: `وافق البائع على عرض الشراء بمبلغ ${offer.offerPriceDzd.toLocaleString('en-US')} دج. يمكنك التنسيق لإتمام التسليم.`,
      bodyFr: `Le vendeur a accepté votre offre de ${offer.offerPriceDzd} DZD.`,
      link: `/messages`,
    });

    return NextResponse.json({
      offer: updated,
      message: 'تم قبول العرض المالي بنجاح',
    });
  } else if (action === 'REJECT') {
    const [updated] = await db
      .update(offers)
      .set({ status: 'REJECTED' })
      .where(eq(offers.id, offer.id))
      .returning();

    return NextResponse.json({
      offer: updated,
      message: 'تم رفض العرض المالي',
    });
  } else if (action === 'COUNTER') {
    const [updated] = await db
      .update(offers)
      .set({
        status: 'COUNTERED',
        counterPriceDzd: Number(counterPriceDzd) || offer.offerPriceDzd,
      })
      .where(eq(offers.id, offer.id))
      .returning();

    return NextResponse.json({
      offer: updated,
      message: `تم إرسال عرض مضاد بقيمة ${Number(counterPriceDzd).toLocaleString(
        'en-US'
      )} دج`,
    });
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
}
