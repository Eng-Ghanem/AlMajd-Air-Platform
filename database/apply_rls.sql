-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_prices ENABLE ROW LEVEL SECURITY;

-- Remove any existing public permissive policies if they exist
DROP POLICY IF EXISTS "Public access" ON users;
DROP POLICY IF EXISTS "Public access" ON service_requests;
DROP POLICY IF EXISTS "Public access" ON payments;
DROP POLICY IF EXISTS "Public access" ON subscriptions;
DROP POLICY IF EXISTS "Public access" ON device_prices;

-- Policy: Allow public to SELECT from device_prices (safe to read)
CREATE POLICY "Public can read device prices" 
ON device_prices FOR SELECT 
USING (true);

-- Policy: Allow users to SELECT their own profile data
CREATE POLICY "Users can read own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

-- Policy: Allow users to UPDATE their own profile data
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = id::text);

-- No INSERT or DELETE policies are created for anon users.
-- The Express backend using the Service Role Key will bypass RLS.
