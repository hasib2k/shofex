import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FiSearch } from 'react-icons/fi';
import { IoRocketSharp, IoShieldCheckmarkSharp, IoDiamondSharp, IoHeadsetSharp } from 'react-icons/io5';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  const fetchSearchSuggestions = async (query) => {
    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await productsAPI.getAll({ search: query, limit: 5 });
      setSearchSuggestions(response.data.products || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSearchSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    
    navigate(`/products?${params.toString()}`);
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

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <h2>Find What You're Looking For</h2>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-dropdown"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="search-divider"></div>
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchSearchSuggestions(e.target.value);
                  }}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map(product => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="suggestion-item"
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                    >
                      <img
                        src={product.images?.[0]
                          ? (product.images[0].startsWith('http')
                              ? product.images[0]
                              : `http://localhost:5000${product.images[0]}`)
                          : 'https://via.placeholder.com/50'
                        }
                        alt={product.name}
                        className="suggestion-image"
                      />
                      <div className="suggestion-info">
                        <div className="suggestion-name">{product.name}</div>
                        <div className="suggestion-price">৳{product.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
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
        <section className="section">
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

      {/* Special Offers Banner */}
      <section className="section special-offers-banner">
        <div className="container">
          <div className="offer-banner-grid">
            <div className="offer-banner-card">
              <img src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop" alt="Summer Sale" />
              <div className="offer-banner-content">
                <h3>Summer Sale</h3>
                <p>Up to 50% Off</p>
                <Link to="/products" className="btn btn-primary">Shop Now</Link>
              </div>
            </div>
            <div className="offer-banner-card">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop" alt="Fashion Week" />
              <div className="offer-banner-content">
                <h3>Fashion Week</h3>
                <p>New Arrivals</p>
                <Link to="/products?category=fashion" className="btn btn-primary">Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="section brands-section">
        <div className="container">
          <h2 className="section-title">Popular Brands</h2>
          <div className="brands-grid">
            <div className="brand-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            </div>
            <div className="brand-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg" alt="Samsung" />
            </div>
            <div className="brand-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" />
            </div>
            <div className="brand-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" />
            </div>
            <div className="brand-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" alt="Sony" />
            </div>
            <div className="brand-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" alt="Dell" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <div className="featured-slider-container">
        <div className="featured-slider-track">
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca58b">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500" alt="Massage Gun Deep Tissue" />
            </div>
            <div className="featured-slide-info">
              <h4>Massage Gun Deep Tissue</h4>
              <p className="featured-slide-price">৳4500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca581">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500" alt="RC Car Racing" />
            </div>
            <div className="featured-slide-info">
              <h4>RC Car Racing</h4>
              <p className="featured-slide-price">৳3500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca56a">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" alt="Winter Jacket Hooded" />
            </div>
            <div className="featured-slide-info">
              <h4>Winter Jacket Hooded</h4>
              <p className="featured-slide-price">৳4500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca572">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500" alt="Protein Powder 2kg" />
            </div>
            <div className="featured-slide-info">
              <h4>Protein Powder 2kg</h4>
              <p className="featured-slide-price">৳3500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca577">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=500" alt="Perfume Eau de Parfum" />
            </div>
            <div className="featured-slide-info">
              <h4>Perfume Eau de Parfum</h4>
              <p className="featured-slide-price">৳4500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca58b">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500" alt="Massage Gun Deep Tissue" />
            </div>
            <div className="featured-slide-info">
              <h4>Massage Gun Deep Tissue</h4>
              <p className="featured-slide-price">৳4500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca581">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500" alt="RC Car Racing" />
            </div>
            <div className="featured-slide-info">
              <h4>RC Car Racing</h4>
              <p className="featured-slide-price">৳3500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca56a">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" alt="Winter Jacket Hooded" />
            </div>
            <div className="featured-slide-info">
              <h4>Winter Jacket Hooded</h4>
              <p className="featured-slide-price">৳4500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca572">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500" alt="Protein Powder 2kg" />
            </div>
            <div className="featured-slide-info">
              <h4>Protein Powder 2kg</h4>
              <p className="featured-slide-price">৳3500</p>
            </div>
          </Link>
          <Link className="featured-slide" to="/products/6954c4deef77ceee0beca577">
            <div className="featured-slide-image">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=500" alt="Perfume Eau de Parfum" />
            </div>
            <div className="featured-slide-info">
              <h4>Perfume Eau de Parfum</h4>
              <p className="featured-slide-price">৳4500</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

