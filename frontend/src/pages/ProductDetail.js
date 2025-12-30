import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error('Insufficient stock');
      return;
    }
    addToCart(product, quantity);
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!product) return null;

  const imageUrl = product.images?.[0]
    ? `http://localhost:5000${product.images[0]}`
    : 'https://via.placeholder.com/500';

  return (
    <div className="product-detail container">
      <div className="product-detail-content">
        <div className="product-images">
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          
          <div className="product-price-section">
            <span className="price">৳{product.price}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="compare-price">৳{product.comparePrice}</span>
            )}
          </div>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="specifications">
              <h3>Specifications</h3>
              {product.specifications.map((spec, index) => (
                <div key={index} className="spec-item">
                  <strong>{spec.key}:</strong> {spec.value}
                </div>
              ))}
            </div>
          )}

          <div className="actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
