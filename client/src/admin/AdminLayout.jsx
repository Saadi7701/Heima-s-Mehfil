import { NavLink, Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, CalendarCheck,
  ArrowLeft, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
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
              <X size={18} />
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

        {/* Bottom */}
        <div className="p-4 border-t border-mehfil-gold/15">
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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-mehfil-gold/10 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-mehfil-gold hover:text-mehfil-ivory transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="text-xs text-mehfil-ivory/30 font-serif tracking-widest">MEHFIL ADMIN v1.0</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
