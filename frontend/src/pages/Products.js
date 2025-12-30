import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    loadProducts();
  }, [categoryId, search]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryId) params.category = categoryId;
      if (search) params.search = search;
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      // Show dummy data when backend is not available
      const dummyProducts = [
        {
          _id: '1',
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal clear sound quality.',
          price: 4500,
          comparePrice: 6000,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
          category: '1'
        },
        {
          _id: '2',
          name: 'Smart Watch Pro',
          description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 5-day battery life.',
          price: 8500,
          comparePrice: 10000,
          images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
          category: '1'
        },
        {
          _id: '3',
          name: 'Casual Cotton T-Shirt',
          description: 'Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear.',
          price: 599,
          comparePrice: 899,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
          category: '2'
        },
        {
          _id: '4',
          name: 'Designer Backpack',
          description: 'Stylish and durable laptop backpack with multiple compartments and water-resistant material.',
          price: 2500,
          comparePrice: 3500,
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
          category: '2'
        },
        {
          _id: '5',
          name: 'Modern Table Lamp',
          description: 'Elegant LED table lamp with adjustable brightness and modern minimalist design.',
          price: 1800,
          comparePrice: 2500,
          images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
          category: '3'
        },
        {
          _id: '6',
          name: 'Decorative Wall Clock',
          description: 'Vintage-style wall clock with silent movement. Perfect accent piece for any room.',
          price: 1200,
          comparePrice: 1800,
          images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500'],
          category: '3'
        },
        {
          _id: '7',
          name: 'The Art of Programming',
          description: 'Comprehensive guide to modern programming practices and design patterns.',
          price: 850,
          comparePrice: 1200,
          images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'],
          category: '4'
        },
        {
          _id: '8',
          name: 'Yoga Mat Premium',
          description: 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly and durable.',
          price: 1500,
          comparePrice: 2000,
          images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
          category: '5'
        },
        {
          _id: '9',
          name: 'Wireless Gaming Mouse',
          description: 'High-precision wireless gaming mouse with RGB lighting and programmable buttons.',
          price: 3200,
          comparePrice: 4500,
          images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
          category: '1'
        },
        {
          _id: '10',
          name: 'Denim Jeans',
          description: 'Classic fit denim jeans with comfortable stretch fabric.',
          price: 1899,
          comparePrice: 2500,
          images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
          category: '2'
        },
        {
          _id: '11',
          name: 'Ceramic Coffee Mug Set',
          description: 'Set of 4 elegant ceramic coffee mugs with modern design.',
          price: 990,
          comparePrice: 1500,
          images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500'],
          category: '3'
        },
        {
          _id: '12',
          name: 'Bestseller Novel Collection',
          description: 'Box set of 3 bestselling novels from top authors.',
          price: 1299,
          comparePrice: 1800,
          images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
          category: '4'
        }
      ];
      
      // Filter by category if selected
      if (categoryId) {
        setProducts(dummyProducts.filter(p => p.category === categoryId));
      } else {
        setProducts(dummyProducts);
      }
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
      // Show dummy categories when backend is not available
      setCategories([
        { _id: '1', name: 'Electronics' },
        { _id: '2', name: 'Fashion' },
        { _id: '3', name: 'Home & Living' },
        { _id: '4', name: 'Books' },
        { _id: '5', name: 'Sports' },
        { _id: '6', name: 'Beauty' }
      ]);
    }
  };

  const handleCategoryChange = (catId) => {
    if (catId) {
      searchParams.set('category', catId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="products-page container">
      <div className="products-header">
        <h1>Products</h1>
        <div className="filters">
          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={() => addToCart(product, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
