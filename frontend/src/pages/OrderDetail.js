import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await ordersAPI.cancel(id, { reason: 'Cancelled by customer' });
      toast.success('Order cancelled');
      loadOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!order) return null;

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="order-detail-page container">
      <button onClick={() => navigate('/orders')} className="btn btn-outline">
        ← Back to Orders
      </button>

      <div className="order-detail-header card">
        <div>
          <h1>Order #{order.orderNumber}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="order-status">
          <span className={`badge badge-${order.status}`}>
            {order.status.toUpperCase()}
          </span>
          <span className={`badge badge-${order.paymentStatus}`}>
            Payment: {order.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="order-detail-content">
        <div className="order-sections">
          <div className="card">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items.map(item => (
                <div key={item._id} className="order-item-detail">
                  <img
                    src={item.product?.images?.[0]
                      ? `http://localhost:5000${item.product.images[0]}`
                      : 'https://via.placeholder.com/80'}
                    alt={item.name}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ৳{item.price}</p>
                  </div>
                  <div className="item-subtotal">
                    ৳{item.subtotal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Shipping Address</h3>
            <p><strong>{order.shippingAddress.name}</strong></p>
            <p>{order.shippingAddress.phone}</p>
            {order.shippingAddress.email && <p>{order.shippingAddress.email}</p>}
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>

          {order.notes && (
            <div className="card">
              <h3>Order Notes</h3>
              <p>{order.notes}</p>
            </div>
          )}

          {canCancel && (
            <button
              onClick={handleCancel}
              className="btn btn-danger btn-block"
            >
              Cancel Order
            </button>
          )}
        </div>

        <div className="order-summary-sidebar card">
          <h3>Order Summary</h3>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>৳{order.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>৳{order.shippingCost}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row">
                <span>Discount:</span>
                <span>-৳{order.discount}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total:</span>
              <span>৳{order.total}</span>
            </div>
          </div>

          <div className="payment-method">
            <h4>Payment Method</h4>
            <p>{order.paymentMethod.toUpperCase()}</p>
          </div>

          {order.transactionId && (
            <div className="transaction-id">
              <h4>Transaction ID</h4>
              <p>{order.transactionId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
