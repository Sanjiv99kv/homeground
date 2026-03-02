import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { WHATSAPP_URL } from "@/lib/data";
import { Menu, X, User, LogOut, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { href: "/#sports", label: "Sports" },
  { href: "/#academies", label: "Academies" },
  { href: "/#founders", label: "Founders" },
  { href: "/#story", label: "Our Story" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      if (location !== "/") {
        window.location.href = href;
      } else {
        const el = document.getElementById(href.replace("/#", ""));
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-heading">HG</span>
          </div>
          <span className="font-heading font-bold text-lg text-foreground">HomeGround</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {WHATSAPP_URL && (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                WhatsApp
              </Button>
            </a>
          )}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name?.split(' ')[0] || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/my-bookings" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => { window.location.href = getLoginUrl(); }}>
              Sign In
            </Button>
          )}
          <Link href="/book">
            <Button size="sm" className="bg-primary text-primary-foreground glow-neon font-semibold">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="container py-4 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-3 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-border my-2" />
            {isAuthenticated ? (
              <>
                <Link href="/my-bookings" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                  My Bookings
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 text-left text-sm text-destructive hover:bg-accent rounded-md">
                  Sign Out
                </button>
              </>
            ) : (
              <Button size="sm" onClick={() => { window.location.href = getLoginUrl(); }} className="mx-4">
                Sign In
              </Button>
            )}
            <Link href="/book" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground glow-neon font-semibold">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
