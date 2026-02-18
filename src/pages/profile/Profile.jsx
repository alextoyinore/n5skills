import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, X, Loader2, Shield, Bell, CreditCard, Globe, Twitter, Linkedin, Github, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { supabase } from '../../utils/supabaseClient';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        bio: '',
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                headline: user.headline || '',
                bio: user.bio || '',
                website: user.website || '',
                twitter: user.socials?.twitter || '',
                linkedin: user.socials?.linkedin || '',
                github: user.socials?.github || '',
            });
        }
    }, [user]);

    if (user === undefined) return null;
    if (!user) return <div>Please login to view this page.</div>;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.name,
                    headline: formData.headline,
                    bio: formData.bio,
                    website: formData.website,
                    socials: {
                        twitter: formData.twitter,
                        linkedin: formData.linkedin,
                        github: formData.github
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            headline: user?.headline || '',
            bio: user?.bio || '',
            website: user?.website || '',
            twitter: user?.socials?.twitter || '',
            linkedin: user?.socials?.linkedin || '',
            github: user?.socials?.github || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="profile-header"
                >
                    <h1>My Profile</h1>
                    <p>Manage your account settings and preferences</p>
                </motion.div>

                <div className="profile-content">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="profile-card"
                    >
                        <div className="profile-card-header">
                            <h2>Personal Information</h2>
                            {!isEditing && (
                                <button
                                    className="btn-edit"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="profile-avatar-section">
                            <div className="avatar-wrapper">
                                <img src={user?.avatar} alt={user?.name} className="profile-avatar" />
                                {isEditing && (
                                    <button className="avatar-upload-btn">
                                        <Camera size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="profile-form">
                            <div className="form-group">
                                <label><User size={16} /> Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <div className="form-value">{user?.name}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label><FileText size={16} /> Headline</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.headline}
                                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                        placeholder="e.g. Senior Software Engineer & Instructor"
                                    />
                                ) : (
                                    <div className="form-value">{user?.headline || 'Not set'}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label><FileText size={16} /> Bio</label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                        rows="4"
                                    />
                                ) : (
                                    <div className="form-value bio-box">{user?.bio || 'No bio provided yet.'}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label><Mail size={16} /> Email Address</label>
                                <div className="form-value disabled">{user?.email}</div>
                                <small className="form-hint">Email cannot be changed</small>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label><Globe size={16} /> Website</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="https://yourwebsite.com"
                                        />
                                    ) : (
                                        <div className="form-value">{user?.website || 'Not set'}</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label><Twitter size={16} /> Twitter (X)</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                            placeholder="@username"
                                        />
                                    ) : (
                                        <div className="form-value">{user?.socials?.twitter || 'Not set'}</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label><Linkedin size={16} /> LinkedIn</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            placeholder="profile-username"
                                        />
                                    ) : (
                                        <div className="form-value">{user?.socials?.linkedin || 'Not set'}</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label><Github size={16} /> GitHub</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            placeholder="username"
                                        />
                                    ) : (
                                        <div className="form-value">{user?.socials?.github || 'Not set'}</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Shield size={16} /> Account Role</label>
                                <div className="form-value disabled" style={{
                                    textTransform: 'capitalize',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>{user?.role || 'Student'}</span>
                                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                        <a href="/admin" className="admin-link-btn" style={{
                                            fontSize: '0.8rem',
                                            padding: '4px 8px',
                                            background: 'var(--primary-color)',
                                            color: 'white',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <Shield size={12} /> Admin Dashboard
                                        </a>
                                    )}
                                </div>
                                <small className="form-hint">Role is managed by administration</small>
                            </div>

                            {isEditing && (
                                <div className="form-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>Saving <Loader2 className="spinner" size={18} /></>
                                        ) : (
                                            <>Save Changes <Save size={18} /></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Account Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="profile-card"
                    >
                        <div className="profile-card-header">
                            <h2>Account Settings</h2>
                        </div>

                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-icon">
                                    <Shield size={20} />
                                </div>
                                <div className="setting-content">
                                    <h3>Password & Security</h3>
                                    <p>Manage your password and security settings</p>
                                </div>
                                <button className="btn-link">Manage</button>
                            </div>

                            <div className="setting-item">
                                <div className="setting-icon">
                                    <Bell size={20} />
                                </div>
                                <div className="setting-content">
                                    <h3>Notifications</h3>
                                    <p>Configure email and push notifications</p>
                                </div>
                                <button className="btn-link">Manage</button>
                            </div>

                            <div className="setting-item">
                                <div className="setting-icon">
                                    <CreditCard size={20} />
                                </div>
                                <div className="setting-content">
                                    <h3>Billing & Subscription</h3>
                                    <p>View your subscription and payment methods</p>
                                </div>
                                <button className="btn-link">Manage</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
