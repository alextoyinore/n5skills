import React from 'react';

const SettingsView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Platform Settings</h2>
        </header>
        <div className="settings-container glass-card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>General Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Platform Name
                        <input type="text" defaultValue="N5 Skills" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Support Email
                        <input type="email" defaultValue="support@n5skills.com" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </label>
                </div>
            </div>
            <button className="btn btn-primary">Save Changes</button>
        </div>
    </div>
);

export default SettingsView;
