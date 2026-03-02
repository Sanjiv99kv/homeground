import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Calendar, DollarSign, Users, Loader2, Shield, BookOpen, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in with an admin account.</p>
          <Button onClick={() => { window.location.href = getLoginUrl(); }}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <Link href="/"><Button>Go Home</Button></Link>
        </div>
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-lg">Admin Dashboard</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { statsQuery.refetch(); bookingsQuery.refetch(); }}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue (Month)</p>
                  <p className="font-heading font-bold text-lg">₹{stats?.thisMonth?.toLocaleString() || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                  <p className="font-heading font-bold text-lg">{stats?.totalBookings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="font-heading font-bold text-lg">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Enrollments</p>
                  <p className="font-heading font-bold text-lg">{stats?.totalEnrollments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="courts">Courts & Pricing</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsQuery.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Sport</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookingsQuery.data?.map(booking => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-mono text-xs">#{booking.id}</TableCell>
                            <TableCell className="capitalize">{booking.sport.replace("_", " ")}</TableCell>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>{booking.startTime}-{booking.endTime}</TableCell>
                            <TableCell className="font-medium">₹{booking.amount}</TableCell>
                            <TableCell><Badge className={statusColors[booking.status]}>{booking.status}</Badge></TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{booking.paymentStatus}</Badge></TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={(v) => updateBookingStatus.mutate({ bookingId: booking.id, status: v as any })}
                              >
                                <SelectTrigger className="w-[120px] h-8 text-xs">
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
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No bookings yet</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courts Tab */}
          <TabsContent value="courts">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Courts & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                {courtsQuery.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-4">
                    {courtsQuery.data?.map(court => (
                      <Card key={court.id} className="border-border/30">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-heading font-semibold">{court.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{court.sport.replace("_", " ")}</p>
                              <Badge variant={court.isActive ? "default" : "destructive"} className="mt-1 text-xs">
                                {court.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Weekday</p>
                                <p className="font-semibold text-primary">₹{court.weekdayPrice}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Weekend</p>
                                <p className="font-semibold text-primary">₹{court.weekendPrice}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
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
                                onClick={() => updateCourt.mutate({ id: court.id, isActive: !court.isActive })}
                              >
                                {court.isActive ? "Disable" : "Enable"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enrollments Tab */}
          <TabsContent value="enrollments">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Academy Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                {enrollmentsQuery.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Academy</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollmentsQuery.data?.map(e => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.studentName}</TableCell>
                            <TableCell className="capitalize">{e.academy}</TableCell>
                            <TableCell>{e.phone}</TableCell>
                            <TableCell className="capitalize">{e.level}</TableCell>
                            <TableCell><Badge variant="outline">{e.status}</Badge></TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                        {!enrollmentsQuery.data?.length && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No enrollments yet</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-heading">Contact Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {inquiriesQuery.isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-4">
                    {inquiriesQuery.data?.map(inq => (
                      <Card key={inq.id} className="border-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{inq.name}</h4>
                              <p className="text-xs text-muted-foreground">{inq.email} · {inq.phone}</p>
                              {inq.subject && <p className="text-sm font-medium mt-1">{inq.subject}</p>}
                              <p className="text-sm text-muted-foreground mt-1">{inq.message}</p>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <Badge variant="outline" className="text-xs">{inq.status}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(inq.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {!inquiriesQuery.data?.length && (
                      <div className="text-center text-muted-foreground py-8">No inquiries yet</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
