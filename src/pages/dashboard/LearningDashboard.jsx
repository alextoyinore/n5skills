import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Award, BookOpen, Search, Bell } from 'lucide-react';
import { COURSES } from '../../constants/mockData';
import { useAuth } from '../../context/AuthContext';
import './LearningDashboard.css';

const LearningDashboard = () => {
    const { user } = useAuth();
    // Mock enrolled courses
    const enrolledCourses = COURSES.slice(0, 4).map((c, i) => ({
        ...c,
        progress: [75, 40, 15, 60][i],
        lastAccessed: '2 hours ago',
        lastLesson: [
            "Introduction to React Hooks",
            "Advanced CSS Grid Layouts",
            "Understanding Asynchronous JavaScript",
            "Risk Management Strategies"
        ][i]
    }));

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
                            <h3>12</h3>
                            <p>Courses in progress</p>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <Award size={24} color="var(--secondary)" />
                        <div>
                            <h3>4</h3>
                            <p>Certificates earned</p>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <Clock size={24} color="var(--success)" />
                        <div>
                            <h3>45h</h3>
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
                        {COURSES.slice(3, 6).map(course => (
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
