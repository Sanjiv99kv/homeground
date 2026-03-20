// api/_source.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, and, gte, lte, desc, sql, asc } from "drizzle-orm";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var courts = mysqlTable("courts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  sport: mysqlEnum("sport", ["cricket", "football", "badminton", "pickleball"]).notNull(),
  description: text("description"),
  weekdayPrice: int("weekdayPrice").notNull().default(1800),
  weekendPrice: int("weekendPrice").notNull().default(2e3),
  openTime: varchar("openTime", { length: 5 }).notNull().default("06:00"),
  closeTime: varchar("closeTime", { length: 5 }).notNull().default("23:00"),
  slotDurationMinutes: int("slotDurationMinutes").notNull().default(60),
  isActive: boolean("isActive").notNull().default(true),
  amenities: json("amenities").$type(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var bookings = mysqlTable("bookings", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var blockedSlots = mysqlTable("blocked_slots", {
  id: int("id").autoincrement().primaryKey(),
  courtId: int("courtId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  reason: varchar("reason", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var academyEnrollments = mysqlTable("academy_enrollments", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var contactInquiries = mysqlTable("contact_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var golfNotifications = mysqlTable("golf_notifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/_core/env.ts
var isProduction = process.env.NODE_ENV === "production";
if (isProduction && !process.env.JWT_SECRET) {
  console.error("[ENV] CRITICAL: JWT_SECRET is not set in production! Sessions will not be secure.");
}
var ENV = {
  appId: process.env.VITE_APP_ID || "homeground-local",
  cookieSecret: process.env.JWT_SECRET || (isProduction ? "" : "homeground-dev-secret-key-change-in-production"),
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
var FALLBACK_COURTS = [
  { id: 1, name: "Cricket Net 1 \u2014 Premium Turf", sport: "cricket", description: "Professional-grade cricket net with high-quality turf and floodlights. Ideal for batting and bowling practice sessions.", weekdayPrice: 1800, weekendPrice: 2200, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Premium Turf", "Bowling Machine", "Changing Room"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 2, name: "Cricket Net 2 \u2014 Match Turf", sport: "cricket", description: "Full-size match practice net with professional-grade surface. Perfect for match simulations and team practice.", weekdayPrice: 1800, weekendPrice: 2200, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Match Turf", "Seating Area", "Scoreboard"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 3, name: "Football Turf \u2014 5-a-side", sport: "football", description: "Multi-purpose football turf supporting 5-a-side games with FIFA-quality synthetic grass and professional goalposts.", weekdayPrice: 1800, weekendPrice: 2200, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Synthetic Turf", "Goalposts", "Changing Room"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 4, name: "Football Turf \u2014 7-a-side", sport: "football", description: "Larger multi-purpose football turf for 7-a-side matches and tournaments with premium synthetic surface.", weekdayPrice: 2200, weekendPrice: 2800, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Floodlights", "Premium Turf", "Goalposts", "Spectator Seating"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 5, name: "Badminton Court 1", sport: "badminton", description: "Indoor badminton court with professional flooring, proper lighting, and shuttle-friendly ventilation.", weekdayPrice: 400, weekendPrice: 600, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Indoor", "Professional Flooring", "Proper Lighting", "Racket Rental"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 6, name: "Badminton Court 2", sport: "badminton", description: "Indoor badminton court at Home Shuttlers Academy with coaching-grade setup and professional nets.", weekdayPrice: 400, weekendPrice: 600, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Indoor", "Academy Grade", "Professional Nets", "Shuttle Provided"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 7, name: "Pickleball Court 1", sport: "pickleball", description: "Dedicated pickleball court with professional nets and premium surface for singles and doubles play.", weekdayPrice: 800, weekendPrice: 1e3, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Professional Nets", "Premium Surface", "Paddle Rental", "Floodlights"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
  { id: 8, name: "Pickleball Court 2", sport: "pickleball", description: "Second pickleball court with tournament-grade setup, ideal for competitive play and casual games.", weekdayPrice: 800, weekendPrice: 1e3, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, isActive: true, amenities: ["Tournament Grade", "Floodlights", "Spectator Area", "Equipment Available"], imageUrl: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
];
async function getAllCourts() {
  const db = await getDb();
  if (!db) return FALLBACK_COURTS.filter((c) => c.isActive);
  return db.select().from(courts).where(eq(courts.isActive, true));
}
async function getCourtsBySport(sport) {
  const db = await getDb();
  if (!db) return FALLBACK_COURTS.filter((c) => c.sport === sport && c.isActive);
  return db.select().from(courts).where(and(eq(courts.sport, sport), eq(courts.isActive, true)));
}
async function getCourtById(id) {
  const db = await getDb();
  if (!db) return FALLBACK_COURTS.find((c) => c.id === id);
  const result = await db.select().from(courts).where(eq(courts.id, id)).limit(1);
  return result[0];
}
async function updateCourt(id, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(courts).set(data).where(eq(courts.id, id));
}
var inMemoryBookingId = 1;
var inMemoryBookings = [];
async function getBookingsForDate(courtId, date) {
  const db = await getDb();
  if (!db) return inMemoryBookings.filter((b) => b.courtId === courtId && b.date === date && b.status !== "cancelled");
  return db.select().from(bookings).where(
    and(eq(bookings.courtId, courtId), eq(bookings.date, date), sql`${bookings.status} != 'cancelled'`)
  );
}
async function getBlockedSlotsForDate(courtId, date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blockedSlots).where(
    and(eq(blockedSlots.courtId, courtId), eq(blockedSlots.date, date))
  );
}
async function createBooking(data) {
  const db = await getDb();
  if (!db) {
    const id = inMemoryBookingId++;
    const now = /* @__PURE__ */ new Date();
    inMemoryBookings.push({
      id,
      userId: data.userId,
      courtId: data.courtId,
      sport: data.sport,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      amount: data.amount,
      status: data.status || "pending",
      paymentId: data.paymentId || null,
      paymentStatus: data.paymentStatus || "pending",
      customerName: data.customerName || null,
      customerPhone: data.customerPhone || null,
      customerEmail: data.customerEmail || null,
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now
    });
    return id;
  }
  const result = await db.insert(bookings).values(data);
  return result[0].insertId;
}
async function getUserBookings(userId) {
  const db = await getDb();
  if (!db) return inMemoryBookings.filter((b) => b.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}
async function updateBookingStatus(id, status, paymentId) {
  const db = await getDb();
  if (!db) {
    const booking = inMemoryBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = /* @__PURE__ */ new Date();
      if (paymentId) {
        booking.paymentId = paymentId;
        booking.paymentStatus = "paid";
      }
    }
    return;
  }
  const updateData = { status };
  if (paymentId) {
    updateData.paymentId = paymentId;
    updateData.paymentStatus = "paid";
  }
  await db.update(bookings).set(updateData).where(eq(bookings.id, id));
}
async function cancelBooking(id) {
  const db = await getDb();
  if (!db) {
    const booking = inMemoryBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = "cancelled";
      booking.updatedAt = /* @__PURE__ */ new Date();
    }
    return;
  }
  await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id));
}
async function getAllBookings(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit);
}
async function getRevenueStats() {
  const db = await getDb();
  if (!db) return { total: 0, today: 0, thisMonth: 0 };
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const monthStart = today.slice(0, 7) + "-01";
  const allConfirmed = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(bookings).where(sql`${bookings.paymentStatus} = 'paid'`);
  const todayRevenue = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(bookings).where(and(eq(bookings.date, today), sql`${bookings.paymentStatus} = 'paid'`));
  const monthRevenue = await db.select({ total: sql`COALESCE(SUM(amount), 0)` }).from(bookings).where(and(gte(bookings.date, monthStart), sql`${bookings.paymentStatus} = 'paid'`));
  return {
    total: Number(allConfirmed[0]?.total ?? 0),
    today: Number(todayRevenue[0]?.total ?? 0),
    thisMonth: Number(monthRevenue[0]?.total ?? 0)
  };
}
async function blockSlot(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blockedSlots).values(data);
}
async function createEnrollment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(academyEnrollments).values(data);
}
async function getAllEnrollments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(academyEnrollments).orderBy(desc(academyEnrollments.createdAt));
}
async function createContactInquiry(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactInquiries).values(data);
}
async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}
async function addGolfNotification(email) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(golfNotifications).values({ email }).onDuplicateKeyUpdate({ set: { email } });
}
async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalBookings: 0, totalUsers: 0, totalEnrollments: 0, totalInquiries: 0 };
  const [bk] = await db.select({ count: sql`COUNT(*)` }).from(bookings);
  const [us] = await db.select({ count: sql`COUNT(*)` }).from(users);
  const [en] = await db.select({ count: sql`COUNT(*)` }).from(academyEnrollments);
  const [iq] = await db.select({ count: sql`COUNT(*)` }).from(contactInquiries);
  return {
    totalBookings: Number(bk?.count ?? 0),
    totalUsers: Number(us?.count ?? 0),
    totalEnrollments: Number(en?.count ?? 0),
    totalInquiries: Number(iq?.count ?? 0)
  };
}
async function getAllCourtsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courts);
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    // "lax" works for same-origin requests on both localhost and production
    // "none" would require secure=true and is only needed for cross-origin cookies
    sameSite: "lax",
    secure
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      if (sessionUserId.startsWith("dev_")) {
        return {
          id: 1,
          openId: sessionUserId,
          name: session.name || "Dev User",
          email: null,
          phone: null,
          loginMethod: "dev",
          role: "user",
          createdAt: signedInAt,
          updatedAt: signedInAt,
          lastSignedIn: signedInAt
        };
      }
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app2.post("/api/dev-login", async (req, res) => {
    if (ENV.isProduction && ENV.oAuthServerUrl) {
      res.status(403).json({ error: "Dev login is disabled in production" });
      return;
    }
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }
      const openId = `dev_${Buffer.from(email).toString("base64url")}`;
      await upsertUser({
        openId,
        name,
        email,
        loginMethod: "dev",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: { name, email, openId } });
    } catch (error) {
      console.error("[DevLogin] Failed", error);
      res.status(500).json({ error: "Dev login failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  courts: router({
    list: publicProcedure.query(async () => {
      return getAllCourts();
    }),
    bySport: publicProcedure.input(z2.object({ sport: z2.string() })).query(async ({ input }) => {
      return getCourtsBySport(input.sport);
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return getCourtById(input.id);
    })
  }),
  booking: router({
    availability: publicProcedure.input(z2.object({
      courtId: z2.number(),
      date: z2.string()
    })).query(async ({ input }) => {
      const court = await getCourtById(input.courtId);
      if (!court) throw new Error("Court not found");
      const existingBookings = await getBookingsForDate(input.courtId, input.date);
      const blocked = await getBlockedSlotsForDate(input.courtId, input.date);
      const bookedSlots = existingBookings.map((b) => ({ start: b.startTime, end: b.endTime }));
      const blockedSlotsList = blocked.map((b) => ({ start: b.startTime, end: b.endTime }));
      const slots = [];
      const [openH, openM] = court.openTime.split(":").map(Number);
      const [closeH, closeM] = court.closeTime.split(":").map(Number);
      const duration = court.slotDurationMinutes;
      let currentMin = openH * 60 + openM;
      const endMin = closeH * 60 + closeM;
      const dateObj = /* @__PURE__ */ new Date(input.date + "T00:00:00");
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const price = isWeekend ? court.weekendPrice : court.weekdayPrice;
      while (currentMin + duration <= endMin) {
        const startH = Math.floor(currentMin / 60);
        const startM = currentMin % 60;
        const endH2 = Math.floor((currentMin + duration) / 60);
        const endM2 = (currentMin + duration) % 60;
        const startTime = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`;
        const endTime = `${String(endH2).padStart(2, "0")}:${String(endM2).padStart(2, "0")}`;
        const isBooked = bookedSlots.some((s) => s.start === startTime);
        const isBlocked = blockedSlotsList.some((s) => s.start === startTime);
        slots.push({ startTime, endTime, available: !isBooked && !isBlocked, price });
        currentMin += duration;
      }
      return { court, slots, date: input.date };
    }),
    create: protectedProcedure.input(z2.object({
      courtId: z2.number(),
      sport: z2.enum(["cricket", "football", "badminton", "pickleball"]),
      date: z2.string(),
      startTime: z2.string(),
      endTime: z2.string(),
      amount: z2.number(),
      customerName: z2.string().optional(),
      customerPhone: z2.string().optional(),
      customerEmail: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      const existing = await getBookingsForDate(input.courtId, input.date);
      const conflict = existing.some((b) => b.startTime === input.startTime);
      if (conflict) throw new Error("This slot is already booked");
      const bookingId = await createBooking({
        userId: ctx.user.id,
        ...input,
        status: "pending",
        paymentStatus: "pending"
      });
      return { bookingId };
    }),
    confirmPayment: protectedProcedure.input(z2.object({
      bookingId: z2.number(),
      paymentId: z2.string()
    })).mutation(async ({ input }) => {
      await updateBookingStatus(input.bookingId, "confirmed", input.paymentId);
      return { success: true };
    }),
    myBookings: protectedProcedure.query(async ({ ctx }) => {
      return getUserBookings(ctx.user.id);
    }),
    cancel: protectedProcedure.input(z2.object({ bookingId: z2.number() })).mutation(async ({ input }) => {
      await cancelBooking(input.bookingId);
      return { success: true };
    })
  }),
  academy: router({
    enroll: publicProcedure.input(z2.object({
      academy: z2.enum(["cricket", "badminton"]),
      studentName: z2.string(),
      studentAge: z2.number().optional(),
      phone: z2.string(),
      email: z2.string().optional(),
      level: z2.enum(["beginner", "intermediate", "advanced"]).optional(),
      message: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      await createEnrollment({
        userId: ctx.user?.id ?? null,
        ...input,
        level: input.level ?? "beginner"
      });
      return { success: true };
    })
  }),
  contact: router({
    submit: publicProcedure.input(z2.object({
      name: z2.string(),
      email: z2.string().optional(),
      phone: z2.string().optional(),
      subject: z2.string().optional(),
      message: z2.string()
    })).mutation(async ({ input }) => {
      await createContactInquiry(input);
      return { success: true };
    }),
    golfNotify: publicProcedure.input(z2.object({ email: z2.string() })).mutation(async ({ input }) => {
      await addGolfNotification(input.email);
      return { success: true };
    })
  }),
  admin: router({
    stats: adminProcedure.query(async () => {
      const stats = await getAdminStats();
      const revenue = await getRevenueStats();
      return { ...stats, ...revenue };
    }),
    bookings: adminProcedure.input(z2.object({ limit: z2.number().optional() }).optional()).query(async ({ input }) => {
      return getAllBookings(input?.limit ?? 100);
    }),
    courts: adminProcedure.query(async () => {
      return getAllCourtsAdmin();
    }),
    updateCourt: adminProcedure.input(z2.object({
      id: z2.number(),
      weekdayPrice: z2.number().optional(),
      weekendPrice: z2.number().optional(),
      isActive: z2.boolean().optional(),
      openTime: z2.string().optional(),
      closeTime: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCourt(id, data);
      return { success: true };
    }),
    blockSlot: adminProcedure.input(z2.object({
      courtId: z2.number(),
      date: z2.string(),
      startTime: z2.string(),
      endTime: z2.string(),
      reason: z2.string().optional()
    })).mutation(async ({ input }) => {
      await blockSlot(input);
      return { success: true };
    }),
    enrollments: adminProcedure.query(async () => {
      return getAllEnrollments();
    }),
    inquiries: adminProcedure.query(async () => {
      return getAllInquiries();
    }),
    updateBookingStatus: adminProcedure.input(z2.object({
      bookingId: z2.number(),
      status: z2.enum(["pending", "confirmed", "cancelled", "completed"])
    })).mutation(async ({ input }) => {
      await updateBookingStatus(input.bookingId, input.status);
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/_source.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var source_default = app;
export {
  source_default as default
};
