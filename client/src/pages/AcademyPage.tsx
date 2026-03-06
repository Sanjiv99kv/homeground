import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACADEMY_DATA, IMAGES, WHATSAPP_URL } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Trophy, Clock, Users, Star, CheckCircle, GraduationCap, MapPin, Phone, ChevronRight, ArrowRight, Zap, Target, Shield, Award } from "lucide-react";

/* ─── Gallery Images Config ─── */
const GALLERY = {
  cricket: [
    { src: IMAGES.paulCoaching, label: "Paul Valthaty Coaching" },
    { src: IMAGES.cricketTurfNight, label: "Night Turf Session" },
    { src: IMAGES.cricketNets, label: "Net Practice" },
    { src: IMAGES.cricketCoaching, label: "Coaching Session" },
    { src: IMAGES.cricketDrive, label: "Batting Technique" },
    { src: IMAGES.turfNight, label: "HomeGround Turf" },
  ],
  badminton: [
    { src: IMAGES.badmintonCourt, label: "Professional Courts" },
    { src: IMAGES.badmintonCourtGreen, label: "Multi-Court Facility" },
    { src: IMAGES.badmintonSmash, label: "Smash Training" },
    { src: IMAGES.badmintonPlayer, label: "Player Action" },
    { src: IMAGES.turfFacility, label: "HomeGround Facility" },
    { src: IMAGES.badmintonCourt, label: "Court Overview" },
  ],
};

const HERO_IMAGES = {
  cricket: IMAGES.cricketTurfNight,
  badminton: IMAGES.badmintonCourt,
};

const ACCENT_COLORS = {
  cricket: { primary: "oklch(0.75 0.18 55)", glow: "oklch(0.75 0.18 55 / 20%)", badge: "text-primary border-primary/50" },
  badminton: { primary: "oklch(0.8 0.2 125)", glow: "oklch(0.8 0.2 125 / 20%)", badge: "text-hg-lime border-hg-lime/50" },
};

