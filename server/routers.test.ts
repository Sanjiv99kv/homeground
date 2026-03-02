import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module so tests don't need a real database
vi.mock("./db", () => ({
  getAllCourts: vi.fn().mockResolvedValue([
    { id: 1, name: "Cricket Turf A", sport: "cricket", weekdayPrice: 1800, weekendPrice: 2200, isActive: true, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, description: "Main cricket turf", amenities: ["Floodlights", "Nets"], capacity: 22 },
    { id: 2, name: "Football Turf", sport: "football", weekdayPrice: 1800, weekendPrice: 2200, isActive: true, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, description: "Football turf", amenities: ["Floodlights"], capacity: 14 },
  ]),
  getCourtsBySport: vi.fn().mockImplementation(async (sport: string) => {
    const allCourts = [
      { id: 1, name: "Cricket Turf A", sport: "cricket", weekdayPrice: 1800, weekendPrice: 2200, isActive: true, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, description: "Main cricket turf", amenities: ["Floodlights", "Nets"], capacity: 22 },
      { id: 2, name: "Football Turf", sport: "football", weekdayPrice: 1800, weekendPrice: 2200, isActive: true, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, description: "Football turf", amenities: ["Floodlights"], capacity: 14 },
      { id: 3, name: "Badminton Court 1", sport: "badminton", weekdayPrice: 400, weekendPrice: 500, isActive: true, openTime: "06:00", closeTime: "22:00", slotDurationMinutes: 60, description: "Indoor court", amenities: ["Indoor"], capacity: 4 },
    ];
    return allCourts.filter(c => c.sport === sport);
  }),
  getCourtById: vi.fn().mockImplementation(async (id: number) => {
    const courts: Record<number, any> = {
      1: { id: 1, name: "Cricket Turf A", sport: "cricket", weekdayPrice: 1800, weekendPrice: 2200, isActive: true, openTime: "06:00", closeTime: "23:00", slotDurationMinutes: 60, description: "Main cricket turf", amenities: ["Floodlights", "Nets"], capacity: 22 },
    };
    return courts[id] ?? undefined;
  }),
  getBookingsForDate: vi.fn().mockResolvedValue([]),
  getBlockedSlotsForDate: vi.fn().mockResolvedValue([]),
  createBooking: vi.fn().mockResolvedValue(42),
  getUserBookings: vi.fn().mockResolvedValue([
    { id: 1, courtId: 1, sport: "cricket", date: "2026-03-05", startTime: "10:00", endTime: "11:00", amount: 1800, status: "confirmed", paymentStatus: "paid" },
  ]),
  updateBookingStatus: vi.fn().mockResolvedValue(undefined),
  cancelBooking: vi.fn().mockResolvedValue(undefined),
  createEnrollment: vi.fn().mockResolvedValue(undefined),
  createContactInquiry: vi.fn().mockResolvedValue(undefined),
  addGolfNotification: vi.fn().mockResolvedValue(undefined),
  getAdminStats: vi.fn().mockResolvedValue({ totalBookings: 10, totalUsers: 5, totalEnrollments: 3, totalInquiries: 2 }),
  getRevenueStats: vi.fn().mockResolvedValue({ total: 50000, today: 3600, thisMonth: 25000 }),
  getAllBookings: vi.fn().mockResolvedValue([]),
  getAllCourtsAdmin: vi.fn().mockResolvedValue([]),
  getAllEnrollments: vi.fn().mockResolvedValue([]),
  getAllInquiries: vi.fn().mockResolvedValue([]),
  updateCourt: vi.fn().mockResolvedValue(undefined),
  blockSlot: vi.fn().mockResolvedValue(undefined),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "player@homeground.com",
    name: "Test Player",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createUserContext({ id: 99, openId: "admin-001", name: "Admin User", role: "admin" });
}

// ─── Courts ──────────────────────────────────────────────────────────

describe("courts", () => {
  it("lists all active courts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.courts.list();
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("sport");
  });

  it("filters courts by sport", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const cricket = await caller.courts.bySport({ sport: "cricket" });
    expect(cricket).toHaveLength(1);
    expect(cricket[0].sport).toBe("cricket");

    const badminton = await caller.courts.bySport({ sport: "badminton" });
    expect(badminton).toHaveLength(1);
    expect(badminton[0].sport).toBe("badminton");
  });

  it("returns a court by ID", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const court = await caller.courts.getById({ id: 1 });
    expect(court).toBeDefined();
    expect(court?.name).toBe("Cricket Turf A");
  });
});

// ─── Booking Availability ────────────────────────────────────────────

