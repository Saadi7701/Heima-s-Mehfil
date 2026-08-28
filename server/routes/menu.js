import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ── GET /api/menu/categories ─────────────────────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/menu ────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('is_available', true);
    if (error) throw error;
    const formattedData = data.map(item => ({
      ...item,
      category: item.categories?.name
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/menu/all (admin - includes unavailable) ─────────────────
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(id, name)')
      .order('name');
    if (error) throw error;
    const formattedData = data.map(item => ({
      ...item,
      category: item.categories?.name,
      category_id: item.categories?.id || item.category_id,
    }));
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/menu (admin creates new item) ───────────────────────────
router.post('/', async (req, res) => {
  try {
    const { category_id, name, description, price, image_url, is_featured, is_vegetarian, is_spicy, is_available } = req.body;
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ category_id, name, description, price, image_url, is_featured: is_featured || false, is_vegetarian: is_vegetarian || false, is_spicy: is_spicy || false, is_available: is_available !== false }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/menu/:id (admin updates item) ────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
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

// ── DELETE /api/menu/:id ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('menu_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
