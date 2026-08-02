const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../client/.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSignup() {
  console.log("Testing signup with Supabase URL:", process.env.VITE_SUPABASE_URL);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `test_${Date.now()}@example.com`,
      password: 'Password123!@#',
      options: {
        data: { name: 'Test User', phone: '01000000000' }
      }
    });

    if (error) {
      console.error("Signup failed:", error);
      console.log("Error JSON:", JSON.stringify(error, null, 2));
    } else {
      console.log("Signup succeeded! User ID:", data.user?.id);
    }
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

testSignup();
