const { supabase } = require('../Config/supabase');

class SupabaseService {
    // User operations
    async createUser(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    async findUserByPhone(phoneNumber) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone_number', phoneNumber)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return data;
    }

    async findUserById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    async updateUser(id, updateData) {
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    // Cart operations
    async createCartItem(cartData) {
        const { data, error } = await supabase
            .from('cart')
            .insert([cartData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    async findCartItem(product, userId) {
        // Match on user_id and product.id inside the JSONB column
        const { data, error } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId)
            .contains('product', { id: product.id })
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    async findCartByUserId(userId) {
        const { data, error } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    }

    async deleteCartItem(id) {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Payment operations
    async createPayment(paymentData) {
        const { data, error } = await supabase
            .from('payments')
            .insert([paymentData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    async findPaymentById(id) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    async updatePayment(id, updateData) {
        const { data, error } = await supabase
            .from('payments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    // Ordered products operations
    async createOrderedProduct(orderData) {
        const { data, error } = await supabase
            .from('ordered_products')
            .insert([orderData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    async findOrderedProductsByUserId(userId) {
        const { data, error } = await supabase
            .from('ordered_products')
            .select(`
                *,
                payments (
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                )
            `)
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    }

    async findOrderedProductsByStatus(userId, status) {
        const { data, error } = await supabase
            .from('ordered_products')
            .select(`
                *,
                payments (
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                )
            `)
            .eq('user_id', userId)
            .eq('status', status);
        
        if (error) throw error;
        return data;
    }

    async findOrderedProductById(id) {
        const { data, error } = await supabase
            .from('ordered_products')
            .select(`
                *,
                payments (
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    async updateOrderStatus(id, status) {
        const { data, error } = await supabase
            .from('ordered_products')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    // Get user with related data
    async getUserWithRelations(userId) {
        const { data, error } = await supabase
            .from('users')
            .select(`
                *,
                cart:cart(*),
                ordered_products:ordered_products(*)
            `)
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return data;
    }
}

module.exports = new SupabaseService();
