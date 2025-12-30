import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data.order);
      setStatusUpdate({ status: response.data.order.status, note: '' });
      setPaymentStatus(response.data.order.paymentStatus);
    } catch (error) {
      console.error('Error loading order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.updateStatus(id, statusUpdate);
      toast.success('Order status updated');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePaymentStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.updatePaymentStatus(id, { paymentStatus });
      toast.success('Payment status updated');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!order) return null;

  return (
    <div>
      <button onClick={() => navigate('/orders')} className="btn btn-outline" style={{marginBottom: '20px'}}>
        ← Back to Orders
      </button>

      <h1>Order #{order.orderNumber}</h1>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px'}}>
        <div>
          <div className="card">
            <h3>Order Items</h3>
            {order.items.map((item, index) => (
              <div key={index} style={{padding: '10px 0', borderBottom: '1px solid #e5e7eb'}}>
                <strong>{item.name}</strong>
                <div>Quantity: {item.quantity} × ৳{item.price} = ৳{item.subtotal}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Shipping Address</h3>
            <p><strong>{order.shippingAddress.name}</strong></p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
          </div>

          <div className="card">
            <h3>Update Order Status</h3>
            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Note</label>
                <textarea
                  value={statusUpdate.note}
                  onChange={(e) => setStatusUpdate({...statusUpdate, note: e.target.value})}
                  rows="2"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Status
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Payment Status</h3>
            <form onSubmit={handlePaymentStatusUpdate}>
              <div className="form-group">
                <label>Update Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  required
                  style={{marginBottom: '10px'}}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                Update Payment Status
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Order Summary</h3>
            <div style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '10px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '5px 0'}}>
                <span>Subtotal:</span>
                <span>৳{order.subtotal}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '5px 0'}}>
                <span>Shipping:</span>
                <span>৳{order.shippingCost}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontWeight: 'bold', fontSize: '18px'}}>
                <span>Total:</span>
                <span>৳{order.total}</span>
              </div>
            </div>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> <span className={`badge badge-${order.paymentStatus}`}>{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
