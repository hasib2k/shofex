import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // If there's a new image file, use it; otherwise use the existing image URL
      if (imageFile) {
        // For now, just use the preview as the image (you can implement actual upload later)
        submitData.image = formData.image || imagePreview;
      }
      
      if (editId) {
        await categoriesAPI.update(editId, submitData);
        toast.success('Category updated');
      } else {
        await categoriesAPI.create(submitData);
        toast.success('Category created');
      }
      setFormData({ name: '', description: '', image: '' });
      setImageFile(null);
      setImagePreview('');
      setEditId(null);
      setShowForm(false);
      loadCategories();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (category) => {
    setFormData({ 
      name: category.name, 
      description: category.description || '',
      image: category.image || ''
    });
    setImagePreview(category.image || '');
    setImageFile(null);
    setEditId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await categoriesAPI.delete(id);
      toast.success('Category deleted');
      loadCategories();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h1>Categories</h1>
        <button onClick={() => {
          setShowForm(!showForm); 
          setEditId(null); 
          setFormData({name: '', description: '', image: ''});
          setImageFile(null);
          setImagePreview('');
        }} className="btn btn-primary">
          <FiPlus /> {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{marginBottom: '20px'}}>
          <h3>{editId ? 'Edit Category' : 'Add Category'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
              <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                Enter an image URL or upload a file below
              </small>
            </div>
            <div className="form-group">
              <label>Or Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {(imagePreview || formData.image) && (
              <div className="form-group">
                <label>Image Preview</label>
                <img 
                  src={imagePreview || formData.image} 
                  alt="Preview" 
                  style={{
                    width: '200px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'
                  }}
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id}>
                <td>
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      style={{
                        width: '60px',
                        height: '45px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                  )}
                </td>
                <td>{category.name}</td>
                <td>{category.description || 'N/A'}</td>
                <td>
                  <span className={`badge ${category.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(category)} className="btn btn-sm btn-primary" style={{marginRight: '10px'}}>
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(category._id)} className="btn btn-sm btn-danger">
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

export default Categories;
