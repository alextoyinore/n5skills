import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, Trash2, Search, Filter, Loader2, ExternalLink, X } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';
import './PinManagement.css';

const PinManagementView = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [pinCount, setPinCount] = useState(10);
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copying, setCopying] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ total: 0, available: 0, used: 0 });
    const [showGenerator, setShowGenerator] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchPins();
    }, []);

    const fetchCourses = async () => {
        const { data } = await supabase
            .from('courses')
            .select('id, title')
            .eq('is_free', false)
            .order('title');
        setCourses(data || []);
    };

    const fetchPins = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('course_pins')
                .select(`
                    id,
                    pin_code,
                    is_used,
                    used_at,
                    created_at,
                    courses (title),
                    profiles:used_by (full_name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            const pinsData = data || [];
            setPins(pinsData);

            // Calculate stats
            const usedCount = pinsData.filter(p => p.is_used).length;
            setStats({
                total: pinsData.length,
                available: pinsData.length - usedCount,
                used: usedCount
            });
        } catch (error) {
            console.error('Error fetching pins:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePins = async () => {
        if (pinCount <= 0) {
            alert('Please enter a valid count.');
            return;
        }

        setGenerating(true);
        try {
            const newPins = [];
            for (let i = 0; i < pinCount; i++) {
                // Simple random PIN generator: 8 chars alphanumeric
                const pin = Math.random().toString(36).substring(2, 10).toUpperCase();
                newPins.push({
                    pin_code: pin
                });
            }

            const { error } = await supabase
                .from('course_pins')
                .insert(newPins);

            if (error) throw error;

            alert(`Successfully generated ${pinCount} PINs.`);
            fetchPins();
        } catch (error) {
            console.error('Error generating pins:', error);
            alert('Generation failed: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopying(id);
        setTimeout(() => setCopying(null), 2000);
    };

    const deletePin = async (id) => {
        if (!window.confirm('Are you sure you want to delete this PIN?')) return;

        try {
            const { error } = await supabase
                .from('course_pins')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setPins(pins.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting pin:', error);
        }
    };

    const filteredPins = pins.filter(pin =>
        pin.pin_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pin.courses?.title || 'unassigned').toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-view pin-management">
            <header className="admin-header">
                <div className="admin-welcome">
                    <p className="subtitle">System Administration</p>
                    <h2>PIN Code <span className="primary-text">Management</span></h2>
                </div>
                <button
                    className={`btn ${showGenerator ? 'btn-outline' : 'btn-primary'} btn-sm`}
                    onClick={() => setShowGenerator(!showGenerator)}
                >
                    {showGenerator ? <X size={18} /> : <Plus size={18} />}
                    {showGenerator ? 'Cancel' : 'Generate PINs'}
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <span className="stat-icon">
                        <Key size={24} />
                    </span>
                    <div>
                        <p>Total PINs</p>
                        <h3>{stats.total}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-icon" style={{ background: '#DCFCE7', color: '#166534' }}>
                        <Check size={24} />
                    </span>
                    <div>
                        <p>Available</p>
                        <h3>{stats.available}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-icon" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                        <ExternalLink size={24} />
                    </span>
                    <div>
                        <p>Redeemed</p>
                        <h3>{stats.used}</h3>
                    </div>
                </div>
            </div>

            {showGenerator && (
                <div className="generator-focused-section animate-slide-down">
                    <div className="glass-card mb-12 premium-generator-card">
                        <div className="generator-content">
                            <div className="generator-text">
                                <h3 className="text-xl font-bold mb-1">Batch Generate Universal PINs</h3>
                                <p className="text-muted text-sm">Universal PINs are not tied to any course. Use them for general promotions or gift cards.</p>
                            </div>
                            <div className="generator-actions">
                                <div className="input-with-label">
                                    <label>Quantity</label>
                                    <div className="form-group mb-0">
                                        <input
                                            type="number"
                                            className="admin-input-premium"
                                            value={pinCount}
                                            onChange={(e) => setPinCount(parseInt(e.target.value))}
                                            min="1"
                                            max="100"
                                            placeholder="10"
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary generate-btn-large"
                                    onClick={generatePins}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="spinner" size={20} />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={20} />
                                            <span>Create PIN Batch</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="view-filters">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by PIN code or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://gumroad.com/dashboard" target="_blank" rel="noopener noreferrer" className="btn-filter flex items-center gap-2">
                        <ExternalLink size={18} /> Gumroad Dashboard
                    </a>
                </div>
            </div>

            <div className="activity-table glass-card">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <Loader2 className="spinner mb-4" size={32} />
                        <p className="text-muted">Fetching PIN records...</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>PIN Code</th>
                                <th>Associated Course</th>
                                <th>Status</th>
                                <th>Redemption Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPins.map(pin => (
                                <tr key={pin.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <code className="pin-code-display">{pin.pin_code}</code>
                                            <button
                                                className="icon-btn-sm"
                                                title="Copy to clipboard"
                                                onClick={() => copyToClipboard(pin.pin_code, pin.id)}
                                            >
                                                {copying === pin.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {pin.is_used ? (
                                            <span className="font-semibold text-slate-700">{pin.courses?.title}</span>
                                        ) : (
                                            <span className="text-muted italic opacity-60">Universal - Unassigned</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge-status ${pin.is_used ? 'danger' : 'success'}`}>
                                            {pin.is_used ? 'Redeemed' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        {pin.is_used ? (
                                            <div className="user-info-brief">
                                                <p className="font-bold">{pin.profiles?.full_name}</p>
                                                <p className="text-muted text-xs">{new Date(pin.used_at).toLocaleDateString()} at {new Date(pin.used_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td>
                                        {!pin.is_used && (
                                            <button
                                                className="icon-btn delete"
                                                title="Revoke PIN"
                                                onClick={() => deletePin(pin.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredPins.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-muted">
                                        No PIN records found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PinManagementView;
