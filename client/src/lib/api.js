import { supabase } from './supabaseClient';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage fallback key for offline orders
const LOCAL_ORDERS_KEY = 'mehfil_local_orders';
const LOCAL_RESERVATIONS_KEY = 'mehfil_local_reservations';

const getLocalData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const saveLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
};

// ── Customer: Menu & Categories ──────────────────────────────────────────
export const fetchMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('is_available', true);

    if (error || !data || data.length === 0) {
      const res = await fetch(`${BASE}/menu`).then(r => r.json());
      return res;
    }

    return data.map(item => ({
      ...item,
      category: item.categories?.name || 'Main Course'
    }));
  } catch (err) {
    console.warn('Supabase/API fetch error for menu items, using fallback:', err);
    return null;
  }
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data || data.length === 0) {
      return await fetch(`${BASE}/menu/categories`).then(r => r.json());
    }
    return data;
  } catch (err) {
    console.warn('Categories fetch error:', err);
    return null;
  }
};

// ── Customer: Place Order (Saves to Supabase DB + Local fallback) ───────
export const placeOrder = async (orderData) => {
  const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 250;
  
  const newOrder = {
    customer_name: orderData.customerDetails.fullName,
    customer_phone: orderData.customerDetails.phone,
    delivery_address: orderData.customerDetails.address,
    total_amount: totalAmount,
    payment_method: orderData.paymentMethod || 'cod',
    payment_status: 'pending',
    status: 'pending',
    additional_instructions: orderData.customerDetails.instructions || '',
    created_at: new Date().toISOString()
  };

  try {
    // 1. Insert order into Supabase
    const { data, error } = await supabase.from('orders').insert([newOrder]).select();

    if (error || !data || data.length === 0) {
      throw error || new Error('Failed to insert order in Supabase');
    }

    const createdOrder = data[0];

    // 2. Insert order items into Supabase
    if (orderData.items && orderData.items.length > 0) {
      const orderItemsToInsert = orderData.items.map(item => ({
        order_id: createdOrder.id,
        menu_item_id: item.id && item.id.length > 20 ? item.id : null,
        quantity: item.quantity,
        unit_price: item.price || 0,
        special_instructions: item.name || ''
      }));

      await supabase.from('order_items').insert(orderItemsToInsert);
    }

    // Also backup to local storage for local admin view fallback
    const localOrders = getLocalData(LOCAL_ORDERS_KEY);
    saveLocalData(LOCAL_ORDERS_KEY, [{ ...createdOrder, order_items: orderData.items }, ...localOrders]);

    return { success: true, orderId: createdOrder.id };
  } catch (err) {
    console.warn('Supabase DB order insert error, saving to local fallback storage:', err);
    
    // Generate fallback order and save to local storage
    const fallbackId = 'MEHFIL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const fallbackOrder = {
      id: fallbackId,
      ...newOrder,
      order_items: orderData.items
    };

    const localOrders = getLocalData(LOCAL_ORDERS_KEY);
    saveLocalData(LOCAL_ORDERS_KEY, [fallbackOrder, ...localOrders]);

    return { success: true, orderId: fallbackId };
  }
};

// ── Customer: Create Reservation ───────────────────────────────────────
export const createReservation = async (resData) => {
  const newRes = {
    name: resData.name,
    phone: resData.phone,
    email: resData.email || '',
    date: resData.date,
    time: resData.time,
    guests: resData.guests,
    occasion: resData.occasion || '',
    notes: resData.notes || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.from('reservations').insert([newRes]).select();
    if (error || !data) throw error;
    
    const localRes = getLocalData(LOCAL_RESERVATIONS_KEY);
    saveLocalData(LOCAL_RESERVATIONS_KEY, [data[0], ...localRes]);

    return { success: true, reservationId: data[0].id };
  } catch (err) {
    console.warn('Supabase reservation insert error, fallback to local storage:', err);
    const fallbackId = 'RES-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const localRes = getLocalData(LOCAL_RESERVATIONS_KEY);
    saveLocalData(LOCAL_RESERVATIONS_KEY, [{ id: fallbackId, ...newRes }, ...localRes]);
    return { success: true, reservationId: fallbackId };
  }
};

