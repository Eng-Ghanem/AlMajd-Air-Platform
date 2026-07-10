const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../server/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL_HERE') {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized from the dedicated /database folder');
} else {
  console.warn('⚠️ WARNING: Supabase URL or Key is missing in .env file. Database operations will fail.');
}

module.exports = supabase;
