-- MEHFIL Seed Data

-- Clear existing data if needed (optional)
-- DELETE FROM public.order_items;
-- DELETE FROM public.orders;
-- DELETE FROM public.menu_items;
-- DELETE FROM public.categories;

-- Insert Categories and get their IDs
WITH inserted_categories AS (
  INSERT INTO public.categories (name, description, image_url) VALUES 
  ('Starters', 'Begin your culinary journey with our exquisite appetizers', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop'),
  ('Main Course', 'Hearty and flavorful signature dishes', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop'),
  ('BBQ & Grills', 'Char-grilled perfection with authentic spices', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop'),
  ('Desserts', 'Sweet endings to a perfect meal', 'https://images.unsplash.com/photo-1590137876181-2a5a7e340308?w=800&auto=format&fit=crop'),
  ('Beverages', 'Refreshing drinks and traditional mocktails', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop')
  RETURNING id, name
)
-- Insert Menu Items using the returned Category IDs
INSERT INTO public.menu_items (category_id, name, description, price, is_featured, is_vegetarian, is_spicy, image_url)
SELECT c.id, item.name, item.description, item.price, item.is_featured, item.is_vegetarian, item.is_spicy, item.image_url
FROM inserted_categories c
JOIN (
  VALUES 
  ('Starters', 'Reshmi Kebab', 'Silky, tender chicken minced with spices and grilled to perfection.', 1200, true, false, false, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop'),
  ('Starters', 'Lahori Fried Fish', 'Crispy battered fish flavored with traditional Lahori spices.', 1500, true, false, true, 'https://images.unsplash.com/photo-1588636400827-0402b1fbb468?w=800&auto=format&fit=crop'),
  ('Starters', 'Paneer Tikka', 'Cubes of cottage cheese marinated in yogurt and spices, char-grilled.', 1100, false, true, false, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop'),
  ('Starters', 'Mutton Chops', 'Tender mutton chops marinated in secret spices.', 1800, false, false, true, 'https://images.unsplash.com/photo-1544025162-811114215563?w=800&auto=format&fit=crop'),
  ('Starters', 'Hummus with Pita', 'Creamy chickpea dip served with warm pita bread.', 800, false, true, false, 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=800&auto=format&fit=crop'),
  
  ('Main Course', 'Saffron Mutton Biryani', 'Aromatic basmati rice cooked with tender mutton and premium saffron.', 2500, true, false, true, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop'),
  ('Main Course', 'Chicken Karahi', 'Classic wok-cooked chicken in a rich tomato and green chili gravy.', 1900, true, false, true, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop'),
  ('Main Course', 'Nihari', 'Slow-cooked beef stew, rich and flavorful, garnished with ginger and green chilies.', 2200, true, false, true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop'),
  ('Main Course', 'Palak Paneer', 'Cottage cheese cubes in a creamy spinach gravy.', 1400, false, true, false, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop'),
  ('Main Course', 'Dal Makhani', 'Black lentils slow-cooked overnight with butter and cream.', 1200, false, true, false, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop'),

  ('BBQ & Grills', 'Chicken Malai Boti', 'Melt-in-your-mouth chicken cubes marinated in cream and mild spices.', 1500, true, false, false, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop'),
  ('BBQ & Grills', 'Seekh Kebab Platter', 'A mix of beef and chicken minced kebabs.', 2000, true, false, true, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop'),
  ('BBQ & Grills', 'Bihari Boti', 'Thin strips of beef marinated in papaya paste and intense spices.', 1600, false, false, true, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop'),
  ('BBQ & Grills', 'Grilled Prawns', 'Jumbo prawns marinated in garlic and lemon, char-grilled.', 2800, false, false, false, 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop'),

  ('Desserts', 'Shahi Tukda', 'Rich bread pudding dessert soaked in hot milk with spices and nuts.', 800, true, true, false, 'https://images.unsplash.com/photo-1590137876181-2a5a7e340308?w=800&auto=format&fit=crop'),
  ('Desserts', 'Gulab Jamun', 'Deep-fried milk dumplings soaked in rose-flavored sugar syrup.', 600, false, true, false, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop'),
  ('Desserts', 'Rasmalai', 'Soft paneer balls immersed in chilled creamy milk.', 900, true, true, false, 'https://images.unsplash.com/photo-1590137876181-2a5a7e340308?w=800&auto=format&fit=crop'),
  ('Desserts', 'Kulfi Falooda', 'Traditional unchurned ice cream served with vermicelli and rose syrup.', 850, false, true, false, 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=800&auto=format&fit=crop'),

  ('Beverages', 'Mint Margarita', 'Refreshing blend of fresh mint, lemon, and crushed ice.', 500, true, true, false, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop'),
  ('Beverages', 'Lassi (Sweet/Salted)', 'Traditional yogurt-based drink.', 400, false, true, false, 'https://images.unsplash.com/photo-1595981267035-7b04d84b4f1e?w=800&auto=format&fit=crop'),
  ('Beverages', 'Kashmiri Chai', 'Pink tea brewed with green tea leaves, milk, and crushed nuts.', 600, true, true, false, 'https://images.unsplash.com/photo-1544025162-811114215563?w=800&auto=format&fit=crop'),
  ('Beverages', 'Fresh Lime Soda', 'Classic thirst quencher.', 350, false, true, false, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop')
) AS item(category_name, name, description, price, is_featured, is_vegetarian, is_spicy, image_url)
ON c.name = item.category_name;
