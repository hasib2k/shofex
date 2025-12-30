const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics (Admin only)
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Total orders and revenue
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: startDate } });
    
    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // New customers
    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startDate }
    });

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 }, isActive: true })
      .select('name stock sku')
      .limit(10);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .select('orderNumber total status createdAt')
      .sort('-createdAt')
      .limit(5);

    // Daily sales for chart (last 7 days)
    const dailySales = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          paymentStatus: 'paid'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        newCustomers,
        ordersByStatus,
        topProducts,
        lowStockProducts,
        recentOrders,
        dailySales
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
