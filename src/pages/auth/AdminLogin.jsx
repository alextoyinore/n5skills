import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, ChevronLeft, Shield, Key, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/admin');
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

                        <button type="submit" className="btn btn-primary login-btn">
                            Access Dashboard
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
