-- MEHFIL Schema Migrations (run in Supabase SQL Editor)

-- 1. Create reservations table (if not exists)
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests TEXT NOT NULL,
  occasion TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add customer info columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 3. Enable Row Level Security on reservations (allow all for now)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON public.reservations;
CREATE POLICY "Allow all access" ON public.reservations FOR ALL USING (true);

-- 4. Allow all access to orders (for admin operations)
DROP POLICY IF EXISTS "Allow all access" ON public.orders;
CREATE POLICY "Allow all access" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access on order_items" ON public.order_items;
CREATE POLICY "Allow all access on order_items" ON public.order_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access on menu_items" ON public.menu_items;
CREATE POLICY "Allow all access on menu_items" ON public.menu_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access on categories" ON public.categories;
CREATE POLICY "Allow all access on categories" ON public.categories FOR ALL USING (true);
