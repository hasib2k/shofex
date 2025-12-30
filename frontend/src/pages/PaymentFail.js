import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import './PaymentSuccess.css';

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="payment-result-page container">
      <div className="result-card card">
        <FiXCircle size={80} color="#ef4444" />
        <h1>Payment Failed</h1>
        <p>Unfortunately, your payment could not be processed.</p>
        <p>Please try again or contact support.</p>

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
            onClick={() => navigate('/cart')}
            className="btn btn-outline"
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
