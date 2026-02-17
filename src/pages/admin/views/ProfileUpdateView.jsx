import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import {
    User,
    Mail,
    Camera,
    Save,
    X,
    Loader2,
    Globe,
    Twitter,
    Linkedin,
    Github,
    FileText
} from 'lucide-react';
import { uploadImage } from '../../../utils/cloudinary';

const ProfileUpdateView = () => {
    const { user, refreshUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        headline: '',
        bio: '',
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.name || '',
                headline: user.headline || '',
                bio: user.bio || '',
                website: user.website || '',
                twitter: user.socials?.twitter || '',
                linkedin: user.socials?.linkedin || '',
                github: user.socials?.github || '',
                avatar_url: user.avatar || ''
            });
        }
    }, [user]);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            setFormData(prev => ({ ...prev, avatar_url: result.url }));

            // Optionally update immediately in DB
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: result.url })
                .eq('id', user.id);

            if (error) throw error;
            if (refreshUser) await refreshUser();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    headline: formData.headline,
                    bio: formData.bio,
                    website: formData.website,
                    socials: {
                        twitter: formData.twitter,
                        linkedin: formData.linkedin,
                        github: formData.github
                    },
                    avatar_url: formData.avatar_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            alert('Profile updated successfully!');
            if (refreshUser) await refreshUser();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div>
                    <h2>My Profile</h2>
                    <p className="text-muted">Manage your instructor presence and personal details</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </header>

            <div className="settings-container glass-card" style={{ padding: '2rem' }}>
                <div className="profile-edit-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '3rem' }}>
                    {/* Sidebar: Avatar */}
                    <div className="profile-avatar-sidebar" style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                background: 'var(--primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                color: 'var(--primary)',
                                border: '4px solid white'
                            }}>
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    formData.full_name.charAt(0) || <User size={64} />
                                )}
                            </div>
                            <label style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                background: 'var(--primary)',
                                color: 'white',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '3px solid white',
                                transition: 'var(--transition)'
                            }}>
                                {isUploading ? <Loader2 className="spinner" size={20} /> : <Camera size={20} />}
                                <input type="file" onChange={handleAvatarUpload} style={{ display: 'none' }} accept="image/*" disabled={isUploading} />
                            </label>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            Click camera to upload.<br />Square images work best.
                        </p>
                    </div>

                    {/* Main Content: Form */}
                    <div className="profile-form-main" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Headline</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                placeholder="e.g. Senior Software Architect & AWS Expert"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Bio</label>
                            <textarea
                                className="form-control"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell prospective students about your experience and teaching style..."
                                rows="5"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Website URL</label>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://yourportfolio.com"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Twitter / X</label>
                                <div style={{ position: 'relative' }}>
                                    <Twitter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.twitter}
                                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                        placeholder="@username"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>LinkedIn Profile</label>
                                <div style={{ position: 'relative' }}>
                                    <Linkedin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        placeholder="username"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>GitHub Username</label>
                                <div style={{ position: 'relative' }}>
                                    <Github size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        placeholder="username"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdateView;
