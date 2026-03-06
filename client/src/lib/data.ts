// CDN image URLs
export const IMAGES = {
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/homeground_official_logo_c714f159.jpeg",
  paulPortrait: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/paul_valthaty_portrait_07cdb9d9.jpg",
  paulIpl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/paul_valthaty_ipl_action_31682a5c.jpg",
  paulCoaching: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/paul_valthaty_coaching_0176bbd9.jpg",
  turfNight: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/turf_night_5526d0e2.jpg",
  turfFacility: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/homeground_turf_facility_3990d30d.jpg",
  turfCover: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/homeground_turf_cover_652592f6.jpeg",
  // Badminton images
  badmintonCourt: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_court_pro_4b80998d.jpg",
  badmintonCourtGreen: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_court_green_c0d7d284.webp",
  badmintonSmash: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_smash_action_28d77c72.jpg",
  badmintonPlayer: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_player_action_6e32292b.jpg",
  // Cricket coaching images
  cricketTurfNight: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/cricket_turf_night_bce5c184.jpg",
  cricketNets: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/cricket_nets_practice_19aaa38a.jpg",
  cricketCoaching: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/cricket_coaching_session_c2b8a33f.jpg",
  cricketDrive: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/cricket_coaching_drive_4fc8d51d.jpg",
  // Real Home Shuttlers images from BookMyPlayer
  badmintonCoachTeam: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_coach_main_39794a64.jpg",
  badmintonGirlsTeam: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_court_main_c2c0a0d0.jpg",
  badmintonCoachFb: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_coach_fb_0e5bd2d7.jpg",
  // Founders
  foundersGroup: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/founders_group_photo_48b81685.png",
  cricketDaylight: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/cricket_daylight_practice_f581de01.jpeg",
  // Individual founder photos
  archanaPhoto: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/archana_tangri_photo_96052119.png",
  rahulPhoto: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/rahul_tangri_photo_477dbb31.png",
  sparshPhoto: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/sparsh_tangri_photo_0248a7b8.png",
};

// Free Pexels video URLs for hero backgrounds
export const VIDEOS = {
  cricketNight: "https://videos.pexels.com/video-files/11755921/11755921-hd_1920_1080_30fps.mp4",
  cricketHero: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
  sportsAction: "https://videos.pexels.com/video-files/3048163/3048163-uhd_2560_1440_25fps.mp4",
};

