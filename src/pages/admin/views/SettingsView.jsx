import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Loader2, Save, Upload, X } from 'lucide-react';
import { uploadImage } from '../../../utils/cloudinary';

const SettingsView = () => {
    const [settings, setSettings] = useState({
        platform_name: '',
        support_email: '',
        logo_url: null
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('platform_settings')
                .select('*')
                .single();

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            setSettings({ ...settings, logo_url: result.url });
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Error uploading logo: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('platform_settings')
                .update({
                    platform_name: settings.platform_name,
                    support_email: settings.support_email,
                    logo_url: settings.logo_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', settings.id);

            if (error) throw error;
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="admin-view">
            <header className="admin-header">
                <h2>Platform Settings</h2>
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
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>General Settings</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Platform Logo</label>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '120px',
                                    height: '60px',
                                    border: '2px dashed #E2E8F0',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#F8FAFC',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    {settings.logo_url ? (
                                        <>
                                            <img src={settings.logo_url} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            <button
                                                onClick={() => setSettings({ ...settings, logo_url: null })}
                                                style={{
                                                    position: 'absolute',
                                                    top: '2px',
                                                    right: '2px',
                                                    background: 'rgba(239, 68, 68, 0.9)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '2px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                        </>
                                    ) : (
                                        <Upload size={24} style={{ opacity: 0.3 }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="btn btn-outline" style={{ display: 'inline-flex', cursor: 'pointer', gap: '0.5rem' }}>
                                        {isUploading ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                                        {isUploading ? 'Uploading...' : 'Upload Logo'}
                                        <input type="file" onChange={handleLogoUpload} style={{ display: 'none' }} accept="image/*" disabled={isUploading} />
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.5rem' }}>
                                        Recommended: Transparent PNG or SVG. Max 2MB (Cloudinary).
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Platform Name</label>
                            <input
                                type="text"
                                value={settings.platform_name}
                                onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Support Email</label>
                            <input
                                type="email"
                                value={settings.support_email}
                                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
