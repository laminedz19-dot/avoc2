import { NextResponse } from 'next/server';
import { db } from '@/db';
import { platformSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const [settings] = await db.select().from(platformSettings).limit(1);
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'صلاحيات المشرف مطلوبة (Admin)' }, { status: 403 });
  }

  const body = await req.json();
  const {
    publicationFeeDzd,
    beneficiaryName,
    ccpAccount,
    ccpKey,
    baridimobRib,
    instructionsAr,
    instructionsFr,
  } = body;

  const [existing] = await db.select().from(platformSettings).limit(1);
  if (!existing) {
    return NextResponse.json({ error: 'الإعدادات غير موجودة' }, { status: 404 });
  }

  const [updated] = await db
    .update(platformSettings)
    .set({
      publicationFeeDzd: Number(publicationFeeDzd) || 200,
      beneficiaryName,
      ccpAccount,
      ccpKey,
      baridimobRib,
      instructionsAr,
      instructionsFr,
      updatedAt: new Date(),
      updatedBy: user.id,
    })
    .where(eq(platformSettings.id, existing.id))
    .returning();

  return NextResponse.json({
    settings: updated,
    message: 'تم تحديث بيانات حساب CCP ورسوم النشر بنجاح',
  });
}
