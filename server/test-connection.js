require('dotenv').config();

console.log('🔍 Testing Supabase Connection...');
console.log('===============================\n');

// Check environment variables
console.log('Environment Variables:');
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}\n`);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.log('❌ Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
    console.log('📖 See SUPABASE_SETUP.md for instructions');
    process.exit(1);
}

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    console.log('🔌 Testing connection...');
    
    // Test with a simple query
    supabase
        .from('users')
        .select('count')
        .limit(1)
        .then(({ data, error }) => {
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('✅ Connection successful! (Table might not exist yet)');
                    console.log('💡 Run the SQL script from database/schema.sql in your Supabase dashboard');
                } else {
                    console.log('❌ Connection failed:', error.message);
                }
            } else {
                console.log('✅ Connection successful!');
            }
        })
        .catch(err => {
            console.log('❌ Connection error:', err.message);
        });
        
} catch (error) {
    console.log('❌ Failed to create Supabase client:', error.message);
}
