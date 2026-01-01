import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FiSearch } from 'react-icons/fi';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { addToCart } = useCart();

  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setSearchQuery(search);
    setSelectedCategory(categoryId);
  }, [search, categoryId]);

  useEffect(() => {
    loadProducts();
    setCurrentPage(1); // Reset to first page when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, search]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
    setCurrentPage(1); // Reset to first page when sorting/filtering changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sortBy, priceRange]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (categoryId) params.category = categoryId;
      if (search) params.search = search;
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
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

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Filter by price range
    if (priceRange.min !== '') {
      result = result.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Filter out inactive products
    result = result.filter(p => p.isActive !== false);

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  // Group products by category
  const getProductsByCategory = () => {
    const grouped = {};
    
    filteredProducts.forEach(product => {
      const categoryName = product.category?.name || 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    return grouped;
  };

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleCategoryChange = (catId) => {
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handlePriceFilter = () => {
    applyFiltersAndSort();
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSortBy('default');
    searchParams.delete('category');
    setSearchParams(searchParams);
    setCurrentPage(1);
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
    
    setSearchParams(params);
  };

  return (
    <div className="products-page container">
      {/* Hero Banner */}
      <div className="products-hero-banner">
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop" 
          alt="Shopping Banner" 
          className="hero-banner-image"
        />
        <div className="hero-banner-overlay">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends and best deals</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="products-search-section">
        <form onSubmit={handleSearch} className="products-search-form">
          <div className="products-search-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="products-category-dropdown"
            >
              <option value="">Shop by Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="products-search-divider"></div>
            <FiSearch className="products-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchSearchSuggestions(e.target.value);
              }}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="products-search-input"
            />
            <button type="submit" className="products-search-btn">
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

      {/* Category Chips */}
      <div className="category-chips-section">
        <button
          onClick={() => handleCategoryChange('')}
          className={`category-chip ${!categoryId ? 'active' : ''}`}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => handleCategoryChange(category._id)}
            className={`category-chip ${categoryId === category._id ? 'active' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select-inline"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-inputs-inline">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="price-input-inline"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="price-input-inline"
            />
            <button onClick={handlePriceFilter} className="btn-apply-inline">
              Apply
            </button>
          </div>
        </div>

        <button onClick={clearFilters} className="btn-clear-inline">
          Clear Filters
        </button>
      </div>

      <div className="products-container">
        <main className="products-main-full">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found</p>
              {(categoryId || search || priceRange.min || priceRange.max) && (
                <button onClick={clearFilters} className="btn-secondary">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {Object.entries(getProductsByCategory()).map(([categoryName, categoryProducts]) => {
                // Show all products if a category is selected, otherwise show only 5
                const displayProducts = categoryId ? categoryProducts : categoryProducts.slice(0, 5);
                const hasMore = categoryProducts.length > 5;
                const category = categories.find(cat => cat.name === categoryName);
                
                return (
                  <div key={categoryName} className="category-section">
                    <div className="category-header">
                      <h2 className="category-title">{categoryName} ({categoryProducts.length})</h2>
                      {hasMore && category && !categoryId && (
                        <Link 
                          to={`/products?category=${category._id}`}
                          className="view-all-btn"
                        >
                          View All
                        </Link>
                      )}
                    </div>
                    <div className="products-grid">
                      {displayProducts.map(product => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onAddToCart={() => addToCart(product, 1)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
