import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trash2, ChevronDown, Search, X } from 'lucide-react';
import { fetchAdminOrders, updateOrderStatus, deleteOrder } from '../lib/api';

const ORDER_STATUSES = ['pending','confirmed','preparing','ready','out_for_delivery','completed','cancelled'];

const STATUS_STYLES = {
  pending:          'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed:        'text-blue-400 bg-blue-400/10 border-blue-400/30',
  preparing:        'text-orange-400 bg-orange-400/10 border-orange-400/30',
  ready:            'text-purple-400 bg-purple-400/10 border-purple-400/30',
  out_for_delivery: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  completed:        'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled:        'text-red-400 bg-red-400/10 border-red-400/30',
};

function OrderRow({ order, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (e) => {
    setUpdating(true);
    await onStatusChange(order.id, e.target.value);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this order?')) return;
    await onDelete(order.id);
  };

  const items = order.order_items || [];
  const itemSummary = items.map(i => `${i.menu_items?.name || '?'} x${i.quantity}`).join(', ');
  const date = new Date(order.created_at);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="border-b border-mehfil-gold/5 hover:bg-white/2 transition-colors group"
    >
      <td className="px-4 py-4">
        <div className="font-mono text-xs text-mehfil-gold/80">#{order.id.split('-')[0].toUpperCase()}</div>
        <div className="text-[10px] text-mehfil-ivory/30 font-serif mt-0.5">
          {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        <div className="text-[10px] text-mehfil-ivory/20">{date.toLocaleTimeString()}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-mehfil-ivory text-sm font-serif">{order.customer_name || 'Guest'}</div>
        <div className="text-xs text-mehfil-ivory/30 font-serif">{order.customer_phone || '—'}</div>
        <div className="text-xs text-mehfil-ivory/20 font-serif max-w-[160px] truncate">{order.delivery_address}</div>
      </td>
      <td className="px-4 py-4 max-w-[200px]">
        <div className="text-xs text-mehfil-ivory/60 font-serif leading-relaxed">{itemSummary || '—'}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-mehfil-gold font-serif text-sm">Rs {parseFloat(order.total_amount).toLocaleString()}</div>
        <div className="text-xs text-mehfil-ivory/30 uppercase font-serif">{order.payment_method}</div>
      </td>
      <td className="px-4 py-4">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-serif ${order.payment_status === 'paid' ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'}`}>
          {order.payment_status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="relative">
          <select
            value={order.status}
            onChange={handleStatus}
            disabled={updating}
            className={`text-xs px-2 py-1.5 pr-6 rounded-full border font-serif appearance-none cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
            style={{ background: 'transparent' }}
          >
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s} className="bg-[#1a1a1a] text-white capitalize">{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>
      </td>
      <td className="px-4 py-4">
        <button
          onClick={handleDelete}
          className="text-red-400/40 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </motion.tr>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setOrders(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      (o.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.delivery_address || '').toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Group by date
  const grouped = filtered.reduce((acc, o) => {
    const date = new Date(o.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(o);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cinzel text-mehfil-gold">Orders</h1>
          <p className="text-mehfil-ivory/40 text-xs font-serif mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-mehfil-gold/10 border border-mehfil-gold/30 rounded-xl text-mehfil-gold text-sm font-serif hover:bg-mehfil-gold/20 transition-all disabled:opacity-50 self-start"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mehfil-ivory/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, or address…"
            className="w-full bg-[#1a1a1a] border border-mehfil-gold/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-mehfil-ivory placeholder:text-mehfil-ivory/25 focus:outline-none focus:border-mehfil-gold/40"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mehfil-ivory/30 hover:text-mehfil-ivory"><X size={14} /></button>}
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-mehfil-gold/15 rounded-xl px-4 py-2.5 text-sm text-mehfil-ivory/70 focus:outline-none focus:border-mehfil-gold/40 appearance-none"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {/* Orders Table grouped by date */}
      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-mehfil-gold/30 border-t-mehfil-gold rounded-full animate-spin" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl p-12 text-center">
          <p className="text-mehfil-ivory/30 font-serif">No orders found.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dateOrders]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-mehfil-gold/60 font-cinzel tracking-widest uppercase">{date}</span>
              <div className="flex-1 h-px bg-mehfil-gold/10" />
              <span className="text-xs text-mehfil-ivory/25 font-serif">{dateOrders.length} order(s)</span>
            </div>
            <div className="bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-mehfil-gold/10">
                      {['Order ID', 'Customer', 'Items Ordered', 'Amount', 'Payment', 'Status', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] text-mehfil-ivory/30 font-serif tracking-widest uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {dateOrders.map(order => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
