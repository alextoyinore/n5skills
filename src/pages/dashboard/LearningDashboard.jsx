import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Award, BookOpen, Search, Bell, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './LearningDashboard.css';

const LearningDashboard = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [stats, setStats] = useState({
        coursesInProgress: 0,
        certificatesEarned: 0,
        learningTime: '0h'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Fetch enrolled courses with progress
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select(`
                    course_id,
                    courses (
                        id,
                        title,
                        image_url,
                        categories (name),
                        course_modules (
                            id,
                            course_lessons (id)
                        )
                    )
                `)
                .eq('user_id', user.id);

            if (enrollError) throw enrollError;

            // 2. Fetch completions to calculate progress
            const { data: completions, error: compError } = await supabase
                .from('lesson_completions')
                .select('lesson_id')
                .eq('user_id', user.id);

            if (compError) throw compError;

            const completedLessonIds = new Set(completions.map(c => c.lesson_id));

            // Process enrolled courses
            const processedEnrollments = enrollments.map(en => {
                const course = en.courses;
                const allLessons = course.course_modules.flatMap(m => m.course_lessons);
                const totalLessons = allLessons.length;
                const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
                const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                return {
                    id: course.id,
                    title: course.title,
                    image: course.image_url || 'https://via.placeholder.com/300x170',
                    category: course.categories?.name || 'Uncategorized',
                    progress: progress,
                    lastLesson: 'Introduction' // Placeholder for now, later we can track last accessed lesson
                };
            });

            setEnrolledCourses(processedEnrollments);
            setStats({
                coursesInProgress: processedEnrollments.filter(c => c.progress < 100).length,
                certificatesEarned: processedEnrollments.filter(c => c.progress === 100).length,
                learningTime: '12h' // Placeholder
            });

            // 3. Fetch recommended courses (excluding enrolled)
            const enrolledIds = enrollments.map(en => en.course_id);
            const { data: recs, error: recError } = await supabase
                .from('courses')
                .select(`
                    id,
                    title,
                    image_url,
                    profiles:instructor_id (full_name)
                `)
                .eq('status', 'published')
                .not('id', 'in', `(${enrolledIds.length > 0 ? enrolledIds.join(',') : '0'})`)
                .limit(3);

            if (recError) throw recError;
            setRecommendedCourses(recs.map(r => ({
                id: r.id,
                title: r.title,
                image: r.image_url || 'https://via.placeholder.com/150x85',
                instructor: r.profiles?.full_name || 'Admin'
            })));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page flex-center" style={{ minHeight: '80vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-container container">
                <header className="dashboard-header">
                    <div className="header-text">
                        <h1>My Learning</h1>
                        <p>Welcome back, <span className="primary-text">{user?.name?.split(' ')[0] || 'Student'}</span>! You've completed 75% of your weekly goal.</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-minimal">
                            <Search size={18} />
                            <input type="text" placeholder="Search my courses..." />
                        </div>
                        <button className="icon-btn"><Bell size={20} /></button>
                    </div>
                </header>

                <section className="stats-row">
                    <div className="stat-box glass-card">
                        <BookOpen size={24} color="var(--primary)" />
                        <div>
                            <h3>{stats.coursesInProgress}</h3>
                            <p>Courses in progress</p>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <Award size={24} color="var(--secondary)" />
                        <div>
                            <h3>{stats.certificatesEarned}</h3>
                            <p>Certificates earned</p>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <Clock size={24} color="var(--success)" />
                        <div>
                            <h3>{stats.learningTime}</h3>
                            <p>Learning time</p>
                        </div>
                    </div>
                </section>

                <section className="enrolled-courses">
                    <div className="section-title">
                        <h2>Continue Watching</h2>
                        <Link to="#" className="view-all">View all</Link>
                    </div>
                    <div className="dashboard-grid">
                        {enrolledCourses.map(course => (
                            <div key={course.id} className="dashboard-card glass-card">
                                <div className="card-thumb">
                                    <img src={course.image} alt={course.title} />
                                    <Link to={`/learn/${course.id}`} className="play-btn"><PlayCircle size={40} /></Link>
                                </div>
                                <div className="card-details">
                                    <span className="category-tag">{course.category}</span>
                                    <h3>{course.title}</h3>
                                    <p className="last-lesson-title">Running: {course.lastLesson}</p>
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <span className="progress-percent">{course.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="recommendations">
                    <h2>Recommended for you</h2>
                    <div className="rec-grid">
                        {recommendedCourses.map(course => (
                            <Link key={course.id} to={`/course/${course.id}`} className="rec-item">
                                <img src={course.image} alt={course.title} />
                                <div className="rec-info">
                                    <h4>{course.title}</h4>
                                    <p>{course.instructor}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LearningDashboard;
