import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShofexBD</h3>
            <p>Your trusted online shopping destination</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/orders">My Orders</Link>
          </div>
          
          <div className="footer-section">
            <h4>Customer Service</h4>
            <a href="tel:+8801700000000">+880 1700-000000</a>
            <a href="mailto:info@shofexbd.com">info@shofexbd.com</a>
          </div>
          
          <div className="footer-section">
            <h4>Payment Methods</h4>
            <p>bKash, Nagad, Rocket, Cards, Banking, Cash on Delivery</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShofexBD. All rights reserved.</p>
          <a 
            href="http://localhost:3001" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="admin-footer-link"
            title="Admin Panel"
          >
            <FiSettings size={18} />
            Admin Panel
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
