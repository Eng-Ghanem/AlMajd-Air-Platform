require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Import database client from the external database folder
const supabase = require('../database');

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Restrict to frontend origin in production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts from this IP, please try again later.' }
});

app.use('/api/', apiLimiter);
// We don't apply authLimiter globally to /api/auth/ because /api/auth/me is called very frequently
// and gets rate limited, causing users to lose their roles. We apply it specifically below.

// --- Auth Middleware ---
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw error;
    
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
    req.user = profile || { id: user.id, email: user.email, role: 'customer' };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'technician')) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Admin or Technician access required' });
  }
};

// API: Get Current User Profile (Bypasses RLS)
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(req.user);
});

// API: Sync User to public.users
app.post('/api/auth/sync-user', authLimiter, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { id, email, name, phone } = req.body;
    
    if (!id || !email) {
      return res.status(400).json({ error: 'Missing id or email' });
    }
    
    // Always force role to 'customer' to prevent privilege escalation via API
    const safeRole = 'customer';
    
    // Use insert instead of upsert to prevent modifying existing admin accounts
    let { error: dbError } = await supabase.from('users').insert([
      { id, name, email, phone, role: safeRole }
    ]);
    
    // If it already exists, just ignore it and return success
    if (dbError && dbError.code === '23505') {
       return res.status(200).json({ message: 'User already exists' });
    }
    
    if (dbError) throw dbError;
    
    res.status(200).json({ message: 'User synced successfully' });
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(400).json({ error: error.message || 'Unknown error' });
  }
});

// API: Auth Verify OTP (Signup)
app.post('/api/auth/verify-otp', authLimiter, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { email, token, name } = req.body;
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    if (error) throw error;
    
    // Assign role
    let role = 'customer'; // Default role is always customer for public signups
    
    // Create public user profile
    const { error: dbError } = await supabase.from('users').upsert([
      { id: data.user.id, name, email, role }
    ]);
    if (dbError) throw dbError;
    
    res.status(200).json({ message: 'Verified successfully', user: { id: data.user.id, name, email, role }, session: data.session });
  } catch (error) {
    console.error('Verify OTP error:', error);
    const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    res.status(400).json({ error: errorMsg || 'Unknown error during OTP verification' });
  }
});

// API: Admin Create Technician
app.post('/api/admin/technicians', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { name, email, phone, password } = req.body;
    
    // 1. Create auth user with auto-confirm
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered') || authError.status === 422) {
        throw new Error('هذا البريد الإلكتروني مسجل مسبقاً في النظام.');
      }
      throw authError;
    }

    // 2. Insert into public.users table as technician
    const { error: dbError } = await supabase.from('users').upsert([
      { id: authData.user.id, name, email, phone, role: 'technician' }
    ]);
    
    if (dbError) {
      if (dbError.code === '23505' || dbError.message.includes('unique constraint')) {
        throw new Error('هذا البريد الإلكتروني مسجل مسبقاً في النظام.');
      }
      throw dbError;
    }

    res.status(201).json({ message: 'Technician created successfully', user: { id: authData.user.id, name, email, role: 'technician' } });
  } catch (error) {
    console.error('Create technician error:', error);
    res.status(400).json({ error: error.message || 'Unknown error' });
  }
});

// API: Auth Login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Fetch user role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    res.status(200).json({ user: profile, session: data.session });
  } catch (error) {
    console.error('Login error:', error);
    const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    res.status(400).json({ error: errorMsg || 'Unknown error during login' });
  }
});

// API: Forgot Password
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    res.status(200).json({ message: 'Recovery OTP sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    res.status(400).json({ error: errorMsg || 'Unknown error during forgot password' });
  }
});

// API: Reset Password
app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { email, token, newPassword } = req.body;
    // Verify OTP first
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
    if (error) throw error;
    
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;
    
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    res.status(400).json({ error: errorMsg || 'Unknown error during password reset' });
  }
});

// Basic Route
app.get('/', (req, res) => {
  res.send('AlMajd Air API is running with Supabase!');
});

