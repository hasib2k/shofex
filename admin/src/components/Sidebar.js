import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPackage, FiGrid, FiShoppingCart, FiUsers, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/categories', icon: FiGrid, label: 'Categories' },
    { path: '/orders', icon: FiShoppingCart, label: 'Orders' },
    { path: '/customers', icon: FiUsers, label: 'Customers' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>{user?.name}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button onClick={logout} className="logout-btn">
        <FiLogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
