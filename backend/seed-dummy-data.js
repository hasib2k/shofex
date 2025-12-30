require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    isActive: true,
    order: 1
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    isActive: true,
    order: 2
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture and home decor items',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    isActive: true,
    order: 3
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Wide collection of books and magazines',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    isActive: true,
    order: 4
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and fitness gear',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    isActive: true,
    order: 5
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Beauty and personal care products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    isActive: true,
    order: 6
  },
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Fun toys and games for all ages',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
    isActive: true,
    order: 7
  },
  {
    name: 'Grocery & Food',
    slug: 'grocery-food',
    description: 'Fresh groceries and food items',
    image: 'https://images.unsplash.com/photo-1543168256-418811576931?w=400',
    isActive: true,
    order: 8
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car accessories and auto parts',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
    isActive: true,
    order: 9
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Health supplements and wellness products',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
    isActive: true,
    order: 10
  },
  {
    name: 'Garden & Outdoor',
    slug: 'garden-outdoor',
    description: 'Gardening tools and outdoor equipment',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    isActive: true,
    order: 11
  },
  {
    name: 'Jewelry & Watches',
    slug: 'jewelry-watches',
    description: 'Elegant jewelry and luxury watches',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    isActive: true,
    order: 12
  }
];

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal clear sound quality.',
    price: 4500,
    comparePrice: 6000,
    stock: 50,
    sku: 'ELEC-HP-001',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    isFeatured: true,
    tags: ['electronics', 'audio', 'wireless']
  },
  {
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 5-day battery life.',
    price: 8500,
    comparePrice: 10000,
    stock: 35,
    sku: 'ELEC-SW-001',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    isFeatured: true,
    tags: ['electronics', 'smartwatch', 'fitness']
  },
  {
    name: 'Casual Cotton T-Shirt',
    slug: 'casual-cotton-t-shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear.',
    price: 599,
    comparePrice: 899,
    stock: 100,
    sku: 'FASH-TS-001',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    isFeatured: true,
    tags: ['fashion', 'clothing', 'casual']
  },
  {
    name: 'Designer Backpack',
    slug: 'designer-backpack',
    description: 'Stylish and durable laptop backpack with multiple compartments and water-resistant material.',
    price: 2500,
    comparePrice: 3500,
    stock: 45,
    sku: 'FASH-BP-001',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    isFeatured: true,
    tags: ['fashion', 'accessories', 'backpack']
  },
  {
    name: 'Modern Table Lamp',
    slug: 'modern-table-lamp',
    description: 'Elegant LED table lamp with adjustable brightness and modern minimalist design.',
    price: 1800,
    comparePrice: 2500,
    stock: 30,
    sku: 'HOME-LAMP-001',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
    isFeatured: true,
    tags: ['home', 'lighting', 'decor']
  },
  {
    name: 'Decorative Wall Clock',
    slug: 'decorative-wall-clock',
    description: 'Vintage-style wall clock with silent movement. Perfect accent piece for any room.',
    price: 1200,
    comparePrice: 1800,
    stock: 25,
    sku: 'HOME-CLK-001',
    images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500'],
    isFeatured: true,
    tags: ['home', 'decor', 'clock']
  },
  {
    name: 'The Art of Programming',
    slug: 'the-art-of-programming',
    description: 'Comprehensive guide to modern programming practices and design patterns.',
    price: 850,
    comparePrice: 1200,
    stock: 60,
    sku: 'BOOK-PROG-001',
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'],
    isFeatured: true,
    tags: ['books', 'programming', 'education']
  },
  {
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly and durable.',
    price: 1500,
    comparePrice: 2000,
    stock: 40,
    sku: 'SPORT-YM-001',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    isFeatured: true,
    tags: ['sports', 'yoga', 'fitness']
  },
  {
    name: 'Gaming Keyboard RGB',
    slug: 'gaming-keyboard-rgb',
    description: 'Mechanical gaming keyboard with customizable RGB lighting and programmable keys.',
    price: 3500,
    comparePrice: 4500,
    stock: 30,
    sku: 'ELEC-KB-001',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
    isFeatured: false,
    tags: ['electronics', 'gaming', 'keyboard']
  },
  {
    name: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: 'High-precision wireless gaming mouse with 6 programmable buttons and 16000 DPI.',
    price: 2500,
    comparePrice: 3500,
    stock: 45,
    sku: 'ELEC-MS-001',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    isFeatured: false,
    tags: ['electronics', 'gaming', 'mouse']
  },
  {
    name: 'Leather Wallet',
    slug: 'leather-wallet',
    description: 'Genuine leather bifold wallet with multiple card slots and RFID protection.',
    price: 1200,
    comparePrice: 1800,
    stock: 60,
    sku: 'FASH-WL-001',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'],
    isFeatured: false,
    tags: ['fashion', 'accessories', 'wallet']
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Lightweight running shoes with breathable mesh and cushioned sole for maximum comfort.',
    price: 3500,
    comparePrice: 5000,
    stock: 50,
    sku: 'FASH-SH-001',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    isFeatured: true,
    tags: ['fashion', 'shoes', 'sports']
  },
  {
    name: 'Desk Organizer Set',
    slug: 'desk-organizer-set',
    description: 'Complete bamboo desk organizer set with pen holder, drawers, and phone stand.',
    price: 1800,
    comparePrice: 2500,
    stock: 35,
    sku: 'HOME-ORG-001',
    images: ['https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500'],
    isFeatured: false,
    tags: ['home', 'office', 'organizer']
  },
  {
    name: 'Cooking Recipe Book',
    slug: 'cooking-recipe-book',
    description: 'Collection of 500+ easy and delicious recipes for everyday cooking.',
    price: 650,
    comparePrice: 950,
    stock: 70,
    sku: 'BOOK-COOK-001',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
    isFeatured: false,
    tags: ['books', 'cooking', 'recipe']
  },
  {
    name: 'Dumbbell Set 10kg',
    slug: 'dumbbell-set-10kg',
    description: 'Adjustable dumbbell set with rubber coating and anti-slip grip for home workouts.',
    price: 2800,
    comparePrice: 3500,
    stock: 25,
    sku: 'SPORT-DB-001',
    images: ['https://images.unsplash.com/photo-1517836477839-7072aaa8b121?w=500'],
    isFeatured: false,
    tags: ['sports', 'fitness', 'weights']
  },
  {
    name: 'Face Serum Vitamin C',
    slug: 'face-serum-vitamin-c',
    description: 'Brightening vitamin C serum with hyaluronic acid for radiant and youthful skin.',
    price: 1500,
    comparePrice: 2200,
    stock: 55,
    sku: 'BEAUTY-SER-001',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
    isFeatured: true,
    tags: ['beauty', 'skincare', 'serum']
  },
  {
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof portable speaker with 360° sound and 12-hour battery life.',
    price: 2200,
    comparePrice: 3000,
    stock: 40,
    sku: 'ELEC-SPK-001',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    isFeatured: false,
    tags: ['electronics', 'audio', 'speaker']
  },
  {
    name: 'Canvas Wall Art',
    slug: 'canvas-wall-art',
    description: 'Modern abstract canvas wall art set of 3 pieces for living room decoration.',
    price: 3500,
    comparePrice: 5000,
    stock: 20,
    sku: 'HOME-ART-001',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500'],
    isFeatured: false,
    tags: ['home', 'decor', 'art']
  },
  {
    name: 'Sunglasses Polarized',
    slug: 'sunglasses-polarized',
    description: 'Classic aviator polarized sunglasses with UV400 protection and metal frame.',
    price: 1800,
    comparePrice: 2500,
    stock: 65,
    sku: 'FASH-SG-001',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'],
    isFeatured: false,
    tags: ['fashion', 'accessories', 'sunglasses']
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    // Clear existing data
    console.log('🗑️  Clearing existing categories and products...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    console.log('📦 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Assign categories to products
    const electronicsCategory = createdCategories.find(c => c.name === 'Electronics');
    const fashionCategory = createdCategories.find(c => c.name === 'Fashion');
    const homeCategory = createdCategories.find(c => c.name === 'Home & Living');
    const booksCategory = createdCategories.find(c => c.name === 'Books');
    const sportsCategory = createdCategories.find(c => c.name === 'Sports');
    const beautyCategory = createdCategories.find(c => c.name === 'Beauty');

    products[0].category = electronicsCategory._id;
    products[1].category = electronicsCategory._id;
    products[2].category = fashionCategory._id;
    products[3].category = fashionCategory._id;
    products[4].category = homeCategory._id;
    products[5].category = homeCategory._id;
    products[6].category = booksCategory._id;
    products[7].category = sportsCategory._id;
    products[8].category = electronicsCategory._id; // Gaming Keyboard
    products[9].category = electronicsCategory._id; // Gaming Mouse
    products[10].category = fashionCategory._id; // Leather Wallet
    products[11].category = fashionCategory._id; // Running Shoes
    products[12].category = homeCategory._id; // Desk Organizer
    products[13].category = booksCategory._id; // Cooking Recipe Book
    products[14].category = sportsCategory._id; // Dumbbell Set
    products[15].category = beautyCategory._id; // Face Serum
    products[16].category = electronicsCategory._id; // Bluetooth Speaker
    products[17].category = homeCategory._id; // Canvas Wall Art
    products[18].category = fashionCategory._id; // Sunglasses

    // Insert products
    console.log('📦 Creating featured products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} featured products\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Dummy data created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nCategories:');
    createdCategories.forEach(cat => console.log(`  • ${cat.name}`));
    console.log('\nFeatured Products:');
    createdProducts.forEach(prod => console.log(`  • ${prod.name} - ${prod.price} BDT`));
    console.log('\n🚀 You can now start the application!');
    console.log('   Run: npm run dev (from root folder)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure MongoDB is running and MONGODB_URI is set correctly in .env\n');
    process.exit(1);
  }
};

seedData();
