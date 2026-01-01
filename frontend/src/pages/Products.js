import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const { addToCart } = useCart();

  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    loadProducts();
  }, [categoryId, search]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
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
  };

  return (
    <div className="products-page container">
      <div className="products-header">
        <h1>Products ({filteredProducts.length})</h1>
        <div className="header-actions">
          <button onClick={clearFilters} className="btn-clear-filters">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="products-container">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Category</h3>
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="price-input"
              />
            </div>
            <button onClick={handlePriceFilter} className="btn-apply-filter">
              Apply
            </button>
          </div>
        </aside>

        <main className="products-main">
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
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product, 1)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
