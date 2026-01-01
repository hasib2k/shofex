import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const imageUrl = product.images && product.images.length > 0
    ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`)
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <div className="product-image">
          <img 
            src={imageUrl} 
            alt={product.name}
            onError={handleImageError}
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge badge-warning">Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span className="badge badge-danger">Out of Stock</span>
          )}
          {product.isFeatured && (
            <span className="badge badge-featured">Featured</span>
          )}
        </div>
      </Link>
      
      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-price">
          <span className="current-price">৳{product.price}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <>
              <span className="compare-price">৳{product.comparePrice}</span>
              <span className="discount">
                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        
        <button
          className="btn btn-primary btn-block"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <FiShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
