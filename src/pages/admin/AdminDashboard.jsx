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
    ExternalLink
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
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

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

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo-container">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt={settings.platform_name} className="admin-logo-img" />
                        ) : (
                            <h3 style={{ letterSpacing: '-0.5px' }}>{formatPlatformName(settings.platform_name)}</h3>
                        )}
                    </div>
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
                    <div className="admin-profile">
                        <div className="avatar-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="admin-info">
                            <h4>{user?.name || 'Admin'}</h4>
                            <p>Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
