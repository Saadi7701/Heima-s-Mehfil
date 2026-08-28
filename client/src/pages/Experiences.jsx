import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Utensils, Users, Sparkles, Music, Calendar, ArrowRight, Star } from 'lucide-react';

const experiences = [
  {
    id: 'fine-dining',
    title: 'The Royal Fine Dining',
    subtitle: 'An Unmatched Gastronomic Journey',
    img: 'https://images.unsplash.com/photo-1544025162-811114215563?w=800&auto=format&fit=crop',
    desc: 'Step into an atmosphere of regal grandeur. Immerse yourself in handcrafted Mughlai and South Asian culinary masterpieces, served under warm chandelier glows with golden accents.',
    highlights: ['Multi-Course Tasting Menus', 'Sommelier & Signature Mocktails', 'Private Table Butler Service']
  },
  {
    id: 'private-events',
    title: 'Bespoke Private Gatherings',
    subtitle: 'Exclusive Celebrations & Dinners',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
    desc: 'Host your corporate galas, intimate engagement soirees, or family milestones in our private dining suites tailored precisely to your aesthetic and culinary desires.',
    highlights: ['Custom Menu Design', 'Dedicated Concierge', 'Custom Floral & Table Layouts']
  },
  {
    id: 'chefs-table',
    title: 'The Chef’s Exclusive Table',
    subtitle: 'Behind-the-Scenes Culinary Artistry',
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
    desc: 'An intimate culinary showcase where Executive Chefs prepare rare, off-menu delicacies directly in front of you with paired storytelling.',
    highlights: ['Live Charcoal & Tandoor Craft', 'Rare Saffron & Spice Blends', 'Chef-Guided Storytelling']
  },
  {
    id: 'live-evenings',
    title: 'Sufi & Classical Evenings',
    subtitle: 'Soulful Live Heritage Music',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    desc: 'Enhance your feast with subtle live acoustic Qawwali and classical sitar performances every weekend, creating an atmosphere that lingers in memory.',
    highlights: ['Weekend Live Acoustic Sessions', 'Courtyard Ambient Seating', 'Heritage Teas & Desserts']
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function Experiences() {
  return (
    <div className="w-full bg-mehfil-black text-mehfil-ivory pt-28 pb-20 min-h-screen">
      {/* ── Page Header ── */}
      <section className="max-w-6xl mx-auto px-6 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-cinzel uppercase tracking-[0.3em] text-mehfil-gold block mb-3">
            Curated Hospitality
          </span>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-mehfil-gold tracking-wider mb-6">
            ELEVATED EXPERIENCES
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-mehfil-gold to-transparent mx-auto mb-6" />
          <p className="max-w-2xl mx-auto font-serif text-mehfil-ivory/70 text-base md:text-lg leading-relaxed">
            Every dining moment at Mehfil is designed to be extraordinary — combining centuries-old culinary heritage with world-class luxury service.
          </p>
        </motion.div>
      </section>

      {/* ── Experiences List ── */}
      <section className="max-w-6xl mx-auto px-6 space-y-24">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image Box */}
            <div className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-mehfil-gold/20 shadow-2xl">
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mehfil-black/80 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-mehfil-gold/60 rounded-tl-xl" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-mehfil-gold/60 rounded-br-xl" />
            </div>

            {/* Content Box */}
            <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <span className="text-xs font-cinzel uppercase tracking-widest text-mehfil-gold/80 bg-mehfil-gold/10 px-3 py-1 rounded-full border border-mehfil-gold/20">
                {exp.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-cinzel font-semibold text-mehfil-gold">
                {exp.title}
              </h2>
              <p className="text-mehfil-ivory/70 font-serif leading-relaxed text-sm md:text-base">
                {exp.desc}
              </p>

              {/* Highlights */}
              <ul className="space-y-2 pt-2">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-center text-xs md:text-sm font-serif text-mehfil-ivory/90">
                    <Star size={14} className="text-mehfil-gold mr-3 flex-shrink-0 fill-mehfil-gold/40" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  to="/reservations"
                  className="inline-flex items-center space-x-2 text-xs font-cinzel uppercase tracking-widest text-mehfil-gold hover:text-mehfil-gold-light border-b border-mehfil-gold/40 hover:border-mehfil-gold pb-1 transition-all"
                >
                  <span>Reserve This Experience</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <div className="glass-panel p-10 md:p-14 rounded-3xl border border-mehfil-gold/30 bg-gradient-to-b from-mehfil-burgundy/30 to-mehfil-black/80 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-4xl font-cinzel font-bold text-mehfil-gold">
              Planning a Grand Gathering?
            </h3>
            <p className="text-mehfil-ivory/70 font-serif max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Our reservation concierge will assist you in curating custom menus, table arrangements, and private dining options.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/reservations" className="btn-primary text-xs tracking-widest uppercase py-3 px-8">
                Book a Table
              </Link>
              <Link to="/menu" className="btn-outline text-xs tracking-widest uppercase py-3 px-8">
                Explore Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
