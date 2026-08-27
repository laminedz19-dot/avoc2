import { NextResponse } from 'next/server';
import { db } from '@/db';
import {
  users,
  listings,
  payments,
  reports,
  platformSettings,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'صلاحيات الإدارة مطلوبة' }, { status: 403 });
  }

  const allUsers = await db.select().from(users);
  const allListings = await db.select().from(listings);
  const allPayments = await db.select().from(payments);
  const allReports = await db.select().from(reports);
  const [settings] = await db.select().from(platformSettings).limit(1);

  const verifiedPaymentsCount = allPayments.filter(
    (p) => p.status === 'VERIFIED'
  ).length;
  const pendingPaymentsCount = allPayments.filter(
    (p) => p.status === 'PENDING'
  ).length;
  const rejectedPaymentsCount = allPayments.filter(
    (p) => p.status === 'REJECTED'
  ).length;

  const feeAmount = settings?.publicationFeeDzd || 200;
  const publicationFeesRevenueDzd = verifiedPaymentsCount * feeAmount;

  return NextResponse.json({
    stats: {
      totalUsers: allUsers.length,
      bannedUsers: allUsers.filter((u) => u.isBanned).length,
      totalListings: allListings.length,
      publishedListings: allListings.filter((l) => l.status === 'PUBLISHED')
        .length,
      soldListings: allListings.filter((l) => l.status === 'SOLD').length,
      pendingPayments: pendingPaymentsCount,
      approvedPayments: verifiedPaymentsCount,
      rejectedPayments: rejectedPaymentsCount,
      publicationFeesRevenueDzd, // Exact: عدد المدفوعات المقبولة × 200 دج
      publicationFeesFormula: `${verifiedPaymentsCount} إعلان × ${feeAmount} دج = ${publicationFeesRevenueDzd.toLocaleString(
        'en-US'
      )} دج`,
      totalReports: allReports.length,
    },
    settings,
  });
}
