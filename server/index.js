require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Import database client from the external database folder
const supabase = require('../database');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// API: Auth Signup
app.post('/api/auth/signup', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    res.status(200).json({ message: 'OTP sent to email', data });
  } catch (error) {
    console.error('Signup error:', error);
    let errorMsg = 'Unknown error during signup';
    if (error?.message) {
      errorMsg = error.message;
    } else if (error?.error_description) {
      errorMsg = error.error_description;
    } else if (typeof error === 'string') {
      errorMsg = error;
    } else {
      try {
        errorMsg = JSON.stringify(error);
      } catch (e) {
        errorMsg = String(error);
      }
    }
    res.status(400).json({ error: errorMsg });
  }
});

// API: Auth Verify OTP (Signup)
app.post('/api/auth/verify-otp', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { email, token, name } = req.body;
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    if (error) throw error;
    
    // Assign role
    const role = email === '41147332a@gmail.com' ? 'admin' : 'customer';
    
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

// API: Auth Login
app.post('/api/auth/login', async (req, res) => {
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
app.post('/api/auth/forgot-password', async (req, res) => {
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
app.post('/api/auth/reset-password', async (req, res) => {
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
    const { name, phone, serviceType, message, totalPrice } = req.body;
    if (!name || !phone || !serviceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert([
        { name, phone, service_type: serviceType, message, total_price: totalPrice || 0 }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json({ id: data.id, message: 'Request created successfully' });
  } catch (error) {
    console.error('Insert error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Get All Service Requests (Admin)
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
app.delete('/api/requests/:id', async (req, res) => {
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
app.patch('/api/requests/:id/status', async (req, res) => {
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

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// API: Create Payment Intent for Stripe
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in smallest currency unit (e.g. cents)
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({ error: 'Stripe secret key not configured' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 150000, // Default 1500 EGP
      currency: 'egp',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// API: Get All Users (Admin)
app.get('/api/users', async (req, res) => {
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
app.get('/api/payments', async (req, res) => {
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
app.get('/api/subscriptions', async (req, res) => {
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
app.put('/api/device-prices', async (req, res) => {
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
