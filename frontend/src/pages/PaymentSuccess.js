import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get('order');

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="payment-result-page container">
      <div className="result-card card">
        <FiCheckCircle size={80} color="#10b981" />
        <h1>Payment Successful!</h1>
        <p>Your order has been placed successfully.</p>
        <p>Thank you for shopping with us!</p>

        <div className="result-actions">
          {orderId && (
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="btn btn-primary"
            >
              View Order
            </button>
          )}
          <button
            onClick={() => navigate('/orders')}
            className="btn btn-outline"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
