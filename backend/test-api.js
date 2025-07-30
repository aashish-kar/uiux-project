import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  password: 'TestPassword123',
  phone: '+1234567890'
};

const testProduct = {
  name: 'Luxury Chronograph Watch',
  description: 'Premium Swiss-made chronograph with leather strap',
  price: 2500,
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  category: 'Chronograph',
  brand: 'Chronos',
  colors: ['Black', 'Brown'],
  sizes: ['42mm'],
  stock: 10,
  featured: true
};

let authToken = '';
let userId = '';
let productId = '';

const testAPI = async () => {
  console.log('🧪 Testing Chronos Luxury Watches API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: User Signup
    console.log('2️⃣ Testing User Signup...');
    try {
      const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, testUser);
      console.log('✅ Signup Success:', signupResponse.data);
      userId = signupResponse.data.user.id;
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log('⚠️ User already exists, proceeding with login...');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 3: User Login
    console.log('3️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login Success:', loginResponse.data);
    authToken = loginResponse.data.token;
    console.log('');

    // Test 4: Create Product
    console.log('4️⃣ Testing Product Creation...');
    const productResponse = await axios.post(`${API_BASE_URL}/products`, testProduct, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Product Created:', productResponse.data);
    productId = productResponse.data._id;
    console.log('');

    // Test 5: Get Products
    console.log('5️⃣ Testing Get Products...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log('✅ Products Retrieved:', productsResponse.data.length, 'products found');
    console.log('');

    // Test 6: Get Single Product
    console.log('6️⃣ Testing Get Single Product...');
    const singleProductResponse = await axios.get(`${API_BASE_URL}/products/${productId}`);
    console.log('✅ Single Product Retrieved:', singleProductResponse.data.name);
    console.log('');

    // Test 7: Update Product
    console.log('7️⃣ Testing Product Update...');
    const updateResponse = await axios.put(`${API_BASE_URL}/products/${productId}`, {
      price: 2700,
      stock: 8
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Product Updated:', updateResponse.data.price, 'new price');
    console.log('');

    // Test 8: Add to Cart
    console.log('8️⃣ Testing Add to Cart...');
    const cartResponse = await axios.post(`${API_BASE_URL}/cart`, {
      productId: productId,
      quantity: 1
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Added to Cart:', cartResponse.data);
    console.log('');

    // Test 9: Get Cart
    console.log('9️⃣ Testing Get Cart...');
    const getCartResponse = await axios.get(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Cart Retrieved:', getCartResponse.data.length, 'items in cart');
    console.log('');

    // Test 10: Create Order
    console.log('🔟 Testing Order Creation...');
    const orderResponse = await axios.post(`${API_BASE_URL}/orders`, {
      items: [productId],
      shippingAddress: '123 Luxury St, Premium City, PC 12345',
      paymentMethod: 'credit_card'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Order Created:', orderResponse.data._id);
    console.log('');

    // Test 11: Get User Orders
    console.log('1️⃣1️⃣ Testing Get User Orders...');
    const ordersResponse = await axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User Orders Retrieved:', ordersResponse.data.length, 'orders found');
    console.log('');

    // Test 12: Get User Profile
    console.log('1️⃣2️⃣ Testing Get User Profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User Profile Retrieved:', profileResponse.data.firstName, profileResponse.data.lastName);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('✅ Backend is working perfectly with your frontend!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
};

// Run the tests
testAPI(); 