export default function AcademyPage() {
  const params = useParams<{ sport: string }>();
  const sport = params.sport as "cricket" | "badminton";
  const academy = ACADEMY_DATA[sport];
  const accent = ACCENT_COLORS[sport] || ACCENT_COLORS.cricket;
  const gallery = GALLERY[sport] || GALLERY.cricket;
  const heroImage = HERO_IMAGES[sport] || HERO_IMAGES.cricket;

  const [formData, setFormData] = useState({
    studentName: "", studentAge: "", phone: "", email: "", level: "beginner", message: "",
  });

  const enrollMutation = trpc.academy.enroll.useMutation({
    onSuccess: () => {
      toast.success("Enrollment request submitted! We'll contact you soon.");
      setFormData({ studentName: "", studentAge: "", phone: "", email: "", level: "beginner", message: "" });
    },
    onError: () => toast.error("Failed to submit. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) { toast.error("Student name and phone are required"); return; }
    enrollMutation.mutate({
      academy: sport,
      studentName: formData.studentName,
      studentAge: formData.studentAge ? parseInt(formData.studentAge) : undefined,
      phone: formData.phone,
      email: formData.email || undefined,
      level: formData.level as any,
      message: formData.message || undefined,
    });
  };

  if (!academy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl mb-4">Academy Not Found</h1>
          <Link href="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const isCricket = sport === "cricket";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ─── Hero Section with Full-Width Image ─── */}
      <HeroSection
        academy={academy}
        heroImage={heroImage}
        isCricket={isCricket}
        accent={accent}
      />

      {/* ─── Image Gallery ─── */}
      <GallerySection gallery={gallery} isCricket={isCricket} />

      {/* ─── Head Coach / Coaching Team ─── */}
      <CoachSection academy={academy} isCricket={isCricket} accent={accent} />

      {/* ─── Programs ─── */}
      <ProgramsSection academy={academy} isCricket={isCricket} accent={accent} />

      {/* ─── Features ─── */}
      <FeaturesSection academy={academy} isCricket={isCricket} />

      {/* ─── Enrollment Form ─── */}
      <EnrollSection
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isPending={enrollMutation.isPending}
        isCricket={isCricket}
      />

      {/* ─── CTA Section ─── */}
      <CTASection isCricket={isCricket} />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

/* ─── Hero Section ─── */
function HeroSection({ academy, heroImage, isCricket, accent }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.85]);

  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-end overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <img src={heroImage} alt={academy.name} className="w-full h-full object-cover" />
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {/* Color accent overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 30% 70%, ${accent.glow} 0%, transparent 70%)` }}
        />
      </motion.div>

      {/* Floating sport elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { emoji: isCricket ? "🏏" : "🏸", top: "20%", left: "5%", delay: 0 },
          { emoji: isCricket ? "🏆" : "🎯", top: "15%", right: "10%", delay: 1.5 },
          { emoji: "⭐", bottom: "30%", right: "5%", delay: 0.8 },
        ].map((el, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-15 hidden lg:block"
            style={{ top: el.top, left: el.left, right: el.right, bottom: el.bottom }}
            animate={{ y: [0, -20, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6, delay: el.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {el.emoji}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ y: textY }} className="container relative z-10 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 text-foreground/60 hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Home
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md mb-6"
        >
          <span className="text-lg">{isCricket ? "🏏" : "🏸"}</span>
          <span className="text-sm font-sans font-semibold text-primary">Academy</span>
        </motion.div>

        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider leading-[0.9]"
          >
            {academy.name.toUpperCase()}
          </motion.h1>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-1 w-24 sm:w-36 rounded-full origin-left mb-6"
          style={{ background: `linear-gradient(90deg, ${accent.primary}, transparent)` }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl sm:text-2xl font-sans mb-3"
          style={{ color: accent.primary }}
        >
          {academy.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-muted-foreground font-sans max-w-2xl text-lg leading-relaxed mb-8"
        >
          {academy.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a href="#enroll">
            <Button size="lg" className="bg-primary text-primary-foreground font-sans font-bold px-10 h-14 rounded-2xl hover:scale-105 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                ENROLL NOW <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </a>
          <a href="#programs">
            <Button size="lg" variant="outline" className="font-sans font-semibold h-14 px-8 rounded-2xl border-foreground/20 hover:border-primary/50 backdrop-blur-sm">
              VIEW PROGRAMS
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[3]" />
    </section>
  );
}

/* ─── Image Gallery Section ─── */
function GallerySection({ gallery, isCricket }: { gallery: { src: string; label: string }[]; isCricket: boolean }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-3">Gallery</span>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-wider mb-3">OUR FACILITY</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-blue mx-auto rounded-full" />
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {gallery.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => setSelectedImage(i)}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-[300px] sm:h-[400px] md:h-full' : 'h-[180px] sm:h-[220px]'}`}>
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <p className="text-sm font-sans font-medium text-foreground">{img.label}</p>
                </div>
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full"
            >
              <img
                src={gallery[selectedImage].src}
                alt={gallery[selectedImage].label}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <p className="text-center mt-4 font-sans text-foreground/80">{gallery[selectedImage].label}</p>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-foreground/60 hover:text-foreground text-lg font-sans"
              >
                Close &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─── Coach Section ─── */
function CoachSection({ academy, isCricket, accent }: any) {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-card/40" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[180px] -translate-y-1/2"
        style={{ background: accent.glow }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 mb-6">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-sans font-semibold text-primary">
                    {isCricket ? "Head Coach" : "Coaching Team"}
                  </span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wider mb-2">
                  {academy.headCoach.name.toUpperCase()}
                </h2>
                <p className="text-lg font-sans mb-6" style={{ color: accent.primary }}>
                  {academy.headCoach.role}
                </p>
                <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                  {academy.headCoach.bio}
                </p>

                {academy.headCoach.highlights && academy.headCoach.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {academy.headCoach.highlights.map((h: string) => (
                      <motion.span
                        key={h}
                        whileHover={{ scale: 1.05 }}
                        className="text-xs font-sans px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {h}
                      </motion.span>
                    ))}
                  </div>
                )}

                <a href="#enroll">
                  <Button className="bg-primary text-primary-foreground font-sans font-semibold rounded-xl hover:scale-105 transition-all duration-300 group">
                    Train With {isCricket ? "Paul" : "Our Coaches"}
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {academy.headCoach.image ? (
                <div className="relative rounded-3xl overflow-hidden group">
                  <img
                    src={academy.headCoach.image}
                    alt={academy.headCoach.name}
                    className="w-full h-[400px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  {/* Decorative border */}
                  <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl border-2 -z-10" style={{ borderColor: `${accent.primary}30` }} />
                  <div className="absolute -bottom-3 -left-3 w-full h-full rounded-3xl border-2 -z-10" style={{ borderColor: `${accent.primary}15` }} />
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden">
                  <img
                    src={isCricket ? IMAGES.cricketNets : IMAGES.badmintonSmash}
                    alt="Training"
                    className="w-full h-[400px] sm:h-[450px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl border-2 -z-10" style={{ borderColor: `${accent.primary}30` }} />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Programs Section ─── */
function ProgramsSection({ academy, isCricket, accent }: any) {
  return (
    <section id="programs" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-hg-blue/5 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-3">Programs</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wider mb-3">TRAINING PROGRAMS</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-blue mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground font-sans max-w-xl mx-auto">
            Choose the program that fits your schedule and skill level.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {academy.programs.map((program: any, i: number) => (
            <motion.div
              key={program.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <div className="group glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at center, ${accent.glow} 0%, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center"
                    >
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-heading text-xl tracking-wider text-foreground">{program.name.toUpperCase()}</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground font-sans">{program.schedule}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground font-sans">{program.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="font-heading text-2xl tracking-wider text-primary">{program.fee}</span>
                    <a href="#enroll">
                      <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 rounded-xl font-sans group/btn">
                        Enroll <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Section ─── */
function FeaturesSection({ academy, isCricket }: any) {
  const featureIcons = [CheckCircle, Star, Shield, Zap, Target, Award, Trophy, Users];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-card/40" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-3">Benefits</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wider mb-3">WHAT YOU GET</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-lime mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {academy.features.map((feature: string, i: number) => {
            const Icon = featureIcons[i % featureIcons.length];
            return (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card rounded-2xl p-4 text-center group cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                >
                  <Icon className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="text-sm font-sans text-foreground/80">{feature}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Enrollment Form Section ─── */
function EnrollSection({ formData, setFormData, handleSubmit, isPending, isCricket }: any) {
  return (
    <section id="enroll" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-sans font-semibold text-primary uppercase tracking-[0.2em] mb-3">Join Us</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wider mb-3">ENROLL NOW</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-red mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground font-sans">Fill in the details and we'll get back to you within 24 hours.</p>
          </div>

          <div className="glass-card rounded-3xl p-8 border-gradient">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Student Name *" value={formData.studentName} onChange={(e: any) => setFormData((p: any) => ({ ...p, studentName: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
                <Input placeholder="Age" type="number" value={formData.studentAge} onChange={(e: any) => setFormData((p: any) => ({ ...p, studentAge: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Phone Number *" value={formData.phone} onChange={(e: any) => setFormData((p: any) => ({ ...p, phone: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
                <Input placeholder="Email" type="email" value={formData.email} onChange={(e: any) => setFormData((p: any) => ({ ...p, email: e.target.value }))} className="bg-card/50 border-border/50 h-12 rounded-xl font-sans focus:border-primary/50" />
              </div>
              <Select value={formData.level} onValueChange={(v: string) => setFormData((p: any) => ({ ...p, level: v }))}>
                <SelectTrigger className="bg-card/50 border-border/50 h-12 rounded-xl font-sans">
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Any message or questions?" rows={3} value={formData.message} onChange={(e: any) => setFormData((p: any) => ({ ...p, message: e.target.value }))} className="bg-card/50 border-border/50 rounded-xl font-sans focus:border-primary/50" />
              <Button type="submit" className="w-full bg-primary text-primary-foreground glow-primary font-sans font-bold h-14 rounded-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group" disabled={isPending}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative text-base">{isPending ? "Submitting..." : "SUBMIT ENROLLMENT"}</span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection({ isCricket }: { isCricket: boolean }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={isCricket ? IMAGES.turfNight : IMAGES.badmintonCourt}
          alt=""
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background" />
      </div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[180px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4">
            {isCricket ? "TRAIN LIKE A PRO" : "SMASH YOUR LIMITS"}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-hg-blue mx-auto rounded-full mb-5" />
          <p className="text-muted-foreground font-sans max-w-lg mx-auto mb-8 text-lg">
            {isCricket
              ? "Join the Paul Valthaty Cricket Academy and take your game to the next level."
              : "Join Home Shuttlers Badminton Academy and unlock your full potential."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#enroll">
              <Button size="lg" className="bg-primary text-primary-foreground font-sans font-bold px-10 h-14 rounded-2xl hover:scale-105 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  ENROLL NOW <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </a>
            <Link href="/book">
              <Button size="lg" variant="outline" className="font-sans font-semibold h-14 px-8 rounded-2xl border-foreground/20 hover:border-primary/50">
                BOOK A TURF
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
