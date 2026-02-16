import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles, Laptop, Globe, Loader2, Github, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css'; // Reusing some base styles

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { signup, signInWithOAuth, emailLoading, googleLoading, githubLoading, user, loading } = useAuth();
    const navigate = useNavigate();

    // Remove race-condition prone useEffect. 
    // Only redirect if state is stable (not loading) and user exists.
    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(name, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to create account. Please try again.');
        }
    };

    const handleOAuthLogin = async (provider) => {
        setError('');
        try {
            await signInWithOAuth(provider);
        } catch (err) {
            setError(`Failed to sign in with ${provider}. Please try again.`);
        }
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

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="auth-error-msg"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="oauth-buttons">
                                <button
                                    type="button"
                                    className="btn-oauth btn-oauth-google"
                                    onClick={() => handleOAuthLogin('google')}
                                    disabled={googleLoading || githubLoading}
                                >
                                    {googleLoading ? (
                                        <>Connecting <Loader2 className="spinner" size={18} /></>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Continue with Google
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="btn-oauth btn-oauth-github"
                                    onClick={() => handleOAuthLogin('github')}
                                    disabled={googleLoading || githubLoading}
                                >
                                    {githubLoading ? (
                                        <>Connecting <Loader2 className="spinner" size={18} /></>
                                    ) : (
                                        <>
                                            <Github size={18} />
                                            Continue with GitHub
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="auth-divider">
                                <span>OR</span>
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
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary login-btn"
                                disabled={emailLoading || googleLoading || githubLoading}
                            >
                                {emailLoading ? (
                                    <>Creating Account <Loader2 className="spinner" size={20} /></>
                                ) : (
                                    <>Create Account <ArrowRight size={20} /></>
                                )}
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
