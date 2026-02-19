import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    BarChart3,
    LogOut,
    Tag,
    Edit3,
    Menu,
    X,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    User,
    Key,
    Star, // Added for Reviews
    HelpCircle, // Added for FAQs
    MessageSquare // Added for Contact Submissions
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { settings, formatPlatformName } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('adminSidebarCollapsed');
        return saved === 'true';
    });

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('adminSidebarCollapsed', newState.toString());
    };

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/admin' || path === '/admin/dashboard') return 'dashboard';
        if (path.includes('/admin/courses')) return 'courses';
        if (path.includes('/admin/categories')) return 'categories';
        if (path.includes('/admin/users')) return 'users';
        if (path.includes('/admin/blog')) return 'blog';
        if (path.includes('/admin/analytics')) return 'analytics';
        if (path.includes('/admin/settings')) return 'settings';
        if (path.includes('/admin/pins')) return 'pins';
        if (path.includes('/admin/reviews')) return 'reviews'; // Added
        if (path.includes('/admin/faqs')) return 'faqs'; // Added
        if (path.includes('/admin/contact-submissions')) return 'contact-submissions'; // Added
        return 'dashboard';
    };

    const activeTab = getActiveTab();

    useEffect(() => {
        console.log('AdminDashboard - Current User State:', user);
    }, [user]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            navigate('/login');
        }
    };

    // Permission check helper
    const hasPermission = (userRole, tabId) => {
        if (userRole === 'superadmin') return true;

        // Restrictions for Instructors
        if (userRole === 'instructor') {
            const forbidden = ['users', 'pins', 'messages', 'reviews', 'faqs', 'settings', 'contact-submissions'];
            return !forbidden.includes(tabId);
        }

        // Restrictions for Admins
        if (userRole === 'admin') {
            const forbidden = ['users', 'pins'];
            return !forbidden.includes(tabId);
        }

        return false;
    };

    // Safety redirect if trying to access restricted URL directly
    useEffect(() => {
        if (user && !hasPermission(user.role, activeTab)) {
            console.warn(`Unauthorized access attempt to ${activeTab} by ${user.role}. Redirecting...`);
            navigate('/admin/dashboard', { replace: true });
        }
    }, [activeTab, user, navigate]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'blog', label: 'Blog', icon: Edit3, path: '/admin/blog' },
        { id: 'courses', label: 'Courses', icon: BookOpen, path: '/admin/courses' },
        { id: 'categories', label: 'Categories', icon: Tag, path: '/admin/categories' },
        { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
        { id: 'pins', label: 'PIN Management', icon: Key, path: '/admin/pins' },
        { id: 'reviews', label: 'Reviews', icon: Star, path: '/admin/reviews' },
        { id: 'faqs', label: 'FAQs', icon: HelpCircle, path: '/admin/faqs' },
        { id: 'contact-submissions', label: 'Messages', icon: MessageSquare, path: '/admin/contact-submissions' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    ].filter(item => hasPermission(user?.role, item.id));

    return (
        <div className="admin-dashboard">
            {/* Mobile Header */}
            <div className="admin-mobile-header">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="mobile-logo">
                    {settings.logo_url ? (
                        <img src={settings.logo_url} alt={settings.platform_name} className="admin-logo-img" />
                    ) : (
                        formatPlatformName(settings.platform_name)
                    )}
                </div>
                <div className="mobile-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo-container">
                        {isCollapsed ? (
                            <div className="sidebar-icon-badge">
                                {settings.platform_name.substring(0, 2).toUpperCase()}
                            </div>
                        ) : settings.logo_url ? (
                            <div className="sidebar-logo-img-wrapper">
                                <img src={settings.logo_url} alt={settings.platform_name} className="admin-logo-img" />
                                <span className="admin-suffix">Admin</span>
                            </div>
                        ) : (
                            <h3 style={{ letterSpacing: '-0.5px' }}>
                                {formatPlatformName(settings.platform_name)}
                                <span className="admin-suffix"> Admin</span>
                            </h3>
                        )}
                    </div>
                    {/* PC Toggle */}
                    <button className="collapse-toggle" onClick={toggleCollapse}>
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                    {/* Mobile Close */}
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <ul className="sidebar-links">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className={activeTab === item.id ? 'active' : ''}
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </li>
                    ))}
                    <li
                        onClick={() => window.open('/', '_blank')}
                        className="open-site-link"
                    >
                        <ExternalLink size={20} />
                        <span>Open Site</span>
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <div
                        className={`admin-profile ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => navigate('/admin/profile')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="avatar-sm">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                user?.name ? user.name.charAt(0).toUpperCase() : 'A'
                            )}
                        </div>
                        <div className="admin-info">
                            <h4>{user?.name || 'Admin'}</h4>
                            <p>
                                {user?.role === 'superadmin' ? 'Super Admin' :
                                    user?.role === 'admin' ? 'Administrator' :
                                        user?.role === 'instructor' ? 'Instructor' : 'Staff'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={`admin-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
