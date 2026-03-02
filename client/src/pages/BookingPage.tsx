import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { SPORTS } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Check, Clock, MapPin, ChevronRight, Loader2 } from "lucide-react";
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
      // In production, redirect to Razorpay. For now, confirm directly.
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
      <div className="pt-20 pb-12">
        <div className="container max-w-4xl">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center shrink-0">
                <button
                  onClick={() => { if (i < currentStepIndex) setStep(s.key); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    i < currentStepIndex ? "bg-primary/20 text-primary cursor-pointer" :
                    i === currentStepIndex ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStepIndex ? <Check className="h-3 w-3" /> : <span className="w-4 text-center text-xs">{i + 1}</span>}
                  <span>{s.label}</span>
                </button>
                {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Sport Selection */}
            {step === "sport" && (
              <motion.div key="sport" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-heading text-2xl font-bold mb-6">Select Your Sport</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SPORTS.map(sport => (
                    <Card
                      key={sport.id}
                      className={`cursor-pointer border hover:border-primary/50 transition-all ${sport.borderColor} bg-gradient-to-b ${sport.color}`}
                      onClick={() => handleSportSelect(sport.id)}
                    >
                      <CardContent className="p-6 flex items-center gap-4">
                        <span className="text-4xl">{sport.icon}</span>
                        <div>
                          <h3 className="font-heading font-semibold">{sport.name}</h3>
                          <p className="text-sm text-muted-foreground">From ₹{sport.priceFrom}/hr</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Court Selection */}
            {step === "court" && (
              <motion.div key="court" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("sport")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <h2 className="font-heading text-2xl font-bold">
                    {sportInfo?.icon} Select {sportInfo?.name} Court
                  </h2>
                </div>
                {courtsQuery.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {courtsQuery.data?.map(court => (
                      <Card
                        key={court.id}
                        className="cursor-pointer border hover:border-primary/50 transition-all"
                        onClick={() => handleCourtSelect(court.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-heading font-semibold text-lg">{court.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{court.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {(court.amenities as string[] || []).map((a: string) => (
                                  <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <p className="text-sm text-muted-foreground">Weekday</p>
                              <p className="font-semibold text-primary">₹{court.weekdayPrice}</p>
                              <p className="text-sm text-muted-foreground mt-1">Weekend</p>
                              <p className="font-semibold text-primary">₹{court.weekendPrice}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Date Selection */}
            {step === "date" && (
              <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("court")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <h2 className="font-heading text-2xl font-bold">Select Date</h2>
                </div>
                <Card>
                  <CardContent className="p-6 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date > addDays(new Date(), 30)}
                      className="rounded-md"
                    />
                  </CardContent>
                </Card>
                {selectedDate && (
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    {isWeekend(selectedDate) ? "Weekend pricing applies" : "Weekday pricing applies"} for {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 4: Time Slot Selection */}
            {step === "slot" && (
              <motion.div key="slot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("date")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <div>
                    <h2 className="font-heading text-2xl font-bold">Select Time Slot</h2>
                    <p className="text-sm text-muted-foreground">{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>
                {availabilityQuery.isLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availabilityQuery.data?.slots.map((slot) => (
                      <button
                        key={slot.startTime}
                        disabled={!slot.available}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          !slot.available
                            ? "border-border/30 bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                            : selectedSlot?.startTime === slot.startTime
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm font-medium">{slot.startTime}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                        <div className="mt-2">
                          {slot.available ? (
                            <span className="text-sm font-semibold text-primary">₹{slot.price}</span>
                          ) : (
                            <span className="text-xs text-destructive">Booked</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Details & Confirm */}
            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("slot")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <h2 className="font-heading text-2xl font-bold">Confirm Booking</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Summary */}
                  <Card className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="font-heading">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sport</span>
                        <span className="font-medium">{sportInfo?.icon} {sportInfo?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Court</span>
                        <span className="font-medium">{selectedCourt?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{selectedDate && format(selectedDate, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between">
                        <span className="font-heading font-semibold">Total</span>
                        <span className="font-heading font-bold text-xl text-primary">₹{selectedSlot?.price}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="bg-background" />
                      <Input placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="bg-background" />
                      <Input placeholder="Email" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="bg-background" />
                      <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="bg-background" />

                      {!isAuthenticated ? (
                        <Button className="w-full" onClick={() => { window.location.href = getLoginUrl(); }}>
                          Sign In to Book
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-primary text-primary-foreground glow-neon font-semibold"
                          onClick={handleBooking}
                          disabled={createBooking.isPending || confirmPayment.isPending}
                        >
                          {createBooking.isPending || confirmPayment.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                          ) : (
                            <>Pay ₹{selectedSlot?.price} & Confirm</>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
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