// WhatsApp number is configurable via VITE_WHATSAPP_NUMBER env variable
export const WHATSAPP_NUMBER = (import.meta as any).env?.VITE_WHATSAPP_NUMBER || "";
export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20HomeGround!%20I%27d%20like%20to%20know%20more%20about%20your%20services.`
  : "";

export const FOUNDERS = [
  {
    name: "Rahul Tangri",
    role: "Co-Founder & Digital Architect",
    image: IMAGES.rahulPhoto,
    bio: "The digital heartbeat of HomeGround. Rahul bridges the gap between grassroots sport and cutting-edge technology, building the platforms that let hundreds of players book, train, and compete every week. From the seamless booking engine to the social media presence that has made HomeGround go viral in Kandivali, Rahul ensures the brand lives as powerfully online as it does on the turf. His tech-first mindset keeps HomeGround ahead of every competitor.",
    highlights: ["Tech Innovation", "Platform Engineering", "Digital Strategy", "Social Media"],
    color: "hg-blue",
  },
  {
    name: "Archana Tangri",
    role: "Co-Founder & Business Strategist",
    image: IMAGES.archanaPhoto,
    bio: "The quiet force behind HomeGround's rapid ascent. Archana brings a rare combination of sharp financial acumen and deep empathy for the sporting community. She oversees the business strategy, financial planning, and the academy partnerships that have made HomeGround a household name. Her ability to see opportunity where others see obstacles has been instrumental in scaling from a neighbourhood turf to a multi-sport empire with two professional academies.",
    highlights: ["Financial Strategy", "Academy Partnerships", "Brand Building", "Growth Architecture"],
    color: "hg-red",
  },
  {
    name: "Sparsh Tangri",
    role: "Co-Founder & Visionary",
    image: IMAGES.sparshPhoto,
    bio: "A born entrepreneur with an unwavering belief that sport transforms lives. Sparsh envisioned HomeGround not as a business, but as a movement — a place where every child in Kandivali could access world-class facilities without travelling across Mumbai. He architects the operations, forges partnerships, and ensures that every square foot of turf delivers a premium experience. His relentless pursuit of excellence has turned a single cricket pitch into Mumbai's most talked-about multi-sport destination.",
    highlights: ["Strategic Vision", "Operations Excellence", "Community Builder", "Business Growth"],
    color: "hg-lime",
  },
];

export const SPORTS = [
  {
    id: "cricket",
    name: "Cricket",
    icon: "🏏",
    gradient: "from-[oklch(0.75_0.18_55)] to-[oklch(0.65_0.15_40)]",
    bgGlow: "oklch(0.75 0.18 55 / 15%)",
    description: "Premium cricket turf with professional-grade nets and floodlights",
    priceFrom: 1800,
  },
  {
    id: "football",
    name: "Football",
    icon: "⚽",
    gradient: "from-[oklch(0.65_0.2_240)] to-[oklch(0.55_0.18_220)]",
    bgGlow: "oklch(0.65 0.2 240 / 15%)",
    description: "Multi-purpose football turf supporting 5-a-side and 7-a-side",
    priceFrom: 1800,
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "🏸",
    gradient: "from-[oklch(0.8_0.2_125)] to-[oklch(0.7_0.18_110)]",
    bgGlow: "oklch(0.8 0.2 125 / 15%)",
    description: "Indoor courts at Home Shuttlers Academy with professional coaching",
    priceFrom: 400,
  },
  {
    id: "box_cricket",
    name: "Box Cricket",
    icon: "🥊",
    gradient: "from-[oklch(0.6_0.22_25)] to-[oklch(0.5_0.2_15)]",
    bgGlow: "oklch(0.6 0.22 25 / 15%)",
    description: "Enclosed box cricket arena for quick matches and corporate events",
    priceFrom: 1500,
  },
];

export const TESTIMONIALS = [
  {
    name: "Abhishek M.",
    source: "CricHeroes",
    rating: 5,
    text: "Best cricket turf in Kandivali! The nets are professional grade and the floodlights are excellent. Paul sir's coaching is world-class.",
    sport: "Cricket",
  },
  {
    name: "Priya S.",
    source: "JustDial",
    rating: 4.5,
    text: "Home Shuttlers is a fantastic badminton academy. Coaches are very patient and the court quality is top-notch. My kids love going there!",
    sport: "Badminton",
  },
  {
    name: "Rohan K.",
    source: "BookMyPlayer",
    rating: 5,
    text: "Booked the football turf for a corporate event. Everything was perfectly organized. The turf quality is amazing and staff is very helpful.",
    sport: "Football",
  },
  {
    name: "Sneha D.",
    source: "Google",
    rating: 4.5,
    text: "Great facility for box cricket. We had an amazing time. The booking process was smooth and the turf was well-maintained.",
    sport: "Box Cricket",
  },
  {
    name: "Vikram P.",
    source: "CricHeroes",
    rating: 5,
    text: "Training under Paul Valthaty is a dream come true. His IPL experience and coaching techniques have improved my game tremendously.",
    sport: "Cricket Academy",
  },
  {
    name: "Anita R.",
    source: "JustDial",
    rating: 4,
    text: "Very well-maintained badminton courts. The coaching staff is professional and the timings are flexible. Highly recommended!",
    sport: "Badminton",
  },
];

export const ORIGIN_STORY = {
  title: "Where Mumbai Plays",
  subtitle: "Our Story",
  paragraphs: [
    "HomeGround was born from a simple belief — every athlete deserves a world-class playing surface, right in their neighbourhood. In the heart of Kandivali East, Mumbai, we set out to build more than just a turf. We built a community.",
    "Co-founded by IPL cricketer Paul Valthaty, alongside Sparsh Tangri, Archana Tangri, and Rahul Tangri, HomeGround started as a single cricket turf and grew into a multi-sport destination offering cricket, football, badminton, and box cricket facilities.",
    "With the launch of the Paul Valthaty Cricket Academy and the Home Shuttlers Badminton Academy, HomeGround became a place where casual players and serious athletes alike could train, compete, and grow — all under one roof.",
    "Today, HomeGround is Kandivali's go-to sports hub, serving hundreds of players every week. Whether you're booking a turf for a weekend match or enrolling your child in professional coaching, HomeGround is where your game begins.",
  ],
};

export const ACADEMY_DATA = {
  cricket: {
    name: "Paul Valthaty Cricket Academy",
    tagline: "Train with an IPL Legend",
    description: "Founded by former IPL cricketer Paul Valthaty, this academy offers professional cricket coaching for all ages and skill levels. From batting technique to match strategy, learn from someone who has performed on the biggest stage.",
    headCoach: { name: "Paul Valthaty", role: "Head Coach & IPL Legend", image: IMAGES.paulPortrait, bio: "Former IPL cricketer who played for Kings XI Punjab. Scored a century against CSK in IPL 2011 — the first by a Punjab player. With 36 First-Class matches and 1,400+ runs, Paul now channels his elite experience into coaching the next generation.", highlights: ["IPL Century vs CSK (2011)", "36 First-Class Matches", "1,400+ Runs"], color: "hg-orange" },
    programs: [
      { name: "Junior Program (8-14 yrs)", schedule: "Mon, Wed, Fri — 4:00 PM to 6:00 PM", fee: "₹3,500/month", level: "Beginner to Intermediate" },
      { name: "Senior Program (15+ yrs)", schedule: "Tue, Thu, Sat — 6:00 PM to 8:00 PM", fee: "₹4,500/month", level: "Intermediate to Advanced" },
      { name: "Weekend Batch", schedule: "Sat & Sun — 7:00 AM to 9:00 AM", fee: "₹3,000/month", level: "All Levels" },
      { name: "Personal Coaching", schedule: "By Appointment", fee: "₹1,500/session", level: "Customized" },
    ],
    features: ["Professional-grade nets", "Video analysis sessions", "Fitness training", "Match simulation", "Mental conditioning", "Tournament preparation"],
  },
  badminton: {
    name: "Home Shuttlers Badminton Academy",
    tagline: "Smash Your Limits",
    description: "Located on the 4th Floor of Thakur Shyamnarayan School, Home Shuttlers offers professional badminton coaching with experienced coaches. Whether you're picking up a racket for the first time or training for tournaments, we have a program for you.",
    headCoach: { name: "Professional Coaching Team", role: "Certified BWF Coaches", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663374526873/QGLXtz8LbdZg3gRkE6by7h/badminton_coach_main_39794a64.jpg", bio: "Our team of certified coaches brings years of competitive and coaching experience to help you improve your game.", highlights: [], color: "hg-lime" },
    programs: [
      { name: "Kids Batch (6-12 yrs)", schedule: "Mon to Fri — 4:00 PM to 5:30 PM", fee: "₹2,500/month", level: "Beginner" },
      { name: "Teens Batch (13-17 yrs)", schedule: "Mon to Fri — 5:30 PM to 7:00 PM", fee: "₹3,000/month", level: "Beginner to Intermediate" },
      { name: "Adult Batch (18+ yrs)", schedule: "Mon, Wed, Fri — 7:00 PM to 8:30 PM", fee: "₹3,500/month", level: "All Levels" },
      { name: "Weekend Coaching", schedule: "Sat & Sun — 8:00 AM to 10:00 AM", fee: "₹2,000/month", level: "All Levels" },
    ],
    features: ["Indoor courts", "Professional equipment", "Footwork training", "Strategy sessions", "Tournament coaching", "Flexible timings"],
  },
};

export const STATS = [
  { value: "500+", label: "Players Weekly", icon: "users" },
  { value: "4.5★", label: "Average Rating", icon: "star" },
  { value: "5", label: "Sports Offered", icon: "trophy" },
  { value: "2", label: "Pro Academies", icon: "award" },
];
