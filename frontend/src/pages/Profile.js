import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page container">
      <h1>My Profile</h1>

      <div className="profile-content">
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
              <span className="value">{user.address.street}</span>
            </div>
            <div className="info-row">
              <span className="label">City:</span>
              <span className="value">{user.address.city}</span>
            </div>
            {user.address.zipCode && (
              <div className="info-row">
                <span className="label">Zip Code:</span>
                <span className="value">{user.address.zipCode}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
