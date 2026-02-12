import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Users, BarChart3, Settings, Plus, Search, Filter, Image, Video, DollarSign, Save, Trash2, Edit2, Edit3, Shield, UserX, FileText } from 'lucide-react';
import './AdminDashboard.css';

// Sub-components for different views
const DashboardOverview = () => (
    <>
        <header className="admin-header">
            <h2>Overview</h2>
            <button className="btn btn-primary btn-sm"><Plus size={18} /> New Course</button>
        </header>

        <div className="stats-grid">
            <div className="stat-card glass-card">
                <span className="stat-icon blue">📚</span>
                <div>
                    <p>Total Courses</p>
                    <h3>156</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <span className="stat-icon orange">🎓</span>
                <div>
                    <p>Total Students</p>
                    <h3>12,450</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <span className="stat-icon yellow">💰</span>
                <div>
                    <p>Revenue</p>
                    <h3>$45,210</h3>
                </div>
            </div>
        </div>

        <section className="recent-activity">
            <h3>Recent Enrollments</h3>
            <div className="activity-table glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Alex Johnson</td>
                            <td>Web Development Bootcamp</td>
                            <td>Feb 10, 2026</td>
                            <td><span className="badge-status success">Active</span></td>
                        </tr>
                        <tr>
                            <td>Sarah Smith</td>
                            <td>UI/UX Masterclass</td>
                            <td>Feb 09, 2026</td>
                            <td><span className="badge-status success">Active</span></td>
                        </tr>
                        <tr>
                            <td>Mike Ross</td>
                            <td>Deep Learning</td>
                            <td>Feb 08, 2026</td>
                            <td><span className="badge-status warning">Pending</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </>
);

