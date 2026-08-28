import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-mehfil-black">
      {/* Top Announcement Bar */}
      <div className="w-full bg-mehfil-burgundy border-b border-mehfil-gold/30 py-2 overflow-hidden relative z-50">
        <div className="whitespace-nowrap animate-marquee flex items-center justify-center text-mehfil-gold text-xs tracking-[0.2em] font-cinzel">
          <span className="mx-4">MEHFIL • KARACHI'S NEW DESTINATION FOR ELEVATED DINING • NOW OPEN</span>
        </div>
      </div>

      {/* Sticky Navbar */}
      <nav className={`fixed top-8 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-panel py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-cinzel font-bold text-mehfil-gold tracking-widest">
            MEHFIL
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 font-serif text-sm tracking-widest text-mehfil-ivory">
            <Link to="/" className="hover:text-mehfil-gold transition-colors duration-300">Home</Link>
            <Link to="/menu" className="hover:text-mehfil-gold transition-colors duration-300">Menu</Link>
            <Link to="/experiences" className="hover:text-mehfil-gold transition-colors duration-300">Experiences</Link>
            <Link to="/reservations" className="hover:text-mehfil-gold transition-colors duration-300">Reservations</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5 text-mehfil-gold">
            <button className="hover:text-mehfil-ivory transition-colors"><Search size={20} /></button>
            <button 
              onClick={() => navigate('/checkout')}
              className="hover:text-mehfil-ivory transition-colors relative"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-mehfil-ivory text-mehfil-burgundy text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-mehfil-gold hover:text-mehfil-ivory transition-colors p-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-gradient-to-b from-[#180505] to-mehfil-black border-b border-mehfil-gold/20 overflow-hidden px-6 py-6 shadow-2xl"
            >
              <div className="flex flex-col space-y-5 font-serif text-base tracking-widest text-mehfil-ivory">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-mehfil-gold transition-colors pb-2 border-b border-mehfil-gold/10 flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight size={16} className="text-mehfil-gold/50" />
                </Link>
                <Link 
                  to="/menu" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-mehfil-gold transition-colors pb-2 border-b border-mehfil-gold/10 flex items-center justify-between"
                >
                  <span>Menu</span>
                  <ArrowRight size={16} className="text-mehfil-gold/50" />
                </Link>
                <Link 
                  to="/experiences" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-mehfil-gold transition-colors pb-2 border-b border-mehfil-gold/10 flex items-center justify-between"
                >
                  <span>Experiences</span>
                  <ArrowRight size={16} className="text-mehfil-gold/50" />
                </Link>
                <Link 
                  to="/reservations" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-mehfil-gold transition-colors pb-2 border-b border-mehfil-gold/10 flex items-center justify-between"
                >
                  <span>Reservations</span>
                  <ArrowRight size={16} className="text-mehfil-gold/50" />
                </Link>
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-mehfil-gold transition-colors text-mehfil-gold/80 text-sm pt-2 flex items-center justify-between font-cinzel"
                >
                  <span>Admin Console</span>
                  <ArrowRight size={14} className="text-mehfil-gold" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-mehfil-burgundy text-mehfil-gold py-16 border-t border-mehfil-gold/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 flex flex-col space-y-4">
            <span className="font-cinzel text-3xl font-bold tracking-widest">MEHFIL</span>
            <p className="text-sm text-mehfil-ivory/80 font-serif leading-relaxed">Where Every Gathering Becomes a Mehfil. A premium dining destination in Karachi combining sophisticated presentation and rich culinary experiences.</p>
          </div>
          <div>
            <h4 className="font-cinzel tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2 text-mehfil-ivory/70 text-sm font-serif">
              <li><Link to="/menu" className="hover:text-mehfil-gold transition-colors">Our Menu</Link></li>
              <li><Link to="/reservations" className="hover:text-mehfil-gold transition-colors">Reservations</Link></li>
              <li><Link to="/about" className="hover:text-mehfil-gold transition-colors">Brand Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-cinzel tracking-widest mb-4">Contact</h4>
            <ul className="space-y-2 text-mehfil-ivory/70 text-sm font-serif">
              <li>Karachi, Pakistan</li>
              <li>+92 300 1234567</li>
              <li>hello@mehfil.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-cinzel tracking-widest mb-4">Newsletter</h4>
            <p className="text-sm text-mehfil-ivory/70 font-serif mb-4">Subscribe for exclusive culinary events.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-transparent border-b border-mehfil-gold/50 py-2 outline-none text-sm text-mehfil-ivory w-full focus:border-mehfil-gold transition-colors" />
              <button className="ml-4 text-mehfil-gold font-cinzel text-sm uppercase tracking-wider hover:text-mehfil-ivory">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
