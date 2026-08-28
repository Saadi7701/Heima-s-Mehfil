import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ChevronDown, Utensils, Clock, MapPin, Phone, ArrowRight } from 'lucide-react';
import logoVideo from '../assets/Creating_brand_animation_video_202608282145_202608282152.mp4';

// ─── Animation Variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
};

// ─── Data ──────────────────────────────────────────────────────────────
const featuredDishes = [
  { name: 'Saffron Mutton Biryani', tag: 'Chef\'s Signature', price: 'Rs 2,500', img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop', desc: 'Aromatic basmati with tender slow-cooked mutton & premium saffron' },
  { name: 'Reshmi Kebab', tag: 'Most Loved', price: 'Rs 1,200', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop', desc: 'Silky minced chicken grilled over charcoal to perfection' },
  { name: 'Nihari', tag: 'Heritage Dish', price: 'Rs 2,200', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop', desc: 'Slow-cooked overnight beef stew, garnished with ginger & green chilies' },
  { name: 'Chicken Karahi', tag: 'Crowd Favourite', price: 'Rs 1,900', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', desc: 'Classic wok-tossed chicken in rich tomato & green chili gravy' },
  { name: 'Shahi Tukda', tag: 'Royal Dessert', price: 'Rs 800', img: 'https://images.unsplash.com/photo-1590137876181-2a5a7e340308?w=600&auto=format&fit=crop', desc: 'Rich bread pudding soaked in saffron milk, topped with rabri & nuts' },
  { name: 'Kashmiri Chai', tag: 'Signature Sip', price: 'Rs 600', img: 'https://images.unsplash.com/photo-1544025162-811114215563?w=600&auto=format&fit=crop', desc: 'Delicate pink tea brewed with green leaves, cream & crushed pistachios' },
];

const stats = [
  { value: '200+', label: 'Curated Dishes' },
  { value: '5★', label: 'Guest Rating' },
  { value: '8+', label: 'Years of Heritage' },
  { value: '10K+', label: 'Happy Guests' },
];

const experiences = [
  { icon: Utensils, title: 'Fine Dining', desc: 'An atmosphere of warmth, elegance, and impeccable service that makes every visit memorable.' },
  { icon: Clock, title: 'Private Events', desc: 'Bespoke event hosting for corporate dinners, family gatherings, and celebrations of all kinds.' },
  { icon: MapPin, title: 'Prime Location', desc: 'Located in the heart of Karachi, Mehfil is your go-to destination for luxury dining.' },
];

const testimonials = [
  { name: 'Aisha R.', role: 'Food Critic', quote: 'Mehfil redefines luxury dining in Karachi. Every dish is a masterpiece of flavour and presentation.', rating: 5 },
  { name: 'Bilal K.', role: 'Regular Guest', quote: 'The Saffron Biryani alone is worth the trip. The ambiance is absolutely breathtaking.', rating: 5 },
  { name: 'Sana M.', role: 'Food Blogger', quote: 'I have dined at premium restaurants across Pakistan. Mehfil stands in a league of its own.', rating: 5 },
];

// ─── Lightning Card Component ─────────────────────────────────────────
function DishCard({ dish, index }) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group rounded-2xl overflow-hidden cursor-pointer flex-shrink-0"
      style={{ width: '320px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Lightning / spotlight glow on hover */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(212,175,55,0.25), transparent 70%)`,
          }}
        />
      )}

      {/* Border glow */}
      <div className={`absolute inset-0 rounded-2xl z-10 transition-all duration-500 ${hovered ? 'ring-1 ring-mehfil-gold shadow-[0_0_40px_rgba(212,175,55,0.3)]' : 'ring-1 ring-mehfil-gold/10'}`} />

      {/* Image */}
      <div className="h-52 overflow-hidden relative">
        <motion.img
          src={dish.img}
          alt={dish.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mehfil-black via-mehfil-black/30 to-transparent" />
        {/* Tag Badge */}
        <span className="absolute top-4 left-4 text-[10px] font-cinzel tracking-widest uppercase bg-mehfil-gold text-mehfil-black px-3 py-1 rounded-full">
          {dish.tag}
        </span>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-b from-mehfil-black/95 to-mehfil-burgundy/20 p-5 relative z-10 border border-t-0 border-mehfil-gold/10 rounded-b-2xl">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-cinzel text-mehfil-gold leading-snug">{dish.name}</h3>
          <span className="text-mehfil-gold font-serif text-sm whitespace-nowrap ml-2">{dish.price}</span>
        </div>
        <p className="text-mehfil-ivory/60 text-xs font-serif leading-relaxed">{dish.desc}</p>
        <motion.div
          className="mt-4 flex items-center text-mehfil-gold/70 text-xs font-cinzel tracking-widest uppercase"
          animate={{ x: hovered ? 4 : 0 }}
        >
          <span>Order Now</span>
          <ArrowRight size={12} className="ml-1" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Stat Counter ─────────────────────────────────────────────────────
function StatItem({ value, label, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="text-4xl md:text-5xl font-cinzel font-bold text-mehfil-gold mb-2 group-hover:text-mehfil-gold-light transition-colors duration-300">
        {value}
      </div>
      <div className="text-mehfil-ivory/60 text-xs tracking-[0.2em] uppercase font-serif">{label}</div>
    </motion.div>
  );
}

// ─── Testimonial Card ──────────────────────────────────────────────────
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: 'radial-gradient(400px at 50% 50%, rgba(212,175,55,0.08), transparent)' }}
      />
      <div className="flex mb-4">
        {[...Array(t.rating)].map((_, i) => (
          <Star key={i} size={14} className="text-mehfil-gold fill-mehfil-gold" />
        ))}
      </div>
      <p className="text-mehfil-ivory/80 font-serif italic leading-relaxed mb-6">"{t.quote}"</p>
      <div>
        <div className="font-cinzel text-mehfil-gold text-sm">{t.name}</div>
        <div className="text-mehfil-ivory/40 text-xs font-serif mt-1">{t.role}</div>
      </div>
    </motion.div>
  );
}

