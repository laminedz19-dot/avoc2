import { NextResponse } from 'next/server';
import { db } from '@/db';
import { payments, listings, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'صلاحيات المشرف مطلوبة (Admin)' }, { status: 403 });
  }

  const rows = await db
    .select({
      payment: payments,
      listingTitle: listings.title,
      listingStatus: listings.status,
      userName: users.name,
      userPhone: users.phone,
    })
    .from(payments)
    .innerJoin(listings, eq(payments.listingId, listings.id))
    .innerJoin(users, eq(payments.userId, users.id))
    .orderBy(desc(payments.createdAt));

  return NextResponse.json({ payments: rows });
}