const CourseCreateView = () => {
    const [step, setStep] = useState(1);

    return (
        <div className="admin-view">
            <header className="admin-header">
                <h2>Create New Course</h2>
                <div className="step-indicator">Step {step} of 3</div>
            </header>

            <div className="create-form-container glass-card">
                {step === 1 && (
                    <div className="form-step">
                        <h3>Basic Information</h3>
                        <div className="form-group">
                            <label>Course Title</label>
                            <input type="text" placeholder="e.g. Advanced JavaScript Masterclass" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea placeholder="Describe what students will learn..." rows="5"></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select>
                                    <option>Development</option>
                                    <option>Design</option>
                                    <option>Business</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Difficulty</label>
                                <select>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => setStep(2)}>Next Step</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <h3>Media & Content</h3>
                        <div className="upload-area">
                            <div className="upload-box">
                                <Image size={40} />
                                <p>Upload Thumbnail Image</p>
                                <span>(Max 5MB, JPG/PNG)</span>
                            </div>
                            <div className="upload-box">
                                <Video size={40} />
                                <p>Upload Intro Video</p>
                                <span>(Max 100MB, MP4)</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Curriculum Outline</label>
                            <div className="curriculum-builder">
                                <div className="builder-item">
                                    <Edit2 size={16} /> Module 1: Introduction
                                </div>
                                <button className="btn-outline-sm"><Plus size={16} /> Add Module</button>
                            </div>
                        </div>
                        <div className="button-group">
                            <button className="btn-filter" onClick={() => setStep(1)}>Back</button>
                            <button className="btn btn-primary" onClick={() => setStep(3)}>Next Step</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <h3>Pricing & Finalize</h3>
                        <div className="form-group">
                            <label>Price (USD)</label>
                            <div className="input-with-icon">
                                <DollarSign size={18} />
                                <input type="number" placeholder="49.99" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Enrollment Type</label>
                            <div className="radio-group">
                                <label><input type="radio" name="enroll" checked /> One-time purchase</label>
                                <label><input type="radio" name="enroll" /> Subscription only</label>
                                <label><input type="radio" name="enroll" /> Free course</label>
                            </div>
                        </div>
                        <div className="button-group">
                            <button className="btn-filter" onClick={() => setStep(2)}>Back</button>
                            <button className="btn btn-primary"><Save size={18} /> Publish Course</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const UserManagementView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>User Management</h2>
            <button className="btn btn-primary btn-sm"><Plus size={18} /> Add New User</button>
        </header>
        <div className="view-filters glass-card">
            <div className="search-bar">
                <Search size={18} />
                <input type="text" placeholder="Search users by name or email..." />
            </div>
            <button className="btn-filter"><Filter size={18} /> Role: All</button>
        </div>
        <div className="activity-table glass-card">
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="user-info-cell">
                                <div className="avatar-sm">AJ</div>
                                Alex Johnson
                            </div>
                        </td>
                        <td>alex@example.com</td>
                        <td><span className="badge-role student">Student</span></td>
                        <td><span className="badge-status success">Active</span></td>
                        <td>
                            <div className="action-row">
                                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                                <button className="icon-btn" title="Permissions"><Shield size={16} /></button>
                                <button className="icon-btn delete" title="Suspend"><UserX size={16} /></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="user-info-cell">
                                <div className="avatar-sm inst">JS</div>
                                Jane Smith
                            </div>
                        </td>
                        <td>jane.smith@inst.com</td>
                        <td><span className="badge-role instructor">Instructor</span></td>
                        <td><span className="badge-status success">Active</span></td>
                        <td>
                            <div className="action-row">
                                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                                <button className="icon-btn" title="Permissions"><Shield size={16} /></button>
                                <button className="icon-btn delete" title="Suspend"><UserX size={16} /></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const CoursesView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Manage Courses</h2>
            <button className="btn btn-primary btn-sm"><Plus size={18} /> Add New Course</button>
        </header>
        <div className="view-filters glass-card">
            <div className="search-bar">
                <Search size={18} />
                <input type="text" placeholder="Search courses..." />
            </div>
            <button className="btn-filter"><Filter size={18} /> Filters</button>
        </div>
        <div className="activity-table glass-card">
            <table>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Category</th>
                        <th>Students</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Advanced React Patterns</td>
                        <td>Development</td>
                        <td>1,240</td>
                        <td>$89.99</td>
                        <td><span className="badge-status success">Published</span></td>
                    </tr>
                    <tr>
                        <td>UI Design Systems</td>
                        <td>Design</td>
                        <td>850</td>
                        <td>$74.99</td>
                        <td><span className="badge-status success">Published</span></td>
                    </tr>
                    <tr>
                        <td>Node.js Backend Architecture</td>
                        <td>Development</td>
                        <td>530</td>
                        <td>$99.00</td>
                        <td><span className="badge-status warning">Draft</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const StudentsView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Student Directory</h2>
        </header>
        <div className="activity-table glass-card">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Enrolled Courses</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Alex Johnson</td>
                        <td>alex@example.com</td>
                        <td>4</td>
                        <td>Jan 15, 2026</td>
                        <td><span className="badge-status success">Active</span></td>
                    </tr>
                    <tr>
                        <td>Sarah Smith</td>
                        <td>sarah@example.com</td>
                        <td>2</td>
                        <td>Jan 20, 2026</td>
                        <td><span className="badge-status success">Active</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const AnalyticsView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Analytics & Reports</h2>
        </header>
        <div className="stats-grid">
            <div className="stat-card glass-card">
                <div>
                    <p>Daily Active Users</p>
                    <h3>1,420</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <div>
                    <p>Retention Rate</p>
                    <h3>68%</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <div>
                    <p>Avg. Completion</p>
                    <h3>45%</h3>
                </div>
            </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Growth Chart Placeholder
        </div>
    </div>
);

const BlogManagementView = ({ onNewPost }) => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Blog Management</h2>
            <button className="btn btn-primary btn-sm" onClick={onNewPost}><Plus size={18} /> New Post</button>
        </header>

        <div className="stats-grid">
            <div className="stat-card glass-card">
                <span className="stat-icon purple">📝</span>
                <div>
                    <p>Total Posts</p>
                    <h3>42</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <span className="stat-icon green">👁️</span>
                <div>
                    <p>Post Views</p>
                    <h3>8.4k</h3>
                </div>
            </div>
            <div className="stat-card glass-card">
                <span className="stat-icon blue">💬</span>
                <div>
                    <p>Comments</p>
                    <h3>156</h3>
                </div>
            </div>
        </div>

        <div className="view-filters glass-card">
            <div className="search-bar">
                <Search size={18} />
                <input type="text" placeholder="Search blog posts..." />
            </div>
            <button className="btn-filter"><Filter size={18} /> Category: All</button>
        </div>

        <div className="activity-table glass-card">
            <table>
                <thead>
                    <tr>
                        <th>Post Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>The Future of AI in Professional Learning</td>
                        <td>Technology</td>
                        <td>Dr. Sarah Chen</td>
                        <td>Feb 10, 2026</td>
                        <td><span className="badge-status success">Published</span></td>
                        <td>
                            <div className="action-row">
                                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                                <button className="icon-btn delete" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>10 Essential Skills for Remote PMs</td>
                        <td>Product</td>
                        <td>Marcus Thorne</td>
                        <td>Feb 08, 2026</td>
                        <td><span className="badge-status success">Published</span></td>
                        <td>
                            <div className="action-row">
                                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                                <button className="icon-btn delete" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const BlogPostCreateView = ({ onBack }) => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Create Blog Post</h2>
            <button className="btn-filter" onClick={onBack}>Back to List</button>
        </header>

        <div className="create-form-container glass-card">
            <div className="form-step">
                <div className="form-group">
                    <label>Post Title</label>
                    <input type="text" placeholder="Enter post title..." />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select>
                            <option>Technology</option>
                            <option>Design</option>
                            <option>Business</option>
                            <option>Product</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Featured Image</label>
                        <div className="upload-box-sm">
                            <Image size={24} />
                            <span>Upload Image</span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Excerpt</label>
                    <textarea placeholder="Brief summary of the post..." rows="3"></textarea>
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea placeholder="Write your post content here..." rows="15"></textarea>
                </div>
                <div className="button-group">
                    <button className="btn-filter" onClick={onBack}>Cancel</button>
                    <button className="btn btn-primary"><Save size={18} /> Save & Publish</button>
                </div>
            </div>
        </div>
    </div>
);

const SettingsView = () => (
    <div className="admin-view">
        <header className="admin-header">
            <h2>Platform Settings</h2>
        </header>
        <div className="settings-container glass-card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>General Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Platform Name
                        <input type="text" defaultValue="N5 Skills" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Support Email
                        <input type="email" defaultValue="support@n5skills.com" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                    </label>
                </div>
            </div>
            <button className="btn btn-primary">Save Changes</button>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardOverview />;
            case 'blog': return <BlogManagementView onNewPost={() => setActiveView('create-post')} />;
            case 'create-post': return <BlogPostCreateView onBack={() => setActiveView('blog')} />;
            case 'courses': return <CoursesView />;
            case 'create-course': return <CourseCreateView />;
            case 'users': return <UserManagementView />;
            case 'analytics': return <AnalyticsView />;
            case 'settings': return <SettingsView />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>
                <ul className="sidebar-links">
                    <li
                        className={activeView === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveView('dashboard')}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </li>
                    <li
                        className={activeView === 'blog' || activeView === 'create-post' ? 'active' : ''}
                        onClick={() => setActiveView('blog')}
                    >
                        <Edit3 size={20} /> Blog
                    </li>
                    <li
                        className={activeView === 'courses' ? 'active' : ''}
                        onClick={() => setActiveView('courses')}
                    >
                        <BookOpen size={20} /> Courses
                    </li>
                    <li
                        className={activeView === 'create-course' ? 'active' : ''}
                        onClick={() => setActiveView('create-course')}
                    >
                        <Plus size={20} /> Create Course
                    </li>
                    <li
                        className={activeView === 'users' ? 'active' : ''}
                        onClick={() => setActiveView('users')}
                    >
                        <Users size={20} /> Users
                    </li>
                    <li
                        className={activeView === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveView('analytics')}
                    >
                        <BarChart3 size={20} /> Analytics
                    </li>
                    <li
                        className={activeView === 'settings' ? 'active' : ''}
                        onClick={() => setActiveView('settings')}
                    >
                        <Settings size={20} /> Settings
                    </li>
                </ul>
            </aside>

            <main className="admin-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
