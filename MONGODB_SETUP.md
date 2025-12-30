# MongoDB Atlas Setup Guide

MongoDB is not installed locally. Here's the **easiest way** to get started:

## Option 1: MongoDB Atlas (Recommended - Free & Fast) ⭐

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/email (takes 1 minute)

### Step 2: Create Free Cluster
1. Choose **FREE** M0 cluster (0 cost forever)
2. Select **AWS** provider
3. Choose closest region (e.g., Mumbai/Singapore)
4. Click **Create Cluster** (takes 2-3 minutes)

### Step 3: Create Database User
1. Click **Database Access** (left menu)
2. Click **Add New Database User**
3. Username: `admin`
4. Password: `admin1234` (or your choice)
5. Click **Add User**

### Step 4: Whitelist IP Address
1. Click **Network Access** (left menu)
2. Click **Add IP Address**
3. Click **Allow Access From Anywhere** (for development)
4. Click **Confirm**

### Step 5: Get Connection String
1. Click **Database** (left menu)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File
1. Open `backend\.env`
2. Replace the MONGODB_URI line with:
   ```
   MONGODB_URI=mongodb+srv://admin:admin1234@cluster0.xxxxx.mongodb.net/digital-ecommerce?retryWrites=true&w=majority
   ```
   (Replace `<password>` with your actual password and use your cluster URL)

### Step 7: Run The Application! 🚀
```powershell
# From project root
npm run dev
```

That's it! Your database is ready in the cloud.

---

## Option 2: Install MongoDB Locally (If you prefer local)

### For Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Choose **Windows x64** version
3. Run installer with default settings
4. MongoDB will auto-start

### After Installation:
MongoDB should start automatically. If not:
```powershell
net start MongoDB
```

Then run:
```powershell
npm run dev
```

---

## Quick Test After Setup

Once MongoDB is connected, run these scripts:

### Create Admin User
```powershell
cd backend
node create-admin-quick.js
```

### Add Dummy Data
```powershell
cd backend
node seed-dummy-data.js
```

### Start Application
```powershell
# From root folder
npm run dev
```

Visit:
- Customer site: http://localhost:3000
- Admin panel: http://localhost:3001

---

## Need Help?

If you see errors:
1. Double-check the connection string has your correct password
2. Make sure IP is whitelisted in MongoDB Atlas
3. Verify cluster is created and active

**Tip:** MongoDB Atlas is recommended because:
- ✅ No installation needed
- ✅ Works immediately
- ✅ Free forever (M0 tier)
- ✅ Automatic backups
- ✅ No maintenance
