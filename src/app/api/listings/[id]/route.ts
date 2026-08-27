import { NextResponse } from 'next/server';
import { db } from '@/db';
import {
  listings,
  listingImages,
  users,
  categories,
  reviews,
  payments,
  favorites,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  const { id } = await context.params;
  const listingId = Number(id);
  if (!listingId) {
    return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
  }

  const [row] = await db
    .select({
      listing: listings,
      sellerName: users.name,
      sellerPhone: users.phone,
      sellerAvatar: users.avatarUrl,
      sellerRatingSum: users.ratingSum,
      sellerRatingCount: users.ratingCount,
      sellerWilaya: users.wilayaName,
      sellerCreatedAt: users.createdAt,
      categoryNameAr: categories.nameAr,
      categoryNameFr: categories.nameFr,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .where(eq(listings.id, listingId))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: 'الإعلان غير موجود' }, { status: 404 });
  }

  // Increment views count
  await db
    .update(listings)
    .set({ viewsCount: row.listing.viewsCount + 1 })
    .where(eq(listings.id, listingId));

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listingId))
    .orderBy(listingImages.displayOrder);

  const listingReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      reviewerName: users.name,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.reviewerId, users.id))
    .where(eq(reviews.listingId, listingId));

  const [listingPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.listingId, listingId))
    .limit(1);

  const currentUser = await getCurrentUser();
  let isFavorite = false;
  if (currentUser) {
    const [fav] = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, currentUser.id))
      .limit(1);
    isFavorite = Boolean(fav);
  }

  return NextResponse.json({
    listing: {
      ...row.listing,
      viewsCount: row.listing.viewsCount + 1,
      images: images.map((i) => i.imageUrl),
      category: {
        id: row.listing.categoryId,
        nameAr: row.categoryNameAr,
        nameFr: row.categoryNameFr,
      },
      seller: {
        id: row.listing.userId,
        name: row.sellerName,
        phone: row.sellerPhone,
        avatarUrl: row.sellerAvatar,
        wilayaName: row.sellerWilaya,
        memberSince: row.sellerCreatedAt,
        rating:
          row.sellerRatingCount > 0
            ? Number((row.sellerRatingSum / row.sellerRatingCount).toFixed(1))
            : 5.0,
        reviewsCount: row.sellerRatingCount,
      },
      reviews: listingReviews,
      payment: listingPayment || null,
      isFavorite,
    },
  });
}
