import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { SPORTS, IMAGES } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Check, Clock, MapPin, ChevronRight, Loader2, Zap, ArrowRight, Shield, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isWeekend } from "date-fns";

type BookingStep = "sport" | "court" | "date" | "slot" | "details" | "confirm";

export default function BookingPage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);

  const [step, setStep] = useState<BookingStep>("sport");
  const [selectedSport, setSelectedSport] = useState<string>(params.get("sport") || "");
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string; price: number } | null>(null);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user?.name && !customerName) setCustomerName(user.name);
    if (user?.email && !customerEmail) setCustomerEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (params.get("sport")) {
      setSelectedSport(params.get("sport")!);
      setStep("court");
    }
  }, []);

  const courtsQuery = trpc.courts.bySport.useQuery(
    { sport: selectedSport },
    { enabled: !!selectedSport }
  );

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const availabilityQuery = trpc.booking.availability.useQuery(
    { courtId: selectedCourtId!, date: dateStr },
    { enabled: !!selectedCourtId && !!dateStr }
  );

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: (data) => {
      toast.success("Booking created! Redirecting to payment...");
      confirmPayment.mutate({ bookingId: data.bookingId, paymentId: `sim_${Date.now()}` });
    },
    onError: (err) => toast.error(err.message || "Failed to create booking"),
  });

  const confirmPayment = trpc.booking.confirmPayment.useMutation({
    onSuccess: () => {
      toast.success("Booking confirmed! Check your bookings page.");
      setLocation("/my-bookings");
    },
    onError: () => toast.error("Payment confirmation failed"),
  });

  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
    setSelectedCourtId(null);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setStep("court");
  };

  const handleCourtSelect = (courtId: number) => {
    setSelectedCourtId(courtId);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setStep("date");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (date) setStep("slot");
  };

  const handleSlotSelect = (slot: { startTime: string; endTime: string; price: number }) => {
    setSelectedSlot(slot);
    setStep("details");
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book");
      window.location.href = getLoginUrl();
      return;
    }
    if (!selectedCourtId || !selectedDate || !selectedSlot) return;
    createBooking.mutate({
      courtId: selectedCourtId,
      sport: selectedSport as any,
      date: dateStr,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      amount: selectedSlot.price,
      customerName,
      customerPhone,
      customerEmail,
      notes: notes || undefined,
    });
  };

  const sportInfo = SPORTS.find(s => s.id === selectedSport);
  const selectedCourt = courtsQuery.data?.find(c => c.id === selectedCourtId);

  const steps: { key: BookingStep; label: string }[] = [
    { key: "sport", label: "Sport" },
    { key: "court", label: "Court" },
    { key: "date", label: "Date" },
    { key: "slot", label: "Time" },
    { key: "details", label: "Details" },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hg-blue/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-2">Booking</span>
            <h1 className="font-heading text-3xl sm:text-4xl tracking-wider mb-2">BOOK YOUR TURF</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-blue rounded-full" />
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-10 overflow-x-auto pb-2"
          >
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center shrink-0">
                <motion.button
                  whileHover={i < currentStepIndex ? { scale: 1.05 } : {}}
                  whileTap={i < currentStepIndex ? { scale: 0.95 } : {}}
                  onClick={() => { if (i < currentStepIndex) setStep(s.key); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 ${
                    i < currentStepIndex ? "bg-primary/15 text-primary cursor-pointer hover:bg-primary/25 border border-primary/20" :
                    i === currentStepIndex ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" :
                    "bg-card/50 text-muted-foreground border border-border/30"
                  }`}
                >
                  {i < currentStepIndex ? <Check className="h-3.5 w-3.5" /> : <span className="w-5 text-center text-xs">{i + 1}</span>}
                  <span>{s.label}</span>
                </motion.button>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${i < currentStepIndex ? 'bg-primary/40' : 'bg-border/30'}`} />
                )}
              </div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Sport Selection */}
            {step === "sport" && (
              <motion.div key="sport" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <h2 className="font-heading text-2xl tracking-wider mb-6">SELECT YOUR SPORT</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {SPORTS.map((sport, i) => (
                    <motion.div
                      key={sport.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div
                        className="glass-card rounded-2xl p-6 cursor-pointer group hover:border-primary/40 transition-all duration-500 relative overflow-hidden"
                        onClick={() => handleSportSelect(sport.id)}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: sport.bgGlow }}
                        />
                        <div className="relative z-10 flex items-center gap-5">
                          <motion.span
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className="text-5xl"
                          >
                            {sport.icon}
                          </motion.span>
                          <div className="flex-1">
                            <h3 className="font-heading text-xl tracking-wider text-foreground">{sport.name.toUpperCase()}</h3>
                            <p className="text-sm font-sans text-muted-foreground mt-1">From ₹{sport.priceFrom}/hr</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Court Selection */}
            {step === "court" && (
              <motion.div key="court" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("sport")} className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <h2 className="font-heading text-2xl tracking-wider">
                    {sportInfo?.icon} SELECT {sportInfo?.name.toUpperCase()} COURT
                  </h2>
                </div>
                {courtsQuery.isLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <span className="text-sm font-sans text-muted-foreground">Loading courts...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {courtsQuery.data?.map((court, i) => (
                      <motion.div
                        key={court.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div
                          className="glass-card rounded-2xl p-6 cursor-pointer group hover:border-primary/40 transition-all duration-500"
                          onClick={() => handleCourtSelect(court.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-heading text-xl tracking-wider text-foreground group-hover:text-primary transition-colors">{court.name}</h3>
                              <p className="text-sm font-sans text-muted-foreground mt-2 leading-relaxed">{court.description}</p>
                              <div className="flex flex-wrap gap-2 mt-4">
                                {(court.amenities as string[] || []).map((a: string) => (
                                  <span key={a} className="text-xs font-sans px-3 py-1 rounded-full bg-primary/10 text-primary/80 border border-primary/15">{a}</span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-6 glass-card rounded-xl p-4">
                              <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider">Weekday</p>
                              <p className="font-heading text-xl text-primary tracking-wider">₹{court.weekdayPrice}</p>
                              <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mt-2">Weekend</p>
                              <p className="font-heading text-xl text-hg-red tracking-wider">₹{court.weekendPrice}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Date Selection */}
            {step === "date" && (
              <motion.div key="date" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("court")} className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <h2 className="font-heading text-2xl tracking-wider">SELECT DATE</h2>
                </div>
                <div className="glass-card rounded-2xl p-6 sm:p-8 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date > addDays(new Date(), 30)}
                    className="rounded-xl"
                  />
                </div>
                {selectedDate && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-sans text-muted-foreground mt-4 text-center"
                  >
                    Selected: <span className="text-primary font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                    {isWeekend(selectedDate) && <Badge variant="secondary" className="ml-2 text-xs">Weekend Pricing</Badge>}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Step 4: Time Slot Selection */}
            {step === "slot" && (
              <motion.div key="slot" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("date")} className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <div>
                    <h2 className="font-heading text-2xl tracking-wider">SELECT TIME SLOT</h2>
                    <p className="text-sm font-sans text-muted-foreground">{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>
                {availabilityQuery.isLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <span className="text-sm font-sans text-muted-foreground">Loading availability...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availabilityQuery.data?.slots.map((slot, i) => (
                      <motion.button
                        key={slot.startTime}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        disabled={!slot.available}
                        onClick={() => handleSlotSelect(slot)}
                        whileHover={slot.available ? { scale: 1.03 } : {}}
                        whileTap={slot.available ? { scale: 0.97 } : {}}
                        className={`p-4 rounded-2xl border text-center transition-all duration-300 ${
                          !slot.available
                            ? "border-border/20 bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                            : selectedSlot?.startTime === slot.startTime
                            ? "border-primary bg-primary/15 text-primary shadow-lg shadow-primary/10"
                            : "border-border/30 hover:border-primary/40 bg-card/50 glass-card"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-sm font-sans font-medium">{slot.startTime}</span>
                        </div>
                        <span className="text-xs font-sans text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                        <div className="mt-2">
                          {slot.available ? (
                            <span className="text-sm font-heading font-bold text-primary tracking-wider">₹{slot.price}</span>
                          ) : (
                            <span className="text-xs font-sans text-destructive">Booked</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Details & Confirm */}
            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("slot")} className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <h2 className="font-heading text-2xl tracking-wider">CONFIRM BOOKING</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Summary */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="glass-card rounded-2xl p-6 border-gradient">
                      <div className="flex items-center gap-2 mb-6">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-heading text-lg tracking-wider">BOOKING SUMMARY</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-sans text-muted-foreground">Sport</span>
                          <span className="font-sans font-medium">{sportInfo?.icon} {sportInfo?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-sans text-muted-foreground">Court</span>
                          <span className="font-sans font-medium">{selectedCourt?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-sans text-muted-foreground">Date</span>
                          <span className="font-sans font-medium">{selectedDate && format(selectedDate, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-sans text-muted-foreground">Time</span>
                          <span className="font-sans font-medium">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                        </div>
                        <div className="border-t border-border/30 pt-4 flex justify-between items-center">
                          <span className="font-heading text-lg tracking-wider">TOTAL</span>
                          <span className="font-heading text-3xl tracking-wider text-primary">₹{selectedSlot?.price}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Contact Details */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="font-heading text-lg tracking-wider">YOUR DETAILS</h3>
                      </div>
                      <div className="space-y-4">
                        <Input placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
                        <Input placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
                        <Input placeholder="Email" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
                        <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />

                        {!isAuthenticated ? (
                          <Button className="w-full h-14 rounded-xl font-sans font-bold" onClick={() => { window.location.href = getLoginUrl(); }}>
                            Sign In to Book
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-primary text-primary-foreground glow-primary font-sans font-bold h-14 rounded-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                            onClick={handleBooking}
                            disabled={createBooking.isPending || confirmPayment.isPending}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative flex items-center gap-2">
                              {createBooking.isPending || confirmPayment.isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4" />
                                  PAY ₹{selectedSlot?.price} & CONFIRM
                                </>
                              )}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
