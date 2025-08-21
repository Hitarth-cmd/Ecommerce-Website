const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.supabase = supabase;

exports.dbconnect = async () => {
    try {
        // Test the connection by making a simple query
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.log('Supabase connection failed');
            console.log(error);
            process.exit(1);
        }
        
        console.log('Supabase connected successfully');
    } catch (error) {
        console.log('Supabase connection failed');
        console.log(error);
        process.exit(1);
    }
};
