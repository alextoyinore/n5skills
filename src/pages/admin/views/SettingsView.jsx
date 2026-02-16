import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Loader2, Save } from 'lucide-react';

const SettingsView = () => {
    const [settings, setSettings] = useState({
        platform_name: '',
        support_email: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('platform_settings')
                .update({
                    platform_name: settings.platform_name,
                    support_email: settings.support_email,
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
