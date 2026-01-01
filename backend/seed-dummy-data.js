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
  },
  {
    name: '4K Ultra HD Monitor 27"',
    slug: '4k-ultra-hd-monitor-27',
    description: '27-inch 4K UHD monitor with HDR support and ultra-slim bezels for professional work.',
    price: 25000,
    comparePrice: 30000,
    stock: 15,
    sku: 'ELEC-MON-001',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'],
    isFeatured: true,
    tags: ['electronics', 'monitor', 'display']
  },
  {
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description: 'True wireless earbuds with active noise cancellation and 24-hour battery life.',
    price: 3500,
    comparePrice: 5000,
    stock: 80,
    sku: 'ELEC-EB-001',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'],
    isFeatured: true,
    tags: ['electronics', 'audio', 'earbuds']
  },
  {
    name: 'Laptop Stand Aluminum',
    slug: 'laptop-stand-aluminum',
    description: 'Ergonomic aluminum laptop stand with adjustable height and cooling design.',
    price: 1500,
    comparePrice: 2000,
    stock: 50,
    sku: 'ELEC-LS-001',
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'],
    isFeatured: false,
    tags: ['electronics', 'accessories', 'laptop']
  },
  {
    name: 'USB-C Hub 7-in-1',
    slug: 'usb-c-hub-7-in-1',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.',
    price: 2200,
    comparePrice: 3000,
    stock: 60,
    sku: 'ELEC-HUB-001',
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'],
    isFeatured: false,
    tags: ['electronics', 'accessories', 'hub']
  },
  {
    name: 'Smart LED Bulbs 4-Pack',
    slug: 'smart-led-bulbs-4-pack',
    description: 'WiFi-enabled color-changing LED bulbs compatible with Alexa and Google Home.',
    price: 3500,
    comparePrice: 4500,
    stock: 40,
    sku: 'HOME-LED-001',
    images: ['https://images.unsplash.com/photo-1558089687-e5dac6f48e6e?w=500'],
    isFeatured: false,
    tags: ['home', 'smart', 'lighting']
  },
  {
    name: 'Ceramic Dinnerware Set',
    slug: 'ceramic-dinnerware-set',
    description: '16-piece ceramic dinnerware set with elegant design, dishwasher safe.',
    price: 4500,
    comparePrice: 6000,
    stock: 30,
    sku: 'HOME-DIN-001',
    images: ['https://images.unsplash.com/photo-1584990347449-39b58a74589c?w=500'],
    isFeatured: false,
    tags: ['home', 'kitchen', 'dinnerware']
  },
  {
    name: 'Memory Foam Pillow',
    slug: 'memory-foam-pillow',
    description: 'Contoured memory foam pillow with cooling gel layer for better sleep.',
    price: 2500,
    comparePrice: 3500,
    stock: 45,
    sku: 'HOME-PIL-001',
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500'],
    isFeatured: false,
    tags: ['home', 'bedroom', 'pillow']
  },
  {
    name: 'Bath Towel Set Premium',
    slug: 'bath-towel-set-premium',
    description: '6-piece ultra-soft cotton bath towel set in multiple colors.',
    price: 3000,
    comparePrice: 4000,
    stock: 35,
    sku: 'HOME-TWL-001',
    images: ['https://images.unsplash.com/photo-1615887023516-9b680e37f08a?w=500'],
    isFeatured: false,
    tags: ['home', 'bathroom', 'towels']
  },
  {
    name: 'Coffee Maker Automatic',
    slug: 'coffee-maker-automatic',
    description: 'Programmable coffee maker with thermal carafe and brew strength control.',
    price: 5500,
    comparePrice: 7000,
    stock: 20,
    sku: 'HOME-COF-001',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'],
    isFeatured: true,
    tags: ['home', 'kitchen', 'appliance']
  },
  {
    name: 'Blender 1000W',
    slug: 'blender-1000w',
    description: 'High-power blender with multiple speed settings and pulse function.',
    price: 3500,
    comparePrice: 4500,
    stock: 30,
    sku: 'HOME-BLD-001',
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500'],
    isFeatured: false,
    tags: ['home', 'kitchen', 'appliance']
  },
  {
    name: 'Denim Jeans Slim Fit',
    slug: 'denim-jeans-slim-fit',
    description: 'Classic slim-fit denim jeans with stretch comfort and modern styling.',
    price: 2500,
    comparePrice: 3500,
    stock: 70,
    sku: 'FASH-JN-001',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    isFeatured: false,
    tags: ['fashion', 'clothing', 'jeans']
  },
  {
    name: 'Polo Shirt Cotton',
    slug: 'polo-shirt-cotton',
    description: 'Classic cotton polo shirt in various colors, perfect for casual wear.',
    price: 1200,
    comparePrice: 1800,
    stock: 90,
    sku: 'FASH-POL-001',
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500'],
    isFeatured: false,
    tags: ['fashion', 'clothing', 'polo']
  },
  {
    name: 'Winter Jacket Hooded',
    slug: 'winter-jacket-hooded',
    description: 'Insulated winter jacket with removable hood and multiple pockets.',
    price: 4500,
    comparePrice: 6000,
    stock: 40,
    sku: 'FASH-JKT-001',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    isFeatured: true,
    tags: ['fashion', 'clothing', 'jacket']
  },
  {
    name: 'Leather Belt Classic',
    slug: 'leather-belt-classic',
    description: 'Genuine leather belt with reversible design and silver buckle.',
    price: 1500,
    comparePrice: 2200,
    stock: 55,
    sku: 'FASH-BLT-001',
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583e2?w=500'],
    isFeatured: false,
    tags: ['fashion', 'accessories', 'belt']
  },
  {
    name: 'Crossbody Bag Leather',
    slug: 'crossbody-bag-leather',
    description: 'Stylish leather crossbody bag with adjustable strap and multiple compartments.',
    price: 3500,
    comparePrice: 5000,
    stock: 35,
    sku: 'FASH-BAG-001',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'],
    isFeatured: false,
    tags: ['fashion', 'accessories', 'bag']
  },
  {
    name: 'Baseball Cap Cotton',
    slug: 'baseball-cap-cotton',
    description: 'Adjustable cotton baseball cap with embroidered logo.',
    price: 800,
    comparePrice: 1200,
    stock: 75,
    sku: 'FASH-CAP-001',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'],
    isFeatured: false,
    tags: ['fashion', 'accessories', 'cap']
  },
  {
    name: 'Fitness Tracker Band',
    slug: 'fitness-tracker-band',
    description: 'Activity tracker with heart rate monitor, sleep tracking, and waterproof design.',
    price: 2500,
    comparePrice: 3500,
    stock: 50,
    sku: 'SPORT-FT-001',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
    isFeatured: false,
    tags: ['sports', 'fitness', 'tracker']
  },
  {
    name: 'Resistance Bands Set',
    slug: 'resistance-bands-set',
    description: '5-piece resistance bands set with different strength levels and carrying bag.',
    price: 1200,
    comparePrice: 1800,
    stock: 60,
    sku: 'SPORT-RB-001',
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'],
    isFeatured: false,
    tags: ['sports', 'fitness', 'bands']
  },
  {
    name: 'Tennis Racket Pro',
    slug: 'tennis-racket-pro',
    description: 'Professional-grade tennis racket with graphite frame and comfortable grip.',
    price: 4500,
    comparePrice: 6000,
    stock: 25,
    sku: 'SPORT-TR-001',
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500'],
    isFeatured: false,
    tags: ['sports', 'tennis', 'racket']
  },
  {
    name: 'Badminton Racket Set',
    slug: 'badminton-racket-set',
    description: '2-player badminton racket set with shuttlecocks and carrying case.',
    price: 2500,
    comparePrice: 3500,
    stock: 35,
    sku: 'SPORT-BR-001',
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500'],
    isFeatured: false,
    tags: ['sports', 'badminton', 'racket']
  },
  {
    name: 'Protein Powder 2kg',
    slug: 'protein-powder-2kg',
    description: 'Whey protein powder with 25g protein per serving, chocolate flavor.',
    price: 3500,
    comparePrice: 4500,
    stock: 40,
    sku: 'SPORT-PRO-001',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'],
    isFeatured: true,
    tags: ['sports', 'fitness', 'supplement']
  },
  {
    name: 'Shaker Bottle 700ml',
    slug: 'shaker-bottle-700ml',
    description: 'Leak-proof protein shaker bottle with mixing ball and measurement marks.',
    price: 500,
    comparePrice: 800,
    stock: 100,
    sku: 'SPORT-SHK-001',
    images: ['https://images.unsplash.com/photo-1623669618812-3e4240f01469?w=500'],
    isFeatured: false,
    tags: ['sports', 'fitness', 'bottle']
  },
  {
    name: 'Hydrating Face Cream',
    slug: 'hydrating-face-cream',
    description: 'Rich moisturizing face cream with hyaluronic acid and SPF 30 protection.',
    price: 1800,
    comparePrice: 2500,
    stock: 50,
    sku: 'BEAUTY-CRM-001',
    images: ['https://images.unsplash.com/photo-1556228994-9a8d36110d53?w=500'],
    isFeatured: false,
    tags: ['beauty', 'skincare', 'moisturizer']
  },
  {
    name: 'Makeup Brush Set 12pc',
    slug: 'makeup-brush-set-12pc',
    description: 'Professional makeup brush set with soft synthetic bristles and organizer.',
    price: 2200,
    comparePrice: 3000,
    stock: 45,
    sku: 'BEAUTY-BRU-001',
    images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'],
    isFeatured: false,
    tags: ['beauty', 'makeup', 'brushes']
  },
  {
    name: 'Hair Dryer Professional',
    slug: 'hair-dryer-professional',
    description: 'Ionic hair dryer with multiple heat settings and cool shot button.',
    price: 3500,
    comparePrice: 4500,
    stock: 30,
    sku: 'BEAUTY-HD-001',
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'],
    isFeatured: false,
    tags: ['beauty', 'hair', 'dryer']
  },
  {
    name: 'Perfume Eau de Parfum',
    slug: 'perfume-eau-de-parfum',
    description: 'Long-lasting eau de parfum with floral and woody notes, 100ml.',
    price: 4500,
    comparePrice: 6000,
    stock: 40,
    sku: 'BEAUTY-PRF-001',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'],
    isFeatured: true,
    tags: ['beauty', 'fragrance', 'perfume']
  },
  {
    name: 'Nail Polish Set 10 Colors',
    slug: 'nail-polish-set-10-colors',
    description: 'Vibrant nail polish collection with quick-dry formula and long-lasting shine.',
    price: 1500,
    comparePrice: 2200,
    stock: 55,
    sku: 'BEAUTY-NP-001',
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500'],
    isFeatured: false,
    tags: ['beauty', 'nails', 'polish']
  },
  {
    name: 'Face Mask Sheet 20-Pack',
    slug: 'face-mask-sheet-20-pack',
    description: 'Assorted sheet masks with natural extracts for different skin concerns.',
    price: 1200,
    comparePrice: 1800,
    stock: 65,
    sku: 'BEAUTY-MSK-001',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500'],
    isFeatured: false,
    tags: ['beauty', 'skincare', 'mask']
  },
  {
    name: 'Fiction Bestseller Collection',
    slug: 'fiction-bestseller-collection',
    description: 'Set of 3 award-winning fiction novels from bestselling authors.',
    price: 1800,
    comparePrice: 2500,
    stock: 45,
    sku: 'BOOK-FIC-001',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    isFeatured: false,
    tags: ['books', 'fiction', 'bestseller']
  },
  {
    name: 'Self-Help Motivation Book',
    slug: 'self-help-motivation-book',
    description: 'Inspiring self-help book with practical strategies for personal growth.',
    price: 750,
    comparePrice: 1100,
    stock: 70,
    sku: 'BOOK-SELF-001',
    images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=500'],
    isFeatured: false,
    tags: ['books', 'self-help', 'motivation']
  },
  {
    name: 'Science Encyclopedia',
    slug: 'science-encyclopedia',
    description: 'Comprehensive science encyclopedia with illustrations and latest discoveries.',
    price: 2500,
    comparePrice: 3500,
    stock: 30,
    sku: 'BOOK-SCI-001',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    isFeatured: false,
    tags: ['books', 'science', 'encyclopedia']
  },
  {
    name: 'Children Story Book Set',
    slug: 'children-story-book-set',
    description: '5-book set of illustrated children stories with moral lessons.',
    price: 1500,
    comparePrice: 2000,
    stock: 50,
    sku: 'BOOK-CHD-001',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    isFeatured: false,
    tags: ['books', 'children', 'stories']
  },
  {
    name: 'Business Strategy Guide',
    slug: 'business-strategy-guide',
    description: 'Essential guide to modern business strategies and entrepreneurship.',
    price: 1200,
    comparePrice: 1800,
    stock: 40,
    sku: 'BOOK-BUS-001',
    images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500'],
    isFeatured: false,
    tags: ['books', 'business', 'strategy']
  },
  {
    name: 'Photography Basics Book',
    slug: 'photography-basics-book',
    description: 'Beginner guide to photography with techniques and tips from professionals.',
    price: 950,
    comparePrice: 1400,
    stock: 45,
    sku: 'BOOK-PHO-001',
    images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500'],
    isFeatured: false,
    tags: ['books', 'photography', 'guide']
  },
  {
    name: 'Building Blocks Set 500pc',
    slug: 'building-blocks-set-500pc',
    description: 'Creative building blocks set with 500 pieces for endless construction fun.',
    price: 2500,
    comparePrice: 3500,
    stock: 35,
    sku: 'TOY-BLK-001',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'],
    isFeatured: false,
    tags: ['toys', 'building', 'kids']
  },
  {
    name: 'RC Car Racing',
    slug: 'rc-car-racing',
    description: 'Remote control racing car with rechargeable battery and LED lights.',
    price: 3500,
    comparePrice: 4500,
    stock: 25,
    sku: 'TOY-RC-001',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    isFeatured: true,
    tags: ['toys', 'rc', 'car']
  },
  {
    name: 'Puzzle 1000 Pieces',
    slug: 'puzzle-1000-pieces',
    description: 'Challenging 1000-piece jigsaw puzzle with beautiful landscape image.',
    price: 1200,
    comparePrice: 1800,
    stock: 40,
    sku: 'TOY-PUZ-001',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500'],
    isFeatured: false,
    tags: ['toys', 'puzzle', 'games']
  },
  {
    name: 'Board Game Family Pack',
    slug: 'board-game-family-pack',
    description: 'Classic board game collection for family fun nights and gatherings.',
    price: 2200,
    comparePrice: 3000,
    stock: 30,
    sku: 'TOY-BRD-001',
    images: ['https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500'],
    isFeatured: false,
    tags: ['toys', 'board', 'games']
  },
  {
    name: 'Action Figure Collectible',
    slug: 'action-figure-collectible',
    description: 'Highly detailed action figure with multiple accessories and articulation.',
    price: 1800,
    comparePrice: 2500,
    stock: 45,
    sku: 'TOY-ACT-001',
    images: ['https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=500'],
    isFeatured: false,
    tags: ['toys', 'action', 'collectible']
  },
  {
    name: 'Stuffed Teddy Bear Large',
    slug: 'stuffed-teddy-bear-large',
    description: 'Soft and cuddly large teddy bear, perfect gift for kids and loved ones.',
    price: 1500,
    comparePrice: 2200,
    stock: 50,
    sku: 'TOY-TED-001',
    images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500'],
    isFeatured: false,
    tags: ['toys', 'stuffed', 'bear']
  },
  {
    name: 'Electric Toothbrush',
    slug: 'electric-toothbrush',
    description: 'Rechargeable electric toothbrush with 3 cleaning modes and timer.',
    price: 2500,
    comparePrice: 3500,
    stock: 40,
    sku: 'HEALTH-TB-001',
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500'],
    isFeatured: false,
    tags: ['health', 'dental', 'toothbrush']
  },
  {
    name: 'Blood Pressure Monitor',
    slug: 'blood-pressure-monitor',
    description: 'Digital blood pressure monitor with large display and memory function.',
    price: 3500,
    comparePrice: 4500,
    stock: 30,
    sku: 'HEALTH-BP-001',
    images: ['https://images.unsplash.com/photo-1584515933487-779824d29309?w=500'],
    isFeatured: false,
    tags: ['health', 'medical', 'monitor']
  },
  {
    name: 'Vitamins Multivitamin',
    slug: 'vitamins-multivitamin',
    description: 'Complete daily multivitamin supplement with essential nutrients, 90 tablets.',
    price: 1500,
    comparePrice: 2000,
    stock: 60,
    sku: 'HEALTH-VIT-001',
    images: ['https://images.unsplash.com/photo-1550572017-4d6d54e4dcbe?w=500'],
    isFeatured: false,
    tags: ['health', 'supplement', 'vitamins']
  },
  {
    name: 'First Aid Kit Complete',
    slug: 'first-aid-kit-complete',
    description: 'Comprehensive first aid kit with 100+ medical supplies for home and travel.',
    price: 2200,
    comparePrice: 3000,
    stock: 35,
    sku: 'HEALTH-FA-001',
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'],
    isFeatured: false,
    tags: ['health', 'first-aid', 'medical']
  },
  {
    name: 'Digital Thermometer',
    slug: 'digital-thermometer',
    description: 'Fast and accurate digital thermometer with fever alarm and memory.',
    price: 800,
    comparePrice: 1200,
    stock: 70,
    sku: 'HEALTH-TH-001',
    images: ['https://images.unsplash.com/photo-1584515933487-779824d29309?w=500'],
    isFeatured: false,
    tags: ['health', 'medical', 'thermometer']
  },
  {
    name: 'Massage Gun Deep Tissue',
    slug: 'massage-gun-deep-tissue',
    description: 'Percussion massage gun with 6 speed levels and multiple attachment heads.',
    price: 4500,
    comparePrice: 6000,
    stock: 25,
    sku: 'HEALTH-MG-001',
    images: ['https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500'],
    isFeatured: true,
    tags: ['health', 'massage', 'recovery']
  },
  {
    name: 'Car Phone Holder Magnetic',
    slug: 'car-phone-holder-magnetic',
    description: 'Strong magnetic car phone mount with 360° rotation and dashboard attachment.',
    price: 800,
    comparePrice: 1200,
    stock: 80,
    sku: 'AUTO-PH-001',
    images: ['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500'],
    isFeatured: false,
    tags: ['automotive', 'accessories', 'holder']
  },
  {
    name: 'Car Vacuum Cleaner',
    slug: 'car-vacuum-cleaner',
    description: 'Portable car vacuum with strong suction and multiple attachments.',
    price: 2500,
    comparePrice: 3500,
    stock: 35,
    sku: 'AUTO-VC-001',
    images: ['https://images.unsplash.com/photo-1584864040848-510e5ecc3ea9?w=500'],
    isFeatured: false,
    tags: ['automotive', 'cleaning', 'vacuum']
  },
  {
    name: 'Dash Cam HD 1080p',
    slug: 'dash-cam-hd-1080p',
    description: 'Full HD dash camera with night vision and loop recording.',
    price: 4500,
    comparePrice: 6000,
    stock: 25,
    sku: 'AUTO-DC-001',
    images: ['https://images.unsplash.com/photo-1533324268280-3072b8c8f9fa?w=500'],
    isFeatured: false,
    tags: ['automotive', 'camera', 'safety']
  },
  {
    name: 'Car Air Freshener Set',
    slug: 'car-air-freshener-set',
    description: 'Long-lasting car air freshener set with 5 different scents.',
    price: 600,
    comparePrice: 900,
    stock: 90,
    sku: 'AUTO-AF-001',
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500'],
    isFeatured: false,
    tags: ['automotive', 'accessories', 'freshener']
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
    const toysCategory = createdCategories.find(c => c.name === 'Toys & Games');
    const healthCategory = createdCategories.find(c => c.name === 'Health & Wellness');
    const autoCategory = createdCategories.find(c => c.name === 'Automotive');

    // Original products (0-18)
    products[0].category = electronicsCategory._id;
    products[1].category = electronicsCategory._id;
    products[2].category = fashionCategory._id;
    products[3].category = fashionCategory._id;
    products[4].category = homeCategory._id;
    products[5].category = homeCategory._id;
    products[6].category = booksCategory._id;
    products[7].category = sportsCategory._id;
    products[8].category = electronicsCategory._id;
    products[9].category = electronicsCategory._id;
    products[10].category = fashionCategory._id;
    products[11].category = fashionCategory._id;
    products[12].category = homeCategory._id;
    products[13].category = booksCategory._id;
    products[14].category = sportsCategory._id;
    products[15].category = beautyCategory._id;
    products[16].category = electronicsCategory._id;
    products[17].category = homeCategory._id;
    products[18].category = fashionCategory._id;

    // New products (19-68)
    products[19].category = electronicsCategory._id; // 4K Monitor
    products[20].category = electronicsCategory._id; // Wireless Earbuds
    products[21].category = electronicsCategory._id; // Laptop Stand
    products[22].category = electronicsCategory._id; // USB-C Hub
    products[23].category = homeCategory._id; // Smart LED Bulbs
    products[24].category = homeCategory._id; // Dinnerware Set
    products[25].category = homeCategory._id; // Memory Foam Pillow
    products[26].category = homeCategory._id; // Bath Towel Set
    products[27].category = homeCategory._id; // Coffee Maker
    products[28].category = homeCategory._id; // Blender
    products[29].category = fashionCategory._id; // Denim Jeans
    products[30].category = fashionCategory._id; // Polo Shirt
    products[31].category = fashionCategory._id; // Winter Jacket
    products[32].category = fashionCategory._id; // Leather Belt
    products[33].category = fashionCategory._id; // Crossbody Bag
    products[34].category = fashionCategory._id; // Baseball Cap
    products[35].category = sportsCategory._id; // Fitness Tracker
    products[36].category = sportsCategory._id; // Resistance Bands
    products[37].category = sportsCategory._id; // Tennis Racket
    products[38].category = sportsCategory._id; // Badminton Racket
    products[39].category = sportsCategory._id; // Protein Powder
    products[40].category = sportsCategory._id; // Shaker Bottle
    products[41].category = beautyCategory._id; // Face Cream
    products[42].category = beautyCategory._id; // Makeup Brush Set
    products[43].category = beautyCategory._id; // Hair Dryer
    products[44].category = beautyCategory._id; // Perfume
    products[45].category = beautyCategory._id; // Nail Polish Set
    products[46].category = beautyCategory._id; // Face Mask Sheet
    products[47].category = booksCategory._id; // Fiction Collection
    products[48].category = booksCategory._id; // Self-Help Book
    products[49].category = booksCategory._id; // Science Encyclopedia
    products[50].category = booksCategory._id; // Children Story Book
    products[51].category = booksCategory._id; // Business Strategy
    products[52].category = booksCategory._id; // Photography Basics
    products[53].category = toysCategory._id; // Building Blocks
    products[54].category = toysCategory._id; // RC Car
    products[55].category = toysCategory._id; // Puzzle
    products[56].category = toysCategory._id; // Board Game
    products[57].category = toysCategory._id; // Action Figure
    products[58].category = toysCategory._id; // Teddy Bear
    products[59].category = healthCategory._id; // Electric Toothbrush
    products[60].category = healthCategory._id; // Blood Pressure Monitor
    products[61].category = healthCategory._id; // Multivitamin
    products[62].category = healthCategory._id; // First Aid Kit
    products[63].category = healthCategory._id; // Digital Thermometer
    products[64].category = healthCategory._id; // Massage Gun
    products[65].category = autoCategory._id; // Car Phone Holder
    products[66].category = autoCategory._id; // Car Vacuum
    products[67].category = autoCategory._id; // Dash Cam
    products[68].category = autoCategory._id; // Car Air Freshener

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
