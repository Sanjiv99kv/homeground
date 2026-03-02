import { WHATSAPP_URL } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-heading">HG</span>
              </div>
              <span className="font-heading font-bold text-lg">HomeGround</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Where Mumbai Plays. Multi-sport turf booking and coaching academies in Kandivali East.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/homegroundcricketacademy/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/homegroundcricketacademy/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/book" className="text-sm text-muted-foreground hover:text-primary transition-colors">Book a Turf</Link>
              <Link href="/academy/cricket" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cricket Academy</Link>
              <Link href="/academy/badminton" className="text-sm text-muted-foreground hover:text-primary transition-colors">Badminton Academy</Link>
              <a href="/#founders" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Team</a>
              <a href="/#story" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Story</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">Opp. Dream Park, Kandivali East, Mumbai 400101</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+919082210021" className="text-sm text-muted-foreground hover:text-primary transition-colors">+91 90822 10021</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:homeground.info@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">homeground.info@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Hours</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">Mon - Sun: 6:00 AM - 11:00 PM</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Open all days including holidays</p>
              {WHATSAPP_URL && (
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HomeGround Sports. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Kandivali East, Mumbai — Where Mumbai Plays
          </p>
        </div>
      </div>
    </footer>
  );
}
