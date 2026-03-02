import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import AcademyPage from "./pages/AcademyPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/book" component={BookingPage} />
      <Route path="/academy/:sport" component={AcademyPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
