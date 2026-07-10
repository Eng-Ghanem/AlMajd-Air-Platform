require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Import database client from the external database folder
const supabase = require('../database');

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('AlMajd Air API is running with Supabase!');
});

// API: Submit Service Request
app.post('/api/requests', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
  try {
    const { name, phone, serviceType, message } = req.body;
    if (!name || !phone || !serviceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert([
        { name, phone, service_type: serviceType, message, total_price: 250 }
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
