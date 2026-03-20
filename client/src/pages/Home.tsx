import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGES, VIDEOS, FOUNDERS, SPORTS, TESTIMONIALS, ORIGIN_STORY, STATS, WHATSAPP_URL } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Star, MapPin, Phone, ArrowRight, ChevronRight, Trophy, Users, Zap, Clock, Award, Play, Target, Shield } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

/* ─── Floating Cricket Elements ─── */
function FloatingElements() {
  const elements = [
    { emoji: "🏏", size: "text-4xl", top: "15%", left: "5%", delay: 0, duration: 7 },
    { emoji: "🏐", size: "text-3xl", top: "25%", right: "8%", delay: 1, duration: 5 },
    { emoji: "🏸", size: "text-3xl", bottom: "30%", left: "8%", delay: 2, duration: 6 },
    { emoji: "⚽", size: "text-4xl", bottom: "20%", right: "5%", delay: 0.5, duration: 8 },
    { emoji: "🎯", size: "text-2xl", top: "45%", left: "3%", delay: 1.5, duration: 5.5 },
    { emoji: "🏆", size: "text-3xl", top: "10%", right: "15%", delay: 2.5, duration: 6.5 },
  ];

  return (
    <>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.size} pointer-events-none z-[2] opacity-20 hidden lg:block`}
          style={{ top: el.top, left: el.left, right: el.right, bottom: el.bottom }}
          animate={{
            y: [0, -25, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </>
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const numericPart = value.replace(/[^0-9.]/g, '');
  const prefix = value.replace(/[0-9.+]/g, '').trim();
  const hasPlus = value.includes('+');
  const num = parseFloat(numericPart) || 0;
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, num]);

  return (
    <span ref={ref}>
      {prefix}{inView ? (num % 1 === 0 ? count : count.toFixed(1)) : '0'}{hasPlus ? '+' : ''}{suffix}
    </span>
  );
}

/* ─── Hero Section with Cricket Video Background ─── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Video Background with Parallax */}
      <motion.div style={{ y: videoY, scale }} className="absolute inset-0 -top-20 -bottom-20">
        {/* Poster image while video loads */}
        <img
          src={IMAGES.turfNight}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={VIDEOS.cricketNight} type="video/mp4" />
        </video>

        {/* Multi-layer cinematic overlay */}
        <div className="video-overlay-sporty" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.08_0.015_250/70%)_100%)]" />
      </motion.div>

      {/* Floating sports elements */}
      <FloatingElements />

      {/* Animated light rays */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-hg-blue/15 via-hg-blue/5 to-transparent"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Orange accent glow orbs */}
      <motion.div
        className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-primary/12 rounded-full blur-[180px] z-[1]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-hg-blue/8 rounded-full blur-[150px] z-[1]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main Content */}
      <motion.div style={{ y: textY, opacity }} className="container relative z-10 pt-28 pb-20">
        <div className="max-w-5xl">
          {/* Location badge with pulse */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "backOut" }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md mb-8">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-sans font-semibold text-primary tracking-wide">Kandivali East, Mumbai</span>
              <span className="text-xs font-sans text-primary/60">•</span>
              <span className="text-xs font-sans text-primary/80">Open Now</span>
            </div>
          </motion.div>

          {/* Main heading with staggered reveal */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-normal leading-[0.85] tracking-wider"
            >
              YOUR HOME
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-normal leading-[0.85] tracking-wider"
            >
              <span className="text-gradient-warm">GROUND</span>
            </motion.h1>
          </div>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-1 w-32 sm:w-48 bg-gradient-to-r from-primary via-hg-red to-hg-blue rounded-full origin-left mb-8"
          />

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl font-sans text-foreground/70 mb-12 max-w-2xl leading-relaxed"
          >
            Cricket • Football • Badminton • Pickleball — all under one roof.{" "}
            <br className="hidden sm:block" />
            Coached by IPL legend <span className="text-primary font-bold">Paul Valthaty</span>.
          </motion.p>

          {/* CTA Buttons with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/book">
              <Button size="lg" className="relative bg-primary text-primary-foreground font-sans font-bold text-base px-12 h-16 rounded-2xl hover:scale-105 transition-all duration-300 group overflow-hidden">
                {/* Shimmer effect on button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  BOOK A TURF
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <a href="#sports">
              <Button size="lg" variant="outline" className="font-sans font-semibold text-base h-16 px-10 rounded-2xl border-foreground/20 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300 group">
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                EXPLORE SPORTS
              </Button>
            </a>
          </motion.div>

          {/* Stats Row with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10"
          >
            {STATS.map((stat, i) => {
              const icons = [Users, Star, Trophy, Award];
              const colors = ["text-primary", "text-yellow-400", "text-hg-blue", "text-hg-lime"];
              const bgColors = ["bg-primary/10", "bg-yellow-400/10", "bg-hg-blue/10", "bg-hg-lime/10"];
              const Icon = icons[i] || Trophy;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`w-12 h-12 rounded-2xl ${bgColors[i]} flex items-center justify-center backdrop-blur-sm border border-white/5`}
                    >
                      <Icon className={`h-5 w-5 ${colors[i]}`} />
                    </motion.div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-heading text-foreground tracking-wider">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-xs font-sans text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator with bounce */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-sans text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />
    </section>
  );
}

/* ─── Scrolling Social Proof Marquee ─── */
function SocialProofBar() {
  const items = [
    { icon: Trophy, text: "IPL Legend Paul Valthaty", color: "text-primary" },
    { icon: Star, text: "4.5/5 on CricHeroes", color: "text-yellow-400" },
    { icon: Users, text: "500+ Players Weekly", color: "text-hg-blue" },
    { icon: Clock, text: "Open 6 AM - 11 PM", color: "text-hg-lime" },
    { icon: Zap, text: "Instant Booking", color: "text-primary" },
    { icon: MapPin, text: "Kandivali East, Mumbai", color: "text-hg-red" },
    { icon: Shield, text: "Professional Coaching", color: "text-hg-blue" },
    { icon: Target, text: "4 Sports Under One Roof", color: "text-primary" },
  ];

  const renderItems = (keyPrefix: string) =>
    items.map((item, i) => (
      <div key={`${keyPrefix}-${i}`} className="flex items-center gap-3 shrink-0 px-6">
        <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
        <span className="text-sm font-sans font-medium text-foreground/80 whitespace-nowrap">{item.text}</span>
        <span className="text-primary/30 ml-6">◆</span>
      </div>
    ));

  return (
    <section className="relative border-y border-primary/10 bg-card/40 backdrop-blur-md overflow-hidden py-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-hg-blue/3" />
      <div className="marquee-track">
        {renderItems('a')}
        {renderItems('b')}
      </div>
    </section>
  );
}

/* ─── Sports Section with Glowing Cards ─── */
function SportsSection() {
  const [, setLocation] = useLocation();
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
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-hg-red mx-auto rounded-full mb-5" />
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
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setLocation(`/book?sport=${sport.id}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setLocation(`/book?sport=${sport.id}`);
                  }
                }}
                className="sport-card relative group rounded-2xl overflow-hidden cursor-pointer h-full"
                style={{ background: sport.bgGlow, ["--sport-accent" as string]: sport.accentColor }}
              >
                {/* Single-color glow matching the card */}
                <div
                  className="sport-card-glow absolute inset-0 rounded-2xl"
                  style={{ boxShadow: `0 0 40px ${sport.accentGlow}, 0 0 80px ${sport.accentGlow}` }}
                />

                <div
                  className="relative glass-card rounded-2xl p-7 h-full sport-card-border"
                  style={{ ["--sport-accent" as string]: sport.accentColor }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-5xl mb-5"
                  >
                    {sport.icon}
                  </motion.div>
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
            <div
              role="button"
              tabIndex={0}
              onClick={() => setLocation("/academy/cricket")}
              onKeyDown={(e) => e.key === "Enter" && setLocation("/academy/cricket")}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => setLocation("/academy/badminton")}
              onKeyDown={(e) => e.key === "Enter" && setLocation("/academy/badminton")}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-hg-lime/15 to-transparent" />
              <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-hg-lime/20 hover:border-hg-lime/40 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-hg-lime/30">
                  <img src={IMAGES.badmintonCoachTeam} alt="Home Shuttlers Coaching Team" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-xl tracking-wider text-foreground">HOME SHUTTLERS BADMINTON ACADEMY</h3>
                  <p className="text-sm font-sans text-hg-lime">Smash your limits</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-hg-lime group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
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
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4">{ORIGIN_STORY.title.toUpperCase()}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-hg-blue rounded-full mb-10" />
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
              <img src={IMAGES.cricketDaylight} alt="Cricket Practice in Daylight at HomeGround" className="w-full h-[500px] object-cover" />
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
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-hg-blue/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-hg-orange/5 rounded-full blur-[150px]" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-4">The Visionaries</span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-5">THE PEOPLE BEHIND<br/>THE PLAYGROUND</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-hg-blue via-primary to-hg-red mx-auto rounded-full mb-5" />
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto text-base leading-relaxed">
            Three individuals. One shared dream. They didn't just build a sports facility — they built a community where champions are made, friendships are forged, and every player finds their home ground.
          </p>
        </motion.div>

        {/* Group Photo Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-20 max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden group">
            {/* Gradient border glow */}
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-hg-blue via-primary to-hg-red opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={IMAGES.foundersGroup}
                alt="Sparsh Tangri, Archana Tangri, and Rahul Tangri — Co-Founders of HomeGround"
                className="w-full h-[350px] sm:h-[450px] md:h-[550px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              {/* Names overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
                  {FOUNDERS.map((f, i) => (
                    <motion.div
                      key={f.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                      className="text-center"
                    >
                      <p className="font-heading text-lg sm:text-xl tracking-wider text-foreground">{f.name.toUpperCase()}</p>
                      <p className="text-xs sm:text-sm font-sans" style={{ color: colorMap[f.color] }}>{f.role}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Individual Founder Cards — Luxury Layout */}
        <div className="space-y-16">
          {FOUNDERS.map((founder, i) => {
            const accentColor = colorMap[founder.color] || colorMap["hg-orange"];
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-14`}
              >
                {/* Left: Large initial + accent */}
                <div className="flex-shrink-0 relative">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: isEven ? 3 : -3 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, color-mix(in oklch, ${accentColor} 60%, oklch(0.2 0 0)))` }}
                  >
                    {founder.image ? (
                      <img src={founder.image} alt={founder.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-heading text-5xl sm:text-6xl tracking-wider text-white/90 drop-shadow-lg">
                          {founder.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.div>
                  {/* Decorative ring */}
                  <div
                    className="absolute -inset-3 rounded-3xl border-2 opacity-20"
                    style={{ borderColor: accentColor }}
                  />
                </div>

                {/* Right: Content */}
                <div className={`flex-1 min-w-0 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}>
                  <div className={`flex ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center mb-3`}>
                    <div className="inline-flex items-center gap-2">
                      <div className="w-8 h-[2px] rounded-full" style={{ background: accentColor }} />
                      <span className="text-xs font-sans font-semibold uppercase tracking-[0.15em]" style={{ color: accentColor }}>
                        {founder.role}
                      </span>
                      <div className="w-8 h-[2px] rounded-full" style={{ background: accentColor }} />
                    </div>
                  </div>
                  <h3 className="font-heading text-3xl sm:text-4xl tracking-wider text-foreground mb-4">
                    {founder.name.toUpperCase()}
                  </h3>
                  <p className="text-base font-sans text-muted-foreground leading-relaxed mb-6">
                    {founder.bio}
                  </p>
                  <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                    {founder.highlights.map(h => (
                      <span
                        key={h}
                        className="text-xs font-sans font-medium px-4 py-1.5 rounded-full border transition-all duration-300 hover:scale-105"
                        style={{
                          background: `color-mix(in oklch, ${accentColor} 10%, transparent)`,
                          borderColor: `color-mix(in oklch, ${accentColor} 30%, transparent)`,
                          color: accentColor,
                        }}
                      >
                        {h}
                      </span>
                    ))}
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
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-primary mx-auto rounded-full mb-5" />
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
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-hg-lime mx-auto rounded-full mb-5" />
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
              <Button type="submit" className="w-full bg-primary text-primary-foreground glow-primary font-sans font-bold h-12 rounded-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group" disabled={contactMutation.isPending}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">{contactMutation.isPending ? "Sending..." : "SEND MESSAGE"}</span>
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
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover opacity-15"
        >
          <source src={VIDEOS.sportsAction} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>
      {/* Accent glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl tracking-wider mb-5">READY TO PLAY?</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-hg-blue mx-auto rounded-full mb-5" />
          <p className="text-muted-foreground font-sans max-w-xl mx-auto mb-10 text-lg">
            Book your turf in under 60 seconds. No calls, no waiting — just instant confirmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="relative bg-primary text-primary-foreground font-sans font-bold text-base px-12 h-16 rounded-2xl hover:scale-105 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  BOOK NOW
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Button>
            </Link>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-green-500/40 text-green-400 hover:bg-green-500/10 font-sans font-semibold text-base h-16 px-10 rounded-2xl">
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
