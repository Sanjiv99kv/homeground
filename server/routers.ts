import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  courts: router({
    list: publicProcedure.query(async () => {
      return db.getAllCourts();
    }),
    bySport: publicProcedure.input(z.object({ sport: z.string() })).query(async ({ input }) => {
      return db.getCourtsBySport(input.sport);
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getCourtById(input.id);
    }),
  }),

  booking: router({
    availability: publicProcedure.input(z.object({
      courtId: z.number(),
      date: z.string(),
    })).query(async ({ input }) => {
      const court = await db.getCourtById(input.courtId);
      if (!court) throw new Error("Court not found");
      const existingBookings = await db.getBookingsForDate(input.courtId, input.date);
      const blocked = await db.getBlockedSlotsForDate(input.courtId, input.date);
      const bookedSlots = existingBookings.map(b => ({ start: b.startTime, end: b.endTime }));
      const blockedSlotsList = blocked.map(b => ({ start: b.startTime, end: b.endTime }));
      // Generate all possible slots
      const slots: { startTime: string; endTime: string; available: boolean; price: number }[] = [];
      const [openH, openM] = court.openTime.split(':').map(Number);
      const [closeH, closeM] = court.closeTime.split(':').map(Number);
      const duration = court.slotDurationMinutes;
      let currentMin = openH * 60 + openM;
      const endMin = closeH * 60 + closeM;
      // Determine weekday/weekend
      const dateObj = new Date(input.date + 'T00:00:00');
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const price = isWeekend ? court.weekendPrice : court.weekdayPrice;
      while (currentMin + duration <= endMin) {
        const startH = Math.floor(currentMin / 60);
        const startM = currentMin % 60;
        const endH2 = Math.floor((currentMin + duration) / 60);
        const endM2 = (currentMin + duration) % 60;
        const startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
        const endTime = `${String(endH2).padStart(2, '0')}:${String(endM2).padStart(2, '0')}`;
        const isBooked = bookedSlots.some(s => s.start === startTime);
        const isBlocked = blockedSlotsList.some(s => s.start === startTime);
        slots.push({ startTime, endTime, available: !isBooked && !isBlocked, price });
        currentMin += duration;
      }
      return { court, slots, date: input.date };
    }),
    create: protectedProcedure.input(z.object({
      courtId: z.number(),
      sport: z.enum(["cricket", "football", "badminton", "pickleball"]),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      amount: z.number(),
      customerName: z.string().optional(),
      customerPhone: z.string().optional(),
      customerEmail: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      // Check availability
      const existing = await db.getBookingsForDate(input.courtId, input.date);
      const conflict = existing.some(b => b.startTime === input.startTime);
      if (conflict) throw new Error("This slot is already booked");
      const bookingId = await db.createBooking({
        userId: ctx.user.id,
        ...input,
        status: 'pending',
        paymentStatus: 'pending',
      });
      return { bookingId };
    }),
    confirmPayment: protectedProcedure.input(z.object({
      bookingId: z.number(),
      paymentId: z.string(),
    })).mutation(async ({ input }) => {
      await db.updateBookingStatus(input.bookingId, 'confirmed', input.paymentId);
      return { success: true };
    }),
    myBookings: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserBookings(ctx.user.id);
    }),
    cancel: protectedProcedure.input(z.object({ bookingId: z.number() })).mutation(async ({ input }) => {
      await db.cancelBooking(input.bookingId);
      return { success: true };
    }),
  }),

  academy: router({
    enroll: publicProcedure.input(z.object({
      academy: z.enum(["cricket", "badminton"]),
      studentName: z.string(),
      studentAge: z.number().optional(),
      phone: z.string(),
      email: z.string().optional(),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      message: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.createEnrollment({
        userId: ctx.user?.id ?? null,
        ...input,
        level: input.level ?? 'beginner',
      });
      return { success: true };
    }),
  }),

  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string(),
    })).mutation(async ({ input }) => {
      await db.createContactInquiry(input);
      return { success: true };
    }),
    golfNotify: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input }) => {
      await db.addGolfNotification(input.email);
      return { success: true };
    }),
  }),

  admin: router({
    stats: adminProcedure.query(async () => {
      const stats = await db.getAdminStats();
      const revenue = await db.getRevenueStats();
      return { ...stats, ...revenue };
    }),
    bookings: adminProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input }) => {
      return db.getAllBookings(input?.limit ?? 100);
    }),
    courts: adminProcedure.query(async () => {
      return db.getAllCourtsAdmin();
    }),
    updateCourt: adminProcedure.input(z.object({
      id: z.number(),
      weekdayPrice: z.number().optional(),
      weekendPrice: z.number().optional(),
      isActive: z.boolean().optional(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateCourt(id, data);
      return { success: true };
    }),
    blockSlot: adminProcedure.input(z.object({
      courtId: z.number(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      reason: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.blockSlot(input);
      return { success: true };
    }),
    enrollments: adminProcedure.query(async () => {
      return db.getAllEnrollments();
    }),
    inquiries: adminProcedure.query(async () => {
      return db.getAllInquiries();
    }),
    updateBookingStatus: adminProcedure.input(z.object({
      bookingId: z.number(),
      status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
    })).mutation(async ({ input }) => {
      await db.updateBookingStatus(input.bookingId, input.status);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
