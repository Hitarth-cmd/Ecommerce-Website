const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Migration Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
} else {
    console.log('📝 Creating .env file...');
    
    const envContent = `# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=8080

# Razorpay Configuration (if you're still using it)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully');
}

console.log('\n📋 Next Steps:');
console.log('1. Update the .env file with your actual Supabase credentials');
console.log('2. Go to your Supabase project dashboard');
console.log('3. Run the SQL script from database/schema.sql in the SQL Editor');
console.log('4. Start the server with: npm run dev');
console.log('\n📖 See SUPABASE_SETUP.md for detailed instructions');
