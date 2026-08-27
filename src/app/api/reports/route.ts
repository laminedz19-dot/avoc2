import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reports } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول للإبلاغ' }, { status: 401 });
  }

  const body = await req.json();
  const { listingId, reportedUserId, reason, details } = body;

  const [newReport] = await db
    .insert(reports)
    .values({
      reporterId: user.id,
      listingId: listingId ? Number(listingId) : null,
      reportedUserId: reportedUserId ? Number(reportedUserId) : null,
      reason: reason || 'محتوى مخالف',
      details: details || '',
      status: 'PENDING',
    })
    .returning();

  return NextResponse.json({
    report: newReport,
    message: 'تم إرسال البلاغ لإدارة المنصة وستتم مراجعته فورا.',
  });
}
