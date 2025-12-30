const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const sslcommerzService = require('../utils/sslcommerz');
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/init
// @desc    Initialize SSLCommerz payment
// @access  Private
router.post('/init', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('customer');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Prepare payment data
    const paymentData = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      customer: {
        id: order.customer._id,
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone
      },
      shippingAddress: order.shippingAddress,
      items: order.items
    };

    const paymentResponse = await sslcommerzService.initPayment(paymentData);

    if (paymentResponse.status === 'SUCCESS') {
      res.json({
        success: true,
        gatewayUrl: paymentResponse.GatewayPageURL,
        sessionKey: paymentResponse.sessionkey
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment initialization failed' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during payment initialization' });
  }
});

// @route   POST /api/payments/success
// @desc    Payment success callback
// @access  Public
router.post('/success', async (req, res) => {
  try {
    const { val_id, tran_id } = req.body;

    // Validate payment with SSLCommerz
    const validation = await sslcommerzService.validatePayment(val_id);

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      const order = await Order.findOne({ orderNumber: tran_id });

      if (order) {
        order.paymentStatus = 'paid';
        order.transactionId = val_id;
        order.status = 'confirmed';
        await order.save();

        res.redirect(`${process.env.FRONTEND_URL}/payment/success?order=${order._id}`);
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
      }
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
    }
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
});

// @route   POST /api/payments/fail
// @desc    Payment failure callback
// @access  Public
router.post('/fail', async (req, res) => {
  const { tran_id } = req.body;
  
  const order = await Order.findOne({ orderNumber: tran_id });
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }

  res.redirect(`${process.env.FRONTEND_URL}/payment/fail?order=${order?._id}`);
});

// @route   POST /api/payments/cancel
// @desc    Payment cancellation callback
// @access  Public
router.post('/cancel', async (req, res) => {
  const { tran_id } = req.body;
  
  const order = await Order.findOne({ orderNumber: tran_id });
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }

  res.redirect(`${process.env.FRONTEND_URL}/payment/cancel?order=${order?._id}`);
});

// @route   POST /api/payments/ipn
// @desc    Instant Payment Notification (IPN)
// @access  Public
router.post('/ipn', async (req, res) => {
  try {
    const { val_id, tran_id, status } = req.body;

    const order = await Order.findOne({ orderNumber: tran_id });

    if (order && status === 'VALID') {
      order.paymentStatus = 'paid';
      order.transactionId = val_id;
      order.status = 'confirmed';
      await order.save();
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

// @route   GET /api/payments/:orderId
// @desc    Get payment status
// @access  Private
router.get('/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
