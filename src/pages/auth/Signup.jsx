import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles, Laptop, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing some base styles

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
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
                            <div className="floating-icon icon-1"><Sparkles size={24} /></div>
                            <div className="floating-icon icon-2"><Laptop size={24} /></div>
                            <div className="floating-icon icon-3"><Globe size={24} /></div>
                        </div>
                    </div>
                    <div className="visual-content">
                        <Link to="/" className="branding-logo">
                            <span className="logo-bold">N5</span>SKILLS
                        </Link>
                        <h2>Join the Next <br />Generation.</h2>
                        <p>Unlock premium content, project-based learning, and a global network of ambitious professionals.</p>

                        <div className="signup-benefits-list">
                            <div className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <div className="benefit-text">
                                    <h4>Expert-Led Courses</h4>
                                    <p>Learn from industry icons and veterans.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <div className="benefit-text">
                                    <h4>Project Portfolios</h4>
                                    <p>Build real products while you learn.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <div className="benefit-text">
                                    <h4>Global Community</h4>
                                    <p>Connect with peers across 140+ countries.</p>
                                </div>
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
                        <form className="login-form" onSubmit={handleSignup}>
                            <div className="form-header">
                                <h1>Create Account</h1>
                                <p>Start your 7-day free trial today</p>
                            </div>

                            <div className="input-group">
                                <label><User size={16} /> Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label><Lock size={16} /> Password</label>
                                <input
                                    type="password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary login-btn">
                                Create Account
                                <ArrowRight size={20} />
                            </button>

                            <p className="signup-text">
                                Already have an account? <Link to="/login">Sign in</Link>
                            </p>
                        </form>
                    </div>

                    <footer className="auth-footer">
                        <p className="legal-notice-small">
                            By joining, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
                        </p>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
