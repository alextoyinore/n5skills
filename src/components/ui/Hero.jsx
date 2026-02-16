import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, BookOpen, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../utils/supabaseClient';
import './Hero.css';

const Hero = () => {
    const { user } = useAuth();
    const { settings, formatPlatformName } = useSettings();
    const [recentlyWatched, setRecentlyWatched] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchRecentlyWatched();
        }
    }, [user]);

    const fetchRecentlyWatched = async () => {
        setLoading(true);
        try {
            // 1. Fetch enrollments with progress and last lesson
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select(`
                    course_id,
                    last_lesson_id,
                    courses (
                        id,
                        title,
                        image_url,
                        course_modules (
                            id,
                            course_lessons (id, title)
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('last_accessed_at', { ascending: false })
                .limit(4);

            if (enrollError) throw enrollError;

            // 2. Fetch completions for progress calculation
            const { data: completions } = await supabase
                .from('lesson_completions')
                .select('lesson_id')
                .eq('user_id', user.id);

            const completedLessonIds = new Set(completions?.map(c => c.lesson_id) || []);

            // 3. Process matches
            const processed = enrollments.map(en => {
                const course = en.courses;
                if (!course) return null;

                const allLessons = course.course_modules.flatMap(m => m.course_lessons);
                const totalLessons = allLessons.length;
                const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
                const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                // Find the title of the last accessed lesson
                let lastLessonTitle = 'Introduction';
                if (en.last_lesson_id) {
                    const lastLesson = allLessons.find(l => l.id === en.last_lesson_id);
                    if (lastLesson) lastLessonTitle = lastLesson.title;
                }

                return {
                    id: course.id,
                    title: course.title,
                    thumbnail: course.image_url || 'https://via.placeholder.com/400x225',
                    progress: progress,
                    currentLesson: lastLessonTitle
                };
            }).filter(Boolean);

            setRecentlyWatched(processed);
        } catch (error) {
            console.error('Error fetching hero data:', error);
        } finally {
            setLoading(false);
        }
    };

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

                    {loading ? (
                        <div className="flex-center py-10">
                            <Loader2 className="spinner" size={40} color="var(--primary)" />
                        </div>
                    ) : recentlyWatched.length > 0 ? (
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

                            <div className="hero-actions-centered mt-8">
                                <Link to="/courses" className="btn btn-primary">
                                    <BookOpen size={20} /> Browse All Courses
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="empty-hero-state py-10 text-center">
                            <p className="mb-6 opacity-80">You haven't started any courses yet. Ready to master a new skill?</p>
                            <Link to="/courses" className="btn btn-primary btn-lg">
                                <BookOpen size={20} /> Browse Course Catalog
                            </Link>
                        </div>
                    )}
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
