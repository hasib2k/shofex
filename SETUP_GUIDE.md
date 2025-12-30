# Digital E-Commerce - Quick Start Guide

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

## Step-by-Step Setup

### 1. Install Dependencies

Open PowerShell/Terminal in the project root directory and run:

```powershell
npm run install-all
```

This will install dependencies for all three projects (backend, frontend, admin).

### 2. Configure Backend

Navigate to the backend folder and create environment file:

```powershell
cd backend
copy .env.example .env
```

Edit `.env` file with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digital-ecommerce
JWT_SECRET=your_random_secret_key_here_change_this
JWT_EXPIRE=7d

# SSLCommerz (Get from https://sslcommerz.com)
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

# URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Email (Optional - Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start MongoDB

If using local MongoDB:

```powershell
# Start MongoDB service (Windows)
net start MongoDB

# Or start MongoDB manually
mongod --dbpath="C:\data\db"
```

If using MongoDB Atlas, update `MONGODB_URI` in `.env` with your connection string.

### 4. Create Admin User

```powershell
cd backend
npm run create-admin
```

Follow the prompts to create your admin account. Example:
- Name: Admin User
- Email: admin@digitalecommerce.com
- Phone: +8801700000000
- Password: admin123 (use a strong password!)

### 5. Start Development Servers

#### Option A: Start All Servers Together (Recommended)

From the project root:

```powershell
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Customer Frontend: http://localhost:3000
- Admin Panel: http://localhost:3001

#### Option B: Start Servers Individually

In separate terminal windows:

```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Customer Frontend
cd frontend
npm start

# Terminal 3 - Admin Panel
cd admin
npm start
```

### 6. Access the Applications

- **Customer Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Health Check**: http://localhost:5000/api/health

### 7. Initial Setup (Admin Panel)

1. Login to admin panel with the credentials you created
2. Go to **Categories** and create some categories (e.g., Electronics, Clothing, Books)
3. Go to **Products** and add your first products
4. Test the customer website by browsing and adding products to cart

## Quick Test

### Test Customer Flow:
1. Visit http://localhost:3000
2. Register a new customer account
3. Browse products
4. Add items to cart
5. Proceed to checkout
6. Complete order (use Cash on Delivery for testing)

### Test Admin Flow:
1. Visit http://localhost:3001
2. Login with admin credentials
3. View dashboard statistics
4. Manage products, categories, and orders

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution**: 
- Ensure MongoDB is running
- Check MONGODB_URI in `.env` file
- For Atlas: Whitelist your IP address in MongoDB Atlas

### Issue: Port Already in Use

**Solution**:
```powershell
# Find process using port 5000 (or 3000, 3001)
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: Module Not Found

**Solution**:
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: CORS Error

**Solution**: Check that FRONTEND_URL and ADMIN_URL in backend `.env` match your actual URLs.

## Adding Sample Data (Optional)

Create some test categories and products through the admin panel, or manually via MongoDB:

```javascript
// In MongoDB shell or Compass
use digital-ecommerce

// Insert sample category
db.categories.insertOne({
  name: "Electronics",
  description: "Electronic items and gadgets",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Production Deployment (Basic)

### Build Frontend Applications

```powershell
# Build customer frontend
cd frontend
npm run build

# Build admin panel
cd ../admin
npm run build
```

### Configure for Production

1. Update `.env` with production values:
   - Set `NODE_ENV=production`
   - Set `SSLCOMMERZ_IS_LIVE=true`
   - Use production MongoDB URI
   - Use production domain URLs

2. Use a process manager like PM2:

```powershell
npm install -g pm2
cd backend
pm2 start server.js --name digital-ecommerce
pm2 save
pm2 startup
```

3. Serve built React apps with Nginx or similar web server

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/digital-ecommerce |
| JWT_SECRET | Secret key for JWT tokens | your_secret_key |
| JWT_EXPIRE | JWT token expiration | 7d |
| SSLCOMMERZ_STORE_ID | SSLCommerz store ID | test123 |
| SSLCOMMERZ_STORE_PASSWORD | SSLCommerz store password | test@123 |
| SSLCOMMERZ_IS_LIVE | Use live or sandbox | false |
| FRONTEND_URL | Customer website URL | http://localhost:3000 |
| ADMIN_URL | Admin panel URL | http://localhost:3001 |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email address | your_email@gmail.com |
| EMAIL_PASS | Email password/app password | your_password |

## Next Steps

1. **Customize Branding**: Update colors, logo, and text in the frontend
2. **Configure Payment**: Set up SSLCommerz account and update credentials
3. **Add Products**: Populate your product catalog
4. **Test Thoroughly**: Test all features before going live
5. **Set Up Domain**: Configure your domain and SSL certificate
6. **Configure Email**: Set up email notifications for orders
7. **Monitor**: Set up monitoring and logging for production

## Support

For issues or questions:
1. Check the detailed README.md in each folder (backend, frontend, admin)
2. Review the API documentation in backend/README.md
3. Check console logs for error messages

## Security Checklist Before Production

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Use strong admin password
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up automated backups
- [ ] Review and test all security measures

## Maintenance

### Daily Backups

```powershell
mongodump --uri="mongodb://localhost:27017/digital-ecommerce" --out="backup\$(Get-Date -Format 'yyyyMMdd')"
```

### Update Dependencies

```powershell
# Check for updates
npm outdated

# Update dependencies
npm update
```

---

**Congratulations!** Your Digital E-Commerce platform is now ready. Happy selling! 🎉
