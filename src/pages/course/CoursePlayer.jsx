import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, ChevronLeft, ChevronRight, MessageSquare, FileText, Settings, Maximize, Clock, SkipForward, Loader2, Menu, X, LayoutDashboard } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './CoursePlayer.css';

const CoursePlayer = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCourseAndProgress();
        }
    }, [id, user]);

    // Track lesson progress whenever activeLesson changes
    useEffect(() => {
        if (user && activeLesson && id) {
            trackProgress(activeLesson);
        }
    }, [activeLesson, user, id]);

    const trackProgress = async (lessonId) => {
        try {
            const { error } = await supabase
                .from('enrollments')
                .update({
                    last_lesson_id: lessonId,
                    last_accessed_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('course_id', id);

            if (error) console.error('Error tracking progress:', error);
        } catch (err) {
            console.error('Progress tracking failed:', err);
        }
    };

    const fetchCourseAndProgress = async () => {
        setLoading(true);
        try {
            // 1. Fetch Course Data
            const { data: realCourse, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', id)
                .single();

            if (courseError) throw courseError;
            setCourse(realCourse);

            // 2. Fetch Curriculum
            const { data: modules, error: modulesError } = await supabase
                .from('course_modules')
                .select('*, course_lessons(*)')
                .eq('course_id', id)
                .order('order_index');

            if (modulesError) throw modulesError;

            if (modules) {
                const processedCurriculum = modules.map(m => ({
                    id: m.id,
                    title: m.title,
                    lessons: m.course_lessons.sort((a, b) => a.order_index - b.order_index)
                }));
                setCurriculum(processedCurriculum);

                // 3. Set Active Lesson (either from enrollment or first lesson)
                const { data: enrollment } = await supabase
                    .from('enrollments')
                    .select('last_lesson_id')
                    .eq('user_id', user.id)
                    .eq('course_id', id)
                    .maybeSingle();

                if (enrollment?.last_lesson_id) {
                    setActiveLesson(enrollment.last_lesson_id);
                } else if (processedCurriculum.length > 0 && processedCurriculum[0].lessons.length > 0) {
                    setActiveLesson(processedCurriculum[0].lessons[0].id);
                }
            }

            // 4. Fetch Progress
            if (user) {
                const { data: completions } = await supabase
                    .from('lesson_completions')
                    .select('lesson_id')
                    .eq('user_id', user.id);

                if (completions) {
                    setCompletedLessons(completions.map(c => c.lesson_id));
                }
            }
        } catch (error) {
            console.error('Error fetching course player data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = async (lessonId) => {
        if (!user) return;

        const isCompleted = completedLessons.includes(lessonId);

        try {
            if (isCompleted) {
                const { error } = await supabase
                    .from('lesson_completions')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('lesson_id', lessonId);

                if (error) throw error;
                setCompletedLessons(completedLessons.filter(id => id !== lessonId));
            } else {
                const { error } = await supabase
                    .from('lesson_completions')
                    .insert([{ user_id: user.id, lesson_id: lessonId }]);

                if (error) throw error;
                setCompletedLessons([...completedLessons, lessonId]);
            }
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const [activeTab, setActiveTab] = useState('overview');

    const [isAskingQuestion, setIsAskingQuestion] = useState(false);

    const renderTabContent = () => {
        const lesson = allLessons.find(l => l.id === activeLesson) || allLessons[0];

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="p-tab-panel">
                        <h3>About this Lesson</h3>
                        <div className="reading-content mt-4">
                            {lesson?.reading_content ? (
                                <div dangerouslySetInnerHTML={{ __html: lesson.reading_content }} />
                            ) : (
                                <p>Welcome to <strong>{lesson?.title}</strong>. In this lesson, we'll dive deep into the core concepts and practical applications. Focus on understanding the "why" behind the techniques shown.</p>
                            )}
                        </div>

                        <div className="resource-section">
                            <h4>Lesson Resources</h4>
                            <div className="resource-item glass-card border-0">
                                <FileText size={20} />
                                <div className="res-info">
                                    <p>Cheat Sheet: {lesson?.title}</p>
                                    <span>PDF Document • 2.4 MB</span>
                                </div>
                                <button className="btn-text">Download</button>
                            </div>
                        </div>
                    </div>
                );
            case 'resources':
                return (
                    <div className="p-tab-panel">
                        <h3>Downloadable Resources</h3>
                        <div className="resource-grid">
                            <div className="resource-item glass-card border-0">
                                <FileText size={20} />
                                <div className="res-info">
                                    <p>Lesson Slides</p>
                                    <span>PDF • 5.1 MB</span>
                                </div>
                                <button className="btn-text">Download</button>
                            </div>
                            <div className="resource-item glass-card border-0">
                                <FileText size={20} />
                                <div className="res-info">
                                    <p>Source Code Assets</p>
                                    <span>ZIP • 12.8 MB</span>
                                </div>
                                <button className="btn-text">Download</button>
                            </div>
                        </div>
                    </div>
                );
            case 'discussions':
                if (isAskingQuestion) {
                    return (
                        <div className="p-tab-panel">
                            <div className="form-head-actions">
                                <h3>Ask a Question</h3>
                                <button className="btn-text" onClick={() => setIsAskingQuestion(false)}>Back to Discussions</button>
                            </div>
                            <form className="question-form glass-card border-0" onSubmit={(e) => { e.preventDefault(); setIsAskingQuestion(false); }}>
                                <div className="input-group">
                                    <label>Question Title</label>
                                    <input type="text" placeholder="e.g. How do I implement lifecycle methods in functional components?" required />
                                </div>
                                <div className="input-group">
                                    <label>Details</label>
                                    <textarea placeholder="Describe your problem in detail..." rows="6" required></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsAskingQuestion(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Post Question</button>
                                </div>
                            </form>
                        </div>
                    );
                }
                return (
                    <div className="p-tab-panel">
                        <div className="tab-header">
                            <h3>Community Q&A</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setIsAskingQuestion(true)}>Ask a Question</button>
                        </div>
                        <div className="discussion-placeholder glass-card border-0">
                            <MessageSquare size={40} />
                            <p>No questions yet for this lesson. Be the first to ask!</p>
                        </div>
                    </div>
                );
            case 'notes':
                return (
                    <div className="p-tab-panel">
                        <h3>My Notes</h3>
                        <textarea
                            className="notes-textarea glass-card border-0"
                            placeholder="Type your notes here for this lesson... (Auto-saved)"
                            rows="10"
                        ></textarea>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading || !course) {
        return (
            <div className="player-page flex-center" style={{ minHeight: '80vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

    const allLessons = curriculum.flatMap(module => module.lessons);
    const activeLessonId = activeLesson || (allLessons.length > 0 ? allLessons[0].id : null);
    const currentLessonData = allLessons.find(l => l.id === activeLessonId) || allLessons[0];

    const nextLesson = () => {
        const nextIndex = allLessons.findIndex(l => l.id === activeLessonId) + 1;
        if (nextIndex < allLessons.length) {
            setActiveLesson(allLessons[nextIndex].id);
        }
    };

    return (
        <div className="player-page">
            <header className="player-header">
                <div className="player-nav-container">
                    <div className="d-flex align-items-center gap-2">
                        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu size={24} />
                        </button>
                        <Link to="/dashboard" className="player-back">
                            <ChevronLeft size={24} />
                            <span className="dashboard-text">Dashboard</span>
                        </Link>
                    </div>
                    <div className="player-header-title">
                        <h2>{course.title}</h2>
                        <span className="lesson-info-badge">{currentLessonData?.title}</span>
                    </div>
                    <div className="player-meta">
                        <div className="player-progress">
                            <div className="progress-bar-small">
                                <div className="progress-fill" style={{ width: `${(completedLessons.length / Math.max(1, allLessons.length)) * 100}%` }}></div>
                            </div>
                            <span>{Math.round((completedLessons.length / Math.max(1, allLessons.length)) * 100)}% Complete</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="player-layout">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

                <aside className={`curriculum-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header-mobile">
                        <h3>Course Content</h3>
                        <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className="sidebar-sticky">
                        <div className="curriculum-header">
                            <h3>Course Curriculum</h3>
                        </div>
                        <div className="curriculum-list">
                            {curriculum.map((module, mIdx) => (
                                <div key={mIdx} className="curriculum-module">
                                    <div className="module-title">{module.title}</div>
                                    <div className="module-lessons">
                                        {module.lessons.map(lesson => (
                                            <div
                                                key={lesson.id}
                                                className={`curr-lesson ${activeLesson === lesson.id ? 'active' : ''}`}
                                                onClick={() => setActiveLesson(lesson.id)}
                                            >
                                                <div className="curr-status">
                                                    {completedLessons.includes(lesson.id) ? (
                                                        <CheckCircle size={16} color="var(--success)" fill="rgba(16, 185, 129, 0.1)" />
                                                    ) : (
                                                        <div className="curr-dot"></div>
                                                    )}
                                                </div>
                                                <div className="curr-info">
                                                    <p>{lesson.title}</p>
                                                    <span><Clock size={12} /> {lesson.duration || '10m'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="player-content">
                    {currentLessonData?.content_type !== 'reading' && (
                        <div className="video-viewport">
                            <div className="video-mock glass-card border-0">
                                {currentLessonData?.video_url ? (
                                    <iframe
                                        src={currentLessonData.video_url.replace('watch?v=', 'embed/')}
                                        className="video-iframe"
                                        title={currentLessonData.title}
                                        allowFullScreen
                                    />
                                ) : (
                                    <>
                                        <img src={course.image_url || 'https://via.placeholder.com/800x450'} alt="Video Preview" />
                                        <div className="play-overlay">
                                            <Play size={64} fill="currentColor" />
                                        </div>
                                    </>
                                )}
                                {(!currentLessonData?.video_url || !(currentLessonData.video_url.includes('youtube') || currentLessonData.video_url.includes('youtu.be'))) && (
                                    <div className="player-controls">
                                        <div className="ctrl-progress">
                                            <div className="ctrl-progress-fill" style={{ width: '0%' }}></div>
                                        </div>
                                        <div className="ctrl-buttons">
                                            <div className="ctrl-left">
                                                <Play size={20} />
                                                <SkipForward size={20} onClick={nextLesson} />
                                                <span className="time-display">00:00 / {currentLessonData?.duration || '10:00'}</span>
                                            </div>
                                            <div className="ctrl-right">
                                                <Settings size={20} />
                                                <Maximize size={20} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="lesson-details">
                        <div className="lesson-actions">
                            <h1>{currentLessonData?.title}</h1>
                            <div className="btn-group">
                                <button
                                    className={`btn ${completedLessons.includes(activeLesson) ? 'btn-success' : 'btn-outline'}`}
                                    onClick={() => toggleComplete(activeLesson)}
                                >
                                    {completedLessons.includes(activeLesson) ? <><CheckCircle size={18} /> Lesson Completed</> : "Mark as Complete"}
                                </button>
                                <button className="btn btn-primary" onClick={nextLesson}>
                                    Next Lesson <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="player-tabs">
                            <button
                                className={`p-tab ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`p-tab ${activeTab === 'resources' ? 'active' : ''}`}
                                onClick={() => setActiveTab('resources')}
                            >
                                Resources
                            </button>
                            <button
                                className={`p-tab ${activeTab === 'discussions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('discussions')}
                            >
                                Discussions
                            </button>
                            <button
                                className={`p-tab ${activeTab === 'notes' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notes')}
                            >
                                Notes
                            </button>
                        </div>

                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
