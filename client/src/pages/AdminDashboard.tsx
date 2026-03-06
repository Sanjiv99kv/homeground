import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Calendar, DollarSign, Users, Loader2, Shield, BookOpen, MessageSquare, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm font-sans text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
          <h1 className="font-heading text-3xl tracking-wider mb-4">ADMIN ACCESS REQUIRED</h1>
          <p className="text-muted-foreground font-sans mb-8">Please sign in with an admin account.</p>
          <Button className="bg-primary text-primary-foreground glow-primary font-sans font-bold h-12 px-8 rounded-xl" onClick={() => { window.location.href = getLoginUrl(); }}>Sign In</Button>
        </motion.div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Shield className="h-16 w-16 text-destructive/50 mx-auto mb-6" />
          <h1 className="font-heading text-3xl tracking-wider mb-4">ACCESS DENIED</h1>
          <p className="text-muted-foreground font-sans mb-8">You don't have admin privileges.</p>
          <Link href="/"><Button className="rounded-xl font-sans">Go Home</Button></Link>
        </motion.div>
      </div>
    );
  }

  return <AdminContent />;
}

function AdminContent() {
  const statsQuery = trpc.admin.stats.useQuery();
  const bookingsQuery = trpc.admin.bookings.useQuery({});
  const courtsQuery = trpc.admin.courts.useQuery();
  const enrollmentsQuery = trpc.admin.enrollments.useQuery();
  const inquiriesQuery = trpc.admin.inquiries.useQuery();

  const updateBookingStatus = trpc.admin.updateBookingStatus.useMutation({
    onSuccess: () => { toast.success("Booking updated"); bookingsQuery.refetch(); },
    onError: () => toast.error("Failed to update booking"),
  });

  const updateCourt = trpc.admin.updateCourt.useMutation({
    onSuccess: () => { toast.success("Court updated"); courtsQuery.refetch(); },
    onError: () => toast.error("Failed to update court"),
  });

  const stats = statsQuery.data;

  const statCards = [
    { label: "Revenue (Month)", value: `₹${stats?.thisMonth?.toLocaleString() || 0}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: Calendar, color: "text-hg-blue", bg: "bg-hg-blue/10" },
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Enrollments", value: stats?.totalEnrollments || 0, icon: BookOpen, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hg-blue/3 rounded-full blur-[150px]" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 border-b border-border/30 bg-card/30 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-xl font-sans"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="font-heading text-lg tracking-wider">ADMIN DASHBOARD</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl font-sans" onClick={() => { statsQuery.refetch(); bookingsQuery.refetch(); }}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="relative z-10 container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="glass-card rounded-2xl p-5 group hover:border-primary/30 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-sans text-muted-foreground">{stat.label}</p>
                    <p className="font-heading text-xl tracking-wider">{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-card/50 border border-border/30 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger value="bookings" className="rounded-lg font-sans text-sm">Bookings</TabsTrigger>
              <TabsTrigger value="courts" className="rounded-lg font-sans text-sm">Courts & Pricing</TabsTrigger>
              <TabsTrigger value="enrollments" className="rounded-lg font-sans text-sm">Enrollments</TabsTrigger>
              <TabsTrigger value="inquiries" className="rounded-lg font-sans text-sm">Inquiries</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border/20">
                  <h3 className="font-heading text-lg tracking-wider">RECENT BOOKINGS</h3>
                </div>
                <div className="p-6">
                  {bookingsQuery.isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/20">
                            <TableHead className="font-sans text-xs uppercase tracking-wider">ID</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Sport</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Date</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Time</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Amount</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Payment</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookingsQuery.data?.map(booking => (
                            <TableRow key={booking.id} className="border-border/10 hover:bg-primary/5 transition-colors">
                              <TableCell className="font-mono text-xs">#{booking.id}</TableCell>
                              <TableCell className="capitalize font-sans">{booking.sport.replace("_", " ")}</TableCell>
                              <TableCell className="font-sans">{booking.date}</TableCell>
                              <TableCell className="font-sans">{booking.startTime}-{booking.endTime}</TableCell>
                              <TableCell className="font-heading tracking-wider text-primary">₹{booking.amount}</TableCell>
                              <TableCell><Badge className={`${statusColors[booking.status]} text-xs font-sans`}>{booking.status}</Badge></TableCell>
                              <TableCell><Badge variant="outline" className="text-xs font-sans">{booking.paymentStatus}</Badge></TableCell>
                              <TableCell>
                                <Select
                                  value={booking.status}
                                  onValueChange={(v) => updateBookingStatus.mutate({ bookingId: booking.id, status: v as any })}
                                >
                                  <SelectTrigger className="w-[120px] h-8 text-xs rounded-lg font-sans">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                          {!bookingsQuery.data?.length && (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground py-12 font-sans">No bookings yet</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Courts Tab */}
            <TabsContent value="courts">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border/20">
                  <h3 className="font-heading text-lg tracking-wider">COURTS & PRICING</h3>
                </div>
                <div className="p-6">
                  {courtsQuery.isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <div className="space-y-4">
                      {courtsQuery.data?.map((court, i) => (
                        <motion.div
                          key={court.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="glass-card rounded-xl p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <h4 className="font-heading tracking-wider">{court.name}</h4>
                                <p className="text-sm font-sans text-muted-foreground capitalize">{court.sport.replace("_", " ")}</p>
                                <Badge variant={court.isActive ? "default" : "destructive"} className="mt-2 text-xs font-sans">
                                  {court.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-center glass-card rounded-lg px-4 py-2">
                                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider">Weekday</p>
                                  <p className="font-heading text-lg tracking-wider text-primary">₹{court.weekdayPrice}</p>
                                </div>
                                <div className="text-center glass-card rounded-lg px-4 py-2">
                                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider">Weekend</p>
                                  <p className="font-heading text-lg tracking-wider text-hg-red">₹{court.weekendPrice}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl font-sans"
                                  onClick={() => {
                                    const newPrice = prompt("New weekday price:", String(court.weekdayPrice));
                                    const newWeekendPrice = prompt("New weekend price:", String(court.weekendPrice));
                                    if (newPrice && newWeekendPrice) {
                                      updateCourt.mutate({
                                        id: court.id,
                                        weekdayPrice: parseInt(newPrice),
                                        weekendPrice: parseInt(newWeekendPrice),
                                      });
                                    }
                                  }}
                                >
                                  Edit Price
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl font-sans"
                                  onClick={() => updateCourt.mutate({ id: court.id, isActive: !court.isActive })}
                                >
                                  {court.isActive ? "Disable" : "Enable"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border/20">
                  <h3 className="font-heading text-lg tracking-wider">ACADEMY ENROLLMENTS</h3>
                </div>
                <div className="p-6">
                  {enrollmentsQuery.isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/20">
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Student</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Academy</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Phone</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Level</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="font-sans text-xs uppercase tracking-wider">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollmentsQuery.data?.map(e => (
                            <TableRow key={e.id} className="border-border/10 hover:bg-primary/5 transition-colors">
                              <TableCell className="font-sans font-medium">{e.studentName}</TableCell>
                              <TableCell className="capitalize font-sans">{e.academy}</TableCell>
                              <TableCell className="font-sans">{e.phone}</TableCell>
                              <TableCell className="capitalize font-sans">{e.level}</TableCell>
                              <TableCell><Badge variant="outline" className="text-xs font-sans">{e.status}</Badge></TableCell>
                              <TableCell className="text-xs font-sans text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                          {!enrollmentsQuery.data?.length && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-12 font-sans">No enrollments yet</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries">
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border/20">
                  <h3 className="font-heading text-lg tracking-wider">CONTACT INQUIRIES</h3>
                </div>
                <div className="p-6">
                  {inquiriesQuery.isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <div className="space-y-4">
                      {inquiriesQuery.data?.map((inq, i) => (
                        <motion.div
                          key={inq.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="glass-card rounded-xl p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-sans font-medium">{inq.name}</h4>
                                <p className="text-xs font-sans text-muted-foreground">{inq.email} · {inq.phone}</p>
                                {inq.subject && <p className="text-sm font-sans font-medium mt-2 text-primary">{inq.subject}</p>}
                                <p className="text-sm font-sans text-muted-foreground mt-1 leading-relaxed">{inq.message}</p>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <Badge variant="outline" className="text-xs font-sans">{inq.status}</Badge>
                                <p className="text-xs font-sans text-muted-foreground mt-2">{new Date(inq.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {!inquiriesQuery.data?.length && (
                        <div className="text-center text-muted-foreground py-12 font-sans">No inquiries yet</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
