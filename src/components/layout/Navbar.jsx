import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, User, LogIn, ChevronDown, ChevronLeft, BookOpen, Monitor, Palette, Briefcase, TrendingUp, Music } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../constants/mockData';
import { useAuth } from '../../context/AuthContext.js';
import { useSettings } from '../../context/SettingsContext';
import './Navbar.css';

const categoryIcons = {
  "Development": <Monitor size={20} />,
  "Data Science": <TrendingUp size={20} />,
  "Design": <Palette size={20} />,
  "Business": <Briefcase size={20} />,
  "Marketing": <BookOpen size={20} />,
  "Music": <Music size={20} />,
  "All": <BookOpen size={20} />
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileView, setMobileView] = useState('main'); // 'main' or 'explore'
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, formatPlatformName } = useSettings();
  const isHomePage = location.pathname === '/';
  const invertedPaths = [
    '/about', '/terms', '/privacy', '/cookies',
    '/subscriptions', '/business', '/government',
    '/careers', '/contact'
  ];
  const invertedPrefixes = ['/blog', '/instructor'];

  const isInverted =
    invertedPaths.includes(location.pathname) ||
    invertedPrefixes.some(prefix => location.pathname.startsWith(prefix));
  const megaMenuRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsProfileOpen(false);
    setMobileView('main');
  }, [location]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMegaMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMegaMenuOpen(!isMegaMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
    if (isMegaMenuOpen) setIsMegaMenuOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsMobileSearchOpen(false);
      }
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''} ${isMegaMenuOpen ? 'mega-active' : ''} ${isInverted && !scrolled && !isMegaMenuOpen ? 'inverted' : ''}`}>
        <div className="container nav-content">
          <Link to="/" className="logo">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.platform_name} className="navbar-logo-img" />
            ) : (
              formatPlatformName(settings.platform_name)
            )}
          </Link>

          <div className="search-bar">
            <Search
              size={16}
              className="search-icon"
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
            />
            <input
              type="text"
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {isMobileMenuOpen && (
              <button
                className="mobile-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={28} />
              </button>
            )}
            {mobileView === 'explore' && isMobileMenuOpen ? (
              <div className="mobile-view-content">
                <button
                  className="mobile-back-btn"
                  onClick={() => setMobileView('main')}
                >
                  <ChevronLeft size={20} /> Back to Menu
                </button>
                <div className="mobile-categories-list">
                  <h3>All Categories</h3>
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat}
                      to={`/courses?category=${cat}`}
                      className="mobile-category-item"
                    >
                      <span className="cat-icon">{categoryIcons[cat]}</span>
                      <span className="cat-name">{cat}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="dropdown mega-dropdown"
                  ref={megaMenuRef}
                >
                  <button
                    className="nav-link dropdown-btn"
                    onClick={(e) => {
                      if (window.innerWidth <= 992) {
                        setMobileView('explore');
                      } else {
                        toggleMegaMenu(e);
                      }
                    }}
                  >
                    Explore <ChevronDown size={14} className={isMegaMenuOpen ? 'rotated' : ''} />
                  </button>

                  {/* Desktop Mega Menu */}
                  {isMegaMenuOpen && !isMobileMenuOpen && (
                    <div className="mega-menu">
                      <button
                        className="close-mega"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        <X size={18} />
                      </button>
                      <div className="mega-menu-content container">
                        <div className="mega-menu-grid">
                          <div className="mega-menu-column main-col">
                            <h3>Top Categories</h3>
                            <div className="category-links">
                              {CATEGORIES.map(cat => (
                                <Link
                                  key={cat}
                                  to={`/courses?category=${cat}`}
                                  className="mega-category-link"
                                >
                                  <span className="cat-icon">{categoryIcons[cat]}</span>
                                  <div className="cat-info">
                                    <span className="cat-name">{cat}</span>
                                    <span className="cat-desc">Browse {cat} courses</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="mega-menu-column promo-col">
                            <div className="promo-card">
                              <span className="promo-badge">Featured</span>
                              <h4>{settings.platform_name} One Membership</h4>
                              <p>Unlimited access to 8,000+ courses, projects, and certificates.</p>
                              <Link to="/signup" className="btn btn-primary btn-sm">Join Now</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/business" className="nav-link">For Business</Link>

                <div className="auth-btns">
                  {user ? (
                    <div
                      className={`user-profile-dropdown ${isProfileOpen ? 'active' : ''}`}
                      ref={profileRef}
                    >
                      <button
                        className="profile-toggle"
                        onClick={toggleProfileMenu}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="user-avatar"
                        />
                        <span className="user-name">{user.name}</span>
                        <ChevronDown size={14} className={isProfileOpen ? 'rotate-180' : ''} />
                      </button>
                      {isProfileOpen && (
                        <div className="dropdown-menu">
                          <Link to="/dashboard" className="dropdown-item">
                            <Briefcase size={16} /> Dashboard
                          </Link>
                          <Link to="/profile" className="dropdown-item">
                            <User size={16} /> My Profile
                          </Link>
                          <hr />
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Logout clicked');
                              try {
                                await logout();
                                navigate('/login');
                              } catch (error) {
                                console.error('Logout failed:', error);
                              }
                            }}
                            className="dropdown-item logout-btn"
                          >
                            <LogIn size={16} className="rotate-180" /> Log Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="btn-login">Log In</Link>
                      <Link to="/signup" className="btn btn-primary">Join for Free</Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            className="mobile-search-toggle"
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <Search size={22} />
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isMobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-header">
            <span className="logo">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.platform_name} className="navbar-logo-img" />
              ) : (
                formatPlatformName(settings.platform_name)
              )}
            </span>
            <button
              className="close-search-btn"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="mobile-search-input-wrapper">
            <Search
              size={24}
              className="search-icon-mobile"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search for anything..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
