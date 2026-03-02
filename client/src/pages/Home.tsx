import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGES, FOUNDERS, SPORTS, TESTIMONIALS, ORIGIN_STORY, STATS, WHATSAPP_URL } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Star, MapPin, Phone, ArrowRight, ChevronRight, Trophy, Users, Zap, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMAGES.turfFacility} alt="HomeGround Turf" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary px-4 py-1.5">
              <Zap className="h-3 w-3 mr-1.5" /> Kandivali East, Mumbai
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Where Mumbai{" "}
            <span className="text-primary text-glow">Plays</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl"
          >
            Cricket, Football, Badminton & Box Cricket — all under one roof.
            Coached by IPL legend <span className="text-foreground font-medium">Paul Valthaty</span>.
            Book your court in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/book">
              <Button size="lg" className="bg-primary text-primary-foreground glow-neon font-semibold text-base px-8 h-12">
                Book a Turf <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#sports">
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                Explore Sports
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-primary text-glow">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialProofBar() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span>IPL Legend Paul Valthaty</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>4.5/5 on CricHeroes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>500+ Players Weekly</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Open 6 AM - 11 PM</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SportsSection() {
  return (
    <section id="sports" className="py-20 sm:py-28">
      <div className="container">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">What&apos;s Your Game?</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Choose Your Sport</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From cricket nets to badminton courts, we have everything you need for a great game.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPORTS.map((sport, i) => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/book?sport=${sport.id}`}>
                <Card className={`group cursor-pointer border ${sport.borderColor} bg-gradient-to-b ${sport.color} hover:scale-[1.02] transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{sport.icon}</div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{sport.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{sport.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">From ₹{sport.priceFrom}/hr</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Academies CTA */}
        <motion.div {...fadeInUp} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/academy/cricket">
            <Card className="group cursor-pointer border-primary/20 bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/15 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-3xl">🏏</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">Paul Valthaty Cricket Academy</h3>
                  <p className="text-sm text-muted-foreground">Train with an IPL legend</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/academy/badminton">
            <Card className="group cursor-pointer border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent hover:from-yellow-500/15 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <span className="text-3xl">🏸</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">Home Shuttlers Badminton Academy</h3>
                  <p className="text-sm text-muted-foreground">Smash your limits</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function OriginStorySection() {
  return (
    <section id="story" className="py-20 sm:py-28 bg-card/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">{ORIGIN_STORY.subtitle}</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">{ORIGIN_STORY.title}</h2>
            {ORIGIN_STORY.paragraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{p}</p>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <img src={IMAGES.turfNight} alt="HomeGround Turf at Night" className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-heading font-semibold text-lg">HomeGround Sports Complex</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> Kandivali East, Mumbai
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FoundersSection() {
  return (
    <section id="founders" className="py-20 sm:py-28">
      <div className="container">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">The Team</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Meet the Founders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate team behind HomeGround, united by a love for sports and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUNDERS.map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card hover:border-primary/30 transition-all h-full">
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-xl bg-accent overflow-hidden mb-4 mx-auto">
                    {founder.image ? (
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-heading font-bold text-primary">
                        {founder.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-center">{founder.name}</h3>
                  <p className="text-sm text-primary text-center mb-3">{founder.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{founder.bio}</p>
                  {founder.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {founder.highlights.slice(0, 3).map(h => (
                        <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-card/30">
      <div className="container">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">Reviews</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">What Players Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real reviews from CricHeroes, JustDial, BookMyPlayer, and Google.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="border-border/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${j < Math.floor(t.rating) ? 'text-yellow-400 fill-yellow-400' : j < t.rating ? 'text-yellow-400 fill-yellow-400/50' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.sport}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{t.source}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: () => toast.error("Failed to send message. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) { toast.error("Name and message are required"); return; }
    contactMutation.mutate(formData);
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="container">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">Get in Touch</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? Reach out and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div {...fadeInUp}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name *" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-card" />
                <Input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-card" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Phone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-card" />
                <Input placeholder="Subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} className="bg-card" />
              </div>
              <Textarea placeholder="Your Message *" rows={5} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="bg-card" />
              <Button type="submit" className="w-full bg-primary text-primary-foreground glow-neon" disabled={contactMutation.isPending}>
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-heading font-semibold mb-3">Visit Us</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm">HomeGround Sports</p>
                      <p className="text-sm text-muted-foreground">Opp. Dream Park, Kandivali East, Mumbai 400101</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-3">Call Us</h3>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <a href="tel:+919082210021" className="text-sm hover:text-primary transition-colors">+91 90822 10021</a>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-3">Hours</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monday - Sunday</span>
                      <span>6:00 AM - 11:00 PM</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Open all days including holidays</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {WHATSAPP_URL && (
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10">
                        Chat on WhatsApp
                      </Button>
                    </a>
                  )}
                  <Link href="/book">
                    <Button className="w-full bg-primary text-primary-foreground">
                      Book a Turf Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      <div className="container relative z-10 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Book your turf in under 60 seconds. No calls, no waiting — just instant confirmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="bg-primary text-primary-foreground glow-neon font-semibold text-base px-8 h-12">
                Book Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 text-base h-12 px-8">
                  WhatsApp Us
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <SocialProofBar />
      <SportsSection />
      <OriginStorySection />
      <FoundersSection />
      <TestimonialsSection />
      <ContactSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
