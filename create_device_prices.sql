-- تشغيل هذا الكود في Supabase SQL Editor لإنشاء جدول أسعار الأجهزة

CREATE TABLE IF NOT EXISTS public.device_prices (
    id TEXT PRIMARY KEY, -- ex: carrier_1.5
    price NUMERIC NOT NULL,
    discount_percentage NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إعطاء الصلاحيات للوصول إلى الجدول (RLS)
ALTER TABLE public.device_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to device_prices" ON public.device_prices FOR SELECT USING (true);
CREATE POLICY "Allow admin update access to device_prices" ON public.device_prices FOR UPDATE USING (true);
CREATE POLICY "Allow admin insert access to device_prices" ON public.device_prices FOR INSERT WITH CHECK (true);

-- إدخال الأسعار الافتراضية
INSERT INTO public.device_prices (id, price, discount_percentage) VALUES
  ('carrier_1.5', 22000, 5),
  ('carrier_2.25', 32000, 0),
  ('carrier_3', 42000, 0),
  ('carrier_4', 55000, 0),
  ('carrier_5', 65000, 0),
  ('midea_1.5', 18000, 10),
  ('midea_2.25', 26000, 0),
  ('midea_3', 34000, 0),
  ('midea_4', 45000, 0),
  ('midea_5', 55000, 0),
  ('free_air_1.5', 16000, 0),
  ('free_air_2.25', 23000, 0),
  ('free_air_3', 30000, 0),
  ('free_air_4', 40000, 0),
  ('free_air_5', 50000, 0),
  ('haier_1.5', 19000, 0),
  ('haier_2.25', 28000, 0),
  ('haier_3', 36000, 0),
  ('haier_4', 48000, 0),
  ('haier_5', 58000, 0)
ON CONFLICT (id) DO NOTHING;
