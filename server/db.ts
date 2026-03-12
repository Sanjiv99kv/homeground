import { eq, and, gte, lte, desc, sql, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, courts, bookings, blockedSlots, academyEnrollments, contactInquiries, golfNotifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
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

// Courts
export async function getAllCourts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courts).where(eq(courts.isActive, true));
}

export async function getCourtsBySport(sport: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courts).where(and(eq(courts.sport, sport as any), eq(courts.isActive, true)));
}

export async function getCourtById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courts).where(eq(courts.id, id)).limit(1);
  return result[0];
}

export async function updateCourt(id: number, data: Partial<typeof courts.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courts).set(data).where(eq(courts.id, id));
}

// Bookings
export async function getBookingsForDate(courtId: number, date: string) {
  const db = await getDb();
  if (!db) return [];
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
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bookings).values(data);
  return result[0].insertId;
}

export async function getUserBookings(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(id: number, status: string, paymentId?: string) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };
  if (paymentId) { updateData.paymentId = paymentId; updateData.paymentStatus = 'paid'; }
  await db.update(bookings).set(updateData).where(eq(bookings.id, id));
}

export async function cancelBooking(id: number) {
  const db = await getDb();
  if (!db) return;
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
