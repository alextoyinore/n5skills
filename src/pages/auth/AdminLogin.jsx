import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, ChevronLeft, Shield, Key, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { supabase } from '../../utils/supabaseClient';
import './Login.css';

const AdminLogin = () => {
    const { login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: { user: authUser }, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            // Fetch profile to verify role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authUser.id)
                .single();

            if (profile?.role === 'admin') {
                navigate('/admin');
            } else {
                await logout();
                setError('Unauthorized access. Admin privileges required.');
            }
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page admin-theme">
            <div className="login-container-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="login-visual-admin"
                >
                    <div className="hero-bg-elements">
                        <div className="blob blob-admin-1"></div>
                        <div className="blob blob-admin-2"></div>
                        <div className="floating-icons">
                            <div className="floating-icon icon-1"><Shield size={24} /></div>
                            <div className="floating-icon icon-2"><Key size={24} /></div>
                            <div className="floating-icon icon-3"><Eye size={24} /></div>
                        </div>
                    </div>
                    <div className="visual-content">
                        <div className="admin-badge">
                            <ShieldCheck size={40} />
                            <span>OFFICIAL ACCESS</span>
                        </div>
                        <h2>N5 Management <br />Console</h2>
                        <p>Secure portal for administrators to manage course content, users, and platform analytics.</p>

                        <div className="admin-security-info">
                            <div className="sec-item">
                                <span>🔒</span>
                                <p>End-to-end encryption active</p>
                            </div>
                            <div className="sec-item">
                                <span>🕒</span>
                                <p>All actions are logged for security</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="login-form-container-full"
                >
                    <Link to="/" className="back-to-site">
                        <ChevronLeft size={18} /> Back to Site
                    </Link>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-header">
                            <h1>Admin Sign In</h1>
                            <p>Authorized personnel only</p>
                        </div>

                        {error && (
                            <div className="auth-error" style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#EF4444',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="input-group">
                            <label><Mail size={16} /> Admin Email</label>
                            <input
                                type="email"
                                placeholder="admin@n5skills.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><Lock size={16} /> Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary login-btn ${loading ? 'btn-loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
