import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Loader2, AlertCircle, Ticket, Zap, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const paymentColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  paid: "bg-green-500/15 text-green-400",
  refunded: "bg-blue-500/15 text-blue-400",
  failed: "bg-red-500/15 text-red-400",
};

const sportIcons: Record<string, string> = {
  cricket: "🏏",
  football: "⚽",
  badminton: "🏸",
  pickleball: "🏓",
};

export default function MyBookings() {
  const { user, isAuthenticated, loading } = useAuth();
  const bookingsQuery = trpc.booking.myBookings.useQuery(undefined, { enabled: isAuthenticated });
  const cancelMutation = trpc.booking.cancel.useMutation({
    onSuccess: () => {
      toast.success("Booking cancelled");
      bookingsQuery.refetch();
    },
    onError: () => toast.error("Failed to cancel booking"),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm font-sans text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="relative pt-24 pb-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
          </div>
          <div className="container text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
              <h1 className="font-heading text-3xl tracking-wider mb-4">SIGN IN REQUIRED</h1>
              <p className="text-muted-foreground font-sans mb-8 max-w-md mx-auto">Please sign in to view your bookings and manage your reservations.</p>
              <Button
                className="bg-primary text-primary-foreground glow-primary font-sans font-bold h-12 px-8 rounded-xl"
                onClick={() => { window.location.href = getLoginUrl(); }}
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-xl"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button>
            </Link>
            <div>
              <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-1">My Bookings</span>
              <h1 className="font-heading text-3xl tracking-wider">YOUR RESERVATIONS</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-blue rounded-full mt-2" />
            </div>
          </motion.div>

          {bookingsQuery.isLoading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="text-sm font-sans text-muted-foreground">Loading bookings...</span>
              </div>
            </div>
          ) : !bookingsQuery.data?.length ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card rounded-2xl p-16 text-center">
                <Ticket className="h-16 w-16 text-muted-foreground/40 mx-auto mb-6" />
                <h3 className="font-heading text-2xl tracking-wider mb-3">NO BOOKINGS YET</h3>
                <p className="text-muted-foreground font-sans mb-8 max-w-md mx-auto">Book your first turf and start playing!</p>
                <Link href="/book">
                  <Button className="bg-primary text-primary-foreground glow-primary font-sans font-bold h-12 px-8 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Book a Turf
                    </span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {bookingsQuery.data.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                          {sportIcons[booking.sport] || "🏟️"}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading text-lg tracking-wider">
                              {booking.sport.toUpperCase()}
                            </h3>
                            <Badge className={`${statusColors[booking.status]} text-xs font-sans`}>{booking.status}</Badge>
                            <Badge className={`${paymentColors[booking.paymentStatus]} text-xs font-sans`}>{booking.paymentStatus}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm font-sans text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary/60" /> {booking.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary/60" /> {booking.startTime} - {booking.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-heading text-2xl tracking-wider text-primary">₹{booking.amount}</span>
                        {booking.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl font-sans"
                            onClick={() => cancelMutation.mutate({ bookingId: booking.id })}
                            disabled={cancelMutation.isPending}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
