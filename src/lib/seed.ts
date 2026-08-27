import { db } from '@/db';
import {
  users,
  categories,
  wilayas,
  platformSettings,
  listings,
  listingImages,
  payments,
  paymentProofs,
  reviews,
  conversations,
  messages,
  notifications,
} from '@/db/schema';
import { ALGERIA_WILAYAS, CATEGORIES_SEED } from './algeria-data';
import { hashPassword } from './auth';
import crypto from 'crypto';

export async function ensureSeeded() {
  const existingSettings = await db.select().from(platformSettings).limit(1);
  if (existingSettings.length > 0) {
    return;
  }

  // 1. Seed Platform Settings (editable from Admin Panel)
  await db.insert(platformSettings).values({
    publicationFeeDzd: 200,
    beneficiaryName: 'سفيان بومدين (AchriDZ Platform SARL)',
    ccpAccount: '0024987654',
    ccpKey: '89',
    baridimobRib: '00799999002498765489',
    instructionsAr:
      'يرجى إرسال مبلغ 200 دج ثابت لحساب بريد الجزائر CCP أو تطبيق بريدي موب (BaridiMob) أدناه ثم إدخال رقم الحوالة ورفع صورة الإيصال. لا تطلب المنصة أبدًا كلمتك السرية أو الرمز السري للبطاقة الذهبية.',
    instructionsFr:
      'Veuillez transférer exactement 200 DZD vers le compte CCP ou via BaridiMob. Ne communiquez jamais votre code secret CCP ou BaridiMob.',
  });

  // 2. Seed Categories
  for (const cat of CATEGORIES_SEED) {
    await db
      .insert(categories)
      .values({
        slug: cat.slug,
        nameAr: cat.nameAr,
        nameFr: cat.nameFr,
        icon: cat.icon,
        displayOrder: cat.id,
      })
      .onConflictDoNothing();
  }

  // 3. Seed 69 Wilayas
  for (const w of ALGERIA_WILAYAS) {
    await db
      .insert(wilayas)
      .values({
        code: w.code,
        nameAr: w.nameAr,
        nameFr: w.nameFr,
      })
      .onConflictDoNothing();
  }

  // 4. Seed Users (Admin + 3 Sellers/Buyers)
  const [adminUser] = await db
    .insert(users)
    .values({
      name: 'إدارة AchriDZ - Admin CCP',
      phone: '0550000000',
      phoneVerified: true,
      passwordHash: hashPassword('admin123'),
      role: 'ADMIN',
      wilayaCode: '16',
      wilayaName: 'الجزائر العاصمة',
      communeName: 'باب الزوار',
      ratingSum: 25,
      ratingCount: 5,
    })
    .returning();

  const [seller1] = await db
    .insert(users)
    .values({
      name: 'أمين قاسي - حساب تجريبي (Démo)',
      phone: '0661234567',
      phoneVerified: true,
      isDemo: true, // حساب تجريبي لا يُنشر إعلانه الجديد في السوق الفعلي للعامة
      passwordHash: hashPassword('123456'),
      role: 'USER',
      wilayaCode: '16',
      wilayaName: 'الجزائر العاصمة',
      communeName: 'باب الزوار',
      ratingSum: 48,
      ratingCount: 10,
    })
    .returning();

  const [seller2] = await db
    .insert(users)
    .values({
      name: 'سارة بن علي - وهران',
      phone: '0772345678',
      phoneVerified: true,
      passwordHash: hashPassword('123456'),
      role: 'USER',
      wilayaCode: '31',
      wilayaName: 'وهران',
      communeName: 'بئر الجير',
      ratingSum: 24,
      ratingCount: 5,
    })
    .returning();

  const [buyer1] = await db
    .insert(users)
    .values({
      name: 'كريم منصوري - قسنطينة',
      phone: '0559876543',
      phoneVerified: true,
      passwordHash: hashPassword('123456'),
      role: 'USER',
      wilayaCode: '25',
      wilayaName: 'قسنطينة',
      communeName: 'علي منجلي',
      ratingSum: 15,
      ratingCount: 3,
    })
    .returning();

  // 5. Seed Listings:
  // Listing 1: PUBLISHED (Payment 200 DZD verified by Admin)
  const [listing1] = await db
    .insert(listings)
    .values({
      userId: seller1.id,
      categoryId: 1, // electronics
      title: 'iPhone 15 Pro Max 256GB تيتانيوم طبيعي بحالة ممتازة',
      description:
        'هاتف آيفون 15 برو ماكس أصلي، بطارية 96%، مع العلبة الأصلية والشاحن وحماية شاشة. البيع يدًا بيد في باب الزوار أو توصيل داخل العاصمة.',
      priceDzd: 245000,
      condition: 'LIKE_NEW',
      wilayaCode: '16',
      wilayaName: 'الجزائر العاصمة',
      communeName: 'باب الزوار',
      deliveryMethod: 'HAND_TO_HAND',
      status: 'PUBLISHED',
      viewsCount: 184,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
    })
    .returning();

  await db.insert(listingImages).values([
    {
      listingId: listing1.id,
      imageUrl:
        'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
      displayOrder: 0,
    },
    {
      listingId: listing1.id,
      imageUrl:
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    },
  ]);

  const [payment1] = await db
    .insert(payments)
    .values({
      userId: seller1.id,
      listingId: listing1.id,
      amount: 200,
      currency: 'DZD',
      paymentMethod: 'BARIDIMOB',
      transactionReference: 'BM-20260312-984421',
      paymentDate: '2026-03-12',
      proofImage: '/images/sample-receipt.jpg',
      proofHash: crypto
        .createHash('sha256')
        .update('BM-20260312-984421-listing-' + listing1.id)
        .digest('hex'),
      status: 'VERIFIED',
      verifiedBy: adminUser.id,
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    })
    .returning();

  await db.insert(paymentProofs).values({
    paymentId: payment1.paymentId,
    fileUrl: '/images/sample-receipt.jpg',
    fileHash: payment1.proofHash!,
  });

  // Listing 2: PUBLISHED (Camera Sony Alpha a6400)
  const [listing2] = await db
    .insert(listings)
    .values({
      userId: seller2.id,
      categoryId: 5, // photography
      title: 'كاميرا احترافية Sony Alpha a6400 مع عدسة 16-50mm وحقيبة',
      description:
        'كاميرا سوني ميرورلس بدقة 24.2 ميغابكسل وتصوير 4K، مستعملة للتصوير الشخصي قليلًا، مع بطاريتين إضافيتين وحقيبة مبطنة.',
      priceDzd: 135000,
      condition: 'GOOD',
      wilayaCode: '31',
      wilayaName: 'وهران',
      communeName: 'بئر الجير',
      deliveryMethod: 'BOTH',
      status: 'PUBLISHED',
      viewsCount: 96,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    })
    .returning();

  await db.insert(listingImages).values([
    {
      listingId: listing2.id,
      imageUrl:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      displayOrder: 0,
    },
  ]);

  const [payment2] = await db
    .insert(payments)
    .values({
      userId: seller2.id,
      listingId: listing2.id,
      amount: 200,
      currency: 'DZD',
      paymentMethod: 'CCP_TRANSFER',
      transactionReference: 'CCP-44910238-ORAN',
      paymentDate: '2026-03-10',
      proofImage: '/images/sample-receipt.jpg',
      proofHash: crypto
        .createHash('sha256')
        .update('CCP-44910238-ORAN-' + listing2.id)
        .digest('hex'),
      status: 'VERIFIED',
      verifiedBy: adminUser.id,
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 46),
    })
    .returning();

  await db.insert(paymentProofs).values({
    paymentId: payment2.paymentId,
    fileUrl: '/images/sample-receipt.jpg',
    fileHash: payment2.proofHash!,
  });

  // Listing 3: PAYMENT_PENDING — Awaiting Admin review in "Paiements" dashboard!
  const [listing3] = await db
    .insert(listings)
    .values({
      userId: buyer1.id,
      categoryId: 8, // sports & cycling
      title: 'دراجة جبلية Decathlon Rockrider ST 530 فرامل قرصية',
      description:
        'دراجة ألومنيوم 27.5 بوصة بحالة جيدة جداً مع خوذة وقفل، تم إرسال وصل دفع 200 دج وبانتظار تأكيد الإدارة لتظهر للعامة.',
      priceDzd: 48000,
      condition: 'GOOD',
      wilayaCode: '25',
      wilayaName: 'قسنطينة',
      communeName: 'علي منجلي',
      deliveryMethod: 'HAND_TO_HAND',
      status: 'PAYMENT_PENDING',
      viewsCount: 1,
    })
    .returning();

  await db.insert(listingImages).values([
    {
      listingId: listing3.id,
      imageUrl:
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
      displayOrder: 0,
    },
  ]);

  const [payment3] = await db
    .insert(payments)
    .values({
      userId: buyer1.id,
      listingId: listing3.id,
      amount: 200,
      currency: 'DZD',
      paymentMethod: 'BARIDIMOB',
      transactionReference: 'BM-20260315-773120',
      paymentDate: '2026-03-15',
      proofImage: '/images/sample-receipt.jpg',
      proofHash: crypto
        .createHash('sha256')
        .update('BM-20260315-773120-' + listing3.id)
        .digest('hex'),
      status: 'PENDING',
    })
    .returning();

  await db.insert(paymentProofs).values({
    paymentId: payment3.paymentId,
    fileUrl: '/images/sample-receipt.jpg',
    fileHash: payment3.proofHash!,
  });

  // Sample Review
  await db.insert(reviews).values({
    listingId: listing1.id,
    reviewerId: buyer1.id,
    revieweeId: seller1.id,
    rating: 5,
    comment: 'بائع صادق جداً والهاتف مطابق تماماً للوصف في الإعلان. بارك الله فيك.',
  });

  // Sample Conversation & Message
  const [conv] = await db
    .insert(conversations)
    .values({
      listingId: listing1.id,
      buyerId: buyer1.id,
      sellerId: seller1.id,
    })
    .returning();

  await db.insert(messages).values([
    {
      conversationId: conv.id,
      senderId: buyer1.id,
      text: 'السلام عليكم أخي أمين، هل السعر نهائي 245,000 دج أم يمكن التفاوض؟',
    },
    {
      conversationId: conv.id,
      senderId: seller1.id,
      text: 'وعليكم السلام ورحمة الله، أرسل لي عرضك عبر زر تقديم عرض مالي في الدردشة وسنتفق بإذن الله.',
    },
  ]);

  // Initial Notifications
  await db.insert(notifications).values([
    {
      userId: seller1.id,
      titleAr: 'تم تأكيد دفع 200 دج وتم نشر إعلانك بنجاح.',
      titleFr: 'Paiement de 200 DZD validé, votre annonce est publiée.',
      bodyAr: 'تمت مراجعة وصل التحويل لإعلان iPhone 15 Pro Max وأصبح متاحًا لجميع المشترين في الجزائر.',
      bodyFr: 'Votre justificatif de 200 DZD a été vérifié par un administrateur AchriDZ.',
      link: `/listings/${listing1.id}`,
    },
    {
      userId: buyer1.id,
      titleAr: 'إعلانك قيد المراجعة الإدارية لوصل دفع 200 دج',
      titleFr: 'Votre annonce est en attente de validation du paiement 200 DZD',
      bodyAr: 'تم استلام وصل الدفع BM-20260315-773120 وسيتم تفعيل إعلانك فور مراجعته من المشرف.',
      bodyFr: 'Reçu de 200 DZD transmis à l’administration AchriDZ.',
      link: '/my-listings',
    },
  ]);
}
