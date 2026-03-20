import { eq, and, gte, lte, desc, sql, asc } from "drizzle-orm";
import { InsertUser, users, courts, bookings, blockedSlots, academyEnrollments, contactInquiries, golfNotifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const { drizzle } = await import("drizzle-orm/mysql2");
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Fallback court data when database is not available
const FALLBACK_COURTS = [
  { id: 1, name: "Cricket Net 1 — Premium Turf", sport: "cricket" as const, description: "Professional-grade cricket net with high-quality turf and floodlights. Ideal for batting and bowling practice sessions.", weekdayPrice: 1800, weekendPrice: 2200, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Premium Turf", "Bowling Machine", "Changing Room"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Cricket Net 2 — Match Turf", sport: "cricket" as const, description: "Full-size match practice net with professional-grade surface. Perfect for match simulations and team practice.", weekdayPrice: 1800, weekendPrice: 2200, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Match Turf", "Seating Area", "Scoreboard"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Football Turf — 5-a-side", sport: "football" as const, description: "Multi-purpose football turf supporting 5-a-side games with FIFA-quality synthetic grass and professional goalposts.", weekdayPrice: 1800, weekendPrice: 2200, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Synthetic Turf", "Goalposts", "Changing Room"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Football Turf — 7-a-side", sport: "football" as const, description: "Larger multi-purpose football turf for 7-a-side matches and tournaments with premium synthetic surface.", weekdayPrice: 2200, weekendPrice: 2800, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Premium Turf", "Goalposts", "Spectator Seating"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, name: "Badminton Court 1", sport: "badminton" as const, description: "Indoor badminton court with professional flooring, proper lighting, and shuttle-friendly ventilation.", weekdayPrice: 400, weekendPrice: 600, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Indoor", "Professional Flooring", "Proper Lighting", "Racket Rental"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, name: "Badminton Court 2", sport: "badminton" as const, description: "Indoor badminton court at Home Shuttlers Academy with coaching-grade setup and professional nets.", weekdayPrice: 400, weekendPrice: 600, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Indoor", "Academy Grade", "Professional Nets", "Shuttle Provided"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, name: "Pickleball Court 1", sport: "pickleball" as const, description: "Dedicated pickleball court with professional nets and premium surface for singles and doubles play.", weekdayPrice: 800, weekendPrice: 1000, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Professional Nets", "Premium Surface", "Paddle Rental", "Floodlights"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, name: "Pickleball Court 2", sport: "pickleball" as const, description: "Second pickleball court with tournament-grade setup, ideal for competitive play and casual games.", weekdayPrice: 800, weekendPrice: 1000, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Tournament Grade", "Floodlights", "Spectator Area", "Equipment Available"], imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
];

// Courts
export async function getAllCourts() {
  const db = await getDb();
  if (!db) return FALLBACK_COURTS.filter(c => c.isActive);
  return db.select().from(courts).where(eq(courts.isActive, true));
}

export async function getCourtsBySport(sport: string) {
  const db = await getDb();
  if (!db) return FALLBACK_COURTS.filter(c => c.sport === sport && c.isActive);
  return db.select().from(courts).where(and(eq(courts.sport, sport as any), eq(courts.isActive, true)));
}

export async function getCourtById(id: number) {
  const db = await getDb();
  if (!db) return FALLBACK_COURTS.find(c => c.id === id);
  const result = await db.select().from(courts).where(eq(courts.id, id)).limit(1);
  return result[0];
}

export async function updateCourt(id: number, data: Partial<typeof courts.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courts).set(data).where(eq(courts.id, id));
}

// In-memory booking storage when database is not available
let inMemoryBookingId = 1;
const inMemoryBookings: Array<{
  id: number; userId: number; courtId: number; sport: string;
  date: string; startTime: string; endTime: string; amount: number;
  status: string; paymentId: string | null; paymentStatus: string;
  customerName: string | null; customerPhone: string | null;
  customerEmail: string | null; notes: string | null;
  createdAt: Date; updatedAt: Date;
}> = [];

// Bookings
export async function getBookingsForDate(courtId: number, date: string) {
  const db = await getDb();
  if (!db) return inMemoryBookings.filter(b => b.courtId === courtId && b.date === date && b.status !== 'cancelled');
  return db.select().from(bookings).where(
    and(eq(bookings.courtId, courtId), eq(bookings.date, date), sql`${bookings.status} != 'cancelled'`)
  );
}

export async function getBlockedSlotsForDate(courtId: number, date: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blockedSlots).where(
    and(eq(blockedSlots.courtId, courtId), eq(blockedSlots.date, date))
  );
}

