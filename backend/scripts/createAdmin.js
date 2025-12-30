require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n=== Create Admin User ===\n');

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const phone = await question('Enter admin phone: ');
    const password = await question('Enter admin password (min 6 characters): ');

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      console.log('\n❌ User with this email or phone already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      phone,
      password,
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Phone:', admin.phone);
    console.log('Role:', admin.role);
    console.log('\nYou can now login with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
