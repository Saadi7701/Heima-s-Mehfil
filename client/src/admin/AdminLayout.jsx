import { NavLink, Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, CalendarCheck,
  ArrowLeft, Menu, X, ChevronRight, Lock, Eye, EyeOff, LogOut, ShieldCheck
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('mehfil_admin_auth') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'Mehfil@666Heima') {
      localStorage.setItem('mehfil_admin_auth', 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mehfil_admin_auth');
    setAuthenticated(false);
    setPasswordInput('');
  };

  // ── Password Protection Screen ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-mehfil-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161616] border border-mehfil-gold/20 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-mehfil-gold/10 border border-mehfil-gold/30 flex items-center justify-center mx-auto text-mehfil-gold">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-cinzel font-bold text-mehfil-gold tracking-widest">
              ADMIN ACCESS
            </h1>
            <p className="text-xs text-mehfil-ivory/60 font-serif">
              Enter secure password to manage Mehfil Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 pt-2">
            {error && (
              <div className="text-xs font-serif text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full bg-[#0f0f0f] border border-mehfil-gold/20 rounded-xl px-4 py-3.5 pr-12 text-sm text-mehfil-ivory placeholder-mehfil-ivory/30 focus:outline-none focus:border-mehfil-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-mehfil-gold/60 hover:text-mehfil-gold transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <ShieldCheck size={16} />
              <span>Authenticate</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-mehfil-ivory/40 hover:text-mehfil-ivory font-serif flex items-center justify-center space-x-2">
              <ArrowLeft size={14} />
              <span>Return to Customer Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-gradient-to-b from-[#1a0505] to-[#0f0f0f]
        border-r border-mehfil-gold/15
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-mehfil-gold/15">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-cinzel text-2xl font-bold text-mehfil-gold tracking-widest">MEHFIL</div>
              <div className="text-[10px] tracking-[0.3em] text-mehfil-gold/50 font-cinzel uppercase mt-0.5">Admin Console</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-mehfil-gold/50 hover:text-mehfil-gold transition-colors lg:hidden">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                 ${isActive
                  ? 'bg-mehfil-gold/15 text-mehfil-gold border border-mehfil-gold/30'
                  : 'text-mehfil-ivory/50 hover:text-mehfil-ivory hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-mehfil-gold' : 'text-current'} />
                  <span className="font-serif text-sm tracking-wide">{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-mehfil-gold/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-mehfil-gold/15 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-serif"
          >
            <LogOut size={16} />
            <span>Lock / Logout</span>
          </button>
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-mehfil-ivory/40 hover:text-mehfil-ivory hover:bg-white/5 transition-all duration-200 text-sm font-serif"
          >
            <ArrowLeft size={16} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-mehfil-gold/10 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-mehfil-gold hover:text-mehfil-ivory transition-colors p-1"
              aria-label="Open Admin Menu"
            >
              <Menu size={22} />
            </button>
            <span className="font-cinzel text-sm text-mehfil-gold font-semibold lg:hidden">
              MEHFIL ADMIN
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-xs text-mehfil-ivory/40 font-serif tracking-widest">
              MEHFIL ADMIN v1.0
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400/70 hover:text-red-400 font-serif border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

