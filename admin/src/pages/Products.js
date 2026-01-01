import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 100 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0}}>Products ({products.length})</h1>
        <Link to="/products/new" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="card" style={{overflow: 'auto'}}>
        <table className="table">
          <thead>
            <tr>
              <th style={{width: '70px'}}>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th style={{width: '120px'}}>Price</th>
              <th style={{width: '80px'}}>Stock</th>
              <th style={{width: '100px'}}>Status</th>
              <th style={{width: '120px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`}
                      alt={product.name}
                      style={{width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e5e7eb', background: '#f9fafb'}}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: '10px',
                      textAlign: 'center'
                    }}>
                      No Image
                    </div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name || 'N/A'}</td>
                <td>৳{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Link to={`/products/edit/${product._id}`} className="btn btn-sm btn-primary" style={{marginRight: '10px'}}>
                    <FiEdit />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-danger">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
