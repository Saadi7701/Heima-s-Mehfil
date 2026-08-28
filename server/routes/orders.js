import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { 
      items, // array of { id: menu_item_id, quantity }
      customerDetails,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }

    // 1. Fetch prices from DB to ensure security
    const itemIds = items.map(i => i.id);
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, price')
      .in('id', itemIds);

    if (menuError) throw menuError;

    // 2. Calculate true total
    let totalAmount = 0;
    const orderItemsToInsert = [];

    for (const orderItem of items) {
      const dbItem = menuItems.find(m => m.id === orderItem.id);
      if (!dbItem) {
        return res.status(400).json({ error: `Menu item ${orderItem.id} not found` });
      }
      
      const quantity = parseInt(orderItem.quantity) || 1;
      const unitPrice = parseFloat(dbItem.price);
      totalAmount += unitPrice * quantity;
      
      orderItemsToInsert.push({
        menu_item_id: dbItem.id,
        quantity: quantity,
        unit_price: unitPrice
      });
    }

    // Add delivery fee (e.g. 250)
    totalAmount += 250; 

    // 3. Create the order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([{
        total_amount: totalAmount,
        payment_method: paymentMethod,
        delivery_address: customerDetails.address,
        city: 'Karachi',
        additional_instructions: customerDetails.instructions,
        status: 'pending',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid' // Simulate payment logic
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create order items
    const itemsWithOrderId = orderItemsToInsert.map(i => ({
      ...i,
      order_id: newOrder.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) throw itemsError;

    res.status(201).json({ 
      success: true, 
      orderId: newOrder.id,
      message: 'Order placed successfully' 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
