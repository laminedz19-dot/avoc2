import { NextResponse } from 'next/server';
import { db } from '@/db';
import {
  listings,
  listingImages,
  users,
  categories,
  favorites,
  payments,
} from '@/db/schema';
import { eq, desc, and, gte, lte, ilike, or } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET(req: Request) {
  await ensureSeeded();
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const categoryId = url.searchParams.get('category');
  const wilaya = url.searchParams.get('wilaya');
  const commune = url.searchParams.get('commune');
  const condition = url.searchParams.get('condition');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const sort = url.searchParams.get('sort') || 'newest'; // newest, views, closest, price_asc
  const mine = url.searchParams.get('mine') === 'true';
  const includeUnpublished = url.searchParams.get('all') === 'true';
  const userWilaya = url.searchParams.get('userWilaya');

  const currentUser = await getCurrentUser();

  const allListings = await db
    .select({
      listing: listings,
      sellerName: users.name,
      sellerPhone: users.phone,
      sellerAvatar: users.avatarUrl,
      sellerRatingSum: users.ratingSum,
      sellerRatingCount: users.ratingCount,
      categoryNameAr: categories.nameAr,
      categoryNameFr: categories.nameFr,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .orderBy(desc(listings.createdAt));

  const allImages = await db.select().from(listingImages);
  const allPayments = await db.select().from(payments);
  let userFavoriteIds = new Set<number>();
  if (currentUser) {
    const favs = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, currentUser.id));
    favs.forEach((f) => userFavoriteIds.add(f.listingId));
  }

  const enriched = allListings
    .map((item) => {
      const images = allImages
        .filter((img) => img.listingId === item.listing.id)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((img) => img.imageUrl);

      const listingPayment = allPayments.find(
        (p) => p.listingId === item.listing.id
      );

      return {
        ...item.listing,
        seller: {
          id: item.listing.userId,
          name: item.sellerName,
          phone: item.sellerPhone,
          avatarUrl: item.sellerAvatar,
          rating:
            item.sellerRatingCount > 0
              ? Number((item.sellerRatingSum / item.sellerRatingCount).toFixed(1))
              : 5.0,
          reviewsCount: item.sellerRatingCount,
        },
        category: {
          id: item.listing.categoryId,
          nameAr: item.categoryNameAr,
          nameFr: item.categoryNameFr,
        },
        images,
        isFavorite: userFavoriteIds.has(item.listing.id),
        paymentStatus: listingPayment?.status || null,
        paymentReference: listingPayment?.transactionReference || null,
        paymentProof: listingPayment?.proofImage || null,
      };
    })
    .filter((item) => {
      // Rule 2: Public feed shows ONLY PUBLISHED / RESERVED / SOLD ads.
      // Rule 3: حسابات التجريب لا يمكنها النشر الفعلي للعامة (إذا كان الإعلان أنشئ حديثًا بحساب تجريبي isDemoPost=true لا يظهر في السوق العام للعامة بل يظهر في حساب المستخدم التجريبي فقط أو للمشرف).
      if (mine && currentUser) {
        return item.userId === currentUser.id;
      }
      if (includeUnpublished && currentUser?.role === 'ADMIN') {
        return true;
      }
      if (item.isDemoPost) {
        return false; // الإعلانات التجريبية لا تُنشر فعلياً للعامة
      }
      return (
        item.status === 'PUBLISHED' ||
        item.status === 'RESERVED' ||
        item.status === 'SOLD'
      );
    })
    .filter((item) => {
      if (q.trim()) {
        const query = q.trim().toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchWilaya = item.wilayaName.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchWilaya) return false;
      }
      if (categoryId && Number(categoryId) > 0) {
        if (item.categoryId !== Number(categoryId)) return false;
      }
      if (wilaya && wilaya !== 'ALL') {
        if (item.wilayaCode !== wilaya) return false;
      }
      if (commune && commune.trim()) {
        if (!item.communeName.includes(commune)) return false;
      }
      if (condition && condition !== 'ALL') {
        if (item.condition !== condition) return false;
      }
      if (minPrice && Number(minPrice) > 0) {
        if (item.priceDzd < Number(minPrice)) return false;
      }
      if (maxPrice && Number(maxPrice) > 0) {
        if (item.priceDzd > Number(maxPrice)) return false;
      }
      return true;
    });

  // Sorting
  if (sort === 'views') {
    enriched.sort((a, b) => b.viewsCount - a.viewsCount);
  } else if (sort === 'price_asc') {
    enriched.sort((a, b) => a.priceDzd - b.priceDzd);
  } else if (sort === 'closest' && userWilaya) {
    enriched.sort((a, b) => {
      const aSame = a.wilayaCode === userWilaya ? 1 : 0;
      const bSame = b.wilayaCode === userWilaya ? 1 : 0;
      return bSame - aSame;
    });
  }

  return NextResponse.json({ listings: enriched });
}

export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: 'يجب تسجيل الدخول لنشر إعلان' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      categoryId,
      title,
      description,
      priceDzd,
      condition,
      wilayaCode,
      wilayaName,
      communeName,
      deliveryMethod,
      images,
    } = body;

    if (!title || !description || !priceDzd) {
      return NextResponse.json(
        { error: 'يرجى إكمال جميع الحقول الإلزامية للإعلان' },
        { status: 400 }
      );
    }

    // Step 10 mandatory law: Create listing in PAYMENT_REQUIRED status!
    // حسابات التجريب يمكنها إنشاء الإعلان وتجربة النظام لكن الإعلان يوسم كـ isDemoPost ولا يظهر للجمهور العام الفعلي
    const [newListing] = await db
      .insert(listings)
      .values({
        userId: user.id,
        categoryId: Number(categoryId) || 1,
        title: title.trim(),
        description: description.trim(),
        priceDzd: Math.max(100, Number(priceDzd)),
        condition: condition || 'GOOD',
        wilayaCode: wilayaCode || user.wilayaCode || '16',
        wilayaName: wilayaName || user.wilayaName || 'الجزائر العاصمة',
        communeName: communeName || user.communeName || 'باب الزوار',
        deliveryMethod: deliveryMethod || 'HAND_TO_HAND',
        status: 'PAYMENT_REQUIRED', // Strict state machine entry
        isDemoPost: Boolean(user.isDemo),
      })
      .returning();

    const imageList: string[] = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

    await db.insert(listingImages).values(
      imageList.map((url, idx) => ({
        listingId: newListing.id,
        imageUrl: url,
        displayOrder: idx,
      }))
    );

    return NextResponse.json({
      listing: newListing,
      publicationFeeDzd: 200,
      message: 'تم حفظ إعلانك. يرجى دفع رسوم النشر 200 دج لتفعيله وإظهاره للعامة.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'خطأ في إنشاء الإعلان' }, { status: 500 });
  }
}
