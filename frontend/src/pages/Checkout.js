import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zipCode: user?.address?.zipCode || '',
    paymentMethod: 'cod',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          selectedVariations: item.selectedVariations || []
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await ordersAPI.create(orderData);
      const order = response.data.order;

      if (formData.paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${order._id}`);
      } else {
        // Initialize online payment
        const paymentResponse = await paymentsAPI.initPayment(order._id);
        if (paymentResponse.data.success) {
          window.location.href = paymentResponse.data.gatewayUrl;
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const shippingCost = getCartTotal() > 1000 ? 0 : 60;
  const total = getCartTotal() + shippingCost;

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section card">
            <h3>Shipping Information</h3>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section card">
            <h3>Payment Method</h3>
            
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="sslcommerz"
                  checked={formData.paymentMethod === 'sslcommerz'}
                  onChange={handleChange}
                />
                <span>Online Payment (bKash, Nagad, Rocket, Cards)</span>
              </label>
            </div>
          </div>

          <div className="form-section card">
            <h3>Order Notes (Optional)</h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any special instructions..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary card">
          <h3>Order Summary</h3>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.product._id} className="summary-item">
                <span>{item.product.name} × {item.quantity}</span>
                <span>৳{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>৳{getCartTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? 'FREE' : `৳${shippingCost}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>৳{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
