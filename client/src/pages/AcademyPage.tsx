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
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Clock, Users, Star, CheckCircle, GraduationCap } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function AcademyPage() {
  const params = useParams<{ sport: string }>();
  const sport = params.sport as "cricket" | "badminton";
  const academy = ACADEMY_DATA[sport];

  const [formData, setFormData] = useState({
    studentName: "",
    studentAge: "",
    phone: "",
    email: "",
    level: "beginner",
    message: "",
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
    if (!formData.studentName || !formData.phone) {
      toast.error("Student name and phone are required");
      return;
    }
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
          <h1 className="font-heading text-2xl font-bold mb-4">Academy Not Found</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCricket = sport === "cricket";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          {isCricket && <img src={IMAGES.paulCoaching} alt="Academy" className="w-full h-full object-cover opacity-15" />}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />
        </div>
        <div className="container relative z-10">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Button>
          </Link>
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            {isCricket ? "🏏" : "🏸"} Academy
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{academy.name}</h1>
          <p className="text-xl text-primary font-medium mb-4">{academy.tagline}</p>
          <p className="text-muted-foreground max-w-2xl text-lg">{academy.description}</p>
        </div>
      </section>

      {/* Head Coach */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <motion.div {...fadeInUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
                  <Trophy className="h-3 w-3 mr-1" /> {isCricket ? "Head Coach" : "Coaching Team"}
                </Badge>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">{academy.headCoach.name}</h2>
                <p className="text-sm text-primary mb-3">{academy.headCoach.role}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{academy.headCoach.bio}</p>
                {academy.headCoach.highlights && academy.headCoach.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {academy.headCoach.highlights.map(h => (
                      <Badge key={h} variant="secondary">{h}</Badge>
                    ))}
                  </div>
                )}
              </div>
              {academy.headCoach.image && (
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <img src={academy.headCoach.image} alt={academy.headCoach.name} className="w-full h-[350px] object-cover" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              <GraduationCap className="h-3 w-3 mr-1" /> Programs
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Training Programs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose the program that fits your schedule and skill level.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {academy.programs.map((program, i) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="border-border/50 hover:border-primary/30 transition-all h-full">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-3">{program.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{program.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{program.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xl text-primary">{program.fee}</span>
                      <a href="#enroll">
                        <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                          Enroll
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">What You Get</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {academy.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50"
              >
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      <section id="enroll" className="py-16">
        <div className="container max-w-2xl">
          <motion.div {...fadeInUp}>
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-2xl">Enroll Now</CardTitle>
                <p className="text-sm text-muted-foreground">Fill in the details and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Student Name *" value={formData.studentName} onChange={e => setFormData(p => ({ ...p, studentName: e.target.value }))} className="bg-background" />
                    <Input placeholder="Age" type="number" value={formData.studentAge} onChange={e => setFormData(p => ({ ...p, studentAge: e.target.value }))} className="bg-background" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Phone Number *" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-background" />
                    <Input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-background" />
                  </div>
                  <Select value={formData.level} onValueChange={v => setFormData(p => ({ ...p, level: v }))}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Skill Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Any message or questions?" rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="bg-background" />
                  <Button type="submit" className="w-full bg-primary text-primary-foreground glow-primary font-sans font-semibold" disabled={enrollMutation.isPending}>
                    {enrollMutation.isPending ? "Submitting..." : "Submit Enrollment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
