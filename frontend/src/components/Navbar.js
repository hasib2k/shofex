import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            <h2>ShofexBD</h2>
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            
            <Link to="/cart" className="nav-link cart-link">
              <FiShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="nav-link">
                  <FiPackage size={20} />
                  <span className="desktop-only">Orders</span>
                </Link>
                <Link to="/profile" className="nav-link">
                  <FiUser size={20} />
                  <span className="desktop-only">{user?.name}</span>
                </Link>
                <button onClick={logout} className="nav-link btn-link">
                  <FiLogOut size={20} />
                  <span className="desktop-only">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