describe("booking.availability", () => {
  it("returns time slots for a valid court and date (weekday)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    // 2026-03-04 is a Wednesday (weekday)
    const result = await caller.booking.availability({ courtId: 1, date: "2026-03-04" });
    expect(result.court).toBeDefined();
    expect(result.date).toBe("2026-03-04");
    expect(result.slots.length).toBeGreaterThan(0);
    // All slots should be available since mocked bookings are empty
    expect(result.slots.every(s => s.available)).toBe(true);
    // Weekday price
    expect(result.slots[0].price).toBe(1800);
  });

  it("returns weekend pricing on Saturday", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    // 2026-03-07 is a Saturday
    const result = await caller.booking.availability({ courtId: 1, date: "2026-03-07" });
    expect(result.slots[0].price).toBe(2200);
  });

  it("throws for non-existent court", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.booking.availability({ courtId: 999, date: "2026-03-04" })).rejects.toThrow("Court not found");
  });

  it("generates correct slot time format", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.booking.availability({ courtId: 1, date: "2026-03-04" });
    // First slot should be 06:00 - 07:00
    expect(result.slots[0].startTime).toBe("06:00");
    expect(result.slots[0].endTime).toBe("07:00");
    // Last slot should end at or before 23:00
    const lastSlot = result.slots[result.slots.length - 1];
    expect(lastSlot.endTime).toBe("23:00");
  });
});

// ─── Booking Create ──────────────────────────────────────────────────

describe("booking.create", () => {
  it("creates a booking for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.booking.create({
      courtId: 1,
      sport: "cricket",
      date: "2026-03-04",
      startTime: "10:00",
      endTime: "11:00",
      amount: 1800,
      customerName: "Test Player",
      customerPhone: "9876543210",
    });
    expect(result).toHaveProperty("bookingId");
    expect(result.bookingId).toBe(42);
  });

  it("rejects booking for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.booking.create({
        courtId: 1,
        sport: "cricket",
        date: "2026-03-04",
        startTime: "10:00",
        endTime: "11:00",
        amount: 1800,
      })
    ).rejects.toThrow();
  });
});

// ─── Booking User Operations ─────────────────────────────────────────

describe("booking user operations", () => {
  it("returns user bookings for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.booking.myBookings();
    expect(result).toHaveLength(1);
    expect(result[0].sport).toBe("cricket");
  });

  it("confirms payment", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.booking.confirmPayment({ bookingId: 1, paymentId: "pay_test123" });
    expect(result.success).toBe(true);
  });

  it("cancels a booking", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.booking.cancel({ bookingId: 1 });
    expect(result.success).toBe(true);
  });
});

// ─── Academy Enrollment ──────────────────────────────────────────────

describe("academy.enroll", () => {
  it("accepts enrollment for cricket academy", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.academy.enroll({
      academy: "cricket",
      studentName: "Arjun Sharma",
      phone: "9876543210",
      level: "beginner",
    });
    expect(result.success).toBe(true);
  });

  it("accepts enrollment for badminton academy", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.academy.enroll({
      academy: "badminton",
      studentName: "Priya Patel",
      studentAge: 14,
      phone: "9876543211",
      email: "priya@example.com",
      level: "intermediate",
      message: "Interested in tournament prep",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid academy type", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.academy.enroll({
        academy: "tennis" as any,
        studentName: "Test",
        phone: "1234567890",
      })
    ).rejects.toThrow();
  });
});

// ─── Contact ─────────────────────────────────────────────────────────

describe("contact", () => {
  it("submits a contact inquiry", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.submit({
      name: "Visitor",
      email: "visitor@example.com",
      message: "What are your rates for corporate events?",
    });
    expect(result.success).toBe(true);
  });

  it("submits golf notification", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.contact.golfNotify({ email: "golfer@example.com" });
    expect(result.success).toBe(true);
  });
});

// ─── Admin Access Control ────────────────────────────────────────────

describe("admin access control", () => {
  it("allows admin to view stats", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const stats = await caller.admin.stats();
    expect(stats).toHaveProperty("totalBookings");
    expect(stats).toHaveProperty("thisMonth");
    expect(stats.totalBookings).toBe(10);
    expect(stats.thisMonth).toBe(25000);
  });

  it("blocks non-admin from viewing stats", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("blocks unauthenticated users from admin", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("allows admin to view bookings", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const bookings = await caller.admin.bookings({});
    expect(Array.isArray(bookings)).toBe(true);
  });

  it("allows admin to update booking status", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.updateBookingStatus({ bookingId: 1, status: "confirmed" });
    expect(result.success).toBe(true);
  });

  it("allows admin to update court pricing", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.updateCourt({ id: 1, weekdayPrice: 2000, weekendPrice: 2500 });
    expect(result.success).toBe(true);
  });

  it("allows admin to block a slot", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.blockSlot({
      courtId: 1,
      date: "2026-03-10",
      startTime: "10:00",
      endTime: "11:00",
      reason: "Maintenance",
    });
    expect(result.success).toBe(true);
  });
});

// ─── Auth ────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated user", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Player");
    expect(result?.role).toBe("user");
  });
});
