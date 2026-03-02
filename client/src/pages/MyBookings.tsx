import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Calendar, Clock, MapPin, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const paymentColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-green-500/20 text-green-400",
  refunded: "bg-blue-500/20 text-blue-400",
  failed: "bg-red-500/20 text-red-400",
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-24 pb-16 container text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your bookings.</p>
          <Button onClick={() => { window.location.href = getLoginUrl(); }}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button>
            </Link>
            <div>
              <h1 className="font-heading text-2xl font-bold">My Bookings</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>

          {bookingsQuery.isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : !bookingsQuery.data?.length ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground mb-6">Book your first turf and start playing!</p>
                <Link href="/book">
                  <Button className="bg-primary text-primary-foreground glow-primary font-sans font-semibold">Book a Turf</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookingsQuery.data.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="border-border/50 hover:border-border transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading font-semibold">
                              {booking.sport === "box_cricket" ? "Box Cricket" : booking.sport.charAt(0).toUpperCase() + booking.sport.slice(1)}
                            </h3>
                            <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                            <Badge className={paymentColors[booking.paymentStatus]}>{booking.paymentStatus}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {booking.startTime} - {booking.endTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-heading font-bold text-lg text-primary">₹{booking.amount}</span>
                          {booking.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive/50 hover:bg-destructive/10"
                              onClick={() => cancelMutation.mutate({ bookingId: booking.id })}
                              disabled={cancelMutation.isPending}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
