import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ── GET /api/reservations (admin) ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/reservations (customer creates) ─────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, occasion, notes } = req.body;
    const { data, error } = await supabase
      .from('reservations')
      .insert([{ name, phone, email, date, time, guests, occasion, notes, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PATCH /api/reservations/:id ──────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/reservations/:id ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('reservations').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
