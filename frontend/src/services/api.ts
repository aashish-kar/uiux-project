import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  role?: 'user' | 'admin';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  rating?: number;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  strapType?: string;
  dialColor?: string;
  engraving?: string;
}

export interface Order {
  _id: string;
  user?: string | User; // for admin table compatibility
  userId?: string | User; // for backend compatibility
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: Address;
  paymentMethod?: string;
  createdAt: string;
}

export interface OrderUpdate {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount?: number;
  paymentMethod?: string;
  shippingAddress?: Partial<Address>;
}

export interface Address {
  _id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

// Auth API
export const authAPI = {
  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await api.get('/products?featured=true');
    return response.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get(`/products?category=${category}`);
    return response.data;
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await api.get(`/products?search=${query}`);
    return response.data;
  },

  // Admin functions
  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    // Patch: Map flat backend cart items to CartItem with nested product
    return response.data.map((item: any) => ({
      _id: item._id,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      product: {
        _id: item.productId || item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        stock: item.stock,
        // fallback/defaults for missing fields
        description: item.description || '',
        category: item.category || '',
        brand: item.brand || '',
        colors: item.colors || [],
        sizes: item.sizes || [],
        inStock: typeof item.stock === 'number' ? item.stock > 0 : true,
        rating: item.rating,
        featured: item.featured || false,
        createdAt: item.createdAt || '',
        updatedAt: item.updatedAt || '',
      }
    }));
  },

  addToCart: async (item: {
    productId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    strapType?: string;
    dialColor?: string;
    engraving?: string;
  }): Promise<CartItem> => {
    const response = await api.post('/cart', item);
    return response.data;
  },

  updateCartItem: async (itemId: string, updates: {
    quantity?: number;
    selectedColor?: string;
    selectedSize?: string;
  }): Promise<CartItem> => {
    const response = await api.put(`/cart/${itemId}`, updates);
    return response.data;
  },

  removeFromCart: async (itemId: string): Promise<void> => {
    await api.delete(`/cart/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await api.post('/cart/clear');
  },
};

// Orders API
export const ordersAPI = {
  createOrder: async (orderData: {
    items: any[];
    shippingAddress: string;
    paymentMethod: string;
    orderNumber: string;
    totalAmount: number;
    status?: string;
  }): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.put('/users/profile', updates);
    return response.data;
  },

  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put('/users/password', passwords);
  },
};

// Addresses API
export const addressesAPI = {
  getUserAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/addresses');
    return response.data;
  },

  addAddress: async (address: Omit<Address, '_id'>): Promise<Address> => {
    const response = await api.post('/addresses', address);
    return response.data;
  },

  updateAddress: async (addressId: string, updates: Partial<Address>): Promise<Address> => {
    const response = await api.put(`/addresses/${addressId}`, updates);
    return response.data;
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/addresses/${addressId}`);
  },

  setDefaultAddress: async (addressId: string): Promise<void> => {
    await api.put(`/addresses/${addressId}/default`);
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: async (): Promise<any[]> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (productId: string): Promise<any> => {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  },

  removeFromWishlist: async (itemId: string): Promise<void> => {
    await api.delete(`/wishlist/${itemId}`);
  },

  clearWishlist: async (): Promise<void> => {
    await api.delete('/wishlist');
  },
};

// Contact API
export const contactAPI = {
  submit: async (data: Omit<Contact, '_id' | 'createdAt'>): Promise<Contact> => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  list: async (): Promise<Contact[]> => {
    const response = await api.get('/contact');
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contact/${id}`);
  },
};

// Admin API
export const adminAPI = {
  // Check if current user is admin
  isAdmin: (): boolean => {
    const user = authAPI.getCurrentUser();
    return user?.role === 'admin';
  },

  // Get all products for admin management
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Create new product
  createProduct: async (productData: FormData) => {
    const response = await api.post('/products', productData, {
      headers: { 'Content-Type': undefined }, // Let browser set multipart/form-data
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id: string, productData: FormData): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Get all orders for admin
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/all');
    // Patch: Map user/customer field for admin table compatibility
    return response.data.map((order: any) => ({
      ...order,
      user: order.userId && typeof order.userId === 'object'
        ? `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim() || order.userId.email || order.userId._id
        : order.userId || order.user || '',
    }));
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Get all users for admin
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<User> => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Create new order (admin)
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update order (admin, status or full update)
  updateOrder: async (orderId: string, updates: any) => {
    const response = await api.put(`/orders/${orderId}/status`, updates);
    return response.data;
  },

  // Delete order (admin)
  deleteOrder: async (orderId: string) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};

// Payment API (Stripe)
export const paymentAPI = {
  createPaymentIntent: async (data: { amount: number; currency: string }) => {
    const response = await api.post('/stripe/payment-intent', data);
    return response.data;
  },
};

export default api; 