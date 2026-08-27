import { NextResponse } from 'next/server';
import { db } from '@/db';
import { favorites, listings, listingImages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ favorites: [] });
  }

  const rows = await db
    .select({
      fav: favorites,
      listing: listings,
    })
    .from(favorites)
    .innerJoin(listings, eq(favorites.listingId, listings.id))
    .where(eq(favorites.userId, user.id));

  const allImages = await db.select().from(listingImages);

  const enriched = rows.map((r) => {
    const images = allImages
      .filter((i) => i.listingId === r.listing.id)
      .map((i) => i.imageUrl);
    return {
      ...r.listing,
      images,
      isFavorite: true,
    };
  });

  return NextResponse.json({ favorites: enriched });
}

export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 });
  }

  const { listingId } = await req.json();
  const [existing] = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, user.id),
        eq(favorites.listingId, Number(listingId))
      )
    )
    .limit(1);

  if (existing) {
    await db
      .delete(favorites)
      .where(eq(favorites.id, existing.id));
    return NextResponse.json({ isFavorite: false });
  } else {
    await db.insert(favorites).values({
      userId: user.id,
      listingId: Number(listingId),
    });
    return NextResponse.json({ isFavorite: true });
  }
}
