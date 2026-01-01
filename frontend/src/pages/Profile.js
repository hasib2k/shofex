import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zipCode: user?.address?.zipCode || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode
        }
      };

      console.log('Sending profile update to:', '/api/auth/profile');
      console.log('Update data:', updateData);
      
      const response = await authAPI.updateProfile(updateData);
      
      console.log('Profile update response:', response.data);
      
      // Update user in context
      updateUser(response.data.token, response.data.user);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      zipCode: user?.address?.zipCode || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="card profile-card">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="form-control"
                  style={{backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                />
                <small style={{color: '#6b7280'}}>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="card profile-card">
              <h3>Shipping Address</h3>
              
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="card profile-card">
              <h3>Personal Information</h3>
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{user?.phone}</span>
              </div>
            </div>

            {user?.address && (
              <div className="card profile-card">
                <h3>Shipping Address</h3>
                <div className="info-row">
                  <span className="label">Street:</span>
                  <span className="value">{user.address.street || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label">City:</span>
                  <span className="value">{user.address.city || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Zip Code:</span>
                  <span className="value">{user.address.zipCode || 'Not provided'}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
