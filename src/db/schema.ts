import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  phoneVerified: boolean('phone_verified').default(false).notNull(),
  isDemo: boolean('is_demo').default(false).notNull(), // حساب تجريبي: يمكنه تجريب جميع المراحل لكن إعلاناته الجديدة لا تُنشر فعليا للعامة
  otpCode: text('otp_code'),
  otpExpiresAt: timestamp('otp_expires_at'),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url').default(''),
  wilayaCode: text('wilaya_code').default('16'),
  wilayaName: text('wilaya_name').default('الجزائر - Alger'),
  communeName: text('commune_name').default('باب الزوار'),
  ratingSum: integer('rating_sum').default(0).notNull(),
  ratingCount: integer('rating_count').default(0).notNull(),
  role: text('role').default('USER').notNull(), // 'USER' | 'ADMIN'
  isBanned: boolean('is_banned').default(false).notNull(),
  banReason: text('ban_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nameAr: text('name_ar').notNull(),
  nameFr: text('name_fr').notNull(),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const wilayas = pgTable('wilayas', {
  code: text('code').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameFr: text('name_fr').notNull(),
});

export const communes = pgTable('communes', {
  id: serial('id').primaryKey(),
  wilayaCode: text('wilaya_code').notNull(),
  nameAr: text('name_ar').notNull(),
  nameFr: text('name_fr').notNull(),
});

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priceDzd: integer('price_dzd').notNull(),
  condition: text('condition').notNull(), // NEW, LIKE_NEW, GOOD, USED, NEEDS_REPAIR
  wilayaCode: text('wilaya_code').notNull(),
  wilayaName: text('wilaya_name').notNull(),
  communeName: text('commune_name').notNull(),
  deliveryMethod: text('delivery_method').notNull(), // HAND_TO_HAND, DELIVERY, BOTH
  status: text('status').default('PAYMENT_REQUIRED').notNull(),
  isDemoPost: boolean('is_demo_post').default(false).notNull(), // إعلان أُنشئ بحساب تجريبي للمعاينة ولا يظهر في السوق الفعلي للعامة
  // DRAFT -> PAYMENT_REQUIRED -> PAYMENT_PENDING -> PAYMENT_VERIFIED -> PUBLISHED -> RESERVED -> SOLD -> EXPIRED -> REJECTED
  viewsCount: integer('views_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
});

export const listingImages = pgTable('listing_images', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id')
    .notNull()
    .references(() => listings.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
});

export const platformSettings = pgTable('platform_settings', {
  id: serial('id').primaryKey(),
  publicationFeeDzd: integer('publication_fee_dzd').default(200).notNull(),
  beneficiaryName: text('beneficiary_name').notNull(),
  ccpAccount: text('ccp_account').notNull(),
  ccpKey: text('ccp_key').notNull(),
  baridimobRib: text('baridimob_rib').notNull(),
  instructionsAr: text('instructions_ar').notNull(),
  instructionsFr: text('instructions_fr').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: integer('updated_by'),
});

export const payments = pgTable('payments', {
  paymentId: serial('payment_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  listingId: integer('listing_id')
    .notNull()
    .references(() => listings.id, { onDelete: 'cascade' }),
  amount: integer('amount').default(200).notNull(), // Fixed 200 DZD enforced
  currency: text('currency').default('DZD').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'CCP_TRANSFER' | 'BARIDIMOB' | 'CIB_EDAHABIA'
  transactionReference: text('transaction_reference').notNull(),
  paymentDate: text('payment_date').notNull(),
  proofImage: text('proof_image').notNull(),
  proofHash: text('proof_hash'), // Prevents using same proof receipt across multiple listings
  status: text('status').default('PENDING').notNull(), // PENDING | VERIFIED | REJECTED
  rejectionReason: text('rejection_reason'),
  verifiedBy: integer('verified_by'),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const paymentProofs = pgTable('payment_proofs', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id')
    .notNull()
    .references(() => payments.paymentId, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  fileHash: text('file_hash').notNull().unique(), // Hard anti-fraud constraint against receipt reuse
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const favorites = pgTable(
  'favorites',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    listingId: integer('listing_id')
      .notNull()
      .references(() => listings.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userListingIdx: uniqueIndex('user_listing_fav_idx').on(table.userId, table.listingId),
  })
);

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id')
    .notNull()
    .references(() => listings.id, { onDelete: 'cascade' }),
  buyerId: integer('buyer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sellerId: integer('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  offerPriceDzd: integer('offer_price_dzd').notNull(),
  status: text('status').default('PENDING').notNull(), // PENDING, ACCEPTED, REJECTED, COUNTERED
  counterPriceDzd: integer('counter_price_dzd'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id')
    .notNull()
    .references(() => listings.id, { onDelete: 'cascade' }),
  buyerId: integer('buyer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sellerId: integer('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  isBlockedByBuyer: boolean('is_blocked_by_buyer').default(false).notNull(),
  isBlockedBySeller: boolean('is_blocked_by_seller').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: integer('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  text: text('text').default('').notNull(),
  imageUrl: text('image_url'),
  offerPriceDzd: integer('offer_price_dzd'),
  offerStatus: text('offer_status'), // PENDING | ACCEPTED | REJECTED
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id')
    .notNull()
    .references(() => listings.id, { onDelete: 'cascade' }),
  reviewerId: integer('reviewer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  revieweeId: integer('reviewee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1 - 5 stars
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  listingId: integer('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  reportedUserId: integer('reported_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  reason: text('reason').notNull(),
  details: text('details').default(''),
  status: text('status').default('PENDING').notNull(), // PENDING, RESOLVED, DISMISSED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  titleAr: text('title_ar').notNull(),
  titleFr: text('title_fr').notNull(),
  bodyAr: text('body_ar').notNull(),
  bodyFr: text('body_fr').notNull(),
  link: text('link').default(''),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const adminLogs = pgTable('admin_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // PAYMENT_VERIFIED, PAYMENT_REJECTED, SETTINGS_UPDATED, USER_BANNED
  targetType: text('target_type').notNull(), // PAYMENT, LISTING, USER, SETTINGS
  targetId: integer('target_id').notNull(),
  details: text('details').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
