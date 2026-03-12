import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { IMAGES, WHATSAPP_URL } from "@/lib/data";
import { Menu, X, User, LogOut, Calendar, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-110">
            <img src={IMAGES.logo} alt="HomeGround" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl tracking-wider text-foreground leading-none">HOMEGROUND</span>
            <span className="text-[10px] font-sans font-medium text-primary tracking-widest uppercase">Where Mumbai Plays</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="relative px-4 py-2 text-sm font-sans font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 rounded-lg group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-6" />
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {WHATSAPP_URL && (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-green-500/40 text-green-400 hover:bg-green-500/10 hover:border-green-500/60 transition-all duration-300">
                <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </Button>
            </a>
          )}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:border-primary/50 transition-all duration-300">
                  <User className="h-4 w-4" />
                  {user?.name?.split(' ')[0] || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card">
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
            <Button variant="outline" size="sm" onClick={() => { window.location.href = getLoginUrl(); }} className="border-border/50 hover:border-primary/50 transition-all duration-300">
              Sign In
            </Button>
          )}
          <Link href="/book">
            <Button size="sm" className="bg-primary text-primary-foreground font-sans font-semibold glow-primary hover:scale-105 transition-all duration-300 px-6">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-left text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="border-t border-border/50 my-2" />
              {isAuthenticated ? (
                <>
                  <Link href="/my-bookings" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-sans text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg">
                    My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-sans text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 text-left text-sm font-sans text-destructive hover:bg-accent/50 rounded-lg">
                    Sign Out
                  </button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => { window.location.href = getLoginUrl(); }} className="mx-4">
                  Sign In
                </Button>
              )}
              <Link href="/book" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground glow-primary font-sans font-semibold mt-2">
                  Book Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
