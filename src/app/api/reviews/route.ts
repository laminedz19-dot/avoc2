import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول لتقييم الطرف الآخر' }, { status: 401 });
  }

  const body = await req.json();
  const { listingId, revieweeId, rating, comment } = body;

  const stars = Math.min(5, Math.max(1, Number(rating) || 5));

  const [newReview] = await db
    .insert(reviews)
    .values({
      listingId: Number(listingId),
      reviewerId: user.id,
      revieweeId: Number(revieweeId),
      rating: stars,
      comment: (comment || '').trim() || 'تعامل طيب وممتاز',
    })
    .returning();

  // Update seller / buyer overall rating sum & count
  const [targetUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(revieweeId)))
    .limit(1);

  if (targetUser) {
    await db
      .update(users)
      .set({
        ratingSum: targetUser.ratingSum + stars,
        ratingCount: targetUser.ratingCount + 1,
      })
      .where(eq(users.id, targetUser.id));
  }

  return NextResponse.json({
    review: newReview,
    message: 'تم تسجيل تقييمك (من 1 إلى 5 نجوم) بنجاح',
  });
}
