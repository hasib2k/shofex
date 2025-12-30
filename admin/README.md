# Admin Panel - Digital E-Commerce

React-based admin panel for managing the e-commerce platform.

## Features

- Dashboard with analytics and statistics
- Product management (CRUD operations)
- Category management
- Order management with status updates
- Customer management
- Sales charts and reports
- Inventory tracking

## Technology Stack

- React 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- React Hot Toast for notifications
- React Icons

## Available Scripts

### `npm start`
Runs the admin panel at [http://localhost:3001](http://localhost:3001)

### `npm run build`
Builds the admin panel for production

## Default Admin Credentials

Create admin user using the backend script:
```bash
cd backend
npm run create-admin
```

## Project Structure

```
admin/
├── public/
├── src/
│   ├── components/
│   │   └── Sidebar.js       # Navigation sidebar
│   ├── context/
│   │   └── AuthContext.js   # Admin authentication
│   ├── pages/
│   │   ├── Dashboard.js     # Main dashboard
│   │   ├── Products.js      # Product listing
│   │   ├── ProductForm.js   # Add/Edit products
│   │   ├── Categories.js    # Category management
│   │   ├── Orders.js        # Order listing
│   │   ├── OrderDetail.js   # Order details & status update
│   │   ├── Customers.js     # Customer listing
│   │   └── Login.js         # Admin login
│   ├── utils/
│   │   └── api.js           # API configuration
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Key Features

### Dashboard
- Revenue statistics
- Order counts and trends
- Customer metrics
- Sales charts (last 7 days)
- Top-selling products
- Recent orders overview
- Low stock alerts

### Product Management
- Add new products
- Edit existing products
- Delete products
- Manage inventory
- Set product prices
- Upload product images
- Mark products as featured

### Order Management
- View all orders
- Update order status
- Track payment status
- View customer details
- Add order notes
- Order history

### Category Management
- Create categories
- Edit categories
- Delete categories
- Organize products

## API Integration

All API calls go through `src/utils/api.js`:
- Authentication endpoints
- Product CRUD
- Order management
- Customer management
- Dashboard statistics

## Security

- Admin-only access
- JWT authentication
- Protected routes
- Role-based authorization
- Secure API communication

## Order Status Flow

```
Pending → Confirmed → Processing → Shipped → Delivered
                                    ↓
                                Cancelled
```

## Customization

### Sidebar Navigation
Edit `src/components/Sidebar.js` to add/remove menu items

### Dashboard Widgets
Customize `src/pages/Dashboard.js` for different metrics

### Styling
Update `src/index.css` for theme changes

## Deployment

### Build for Production
```bash
npm run build
```

### Serve on Subdomain
Configure web server to serve admin panel on `admin.yourdomain.com`

### Example Nginx Configuration
```nginx
server {
    server_name admin.yourdomain.com;
    
    location / {
        root /path/to/admin/build;
        try_files $uri /index.html;
    }
}
```

## Common Tasks

### Add New Product
1. Login to admin panel
2. Navigate to Products
3. Click "Add Product"
4. Fill in details
5. Save

### Update Order Status
1. Go to Orders
2. Click on order
3. Select new status
4. Add note (optional)
5. Update

### View Statistics
1. Dashboard shows:
   - Revenue
   - Orders
   - Customers
   - Sales trends

## Best Practices

- Regular backups
- Monitor low stock items
- Review orders daily
- Update product information regularly
- Respond to customer inquiries promptly

## Troubleshooting

### Cannot Login
- Verify admin user exists in database
- Check credentials
- Ensure backend is running

### Dashboard Not Loading
- Check API connection
- Verify backend is accessible
- Check browser console for errors

## Support

For technical support, refer to:
- Main project README
- Backend API documentation
- Setup guide