export async function createBooking(data: typeof bookings.$inferInsert) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryBookingId++;
    const now = new Date();
    inMemoryBookings.push({
      id,
      userId: data.userId,
      courtId: data.courtId,
      sport: data.sport,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      amount: data.amount,
      status: (data.status as string) || 'pending',
      paymentId: (data.paymentId as string) || null,
      paymentStatus: (data.paymentStatus as string) || 'pending',
      customerName: data.customerName || null,
      customerPhone: data.customerPhone || null,
      customerEmail: data.customerEmail || null,
      notes: (data.notes as string) || null,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  }
  const result = await db.insert(bookings).values(data);
  return result[0].insertId;
}

export async function getUserBookings(userId: number) {
  const db = await getDb();
  if (!db) return inMemoryBookings.filter(b => b.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(id: number, status: string, paymentId?: string) {
  const db = await getDb();
  if (!db) {
    const booking = inMemoryBookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      if (paymentId) { booking.paymentId = paymentId; booking.paymentStatus = 'paid'; }
    }
    return;
  }
  const updateData: any = { status };
  if (paymentId) { updateData.paymentId = paymentId; updateData.paymentStatus = 'paid'; }
  await db.update(bookings).set(updateData).where(eq(bookings.id, id));
}

export async function cancelBooking(id: number) {
  const db = await getDb();
  if (!db) {
    const booking = inMemoryBookings.find(b => b.id === id);
    if (booking) { booking.status = 'cancelled'; booking.updatedAt = new Date(); }
    return;
  }
  await db.update(bookings).set({ status: 'cancelled' }).where(eq(bookings.id, id));
}

// Admin
export async function getAllBookings(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit);
}

export async function getBookingsByDateRange(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(
    and(gte(bookings.date, startDate), lte(bookings.date, endDate))
  ).orderBy(asc(bookings.date));
}

export async function getRevenueStats() {
  const db = await getDb();
  if (!db) return { total: 0, today: 0, thisMonth: 0 };
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.slice(0, 7) + '-01';
  const allConfirmed = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` }).from(bookings).where(sql`${bookings.paymentStatus} = 'paid'`);
  const todayRevenue = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` }).from(bookings).where(and(eq(bookings.date, today), sql`${bookings.paymentStatus} = 'paid'`));
  const monthRevenue = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` }).from(bookings).where(and(gte(bookings.date, monthStart), sql`${bookings.paymentStatus} = 'paid'`));
  return {
    total: Number(allConfirmed[0]?.total ?? 0),
    today: Number(todayRevenue[0]?.total ?? 0),
    thisMonth: Number(monthRevenue[0]?.total ?? 0),
  };
}

export async function blockSlot(data: typeof blockedSlots.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blockedSlots).values(data);
}

export async function removeBlockedSlot(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(blockedSlots).where(eq(blockedSlots.id, id));
}

// Academy
export async function createEnrollment(data: typeof academyEnrollments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(academyEnrollments).values(data);
}

export async function getAllEnrollments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(academyEnrollments).orderBy(desc(academyEnrollments.createdAt));
}

// Contact
export async function createContactInquiry(data: typeof contactInquiries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactInquiries).values(data);
}

export async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

// Golf notifications
export async function addGolfNotification(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(golfNotifications).values({ email }).onDuplicateKeyUpdate({ set: { email } });
}

// Admin stats
export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalBookings: 0, totalUsers: 0, totalEnrollments: 0, totalInquiries: 0 };
  const [bk] = await db.select({ count: sql<number>`COUNT(*)` }).from(bookings);
  const [us] = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
  const [en] = await db.select({ count: sql<number>`COUNT(*)` }).from(academyEnrollments);
  const [iq] = await db.select({ count: sql<number>`COUNT(*)` }).from(contactInquiries);
  return {
    totalBookings: Number(bk?.count ?? 0),
    totalUsers: Number(us?.count ?? 0),
    totalEnrollments: Number(en?.count ?? 0),
    totalInquiries: Number(iq?.count ?? 0),
  };
}

export async function getAllCourtsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courts);
}
