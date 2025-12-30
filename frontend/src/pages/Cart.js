import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart container">
        <FiShoppingBag size={80} color="#9ca3af" />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const shippingCost = getCartTotal() > 1000 ? 0 : 60;
  const total = getCartTotal() + shippingCost;

  return (
    <div className="cart-page container">
      <h1>Shopping Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.images?.[0] 
                  ? `http://localhost:5000${item.product.images[0]}`
                  : 'https://via.placeholder.com/100'}
                alt={item.product.name}
              />
              
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">৳{item.product.price}</p>
              </div>

              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <div className="item-total">
                ৳{item.product.price * item.quantity}
              </div>

              <button
                className="item-remove"
                onClick={() => removeFromCart(item.product._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          
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

          {getCartTotal() < 1000 && (
            <p className="free-shipping-notice">
              Add ৳{1000 - getCartTotal()} more for free shipping!
            </p>
          )}

          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
