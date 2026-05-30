/**
 * Profile Page
 * User profile management and settings
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, LogOut, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    company_name: profile?.company_name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateProfile(formData);

    if (error) {
      toast.error(error.message || 'Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="profile-page safe-area-top">
      <header className="profile-header">
        <h1 className="profile-title">Profile</h1>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-avatar-section">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <User className="w-12 h-12" />
              </div>
            )}
            <h2 className="profile-name">{profile?.full_name || 'User'}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="full_name" className="form-label">
                <User className="w-5 h-5" />
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <Phone className="w-5 h-5" />
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="form-input"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company_name" className="form-label">
                <Building className="w-5 h-5" />
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                className="form-input"
                placeholder="Your Company"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail className="w-5 h-5" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="form-input"
                disabled
              />
              <p className="form-hint">Email cannot be changed</p>
            </div>

            <button type="submit" disabled={loading} className="save-button">
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <div className="profile-actions">
            <Link to="/about" className="action-link">
              Privacy Policy & Terms
            </Link>
            <button onClick={handleSignOut} className="signout-button">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
