import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trash2, ChevronDown, Search, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchAdminReservations, updateReservation, deleteReservation } from '../lib/api';

const STATUS_STYLES = {
  pending:   { cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: <Clock size={12} /> },
  confirmed: { cls: 'text-green-400 bg-green-400/10 border-green-400/30', icon: <CheckCircle size={12} /> },
  cancelled: { cls: 'text-red-400 bg-red-400/10 border-red-400/30', icon: <XCircle size={12} /> },
};

function ReservationRow({ res, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (e) => {
    setUpdating(true);
    await onStatusChange(res.id, e.target.value);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Cancel reservation for ${res.name}?`)) return;
    await onDelete(res.id);
  };

  const date = new Date(res.date + 'T12:00:00');

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="border-b border-mehfil-gold/5 hover:bg-white/2 transition-colors"
    >
      <td className="px-4 py-4">
        <div className="text-mehfil-ivory font-serif text-sm">{res.name}</div>
        <div className="text-xs text-mehfil-ivory/30 font-serif">{res.phone}</div>
        {res.email && <div className="text-xs text-mehfil-ivory/20 font-serif">{res.email}</div>}
      </td>
      <td className="px-4 py-4">
        <div className="text-mehfil-gold font-serif text-sm">
          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="text-xs text-mehfil-ivory/40 font-serif">{res.time}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-mehfil-ivory/80 font-serif text-sm">{res.guests}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-mehfil-ivory/60 font-serif text-xs">{res.occasion || '—'}</div>
        {res.notes && <div className="text-mehfil-ivory/30 font-serif text-xs mt-0.5 max-w-[150px] truncate" title={res.notes}>{res.notes}</div>}
      </td>
      <td className="px-4 py-4">
        <div className="text-xs text-mehfil-ivory/30 font-serif">
          {new Date(res.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="relative inline-block">
          <select
            value={res.status}
            onChange={handleStatus}
            disabled={updating}
            className={`text-xs px-3 py-1.5 pr-6 rounded-full border font-serif appearance-none cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_STYLES[res.status]?.cls || STATUS_STYLES.pending.cls}`}
            style={{ background: 'transparent' }}
          >
            <option value="pending" className="bg-[#1a1a1a] text-white">Pending</option>
            <option value="confirmed" className="bg-[#1a1a1a] text-white">Confirmed</option>
            <option value="cancelled" className="bg-[#1a1a1a] text-white">Cancelled</option>
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

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id, status) => {
    await updateReservation(id, { status });
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = async (id) => {
    await deleteReservation(id);
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reservations.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cinzel text-mehfil-gold">Reservations</h1>
          <p className="text-mehfil-ivory/40 text-xs font-serif mt-1">
            {reservations.length} total · <span className="text-yellow-400">{pending} pending</span> · <span className="text-green-400">{confirmed} confirmed</span>
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-mehfil-gold/10 border border-mehfil-gold/30 rounded-xl text-mehfil-gold text-sm font-serif hover:bg-mehfil-gold/20 transition-all disabled:opacity-50 self-start"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending, cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/15' },
          { label: 'Confirmed', value: confirmed, cls: 'text-green-400 bg-green-400/10 border-green-400/15' },
          { label: 'Total', value: reservations.length, cls: 'text-mehfil-gold bg-mehfil-gold/10 border-mehfil-gold/15' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.cls}`}>
            <div className="text-2xl font-cinzel font-bold">{s.value}</div>
            <div className="text-xs font-serif opacity-70 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mehfil-ivory/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full bg-[#1a1a1a] border border-mehfil-gold/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-mehfil-ivory placeholder:text-mehfil-ivory/25 focus:outline-none focus:border-mehfil-gold/40"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mehfil-ivory/30 hover:text-mehfil-ivory"><X size={14} /></button>}
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs px-4 py-2 rounded-full border font-serif capitalize transition-all ${filterStatus === s ? 'bg-mehfil-gold text-mehfil-black border-mehfil-gold' : 'border-mehfil-gold/20 text-mehfil-ivory/50 hover:border-mehfil-gold/40'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading && reservations.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-mehfil-gold/30 border-t-mehfil-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-mehfil-gold/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-mehfil-gold/10">
                  {['Guest', 'Date & Time', 'Party Size', 'Occasion / Notes', 'Booked On', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] text-mehfil-ivory/30 font-serif tracking-widest uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-mehfil-ivory/30 font-serif text-sm">
                        No reservations found.
                      </td>
                    </tr>
                  ) : filtered.map(res => (
                    <ReservationRow
                      key={res.id}
                      res={res}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