// ─── Main Home Component ────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Fallback timer: ensure buttons reveal after 4 seconds even if mobile browser delays or suppresses video onEnded
    const timer = setTimeout(() => {
      setVideoEnded(true);
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Infinite scrolling cards
  const cardsRef = useRef(null);
  const duplicated = [...featuredDishes, ...featuredDishes];

  return (
    <div className="w-full bg-mehfil-black overflow-x-hidden">

      {/* ── 1. HERO SECTION ── */}
      <section ref={heroRef} className="relative h-screen w-full flex items-end justify-start overflow-hidden bg-black">
        
        {/* Full-screen video background (plays once, stops at last frame) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <video
            ref={videoRef}
            src={logoVideo}
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoEnded(true)}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Bottom gradient — dissolves video into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-64 z-[1] bg-gradient-to-t from-mehfil-black via-mehfil-black/70 to-transparent pointer-events-none" />
        {/* Top subtle vignette */}
        <div className="absolute top-0 left-0 right-0 h-40 z-[1] bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* Hero Content — Buttons positioned lower on left, appearing after video animation ends */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-left px-8 md:px-16 lg:px-24 w-full max-w-4xl pb-16"
        >
          <AnimatePresence>
            {videoEnded && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link to="/menu" className="btn-primary w-full sm:w-auto text-sm tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl">
                  Explore Menu <ArrowRight size={16} />
                </Link>
                <Link to="/reservations" className="btn-outline w-full sm:w-auto text-sm tracking-[0.2em] shadow-2xl">
                  Reserve a Table
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-mehfil-gold/50"
        >
          <span className="text-[10px] tracking-[0.3em] font-cinzel uppercase mb-2">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ── 2. STATS BAR ── */}
      <section className="py-12 border-y border-mehfil-gold/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mehfil-burgundy/20 via-transparent to-mehfil-burgundy/20" />
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {stats.map((s, i) => <StatItem key={s.label} {...s} index={i} />)}
        </div>
      </section>

      {/* ── 3. BRAND INTRO ── */}
      <section className="py-28 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mehfil-burgundy/15 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Image side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop"
                alt="Chef at Mehfil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mehfil-black/60 to-transparent" />
            </div>
            {/* Gold accent frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-mehfil-gold/50 rounded-tl-2xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-mehfil-gold/50 rounded-br-2xl" />
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 -right-6 bg-mehfil-gold text-mehfil-black px-6 py-4 rounded-xl shadow-2xl"
            >
              <div className="font-cinzel font-bold text-2xl">2018</div>
              <div className="text-xs font-serif tracking-wide">Est. in Karachi</div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <div className="space-y-6">
            <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-xs tracking-[0.3em] text-mehfil-gold font-cinzel uppercase"
            >
              Our Story
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-4xl md:text-5xl font-cinzel text-mehfil-gold leading-tight"
            >
              A Taste Worth Gathering For
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="w-16 h-px bg-mehfil-gold/50 relative"
            >
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rotate-45 border border-mehfil-gold" />
            </motion.div>
            <motion.p variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-mehfil-ivory/75 font-serif text-lg leading-relaxed"
            >
              At Mehfil, we believe dining is an experience that transcends the plate. It is about warmth of hospitality, elegance of setting, and the meticulous crafting of flavours that celebrate Karachi's vibrant culinary culture.
            </motion.p>
            <motion.p variants={fadeUp} custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-mehfil-ivory/60 font-serif leading-relaxed"
            >
              Every dish is crafted by our master chefs using premium, locally sourced ingredients, blending traditional recipes with modern artistry to create an unforgettable experience.
            </motion.p>
            <motion.div variants={fadeUp} custom={5} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Link to="/menu" className="btn-outline inline-flex items-center gap-2 text-sm">
                Discover Our Menu <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. ROLLING FEATURED DISHES (Infinite Scroll) ── */}
      <section className="py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mehfil-burgundy/10 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs tracking-[0.3em] text-mehfil-gold font-cinzel uppercase mb-3"
          >
            Curated for You
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-4xl md:text-5xl font-cinzel text-mehfil-gold mb-4"
          >
            Signature Offerings
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-mehfil-ivory/60 font-serif max-w-xl mx-auto"
          >
            A selection of our most celebrated dishes — crafted with devotion, served with grace.
          </motion.p>
        </div>

        {/* Rolling track — no JS needed, pure CSS animation */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-mehfil-black to-transparent pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-mehfil-black to-transparent pointer-events-none" />

          <div className="flex gap-6 px-6" style={{ animation: 'scrollTrack 30s linear infinite' }} ref={cardsRef}>
            {duplicated.map((dish, i) => (
              <DishCard key={`${dish.name}-${i}`} dish={dish} index={i % featuredDishes.length} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/menu" className="btn-primary inline-flex items-center gap-2 text-sm">
            View Full Menu <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── 5. EXPERIENCES ── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-mehfil-burgundy/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-xs tracking-[0.3em] text-mehfil-gold font-cinzel uppercase mb-3"
            >
              Beyond the Plate
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-4xl md:text-5xl font-cinzel text-mehfil-gold"
            >
              The Mehfil Experience
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl text-center group relative overflow-hidden"
                whileHover={{ y: -6 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: 'radial-gradient(300px at 50% 0%, rgba(212,175,55,0.1), transparent)' }}
                />
                <div className="w-14 h-14 rounded-full border border-mehfil-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:border-mehfil-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
                  <exp.icon className="text-mehfil-gold" size={22} />
                </div>
                <h3 className="text-xl font-cinzel text-mehfil-gold mb-4">{exp.title}</h3>
                <p className="text-mehfil-ivory/60 font-serif leading-relaxed">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mehfil-burgundy/20 via-transparent to-mehfil-burgundy/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-xs tracking-[0.3em] text-mehfil-gold font-cinzel uppercase mb-3"
            >
              Guest Stories
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-4xl md:text-5xl font-cinzel text-mehfil-gold"
            >
              What Our Guests Say
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA BANNER ── */}
      <section className="py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-mehfil-black/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-mehfil-burgundy/60 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-xs tracking-[0.3em] text-mehfil-gold font-cinzel uppercase mb-4"
          >
            Book Your Table
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-4xl md:text-6xl font-cinzel text-mehfil-gold mb-6 leading-tight"
          >
            Reserve Your Mehfil Tonight
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-mehfil-ivory/80 font-serif mb-10 text-lg"
          >
            Whether it's a romantic dinner for two or a grand family gathering, we have the perfect setting for every occasion.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/reservations" className="btn-primary w-full sm:w-auto text-sm tracking-[0.2em] flex items-center justify-center gap-2">
              Reserve Now <ArrowRight size={16} />
            </Link>
            <a href="tel:+923001234567" className="btn-outline w-full sm:w-auto text-sm tracking-[0.2em] flex items-center justify-center gap-2">
              <Phone size={16} /> Call Us
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
