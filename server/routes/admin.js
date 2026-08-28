import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ── GET /api/admin/stats ────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [ordersRes, reservationsRes, menuRes] = await Promise.all([
      supabase.from('orders').select('id, total_amount, status, created_at'),
      supabase.from('reservations').select('id, status'),
      supabase.from('menu_items').select('id, is_available'),
    ]);

    const orders = ordersRes.data || [];
    const reservations = reservationsRes.data || [];
    const menuItems = menuRes.data || [];

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalMenuItems = menuItems.length;
    const totalReservations = reservations.length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;

    // Orders per day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => o.created_at && o.created_at.startsWith(dateStr));
      last7Days.push({
        date: dateStr,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0),
      });
    }

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalMenuItems,
      totalReservations,
      pendingReservations,
      last7Days,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/admin/orders ────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id, quantity, unit_price,
          menu_items ( name )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PATCH /api/admin/orders/:id ──────────────────────────────────────
router.patch('/orders/:id', async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.payment_status) updates.payment_status = req.body.payment_status;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/admin/orders/:id ─────────────────────────────────────
router.delete('/orders/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
