import { IMAGES, WHATSAPP_URL } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative bg-card/80 border-t border-border/50 overflow-hidden">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src={IMAGES.logo} alt="HomeGround" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-heading text-xl tracking-wider text-foreground block leading-none">HOMEGROUND</span>
                <span className="text-[10px] font-sans font-medium text-primary tracking-widest uppercase">Where Mumbai Plays</span>
              </div>
            </div>
            <p className="text-sm font-sans text-muted-foreground mb-5 leading-relaxed">
              Multi-sport turf booking and professional coaching academies in Kandivali East, Mumbai.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/homegroundcricketacademy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-accent/80 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group">
                <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="https://www.facebook.com/homegroundcricketacademy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-accent/80 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group">
                <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg tracking-wider mb-5 text-foreground">QUICK LINKS</h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/book", label: "Book a Turf" },
                { href: "/academy/cricket", label: "Cricket Academy" },
                { href: "/academy/badminton", label: "Badminton Academy" },
              ].map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1 group">
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <a href="/#founders" className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors duration-300">Our Team</a>
              <a href="/#story" className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors duration-300">Our Story</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg tracking-wider mb-5 text-foreground">CONTACT US</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-sans text-muted-foreground leading-relaxed">Opp. Dream Park, Kandivali East, Mumbai 400101</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <a href="tel:+919082210021" className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors">+91 90822 10021</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a href="mailto:homeground.info@gmail.com" className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors">homeground.info@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading text-lg tracking-wider mb-5 text-foreground">HOURS</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-sans text-foreground font-medium block">Mon - Sun</span>
                  <span className="text-sm font-sans text-muted-foreground">6:00 AM - 11:00 PM</span>
                </div>
              </div>
              <p className="text-xs font-sans text-muted-foreground mt-1">Open all days including holidays</p>
              {WHATSAPP_URL && (
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-sans text-green-400 hover:text-green-300 transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-muted-foreground">
            &copy; {new Date().getFullYear()} HomeGround Sports. All rights reserved.
          </p>
          <p className="text-xs font-sans text-muted-foreground">
            Kandivali East, Mumbai — <span className="text-primary">Where Mumbai Plays</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