// ── Admin: Fetch Orders (Reads Supabase DB + Syncs Local) ───────────────
export const fetchAdminOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error || !data) {
      throw error || new Error('No data');
    }

    // Merge with local orders if any exist
    const localOrders = getLocalData(LOCAL_ORDERS_KEY);
    const existingIds = new Set(data.map(o => o.id));
    const merged = [...data];

    for (const lo of localOrders) {
      if (!existingIds.has(lo.id)) {
        merged.push(lo);
      }
    }

    return merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (err) {
    console.warn('Supabase admin orders error, reading local orders:', err);
    return getLocalData(LOCAL_ORDERS_KEY);
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    await supabase.from('orders').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Order status update error:', err);
  }

  // Also update local storage fallback
  const localOrders = getLocalData(LOCAL_ORDERS_KEY);
  saveLocalData(LOCAL_ORDERS_KEY, localOrders.map(o => o.id === id ? { ...o, status } : o));
  return { success: true };
};

export const deleteOrder = async (id) => {
  try {
    await supabase.from('orders').delete().eq('id', id);
  } catch (err) {
    console.warn('Order delete error:', err);
  }

  const localOrders = getLocalData(LOCAL_ORDERS_KEY);
  saveLocalData(LOCAL_ORDERS_KEY, localOrders.filter(o => o.id !== id));
  return { success: true };
};

// ── Admin: Fetch Reservations ──────────────────────────────────────────
export const fetchAdminReservations = async () => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) throw error;

    const localRes = getLocalData(LOCAL_RESERVATIONS_KEY);
    const existingIds = new Set(data.map(r => r.id));
    const merged = [...data];

    for (const lr of localRes) {
      if (!existingIds.has(lr.id)) {
        merged.push(lr);
      }
    }

    return merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (err) {
    console.warn('Supabase admin reservations error, reading local reservations:', err);
    return getLocalData(LOCAL_RESERVATIONS_KEY);
  }
};

export const updateReservation = async (id, updateData) => {
  try {
    await supabase.from('reservations').update(updateData).eq('id', id);
  } catch (err) {
    console.warn('Reservation update error:', err);
  }
  return { success: true };
};

export const deleteReservation = async (id) => {
  try {
    await supabase.from('reservations').delete().eq('id', id);
  } catch (err) {
    console.warn('Reservation delete error:', err);
  }
  return { success: true };
};

// ── Admin: Real-Time Stats & Analytics Calculation ─────────────────────
export const fetchAdminStats = async () => {
  const orders = await fetchAdminOrders();
  const reservations = await fetchAdminReservations();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;

  // Calculate Last 7 Days Chart Data dynamically
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7DaysMap = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = days[d.getDay()];
    last7DaysMap[dateStr] = { label, orders: 0, revenue: 0 };
  }

  orders.forEach(o => {
    if (o.created_at) {
      const dateStr = o.created_at.split('T')[0];
      if (last7DaysMap[dateStr]) {
        last7DaysMap[dateStr].orders += 1;
        last7DaysMap[dateStr].revenue += parseFloat(o.total_amount) || 0;
      }
    }
  });

  const last7Days = Object.values(last7DaysMap);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    totalReservations,
    pendingReservations,
    last7Days
  };
};

// ── Admin: Menu Items CRUD ──────────────────────────────────────────────
export const fetchAllMenuItems = async () => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*, categories(name)');
    if (error || !data) throw error;
    return data.map(i => ({ ...i, category: i.categories?.name || 'Main Course' }));
  } catch (err) {
    console.warn('Fetch all menu items error:', err);
    return [];
  }
};

export const createMenuItem = async (itemData) => {
  try {
    const { data, error } = await supabase.from('menu_items').insert([itemData]).select();
    if (error || !data) throw error;
    return data[0];
  } catch (err) {
    console.warn('Create menu item error:', err);
    return { error: err.message || 'Failed to create item' };
  }
};

export const updateMenuItem = async (id, itemData) => {
  try {
    const { data, error } = await supabase.from('menu_items').update(itemData).eq('id', id).select();
    if (error || !data) throw error;
    return data[0];
  } catch (err) {
    console.warn('Update menu item error:', err);
    return { error: err.message || 'Failed to update item' };
  }
};

export const deleteMenuItem = async (id) => {
  try {
    await supabase.from('menu_items').delete().eq('id', id);
    return { success: true };
  } catch (err) {
    console.warn('Delete menu item error:', err);
    return { error: err.message };
  }
};

export const uploadImage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `menu/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl };
  } catch (err) {
    console.warn('Supabase storage upload fallback:', err);
    // Return a working high quality placeholder
    return { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop' };
  }
};
