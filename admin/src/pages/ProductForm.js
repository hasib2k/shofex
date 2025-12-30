import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI, categoriesAPI, uploadAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    stock: '',
    sku: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    loadCategories();
    if (id) loadProduct();
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      const product = response.data.product;
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category._id,
        price: product.price,
        comparePrice: product.comparePrice || '',
        stock: product.stock,
        sku: product.sku || '',
        isActive: product.isActive,
        isFeatured: product.isFeatured
      });
      setImages(product.images || []);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs immediately
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...previewUrls]);

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await uploadAPI.single(formData);
        return response.data.path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      
      // Replace preview URLs with actual uploaded paths
      setImages(prevImages => {
        const newImages = [...prevImages];
        // Remove the preview URLs we just added
        newImages.splice(newImages.length - files.length, files.length);
        // Add the uploaded paths
        return [...newImages, ...uploadedPaths];
      });
      
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      toast.success(`${files.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
      // Remove preview URLs on error
      setImages(prevImages => prevImages.slice(0, prevImages.length - files.length));
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = images[index];
    // Clean up blob URL if it's a preview
    if (imageToRemove?.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);

    try {
      const productData = { ...formData, images };
      
      if (id) {
        await productsAPI.update(id, productData);
        toast.success('Product updated');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created');
      }
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div>
      <h1>{id ? 'Edit Product' : 'Add Product'}</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Images *</label>
            <div style={{marginBottom: '15px'}}>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
              <label
                htmlFor="imageUpload"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              >
                {uploading ? (
                  <>
                    <div className="spinner" style={{width: '20px', height: '20px'}}></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={20} />
                    Choose Images
                  </>
                )}
              </label>
            </div>

            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '15px'
              }}>
                {images.filter(image => image).map((image, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                  }}>
                    <img
                      src={image?.startsWith('http') || image?.startsWith('blob:') ? image : `http://localhost:5000${image}`}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      <FiX size={16} />
                    </button>
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '2px dashed #d1d5db'
              }}>
                <FiImage size={48} style={{color: '#9ca3af', marginBottom: '10px'}} />
                <p style={{color: '#6b7280', margin: 0}}>No images uploaded yet</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Compare Price</label>
              <input
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active
            </label>

            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/products')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
