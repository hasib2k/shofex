import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FiTruck, FiCreditCard, FiAward, FiHeadphones } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, newArrivalsRes, bestSellersRes] = await Promise.all([
        productsAPI.getAll({ featured: true, limit: 8 }),
        categoriesAPI.getAll(),
        fetch('http://localhost:5000/api/products/section/new-arrivals?limit=8').then(r => r.json()),
        fetch('http://localhost:5000/api/products/section/best-sellers?limit=8').then(r => r.json())
      ]);
      
      setFeaturedProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
      setNewArrivals(newArrivalsRes.products || []);
      setBestSellers(bestSellersRes.products || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setFeaturedProducts([]);
      setCategories([]);
      setNewArrivals([]);
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600" alt="Shopping" />
        </div>
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to <span className="brand-orange">Shofex</span><span className="brand-green">BD</span></h1>
            <p>Your trusted online shopping destination</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Sliding Featured Products Banner */}
      {featuredProducts.length > 0 && (
        <section className="featured-slider-section">
          <div className="featured-slider-container">
            <div className="featured-slider-track">
              {[...featuredProducts.slice(0, 5), ...featuredProducts.slice(0, 5)].map((product, index) => (
                <Link 
                  key={`slider-${product._id}-${index}`}
                  to={`/products/${product._id}`} 
                  className="featured-slide"
                >
                  <div className="featured-slide-image">
                    <img 
                      src={product.images?.[0] 
                        ? (product.images[0].startsWith('http') 
                            ? product.images[0] 
                            : `http://localhost:5000${product.images[0]}`)
                        : 'https://via.placeholder.com/200x150?text=No+Image'
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="featured-slide-info">
                    <h4>{product.name}</h4>
                    <p className="featured-slide-price">৳{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                <div className="category-image-wrapper">
                  <img 
                    src={category.image || 'https://via.placeholder.com/400x300?text=Category'} 
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="btn btn-outline">View All</Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => addToCart(product, 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section" style={{background: '#f9fafb'}}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">New Arrivals</h2>
              <Link to="/products?sort=-createdAt" className="btn btn-outline">View All</Link>
            </div>
            <div className="products-grid">
              {newArrivals.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Best Sellers</h2>
              <Link to="/products?sort=-soldCount" className="btn btn-outline">View All</Link>
            </div>
            <div className="products-grid">
              {bestSellers.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <FiTruck size={40} />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FiCreditCard size={40} />
              </div>
              <h3>Secure Payment</h3>
              <p>Multiple payment options</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FiAward size={40} />
              </div>
              <h3>Quality Products</h3>
              <p>100% authentic products</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FiHeadphones size={40} />
              </div>
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
