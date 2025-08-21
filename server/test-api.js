const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:8080/api/v1';

async function testSignup() {
    console.log('🧪 Testing Signup...');
    
    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: 'testuser',
                phoneNumber: '1234567890',
                password: 'testpass123',
                confirmPassword: 'testpass123',
                accountType: 'Customer'
            })
        });

        const data = await response.json();
        console.log('Signup Response:', {
            status: response.status,
            success: data.success,
            message: data.message
        });

        return data;
    } catch (error) {
        console.error('Signup Error:', error);
        return null;
    }
}

async function testLogin() {
    console.log('🧪 Testing Login...');
    
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: '1234567890',
                password: 'testpass123',
                accountType: 'Customer'
            })
        });

        const data = await response.json();
        console.log('Login Response:', {
            status: response.status,
            success: data.success,
            message: data.message,
            hasToken: !!data.token
        });

        return data;
    } catch (error) {
        console.error('Login Error:', error);
        return null;
    }
}

async function testProtectedRoute(token) {
    if (!token) {
        console.log('❌ No token provided for protected route test');
        return;
    }

    console.log('🧪 Testing Protected Route (Cart)...');
    
    try {
        const response = await fetch(`${BASE_URL}/showcartitems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        const data = await response.json();
        console.log('Protected Route Response:', {
            status: response.status,
            success: data.success,
            message: data.message
        });

        return data;
    } catch (error) {
        console.error('Protected Route Error:', error);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    // Test 1: Signup
    const signupResult = await testSignup();
    
    if (signupResult && signupResult.success) {
        console.log('✅ Signup successful!\n');
        
        // Test 2: Login
        const loginResult = await testLogin();
        
        if (loginResult && loginResult.success && loginResult.token) {
            console.log('✅ Login successful!\n');
            
            // Test 3: Protected Route
            await testProtectedRoute(loginResult.token);
        } else {
            console.log('❌ Login failed');
        }
    } else {
        console.log('❌ Signup failed, skipping other tests');
    }

    console.log('\n🏁 Tests completed!');
}

// Run tests
runTests().catch(console.error);
