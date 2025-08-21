# Supabase Migration Guide

This guide will help you migrate your e-commerce project from MongoDB to Supabase.

## Prerequisites

1. A Supabase project (create one at https://supabase.com)
2. Your Supabase project URL and anon key

## Setup Steps

### 1. Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=8080

# Razorpay Configuration (if you're still using it)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script to create all necessary tables

### 3. Update Your Supabase Project URL and Key

Replace the placeholder values in your `.env` file:
- `SUPABASE_URL`: Your Supabase project URL (e.g., https://abcdefghijklm.supabase.co)
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key

### 4. Install Dependencies

The Supabase client has already been installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

### 5. Test the Connection

Start your server:

```bash
npm run dev
```

You should see "Supabase connected successfully" in the console.

## Database Schema Changes

### Tables Created:

1. **users** - User accounts and authentication
2. **cart** - Shopping cart items
3. **payments** - Payment records
4. **ordered_products** - Order history and status

### Key Changes from MongoDB:

- **IDs**: Changed from MongoDB ObjectId to UUID
- **Field Names**: Changed to snake_case (PostgreSQL convention)
- **Relationships**: Using foreign keys instead of MongoDB references
- **JSON Storage**: Product data stored as JSONB for flexibility

## API Endpoints

All existing API endpoints have been updated to work with Supabase:

- `/api/v1/signup` - User registration
- `/api/v1/login` - User authentication
- `/api/v1/addtocart` - Add items to cart
- `/api/v1/removefromcart` - Remove items from cart
- `/api/v1/showcart` - Display cart items
- `/api/v1/orderedproducts` - Show ordered products
- `/api/v1/refundedproducts` - Show refunded products
- `/api/v1/capturepayment` - Initiate payment
- `/api/v1/paymentverification` - Verify payment
- `/api/v1/paymentrefund` - Process refunds

## Troubleshooting

### Common Issues:

1. **Connection Failed**: Check your SUPABASE_URL and SUPABASE_ANON_KEY
2. **Table Not Found**: Ensure you've run the schema.sql script
3. **Permission Denied**: Check your Supabase RLS (Row Level Security) policies

### RLS Policies

You may need to set up RLS policies in Supabase for security. Basic policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordered_products ENABLE ROW LEVEL SECURITY;

-- Example policy for users table
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);
```

## Migration Notes

- All MongoDB-specific operations have been replaced with Supabase equivalents
- The service layer abstracts database operations for easy maintenance
- UUIDs are used instead of MongoDB ObjectIds
- Relationships are handled through foreign keys and joins
- JSONB columns store flexible product data

## Next Steps

1. Test all API endpoints
2. Update frontend to handle UUIDs instead of ObjectIds
3. Set up proper RLS policies in Supabase
4. Configure authentication if needed
5. Test payment flows end-to-end
