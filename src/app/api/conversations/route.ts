import { NextResponse } from 'next/server';
import { db } from '@/db';
import {
  conversations,
  messages,
  listings,
  users,
  offers,
} from '@/db/schema';
import { eq, or, and, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 });
  }

  const userConvs = await db
    .select({
      conv: conversations,
      listingTitle: listings.title,
      listingPrice: listings.priceDzd,
      buyerName: users.name,
    })
    .from(conversations)
    .innerJoin(listings, eq(conversations.listingId, listings.id))
    .innerJoin(users, eq(conversations.buyerId, users.id))
    .where(
      or(
        eq(conversations.buyerId, user.id),
        eq(conversations.sellerId, user.id)
      )
    )
    .orderBy(desc(conversations.lastMessageAt));

  const allMessages = await db.select().from(messages);
  const allOffers = await db.select().from(offers);
  const allUsers = await db.select().from(users);

  const enriched = userConvs.map((row) => {
    const peerId =
      row.conv.buyerId === user.id ? row.conv.sellerId : row.conv.buyerId;
    const peer = allUsers.find((u) => u.id === peerId);

    const convMessages = allMessages
      .filter((m) => m.conversationId === row.conv.id)
      .sort((a, b) => a.id - b.id);

    const activeOffer = allOffers
      .filter((o) => o.listingId === row.conv.listingId)
      .sort((a, b) => b.id - a.id)[0];

    return {
      ...row.conv,
      listing: {
        id: row.conv.listingId,
        title: row.listingTitle,
        priceDzd: row.listingPrice,
      },
      peer: peer
        ? {
            id: peer.id,
            name: peer.name,
            phone: peer.phone,
            wilayaName: peer.wilayaName,
          }
        : null,
      messages: convMessages,
      latestOffer: activeOffer || null,
    };
  });

  return NextResponse.json({ conversations: enriched });
}

export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 });
  }

  const body = await req.json();
  const { listingId, sellerId, text, offerPriceDzd, imageUrl } = body;

  const [existing] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.listingId, Number(listingId)),
        eq(conversations.buyerId, user.id),
        eq(conversations.sellerId, Number(sellerId))
      )
    )
    .limit(1);

  let conv = existing;
  if (!conv) {
    const [created] = await db
      .insert(conversations)
      .values({
        listingId: Number(listingId),
        buyerId: user.id,
        sellerId: Number(sellerId),
      })
      .returning();
    conv = created;
  }

  // If buyer sent a price negotiation offer
  if (offerPriceDzd && Number(offerPriceDzd) > 0) {
    await db.insert(offers).values({
      listingId: Number(listingId),
      buyerId: user.id,
      sellerId: Number(sellerId),
      offerPriceDzd: Number(offerPriceDzd),
      status: 'PENDING',
    });
  }

  const [newMsg] = await db
    .insert(messages)
    .values({
      conversationId: conv.id,
      senderId: user.id,
      text:
        text ||
        (offerPriceDzd
          ? `عرض شراء بسعر ${Number(offerPriceDzd).toLocaleString('en-US')} دج`
          : 'مرحباً، هل المنتج متاح؟'),
      imageUrl: imageUrl || null,
      offerPriceDzd: offerPriceDzd ? Number(offerPriceDzd) : null,
      offerStatus: offerPriceDzd ? 'PENDING' : null,
    })
    .returning();

  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conv.id));

  return NextResponse.json({ conversation: conv, message: newMsg });
}
