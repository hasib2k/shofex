const axios = require('axios');
const Order = require('../models/Order');

class SSLCommerzService {
  constructor() {
    this.storeId = process.env.SSLCOMMERZ_STORE_ID;
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    this.isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';
    this.baseURL = this.isLive 
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  async initPayment(orderData) {
    try {
      const data = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        total_amount: orderData.total,
        currency: 'BDT',
        tran_id: orderData.orderNumber,
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        fail_url: `${process.env.FRONTEND_URL}/payment/fail`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        ipn_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/ipn`,
        
        // Customer info
        cus_name: orderData.customer.name,
        cus_email: orderData.customer.email || 'customer@example.com',
        cus_phone: orderData.customer.phone,
        cus_add1: orderData.shippingAddress.street,
        cus_city: orderData.shippingAddress.city,
        cus_country: 'Bangladesh',
        
        // Shipping info
        shipping_method: 'Courier',
        ship_name: orderData.shippingAddress.name,
        ship_add1: orderData.shippingAddress.street,
        ship_city: orderData.shippingAddress.city,
        ship_country: 'Bangladesh',
        
        // Product info
        product_name: orderData.items.map(item => item.name).join(', '),
        product_category: 'General',
        product_profile: 'general',
        
        // Additional
        value_a: orderData.orderId,
        value_b: orderData.customer.id
      };

      const response = await axios.post(`${this.baseURL}/gwprocess/v4/api.php`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data;
    } catch (error) {
      console.error('SSLCommerz Init Error:', error.response?.data || error.message);
      throw new Error('Payment initialization failed');
    }
  }

  async validatePayment(valId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/validator/api/validationserverAPI.php`,
        {
          params: {
            val_id: valId,
            store_id: this.storeId,
            store_passwd: this.storePassword,
            format: 'json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('SSLCommerz Validation Error:', error.message);
      throw new Error('Payment validation failed');
    }
  }

  async refundPayment(bankTranId, refundAmount, refundRemarks) {
    try {
      const response = await axios.post(
        `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php`,
        {
          refund_amount: refundAmount,
          refund_remarks: refundRemarks,
          bank_tran_id: bankTranId,
          store_id: this.storeId,
          store_passwd: this.storePassword
        }
      );

      return response.data;
    } catch (error) {
      console.error('SSLCommerz Refund Error:', error.message);
      throw new Error('Payment refund failed');
    }
  }
}

module.exports = new SSLCommerzService();
