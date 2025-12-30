# Digital E-Commerce Platform

A complete single-vendor e-commerce solution with customer frontend and admin panel.

## Project Structure

```
shofex/
├── backend/          # Node.js + Express API server
├── frontend/         # Customer-facing React website
├── admin/           # Admin panel React application
└── README.md
```

## Features

### Customer Frontend
- Product browsing and search
- Shopping cart and checkout
- SSLCommerz payment integration (bKash, Nagad, Rocket, Cards, Banking)
- Cash on Delivery option
- Customer accounts and order history
- Mobile-responsive design

### Admin Panel
- Dashboard with sales analytics
- Product & inventory management
- Order management with status updates
- Customer management
- Payment tracking
- Invoice generation

### Backend API
- RESTful API architecture
- JWT authentication
- MongoDB database
- SSLCommerz payment gateway
- Secure file uploads
- Email/SMS notifications support

## Technology Stack

- **Frontend & Admin**: React 18, React Router, Axios, TailwindCSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Payment**: SSLCommerz Gateway
- **Authentication**: JWT, bcrypt
- **File Upload**: Multer
- **Security**: Helmet, CORS, express-rate-limit

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Install all dependencies**
   ```bash
   npm run install-all
   ```

2. **Configure Backend**
   - Create `.env` file in `backend/` directory
   - Add required environment variables (see backend/README.md)

3. **Run Development Servers**
   ```bash
   # Run all services
   npm run dev

   # Or run individually:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   npm run admin   # Admin on port 3001
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/digital-ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false

# URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS (Optional)
SMS_API_KEY=your_sms_api_key
```

## Deployment Guide

### Server Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 16+ and npm
- MongoDB 4.4+
- Nginx (recommended)
- SSL Certificate (Let's Encrypt)

### Deployment Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install MongoDB
   # Follow official MongoDB installation guide

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Clone and Build**
   ```bash
   git clone <your-repo-url>
   cd shofex
   npm run install-all

   # Build frontend
   cd frontend && npm run build
   cd ../admin && npm run build
   ```

3. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/digital-ecommerce
   server {
       listen 80;
       server_name yourdomain.com;

       # Customer Frontend
       location / {
           root /path/to/shofex/frontend/build;
           try_files $uri /index.html;
       }

       # API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   server {
       listen 80;
       server_name admin.yourdomain.com;

       # Admin Panel
       location / {
           root /path/to/shofex/admin/build;
           try_files $uri /index.html;
       }
   }
   ```

4. **SSL Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com
   ```

5. **Process Manager (PM2)**
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name digital-ecommerce-api
   pm2 save
   pm2 startup
   ```

## Domain & DNS Configuration

1. Point your domain to server IP
   - A Record: `yourdomain.com` → `your_server_ip`
   - A Record: `admin.yourdomain.com` → `your_server_ip`
   - A Record: `api.yourdomain.com` → `your_server_ip` (optional)

2. Wait for DNS propagation (15 minutes - 48 hours)

## SSLCommerz Integration

1. Register at https://sslcommerz.com
2. Get Store ID and Store Password
3. Add credentials to backend `.env`
4. Test in sandbox mode before going live
5. Switch `SSLCOMMERZ_IS_LIVE=true` for production

## Default Admin Credentials

**First Time Setup**: Create admin user by running:
```bash
cd backend
node scripts/createAdmin.js
```

Or manually register first user and set role to "admin" in database.

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Regular backups configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

## Backup Strategy

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/digital-ecommerce" --out=/backup/$(date +%Y%m%d)

# Automate with cron
0 2 * * * /usr/bin/mongodump --uri="mongodb://localhost:27017/digital-ecommerce" --out=/backup/$(date +\%Y\%m\%d)
```

## Support & Maintenance

- Keep Node.js and dependencies updated
- Monitor server resources (CPU, RAM, Disk)
- Review logs regularly
- Test payments in sandbox before production
- Backup database daily

## Future Enhancements

- [ ] Android and iOS mobile apps
- [ ] Courier API integration
- [ ] Loyalty programs
- [ ] Advanced analytics
- [ ] Social media integration
- [ ] WhatsApp order notifications
- [ ] Product reviews and ratings
- [ ] Wishlist feature

## License

MIT License - Free to use for Digital E-Commerce

## Contact

For support and inquiries, contact Digital E-Commerce team.
