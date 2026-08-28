import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, Users, Phone, User, MessageSquare, Loader2, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
  })
};

const times = ['12:00 PM', '1:00 PM', '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];
const partySizes = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6 Guests', '7 Guests', '8+ Guests'];

export default function Reservations() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', time: '', guests: '', occasion: '', notes: ''
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-mehfil-black flex items-center justify-center pt-28 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-2xl p-12 max-w-lg w-full text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
            <CheckCircle className="text-mehfil-gold mx-auto mb-6" size={56} />
          </motion.div>
          <h2 className="text-3xl font-cinzel text-mehfil-gold mb-4">Reservation Confirmed</h2>
          <p className="text-mehfil-ivory/70 font-serif mb-2">
            Thank you, <span className="text-mehfil-gold">{form.name}</span>. Your table for <span className="text-mehfil-gold">{form.guests}</span> on <span className="text-mehfil-gold">{form.date}</span> at <span className="text-mehfil-gold">{form.time}</span> has been reserved.
          </p>
          <p className="text-mehfil-ivory/50 text-sm font-serif mt-4">A confirmation will be sent to {form.phone}. We look forward to welcoming you to Mehfil.</p>
          <button onClick={() => setSubmitted(false)} className="btn-outline mt-8 w-full text-sm">Make Another Reservation</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mehfil-black pt-28 pb-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-mehfil-burgundy/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p variants={fadeUp} initial="hidden" animate="visible"
            className="text-xs tracking-[0.3em] text-mehfil-gold font-cinzel uppercase mb-4"
          >Reserve Your Experience</motion.p>
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="text-4xl md:text-6xl font-cinzel text-mehfil-gold mb-6"
          >Book Your Table</motion.h1>
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-mehfil-gold/60" />
              <div className="w-2 h-2 rotate-45 border border-mehfil-gold" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-mehfil-gold/60" />
            </div>
          </motion.div>
          <motion.p variants={fadeUp} custom={3} initial="hidden" animate="visible"
            className="text-mehfil-ivory/60 font-serif max-w-xl mx-auto"
          >
            Reserve your table and let us craft an unforgettable dining experience tailored just for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="lg:col-span-3 glass-panel rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-mehfil-gold/50" size={16} />
                  <input required name="name" value={form.name} onChange={handleChange}
                    type="text" placeholder="Full Name"
                    className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 pl-10 pr-4 text-mehfil-ivory placeholder:text-mehfil-ivory/30 focus:outline-none focus:border-mehfil-gold transition-colors"
                  />
                </div>
                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-mehfil-gold/50" size={16} />
                  <input required name="phone" value={form.phone} onChange={handleChange}
                    type="tel" placeholder="Phone Number"
                    className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 pl-10 pr-4 text-mehfil-ivory placeholder:text-mehfil-ivory/30 focus:outline-none focus:border-mehfil-gold transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <input name="email" value={form.email} onChange={handleChange}
                type="email" placeholder="Email (optional)"
                className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 px-4 text-mehfil-ivory placeholder:text-mehfil-ivory/30 focus:outline-none focus:border-mehfil-gold transition-colors"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Date */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-mehfil-gold/50" size={16} />
                  <input required name="date" value={form.date} onChange={handleChange}
                    type="date" min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 pl-10 pr-4 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors [color-scheme:dark]"
                  />
                </div>
                {/* Time */}
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 text-mehfil-gold/50" size={16} />
                  <select required name="time" value={form.time} onChange={handleChange}
                    className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 pl-10 pr-4 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors appearance-none"
                  >
                    <option value="" className="bg-mehfil-black">Time</option>
                    {times.map(t => <option key={t} value={t} className="bg-mehfil-black">{t}</option>)}
                  </select>
                </div>
                {/* Guests */}
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 text-mehfil-gold/50" size={16} />
                  <select required name="guests" value={form.guests} onChange={handleChange}
                    className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 pl-10 pr-4 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors appearance-none"
                  >
                    <option value="" className="bg-mehfil-black">Guests</option>
                    {partySizes.map(p => <option key={p} value={p} className="bg-mehfil-black">{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Occasion */}
              <select name="occasion" value={form.occasion} onChange={handleChange}
                className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 px-4 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors appearance-none"
              >
                <option value="" className="bg-mehfil-black">Select Occasion (Optional)</option>
                {['Birthday Celebration', 'Anniversary', 'Business Dinner', 'Family Gathering', 'Date Night', 'Other'].map(o => (
                  <option key={o} value={o} className="bg-mehfil-black">{o}</option>
                ))}
              </select>

              {/* Notes */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 text-mehfil-gold/50" size={16} />
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  rows={3} placeholder="Special requests or dietary requirements..."
                  className="w-full bg-mehfil-black/50 border border-mehfil-gold/20 rounded-lg py-3 pl-10 pr-4 text-mehfil-ivory placeholder:text-mehfil-ivory/30 focus:outline-none focus:border-mehfil-gold transition-colors resize-none"
                />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full text-sm tracking-[0.2em] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Reservation'}
              </button>
            </form>
          </motion.div>

          {/* Info Panel */}
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Hours */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-cinzel text-mehfil-gold text-lg mb-4 flex items-center gap-2"><Clock size={18} /> Dining Hours</h3>
              <div className="space-y-2 font-serif text-sm">
                {[
                  { day: 'Monday – Thursday', hours: '12:00 PM – 11:00 PM' },
                  { day: 'Friday & Saturday', hours: '12:00 PM – 12:00 AM' },
                  { day: 'Sunday', hours: '1:00 PM – 10:00 PM' },
                ].map(h => (
                  <div key={h.day} className="flex justify-between items-center py-2 border-b border-mehfil-gold/10 last:border-0">
                    <span className="text-mehfil-ivory/60">{h.day}</span>
                    <span className="text-mehfil-gold">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-cinzel text-mehfil-gold text-lg mb-4 flex items-center gap-2"><Phone size={18} /> Contact Us</h3>
              <div className="space-y-3 font-serif text-sm text-mehfil-ivory/70">
                <p>+92 300 1234567</p>
                <p>hello@mehfil.pk</p>
                <p>Main Boulevard, DHA Phase 5, Karachi</p>
              </div>
            </div>

            {/* Ambiance image */}
            <div className="rounded-2xl overflow-hidden h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop"
                alt="Mehfil Ambiance"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mehfil-black/70 to-transparent flex items-end p-4">
                <p className="text-mehfil-ivory/80 font-serif text-sm italic">"A mehfil that stays with you long after the last bite."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
