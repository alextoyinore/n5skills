import React, { useEffect, useState } from 'react';
import { Search, Bell, Plus, BookOpen, Users, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';

const DashboardOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        revenue: 0
    });
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            // 1. Total Courses
            const { count: courseCount } = await supabase
                .from('courses')
                .select('*', { count: 'exact', head: true });

            // 2. Total Students (Unique users in enrollments)
            const { data: enrollmentData } = await supabase
                .from('enrollments')
                .select('user_id');

            const uniqueStudents = new Set(enrollmentData?.map(e => e.user_id)).size;

            // 3. Revenue (Sum of price of enrolled courses)
            const { data: revenueData } = await supabase
                .from('enrollments')
                .select(`
                    id,
                    courses (price)
                `);

            const totalRevenue = revenueData?.reduce((sum, en) => sum + (en.courses?.price || 0), 0) || 0;

            setStats({
                totalCourses: courseCount || 0,
                totalStudents: uniqueStudents,
                revenue: totalRevenue
            });

            // 4. Recent Enrollments
            const { data: recent } = await supabase
                .from('enrollments')
                .select(`
                    enrolled_at,
                    profiles:user_id (full_name, email),
                    courses (title)
                `)
                .order('enrolled_at', { ascending: false })
                .limit(5);

            setRecentEnrollments(recent || []);

        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

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
                    <span className="stat-icon">
                        <BookOpen size={24} />
                    </span>
                    <div>
                        <p>Total Courses</p>
                        <h3>{stats.totalCourses}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-icon">
                        <Users size={24} />
                    </span>
                    <div>
                        <p>Total Students</p>
                        <h3>{stats.totalStudents.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-icon">
                        <DollarSign size={24} />
                    </span>
                    <div>
                        <p>Revenue</p>
                        <h3>₦{stats.revenue.toLocaleString()}</h3>
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
                            {recentEnrollments.map((en, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="student-info-cell">
                                            <p className="student-name">{en.profiles?.full_name || 'Anonymous'}</p>
                                            <p className="student-email">{en.profiles?.email}</p>
                                        </div>
                                    </td>
                                    <td>{en.courses?.title}</td>
                                    <td>{new Date(en.enrolled_at).toLocaleDateString()}</td>
                                    <td><span className="badge-status success">Active</span></td>
                                </tr>
                            ))}
                            {recentEnrollments.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        No recent enrollments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default DashboardOverview;
