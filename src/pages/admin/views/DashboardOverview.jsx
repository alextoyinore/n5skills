import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <header className="admin-header">
                <div className="admin-welcome">
                    <p className="subtitle">System Overview</p>
                    <h2>Welcome back, <span className="primary-text">{user?.name || 'Admin'}</span></h2>
                </div>
                <div className="header-actions">
                    <div className="admin-search-minimal">
                        <Search size={18} />
                        <input type="text" placeholder="Global search..." />
                    </div>
                    <button className="icon-btn"><Bell size={20} /></button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/courses/create')}>
                        <Plus size={18} /> New Course
                    </button>
                </div>
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
};

export default DashboardOverview;
