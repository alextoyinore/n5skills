import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import './Hero.css';

const Hero = () => {
    const { user } = useAuth();
    const { settings, formatPlatformName } = useSettings();

    // Mock recently watched courses (replace with actual data from your backend)
    const recentlyWatched = [
        {
            id: 1,
            title: "Advanced React Patterns",
            progress: 65,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400",
            lastWatched: "2 hours ago",
            currentLesson: "Compound Components & Context"
        },
        {
            id: 2,
            title: "Node.js Masterclass",
            progress: 40,
            thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=400",
            lastWatched: "Yesterday",
            currentLesson: "Streams and Buffers in Depth"
        },
        {
            id: 3,
            title: "UI/UX Design Fundamentals",
            progress: 80,
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400",
            lastWatched: "3 days ago",
            currentLesson: "Color Theory & Applications"
        },
        {
            id: 4,
            title: "Financial Strategy",
            progress: 25,
            thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400",
            lastWatched: "5 days ago",
            currentLesson: "Portfolio Management Basics"
        }
    ];

    if (user) {
        return (
            <div className="hero hero-personalized">
                <div className="hero-bg-elements">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>

                <div className="container hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="personalized-welcome"
                    >
                        <h1>Welcome back, <span className="primary-text">{user.name.split(' ')[0]}</span>! 👋</h1>
                        <p>Continue your learning journey where you left off</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="recently-watched-section"
                    >
                        <div className="section-header-inline">
                            <h2><Clock size={24} /> Continue Watching</h2>
                            <Link to="/dashboard" className="btn-text">View All →</Link>
                        </div>

                        <div className="recent-courses-grid">
                            {recentlyWatched.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                    className="recent-course-card"
                                >
                                    <Link to={`/learn/${course.id}`}>
                                        <div className="course-thumbnail">
                                            <img src={course.thumbnail} alt={course.title} />
                                            <div className="play-overlay">
                                                <PlayCircle size={48} />
                                            </div>
                                        </div>
                                        <div className="course-info">
                                            <h3>{course.title}</h3>
                                            <div className="course-meta">
                                                <span className="current-lesson">Running: {course.currentLesson}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-text">{course.progress}% complete</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="hero-actions-centered">
                            <Link to="/courses" className="btn btn-primary">
                                <BookOpen size={20} /> Browse All Courses
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="hero">
            <div className="hero-bg-elements">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-text"
                >
                    <span className="badge">NEW COURSES AVAILABLE</span>
                    <h1>Learn from the <span className="accent-text">Best</span>, Anywhere.</h1>
                    <p>
                        Master the skills that matter. Access world-class education from top universities
                        and industry leaders. Start your journey today.
                    </p>
                    <div className="hero-actions">
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Get Started <ArrowRight size={20} />
                        </Link>
                        <button
                            className="btn btn-outline"
                            onClick={() => alert("Demo video coming soon!")}
                        >
                            <PlayCircle size={20} /> Watch Demo
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">15K+</span>
                            <span className="stat-label">Online Courses</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">2M+</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">100+</span>
                            <span className="stat-label">Partners</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hero-image"
                >
                    <div className="image-wrapper">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" alt="Students learning" />
                        <div className="floating-card card-1">
                            <div className="card-icon">🚀</div>
                            <div>
                                <strong>Career Growth</strong>
                                <p>Boost your salary by 40%</p>
                            </div>
                        </div>
                        <div className="floating-card card-2">
                            <div className="card-icon">🏆</div>
                            <div>
                                <strong>Certificates</strong>
                                <p>Recognized globally</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
