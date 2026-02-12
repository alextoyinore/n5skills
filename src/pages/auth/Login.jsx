import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, Code, Users, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <div className="login-page">
            <div className="login-container-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="login-visual"
                >
                    <div className="hero-bg-elements">
                        <div className="blob blob-1"></div>
                        <div className="blob blob-2"></div>
                        <div className="floating-icons">
                            <div className="floating-icon icon-1"><Code size={24} /></div>
                            <div className="floating-icon icon-2"><Users size={24} /></div>
                            <div className="floating-icon icon-3"><Star size={24} /></div>
                        </div>
                    </div>
                    <div className="visual-content">
                        <Link to="/" className="branding-logo">
                            <span className="logo-bold">N5</span>SKILLS
                        </Link>
                        <h2>Elevate Your <br />Expertise.</h2>
                        <p>Access your curated learning catalog and continue where you left off. Your journey to mastery begins here.</p>

                        <div className="login-stats">
                            <div className="stat-item">
                                <h3>150k+</h3>
                                <span>Students enrolled</span>
                            </div>
                            <div className="stat-item">
                                <h3>800+</h3>
                                <span>Premium courses</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="login-form-container-full"
                >
                    <div className="form-inner">
                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-header">
                                <h1>Sign In</h1>
                                <p>Enter your credentials to access your account</p>
                            </div>

                            <div className="input-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
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

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Keep me signed in
                                </label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>

                            <button type="submit" className="btn btn-primary login-btn">
                                Sign In
                                <ArrowRight size={20} />
                            </button>

                            <p className="signup-text">
                                New to N5SKILLS? <Link to="/signup">Join for free</Link>
                            </p>
                        </form>
                    </div>

                    <footer className="auth-footer">
                        <Link to="/terms">Terms</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/admin/login" className="admin-entry">Admin Access</Link>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
