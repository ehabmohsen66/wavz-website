import { useState } from 'react';
import api from '../api/client';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);
  const toast = useToast();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      // In our API index.php, users can be edited via PUT /api/users/{id}
      await api.put(`/users/${user.id}`, { name, avatar });
      await checkAuth(); // refresh Auth context state
      toast.success('Profile details updated successfully');
    } catch (err) {
      toast.error('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('New password is required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdatingPass(true);
    try {
      // In our index.php / users model, sending password updates the account credential securely
      await api.put(`/users/${user.id}`, { password: newPassword });
      toast.success('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (err) {
      toast.error('Failed to change password: ' + err.message);
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">My Account Settings</h1>
          <p className="page-subtitle">Update your personal profile information and login password.</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 24, alignItems: 'flex-start' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: 24 }}>
          <div className="card-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            <h3 className="card-title">Profile Information</h3>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ width: 140 }}>
                <ImageUpload
                  value={avatar}
                  onChange={setAvatar}
                  label="Avatar"
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="profName">Full Name</label>
                  <input
                    id="profName"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profEmail">Email Address</label>
                  <input
                    id="profEmail"
                    type="email"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                  />
                  <div className="form-help">Email cannot be modified by staff.</div>
                </div>
                <div className="form-group">
                  <label className="form-label">System Privilege</label>
                  <span className="badge badge-published" style={{ textTransform: 'uppercase', display: 'inline-block', marginTop: 4 }}>
                    {user?.role || 'editor'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner-border" /> : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="card" style={{ padding: 24 }}>
          <div className="card-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            <h3 className="card-title">Security & Password resets</h3>
          </div>
          <form onSubmit={handleChangePassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="newPass">New Password</label>
                <input
                  id="newPass"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confPass">Confirm New Password</label>
                <input
                  id="confPass"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <button type="submit" className="btn btn-primary" disabled={updatingPass}>
                {updatingPass ? <span className="spinner-border" /> : 'Update Secure Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
