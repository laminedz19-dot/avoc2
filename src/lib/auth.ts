import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SECRET_KEY = process.env.AUTH_SECRET || 'achridz_maghreb_200dzd_mandatory_secret_key_2026';

export function hashPassword(plain: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(plain).digest('hex');
}

export function createToken(payload: { id: number; phone: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { id: number; phone: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('achridz_token')?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);
  if (!user || user.isBanned) return null;
  return user;
}
