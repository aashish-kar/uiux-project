# Chronos Luxury Watches - Backend API

A Node.js/Express backend API for the Chronos Luxury Watches e-commerce platform.

## 🚀 Features

- **User Authentication** - JWT-based login/signup
- **Product Management** - CRUD operations for luxury watches
- **Shopping Cart** - Add, update, remove items
- **Order Management** - Create and track orders
- **User Profiles** - Manage user information
- **Address Management** - Shipping addresses
- **Payment Integration** - Stripe payment processing

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/luxury-watches
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🧪 Testing the API

Run the comprehensive API test:

```bash
node test-api.js
```

This will test all endpoints:
- ✅ Health check
- ✅ User signup/login
- ✅ Product CRUD operations
- ✅ Cart operations
- ✅ Order management
- ✅ User profile

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### User
```javascript
{
  email: String (required, unique),
  passwordHash: String (required),
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  image: String,
  category: String,
  brand: String,
  colors: [String],
  sizes: [String],
  inStock: Boolean,
  rating: Number,
  stock: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:8080` (Vite dev server)
- `http://localhost:5173` (Vite default port)

Update the CORS configuration in `app.js` if needed.

## 🚀 Deployment

1. **Set environment variables for production**
2. **Use a production MongoDB instance**
3. **Set up proper JWT secrets**
4. **Configure CORS for your domain**
5. **Deploy to your preferred platform**

## 📝 License

This project is part of the Chronos Luxury Watches platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request 