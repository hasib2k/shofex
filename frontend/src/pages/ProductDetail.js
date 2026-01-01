import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FiArrowLeft } from 'react-icons/fi';
import { IoRocketSharp, IoShieldCheckmarkSharp, IoReturnDownBackSharp, IoDiamondSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
      
      // Load similar products from the same category
      if (response.data.product.category) {
        loadSimilarProducts(response.data.product.category._id || response.data.product.category);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProducts = async (categoryId) => {
    try {
      const response = await productsAPI.getAll({ category: categoryId, limit: 8 });
      const filtered = response.data.products.filter(p => p._id !== id && p.isActive !== false);
      setSimilarProducts(filtered.slice(0, 5));
    } catch (error) {
      console.error('Error loading similar products:', error);
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
    ? (product.images[0].startsWith('http') 
        ? product.images[0] 
        : `http://localhost:5000${product.images[0]}`)
    : 'https://via.placeholder.com/500?text=No+Image';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/500?text=Image+Not+Available';
  };

  return (
    <div className="product-detail container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Products
      </button>

      <div className="product-detail-content">
        <div className="product-images-section">
          <div className="product-images">
            <img 
              src={imageUrl} 
              alt={product.name}
              onError={handleImageError}
            />
          </div>
          <div className="product-name-under-image">
            <h1>{product.name}</h1>
            <p className="product-short-desc">
              {product.description ? product.description.substring(0, 120) + '...' : 'Premium quality product with excellent features'}
            </p>
            <div className="product-rating">
              <span className="rating-stars">★★★★★</span>
              <span className="rating-text">(4.5/5 - 128 reviews)</span>
            </div>
          </div>
        </div>

        <div className="product-details">
          <div className="product-price-label">Price</div>
          <div className="product-price-section">
            <span className="price">৳{product.price.toLocaleString()}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="compare-price">৳{product.comparePrice.toLocaleString()}</span>
                <span className="discount-badge">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} units available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <strong>SKU:</strong> {product.sku || 'N/A'}
            </div>
            {product.brand && (
              <div className="meta-item">
                <strong>Brand:</strong> {product.brand}
              </div>
            )}
            <div className="meta-item">
              <strong>Category:</strong> {product.category?.name || 'Uncategorized'}
            </div>
          </div>

          <div className="description">
            <h3>Product Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="specifications">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-key">{spec.key}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="product-features">
            <div className="feature-item">
              <IoRocketSharp className="feature-icon" />
              <div>
                <strong>Fast Delivery</strong>
                <p>Free shipping on orders over ৳500</p>
              </div>
            </div>
            <div className="feature-item">
              <IoShieldCheckmarkSharp className="feature-icon" />
              <div>
                <strong>Secure Payment</strong>
                <p>100% secure payment</p>
              </div>
            </div>
            <div className="feature-item">
              <IoReturnDownBackSharp className="feature-icon" />
              <div>
                <strong>Easy Returns</strong>
                <p>7 days return policy</p>
              </div>
            </div>
            <div className="feature-item">
              <IoDiamondSharp className="feature-icon" />
              <div>
                <strong>Quality Guaranteed</strong>
                <p>100% authentic products</p>
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
                min="1" 
                max={product.stock}
              />
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >+</button>
            </div>
            
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="similar-products">
          <h2>Similar Products</h2>
          <div className="similar-products-grid">
            {similarProducts.map(similarProduct => (
              <ProductCard
                key={similarProduct._id}
                product={similarProduct}
                onAddToCart={() => addToCart(similarProduct, 1)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