// API: Submit Service Request
app.post('/api/requests', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { name, phone, email, address, serviceType, message, totalPrice, paymentMethod } = req.body;
    if (!name || !phone || !serviceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const payload = { 
      name, 
      phone, 
      service_type: serviceType, 
      message, 
      total_price: Math.round(Number(totalPrice) || 0) 
    };
    if (email) payload.email = email;
    if (address) payload.address = address;
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    
    // Auto-record payment if provided
    if (paymentMethod) {
      const paymentPayload = { 
        request_id: data.id, 
        amount: Math.round(Number(totalPrice) || 0), 
        status: 'completed'
      };
      
      let { error: paymentError } = await supabase
        .from('payments')
        .insert([{ ...paymentPayload, method: paymentMethod }]);
        
      if (paymentError && paymentError.message.includes('method')) {
        // Fallback for when the 'method' column is missing in the database
        const { error: fallbackError } = await supabase
          .from('payments')
          .insert([paymentPayload]);
        paymentError = fallbackError;
      }
        
      if (paymentError) {
        console.error('Failed to record payment automatically:', paymentError.message);
      } else {
        // Also update request status to paid
        await supabase
          .from('service_requests')
          .update({ status: 'paid' })
          .eq('id', data.id);
      }
    }
    
    res.status(201).json({ id: data.id, message: 'Request created successfully' });
  } catch (error) {
    console.error('Insert error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Get All Service Requests (Admin)
app.post('/api/admin/requests', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { name, phone, email, address, serviceType, message, totalPrice, status, date } = req.body;
    if (!name || !phone || !serviceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const payload = { 
      name, 
      phone, 
      service_type: serviceType, 
      message, 
      total_price: totalPrice || 0,
      status: status || 'paid'
    };
    if (email) payload.email = email;
    if (address) payload.address = address;
    
    if (date) {
      payload.created_at = new Date(date).toISOString();
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json({ id: data.id, message: 'Admin Request created successfully' });
  } catch (error) {
    console.error('Insert admin request error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/requests', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Delete Service Request (Admin)
app.delete('/api/requests/:id', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Update Service Request Status (Admin)
app.patch('/api/requests/:id/status', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
    
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Mock Payment Processing
app.post('/api/payments', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { requestId, amount } = req.body;
    
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([
        { request_id: requestId || null, amount, status: 'completed' }
      ])
      .select()
      .single();
      
    if (paymentError) throw paymentError;
    
    // Update request status if linked
    if (requestId) {
      await supabase
        .from('service_requests')
        .update({ status: 'paid' })
        .eq('id', requestId);
    }
    
    res.status(200).json({ message: 'Payment successful', paymentId: paymentData.id });
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stripe is not currently implemented in frontend.
// Removed /api/create-payment-intent to prevent arbitrary amount specification.

// API: Get All Users (Admin)
app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Fetch users error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Get All Payments with Request details (Admin)
app.get('/api/payments', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    // We join with service_requests to get customer name
    const { data, error } = await supabase
      .from('payments')
      .select('*, service_requests(name, total_price)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Fetch payments error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Get All Subscriptions (Admin)
app.get('/api/subscriptions', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Fetch subscriptions error:', error.message);
    res.json([]);
  }
});

// API: Get Device Prices
app.get('/api/device-prices', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { data, error } = await supabase
      .from('device_prices')
      .select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Fetch device prices error:', error.message);
    res.json([]);
  }
});

// API: Update Device Prices (Admin)
app.put('/api/device-prices', requireAuth, requireAdmin, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { prices } = req.body; // Array of { id, price, discount_percentage }
    if (!prices || !Array.isArray(prices)) {
      return res.status(400).json({ error: 'Invalid prices data' });
    }

    const { data, error } = await supabase
      .from('device_prices')
      .upsert(prices, { onConflict: 'id' })
      .select();

    if (error) throw error;
    res.json({ message: 'Prices updated successfully', data });
  } catch (error) {
    console.error('Update device prices error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
