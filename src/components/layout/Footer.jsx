import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import './Footer.css';

const Footer = () => {
    const { settings, formatPlatformName } = useSettings();
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="logo logo-white">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt={settings.platform_name} className="footer-logo-img" />
                        ) : (
                            formatPlatformName(settings.platform_name)
                        )}
                    </Link>
                    <p>The world's leading platform for professional learning. Learn without limits.</p>
                    <div className="social-links">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Linkedin size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Platform</h4>
                    <ul>
                        <li><Link to="/courses">Courses</Link></li>
                        <li><Link to="/subscriptions">Subscriptions</Link></li>
                        <li><Link to="/business">For Business</Link></li>
                        <li><Link to="/government">For Government</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/cookies">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} {settings.platform_name} Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
