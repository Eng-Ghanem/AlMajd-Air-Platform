const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'server/.env' });
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await sb.auth.signInWithPassword({ email: '41147332a@gmail.com', password: 'Password123!' });
  if (error) return console.error('Login error:', error);
  
  const token = data.session.access_token;
  const res = await fetch('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } });
  console.log('Status:', res.status);
  const json = await res.json();
  console.log('JSON:', json);
}
test();
