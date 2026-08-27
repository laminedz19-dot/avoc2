import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createToken, getCurrentUser, hashPassword } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      isDemo: user.isDemo,
      role: user.role,
      avatarUrl: user.avatarUrl,
      wilayaCode: user.wilayaCode,
      wilayaName: user.wilayaName,
      communeName: user.communeName,
      ratingSum: user.ratingSum,
      ratingCount: user.ratingCount,
      createdAt: user.createdAt,
    },
  });
}

export async function POST(req: Request) {
  await ensureSeeded();
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Request OTP Code
    if (action === 'request_otp') {
      const { phone, name, wilayaCode, wilayaName, communeName } = body;
      if (!phone || phone.trim().length < 9) {
        return NextResponse.json(
          { error: 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0661234567)' },
          { status: 400 }
        );
      }
      const cleanPhone = phone.trim();
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.phone, cleanPhone))
        .limit(1);

      if (existing) {
        await db
          .update(users)
          .set({ otpCode, otpExpiresAt: expiresAt })
          .where(eq(users.id, existing.id));
      } else {
        await db.insert(users).values({
          name: name || `مستخدم جزائري ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          phoneVerified: false,
          otpCode,
          otpExpiresAt: expiresAt,
          passwordHash: hashPassword('123456'),
          wilayaCode: wilayaCode || '16',
          wilayaName: wilayaName || 'الجزائر العاصمة',
          communeName: communeName || 'باب الزوار',
        });
      }

      return NextResponse.json({
        message: 'تم إرسال رمز التحقق OTP إلى هاتفك بنجاح',
        demoOtp: otpCode, // Exposed in demo/sandbox for instantaneous 1-click test
      });
    }

    // 2. Verify OTP Code & Login
    if (action === 'verify_otp') {
      const { phone, code } = body;
      const cleanPhone = (phone || '').trim();
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.phone, cleanPhone))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: 'الحساب غير موجود' }, { status: 404 });
      }

      // Check OTP code or universal demo code 123456
      if (user.otpCode !== code && code !== '123456') {
        return NextResponse.json({ error: 'رمز التحقق OTP غير صحيح' }, { status: 400 });
      }

      await db
        .update(users)
        .set({ phoneVerified: true, otpCode: null })
        .where(eq(users.id, user.id));

      const token = createToken({
        id: user.id,
        phone: user.phone,
        role: user.role,
      });

      const cookieStore = await cookies();
      cookieStore.set('achridz_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          wilayaCode: user.wilayaCode,
          wilayaName: user.wilayaName,
          communeName: user.communeName,
        },
      });
    }

    // 3. Quick Password / Phone Login (or demo Admin/Seller switch)
    if (action === 'login') {
      const { phone, password } = body;
      const cleanPhone = (phone || '').trim();
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.phone, cleanPhone))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: 'رقم الهاتف غير مسجل في المنصة' }, { status: 404 });
      }

      const hashed = hashPassword(password || '');
      if (user.passwordHash !== hashed && password !== 'admin123' && password !== '123456') {
        return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 });
      }

      const token = createToken({
        id: user.id,
        phone: user.phone,
        role: user.role,
      });

      const cookieStore = await cookies();
      cookieStore.set('achridz_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          wilayaCode: user.wilayaCode,
          wilayaName: user.wilayaName,
          communeName: user.communeName,
        },
      });
    }

    // 4. Switch Account (Quick Demo Persona Switcher: Admin vs Seller vs Buyer)
    if (action === 'switch_demo_user') {
      const { phone } = body;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);
      if (!user) {
        return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
      }
      const token = createToken({
        id: user.id,
        phone: user.phone,
        role: user.role,
      });
      const cookieStore = await cookies();
      cookieStore.set('achridz_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
      return NextResponse.json({ user });
    }

    // 5. Logout
    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('achridz_token');
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'حدث خطأ في المصادقة' }, { status: 500 });
  }
}
