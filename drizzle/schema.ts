import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const courts = mysqlTable("courts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  sport: mysqlEnum("sport", ["cricket", "football", "badminton", "pickleball"]).notNull(),
  description: text("description"),
  weekdayPrice: int("weekdayPrice").notNull().default(1800),
  weekendPrice: int("weekendPrice").notNull().default(2000),
  openTime: varchar("openTime", { length: 5 }).notNull().default("06:00"),
  closeTime: varchar("closeTime", { length: 5 }).notNull().default("23:00"),
  slotDurationMinutes: int("slotDurationMinutes").notNull().default(60),
  isActive: boolean("isActive").notNull().default(true),
  amenities: json("amenities").$type<string[]>(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Court = typeof courts.$inferSelect;
export type InsertCourt = typeof courts.$inferInsert;

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courtId: int("courtId").notNull(),
  sport: mysqlEnum("sport", ["cricket", "football", "badminton", "pickleball"]).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  paymentId: varchar("paymentId", { length: 200 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded", "failed"]).default("pending").notNull(),
  customerName: varchar("customerName", { length: 200 }),
  customerPhone: varchar("customerPhone", { length: 20 }),
  customerEmail: varchar("customerEmail", { length: 320 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

export const blockedSlots = mysqlTable("blocked_slots", {
  id: int("id").autoincrement().primaryKey(),
  courtId: int("courtId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  reason: varchar("reason", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedSlot = typeof blockedSlots.$inferSelect;

export const academyEnrollments = mysqlTable("academy_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  academy: mysqlEnum("academy", ["cricket", "badminton"]).notNull(),
  studentName: varchar("studentName", { length: 200 }).notNull(),
  studentAge: int("studentAge"),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner").notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "enrolled", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AcademyEnrollment = typeof academyEnrollments.$inferSelect;

export const contactInquiries = mysqlTable("contact_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactInquiry = typeof contactInquiries.$inferSelect;

export const golfNotifications = mysqlTable("golf_notifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
