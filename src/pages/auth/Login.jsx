import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, Code, Users, Star, Loader2, Github, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, signInWithOAuth, emailLoading, googleLoading, githubLoading, user, loading } = useAuth();
    const { settings, formatPlatformName } = useSettings();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleOAuthLogin = async (provider) => {
        setError('');
        try {
            await signInWithOAuth(provider);
            // OAuth redirect is handled by Supabase, but if it returns (e.g. popups), we can navigate
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
                            <div className="floating-icon icon-1"><Code size={24} /></div>
                            <div className="floating-icon icon-2"><Users size={24} /></div>
                            <div className="floating-icon icon-3"><Star size={24} /></div>
                        </div>
                    </div>
                    <div className="visual-content">
                        <Link to="/" className="branding-logo">
                            {settings.logo_url ? (
                                <img src={settings.logo_url} alt={settings.platform_name} className="auth-logo-img" />
                            ) : (
                                formatPlatformName(settings.platform_name)
                            )}
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
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
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

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Keep me signed in
                                </label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary login-btn"
                                disabled={emailLoading || googleLoading || githubLoading}
                            >
                                {emailLoading ? (
                                    <>Signing In <Loader2 className="spinner" size={20} /></>
                                ) : (
                                    <>Sign In <ArrowRight size={20} /></>
                                )}
                            </button>

                            <p className="signup-text">
                                New to {settings.platform_name}? <Link to="/signup">Join for free</Link>
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
