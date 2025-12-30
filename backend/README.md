# Digital E-Commerce Backend

Backend API server for Digital E-Commerce platform.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

3. **Create admin user**
   ```bash
   npm run create-admin
   ```

4. **Start server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/init` - Initialize payment
- `POST /api/payments/success` - Payment success callback
- `POST /api/payments/fail` - Payment fail callback
- `POST /api/payments/cancel` - Payment cancel callback
- `GET /api/payments/:orderId` - Get payment status

### Customers (Admin)
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id/toggle-active` - Toggle customer active status

### Dashboard (Admin)
- `GET /api/dashboard/stats` - Get dashboard statistics

### Upload (Admin)
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete image

## Database Models

- **User** - Customers and admins
- **Category** - Product categories
- **Product** - Product catalog
- **Order** - Customer orders

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- SSLCommerz Payment Gateway
- Multer for file uploads
- Nodemailer for emails
