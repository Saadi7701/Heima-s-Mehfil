import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';
import { ShoppingBag, DollarSign, Clock, CalendarCheck, UtensilsCrossed, RefreshCw, TrendingUp } from 'lucide-react';
import { fetchAdminStats, fetchAdminOrders } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } })
};

function StatCard({ icon: Icon, label, value, sub, color, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl p-6 overflow-hidden group hover:border-mehfil-gold/30 transition-all duration-300"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(300px at 0% 0%, rgba(212,175,55,0.06), transparent)' }}
      />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <TrendingUp size={16} className="text-mehfil-gold/30" />
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-cinzel font-bold text-mehfil-gold mb-1">{value}</div>
        <div className="text-xs text-mehfil-ivory/50 font-serif tracking-wide">{label}</div>
        {sub && <div className="text-xs text-mehfil-gold/40 mt-1 font-serif">{sub}</div>}
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-mehfil-gold/20 rounded-xl p-4 shadow-2xl">
      <p className="font-cinzel text-mehfil-gold text-xs mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-serif text-sm text-mehfil-ivory">
          {p.name}: <span className="text-mehfil-gold">{p.name === 'revenue' ? `Rs ${p.value.toLocaleString()}` : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  preparing: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  completed: 'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminOrders(),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 6));
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-mehfil-gold/30 border-t-mehfil-gold rounded-full animate-spin" />
          <p className="text-mehfil-ivory/40 font-serif text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-cinzel text-mehfil-gold">Dashboard</h1>
          <p className="text-mehfil-ivory/40 text-xs font-serif mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-mehfil-gold/10 border border-mehfil-gold/30 rounded-xl text-mehfil-gold text-sm font-serif hover:bg-mehfil-gold/20 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard index={0} icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} sub={`${stats.pendingOrders} pending`} color="bg-mehfil-gold/15 text-mehfil-gold" />
          <StatCard index={1} icon={DollarSign} label="Total Revenue" value={`Rs ${(stats.totalRevenue || 0).toLocaleString()}`} sub="All time" color="bg-green-400/15 text-green-400" />
          <StatCard index={2} icon={Clock} label="Pending Orders" value={stats.pendingOrders} sub={`${stats.completedOrders} completed`} color="bg-orange-400/15 text-orange-400" />
          <StatCard index={3} icon={CalendarCheck} label="Reservations" value={stats.totalReservations} sub={`${stats.pendingReservations} pending`} color="bg-blue-400/15 text-blue-400" />
        </div>
      )}

      {/* Charts Row */}
      {stats?.last7Days && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders chart */}
          <motion.div
            variants={fadeUp} custom={4} initial="hidden" animate="visible"
            className="bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl p-6"
          >
            <h3 className="font-cinzel text-mehfil-gold text-sm mb-6">Orders — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.last7Days} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,240,0.4)', fontSize: 11, fontFamily: 'serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212,175,55,0.05)' }} />
                <Bar dataKey="orders" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue chart */}
          <motion.div
            variants={fadeUp} custom={5} initial="hidden" animate="visible"
            className="bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl p-6"
          >
            <h3 className="font-cinzel text-mehfil-gold text-sm mb-6">Revenue — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,240,0.4)', fontSize: 11, fontFamily: 'serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Recent Orders */}
      <motion.div
        variants={fadeUp} custom={6} initial="hidden" animate="visible"
        className="bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-mehfil-gold/10 flex items-center justify-between">
          <h3 className="font-cinzel text-mehfil-gold text-sm">Recent Orders</h3>
          <span className="text-mehfil-ivory/30 text-xs font-serif">Last 6 orders</span>
        </div>
        <div className="divide-y divide-mehfil-gold/5">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-mehfil-ivory/30 font-serif text-sm">No orders yet.</div>
          ) : recentOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-lg bg-mehfil-gold/10 flex items-center justify-center text-mehfil-gold text-xs font-cinzel">
                  #{order.id.split('-')[0].toUpperCase().slice(0, 4)}
                </div>
                <div>
                  <div className="text-mehfil-ivory text-sm font-serif">{order.customer_name || order.delivery_address?.split(',')[0] || 'Guest'}</div>
                  <div className="text-mehfil-ivory/30 text-xs font-serif">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {order.order_items?.length || 0} item(s)
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-mehfil-gold font-serif text-sm">Rs {parseFloat(order.total_amount).toLocaleString()}</div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-serif capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
