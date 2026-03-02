import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGES, VIDEOS, FOUNDERS, SPORTS, TESTIMONIALS, ORIGIN_STORY, STATS, WHATSAPP_URL } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Star, MapPin, Phone, ArrowRight, ChevronRight, Trophy, Users, Zap, Clock, Award, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "sonner";

/* ─── Hero Section with Video Background ─── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Parallax */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 -top-20 -bottom-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={IMAGES.turfFacility}
          className="w-full h-full object-cover"
        >
          <source src={VIDEOS.cricketHero} type="video/mp4" />
        </video>
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        {/* Orange accent glow */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-hg-blue/8 rounded-full blur-[120px]" />
      </motion.div>

      <motion.div style={{ y: textY, opacity }} className="container relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Location badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-sans font-medium text-primary">Kandivali East, Mumbai</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-[0.9] mb-6 tracking-wider"
          >
            WHERE MUMBAI
            <br />
            <span className="text-gradient-warm">PLAYS</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl font-sans text-foreground/70 mb-10 max-w-2xl leading-relaxed"
          >
            Cricket, Football, Badminton & Box Cricket — all under one roof.
            Coached by IPL legend <span className="text-primary font-semibold">Paul Valthaty</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/book">
              <Button size="lg" className="bg-primary text-primary-foreground glow-primary font-sans font-bold text-base px-10 h-14 rounded-xl hover:scale-105 transition-all duration-300 group">
                BOOK A TURF
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#sports">
              <Button size="lg" variant="outline" className="font-sans font-semibold text-base h-14 px-10 rounded-xl border-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <Play className="mr-2 h-4 w-4" />
                EXPLORE SPORTS
              </Button>
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          >
            {STATS.map((stat, i) => {
              const icons = [Users, Star, Trophy, Award];
              const Icon = icons[i] || Trophy;
              return (
                <div key={i} className="group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-heading text-foreground tracking-wider">{stat.value}</div>
                      <div className="text-xs font-sans text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Scrolling Social Proof Marquee ─── */
function SocialProofBar() {
  const items = [
    { icon: Trophy, text: "IPL Legend Paul Valthaty" },
    { icon: Star, text: "4.5/5 on CricHeroes" },
    { icon: Users, text: "500+ Players Weekly" },
    { icon: Clock, text: "Open 6 AM - 11 PM" },
    { icon: Zap, text: "Instant Booking" },
    { icon: MapPin, text: "Kandivali East, Mumbai" },
  ];

  return (
    <section className="relative border-y border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden py-4">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-8 whitespace-nowrap">
            <item.icon className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-sans font-medium text-muted-foreground">{item.text}</span>
            <span className="text-primary/30 mx-4">|</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Sports Section with Glowing Cards ─── */
function SportsSection() {
  return (
    <section id="sports" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hg-blue/5 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-4">Choose Your Game</span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5">OUR SPORTS</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto">
            From cricket nets to badminton courts — world-class facilities for every athlete.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPORTS.map((sport, i) => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <Link href={`/book?sport=${sport.id}`}>
                <div className="sport-card relative group rounded-2xl overflow-hidden cursor-pointer h-full" style={{ background: sport.bgGlow }}>
                  {/* Glow effect on hover */}
                  <div className="sport-card-glow absolute inset-0 rounded-2xl" style={{ boxShadow: `0 0 40px ${sport.bgGlow}, 0 0 80px ${sport.bgGlow}` }} />

                  <div className="relative glass-card rounded-2xl p-7 h-full border-gradient">
                    <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-500">{sport.icon}</div>
                    <h3 className="font-heading text-2xl tracking-wider mb-2 text-foreground">{sport.name}</h3>
                    <p className="text-sm font-sans text-muted-foreground mb-5 leading-relaxed">{sport.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-sans font-bold text-primary">From ₹{sport.priceFrom}/hr</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                        <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Academy CTAs */}
        <div id="academies" className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/academy/cricket">
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-hg-orange/15 to-transparent" />
                <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-hg-orange/20 hover:border-hg-orange/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                    <img src={IMAGES.paulCoaching} alt="Paul Valthaty" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl tracking-wider text-foreground">PAUL VALTHATY CRICKET ACADEMY</h3>
                    <p className="text-sm font-sans text-primary">Train with an IPL legend</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/academy/badminton">
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-hg-lime/15 to-transparent" />
                <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-hg-lime/20 hover:border-hg-lime/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-hg-lime/20 flex items-center justify-center shrink-0">
                    <span className="text-3xl">🏸</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl tracking-wider text-foreground">HOME SHUTTLERS BADMINTON ACADEMY</h3>
                    <p className="text-sm font-sans text-hg-lime">Smash your limits</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-hg-lime group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Origin Story Section ─── */
function OriginStorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section id="story" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-4">{ORIGIN_STORY.subtitle}</span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-10">{ORIGIN_STORY.title.toUpperCase()}</h2>
            {ORIGIN_STORY.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-muted-foreground font-sans mb-5 leading-relaxed"
              >
                {p}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            style={{ y: imageY }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-border/30">
              <img src={IMAGES.turfNight} alt="HomeGround Turf at Night" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="glass-card-bright rounded-2xl p-5">
                  <p className="font-heading text-xl tracking-wider text-foreground">HOMEGROUND SPORTS COMPLEX</p>
                  <p className="text-sm font-sans text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-primary" /> Kandivali East, Mumbai
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl border-2 border-primary/20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl border-2 border-hg-blue/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Founders Section ─── */
function FoundersSection() {
  const colorMap: Record<string, string> = {
    "hg-orange": "oklch(0.75 0.18 55)",
    "hg-blue": "oklch(0.65 0.2 240)",
    "hg-red": "oklch(0.6 0.22 25)",
    "hg-lime": "oklch(0.8 0.2 125)",
  };

  return (
    <section id="founders" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-hg-orange/5 rounded-full blur-[150px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-4">The Team</span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5">MEET THE FOUNDERS</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto">
            United by a love for sports and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUNDERS.map((founder, i) => {
            const accentColor = colorMap[founder.color] || colorMap["hg-orange"];
            return (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <div className="group relative rounded-2xl overflow-hidden h-full">
                  <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/20 transition-all duration-500">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-5">
                      {founder.image ? (
                        <img src={founder.image} alt={founder.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-3xl font-heading font-normal tracking-wider"
                          style={{ background: `${accentColor}`, color: 'oklch(0.12 0.01 55)' }}
                        >
                          {founder.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      {/* Color accent dot */}
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card"
                        style={{ background: accentColor }}
                      />
                    </div>

                    <h3 className="font-heading text-xl tracking-wider text-center text-foreground">{founder.name.toUpperCase()}</h3>
                    <p className="text-sm font-sans text-center mb-4" style={{ color: accentColor }}>{founder.role}</p>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed text-center">{founder.bio}</p>

                    {founder.highlights.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-5">
                        {founder.highlights.slice(0, 3).map(h => (
                          <span
                            key={h}
                            className="text-xs font-sans px-3 py-1 rounded-full"
                            style={{ background: `color-mix(in oklch, ${accentColor} 15%, transparent)`, color: accentColor }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-hg-blue/5 rounded-full blur-[150px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-4">Reviews</span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5">WHAT PLAYERS SAY</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto">
            Real reviews from CricHeroes, JustDial, BookMyPlayer, and Google.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/20 transition-all duration-500 group">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < Math.floor(t.rating) ? 'text-yellow-400 fill-yellow-400' : j < t.rating ? 'text-yellow-400 fill-yellow-400/50' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm font-sans text-foreground/80 mb-6 leading-relaxed">
                  <span className="text-primary text-2xl font-heading leading-none">&ldquo;</span>
                  {t.text}
                  <span className="text-primary text-2xl font-heading leading-none">&rdquo;</span>
                </p>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div>
                    <p className="text-sm font-sans font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs font-sans text-muted-foreground">{t.sport}</p>
                  </div>
                  <span className="text-xs font-sans font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{t.source}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section ─── */
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
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-4">Get in Touch</span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5">CONTACT US</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto">
            Have questions? Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name *" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50 transition-colors" />
                <Input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50 transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Phone" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50 transition-colors" />
                <Input placeholder="Subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50 transition-colors" />
              </div>
              <Textarea placeholder="Your Message *" rows={5} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="bg-card/50 border-border/50 rounded-xl font-sans focus:border-primary/50 transition-colors" />
              <Button type="submit" className="w-full bg-primary text-primary-foreground glow-primary font-sans font-bold h-12 rounded-xl hover:scale-[1.02] transition-all duration-300" disabled={contactMutation.isPending}>
                {contactMutation.isPending ? "Sending..." : "SEND MESSAGE"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card rounded-2xl p-8 h-full">
              <div className="space-y-7">
                <div>
                  <h3 className="font-heading text-xl tracking-wider mb-4 text-foreground">VISIT US</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-medium text-foreground">HomeGround Sports</p>
                      <p className="text-sm font-sans text-muted-foreground">Opp. Dream Park, Kandivali East, Mumbai 400101</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-xl tracking-wider mb-4 text-foreground">CALL US</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <a href="tel:+919082210021" className="text-sm font-sans font-medium hover:text-primary transition-colors">+91 90822 10021</a>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-xl tracking-wider mb-4 text-foreground">HOURS</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-medium text-foreground">Monday - Sunday</p>
                      <p className="text-sm font-sans text-muted-foreground">6:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  {WHATSAPP_URL && (
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full border-green-500/40 text-green-400 hover:bg-green-500/10 h-12 rounded-xl font-sans">
                        Chat on WhatsApp
                      </Button>
                    </a>
                  )}
                  <Link href="/book">
                    <Button className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-sans font-semibold">
                      Book a Turf Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={IMAGES.turfCover} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl tracking-wider mb-5">READY TO PLAY?</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto mb-10 text-lg">
            Book your turf in under 60 seconds. No calls, no waiting — just instant confirmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="bg-primary text-primary-foreground glow-primary font-sans font-bold text-base px-10 h-14 rounded-xl hover:scale-105 transition-all duration-300 group">
                BOOK NOW
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-sans font-semibold text-base h-14 px-10 rounded-xl">
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

/* ─── Main Page ─── */
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
