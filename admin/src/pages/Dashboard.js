import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats({ period: 'month' });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon" style={{background: '#dbeafe'}}>
            <FiDollarSign size={24} color="#1e40af" />
          </div>
          <div className="stat-details">
            <h3>৳{stats?.totalRevenue?.toLocaleString() || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{background: '#fef3c7'}}>
            <FiShoppingCart size={24} color="#92400e" />
          </div>
          <div className="stat-details">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{background: '#d1fae5'}}>
            <FiUsers size={24} color="#065f46" />
          </div>
          <div className="stat-details">
            <h3>{stats?.newCustomers || 0}</h3>
            <p>New Customers</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{background: '#e0e7ff'}}>
            <FiTrendingUp size={24} color="#3730a3" />
          </div>
          <div className="stat-details">
            <h3>{stats?.dailySales?.length || 0}</h3>
            <p>Active Days</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3>Sales Overview (Last 7 Days)</h3>
          {stats?.dailySales && stats.dailySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No sales data available</p>
          )}
        </div>

        <div className="card">
          <h3>Top Products</h3>
          <div className="products-list">
            {stats?.topProducts?.slice(0, 5).map((item, index) => (
              <div key={index} className="product-item">
                <span>{item.product?.name}</span>
                <span className="product-sales">{item.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Orders</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders?.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customer?.name}</td>
                <td>৳{order.total}</td>
                <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
