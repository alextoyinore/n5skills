import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, ChevronLeft, ChevronRight, MessageSquare, FileText, Settings, Maximize, Clock, SkipForward, Loader2, Menu, X, LayoutDashboard, BarChart, Calendar, Mail, Twitter, Linkedin, Github, Globe } from 'lucide-react';
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
    const [instructor, setInstructor] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockPin, setUnlockPin] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);

    const [resources, setResources] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [userNote, setUserNote] = useState('');
    const [noteSaving, setNoteSaving] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // { id: string, name: string }

    useEffect(() => {
        if (id) {
            fetchCourseAndProgress();
        }
    }, [id, user?.id]);

    // Track lesson progress & fetch details whenever activeLesson changes
    useEffect(() => {
        if (user && activeLesson && id) {
            trackProgress(activeLesson);
            fetchLessonDetails(activeLesson);
        }
    }, [activeLesson, user?.id, id]);

    const fetchLessonDetails = async (lessonId) => {
        try {
            // 1. Fetch Resources
            const { data: resData } = await supabase
                .from('lesson_resources')
                .select('*')
                .eq('lesson_id', lessonId);
            setResources(resData || []);

            // 2. Fetch Discussions
            const { data: discData } = await supabase
                .from('lesson_discussions')
                .select('*, profiles:user_id(full_name, avatar_url)')
                .eq('lesson_id', lessonId)
                .order('created_at', { ascending: true }); // Ascending for logical thread flow
            setDiscussions(discData || []);

            // 3. Fetch User Note
            const { data: noteData } = await supabase
                .from('lesson_notes')
                .select('content')
                .eq('lesson_id', lessonId)
                .eq('user_id', user.id)
                .maybeSingle();
            setUserNote(noteData?.content || '');

        } catch (error) {
            console.error('Error fetching lesson details:', error);
        }
    };

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

            // Fetch Instructor Data
            if (realCourse.instructor_id) {
                const { data: instructorData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', realCourse.instructor_id)
                    .single();
                setInstructor(instructorData);
            }

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
                    .select('last_lesson_id, is_unlocked')
                    .eq('user_id', user.id)
                    .eq('course_id', id)
                    .maybeSingle();

                if (enrollment) {
                    setIsUnlocked(enrollment.is_unlocked);
                    if (enrollment.last_lesson_id) {
                        setActiveLesson(enrollment.last_lesson_id);
                    } else if (processedCurriculum.length > 0 && processedCurriculum[0].lessons.length > 0) {
                        setActiveLesson(processedCurriculum[0].lessons[0].id);
                    }
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

    const handleSaveNote = async (content) => {
        setUserNote(content);
        setNoteSaving(true);
        try {
            const { error } = await supabase
                .from('lesson_notes')
                .upsert({
                    user_id: user.id,
                    lesson_id: activeLesson,
                    content: content,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, lesson_id' });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving note:', error);
        } finally {
            setTimeout(() => setNoteSaving(false), 1000);
        }
    };

    const handlePostQuestion = async (e) => {
        // ... (existing code)
    };

    const handleUnlock = async () => {
        if (!unlockPin.trim()) return;
        setIsUnlocking(true);
        try {
            const { data, error } = await supabase.rpc('redeem_course_pin', {
                p_pin_code: unlockPin.trim(),
                p_user_id: user.id,
                p_course_id: id
            });

            if (error) throw error;

            if (data === true) {
                setIsUnlocked(true);
                alert('Course unlocked successfully! You now have full access.');
            } else {
                alert('Invalid or already used PIN. Please check and try again.');
            }
        } catch (error) {
            console.error('Error unlocking course:', error);
            alert('Failed to unlock course: ' + error.message);
        } finally {
            setIsUnlocking(false);
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


                    </div>
                );
            case 'info':
                return (
                    <div className="p-tab-panel">
                        <h3>About this Course</h3>
                        <p className="mt-2" style={{ lineHeight: '1.7', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            {course?.description || 'No description available for this course.'}
                        </p>

                        <div className="course-meta-grid">
                            <div className="meta-box glass-card border-0">
                                <div className="meta-label">
                                    <BarChart size={18} />
                                    Level
                                </div>
                                <div className="meta-value">{course?.level || 'All Levels'}</div>
                            </div>

                            <div className="meta-box glass-card border-0">
                                <div className="meta-label">
                                    <Clock size={18} />
                                    Duration
                                </div>
                                <div className="meta-value">{course?.duration || 'Unknown'}</div>
                            </div>

                            <div className="meta-box glass-card border-0">
                                <div className="meta-label">
                                    <Calendar size={18} />
                                    Last Updated
                                </div>
                                <div className="meta-value">
                                    {course?.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'instructor':
                if (!instructor) {
                    return (
                        <div className="p-tab-panel">
                            <h3>Instructor</h3>
                            <div className="d-flex align-items-center gap-3 text-muted mt-4">
                                <Loader2 className="spinner" size={20} />
                                <span>Loading instructor profile...</span>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="p-tab-panel">
                        <h3>Instructor</h3>

                        <div className="instructor-card glass-card border-0">
                            <div className="instructor-header">
                                <div className="instructor-avatar-large">
                                    {instructor?.avatar_url ? (
                                        <img src={instructor.avatar_url} alt={instructor.full_name} />
                                    ) : (
                                        <div className="instructor-initials">
                                            {instructor?.full_name?.charAt(0) || 'I'}
                                        </div>
                                    )}
                                </div>

                                <div className="instructor-info">
                                    <h4>{instructor?.id ? (
                                        <Link to={`/instructor/${instructor.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{instructor.full_name}</Link>
                                    ) : (instructor?.full_name || 'Instructor')}</h4>
                                    <div className="instructor-email">
                                        <Mail size={16} />
                                        {instructor?.email}
                                    </div>

                                    <div className="instructor-socials">
                                        {instructor?.website && (
                                            <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="social-link website" title="Website">
                                                <Globe size={18} />
                                            </a>
                                        )}
                                        {instructor?.socials?.twitter && (
                                            <a href={`https://twitter.com/${instructor.socials.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link twitter" title="Twitter">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                        {instructor?.socials?.linkedin && (
                                            <a href={instructor.socials.linkedin.startsWith('http') ? instructor.socials.linkedin : `https://linkedin.com/in/${instructor.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="LinkedIn">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {instructor?.socials?.github && (
                                            <a href={`https://github.com/${instructor.socials.github}`} target="_blank" rel="noopener noreferrer" className="social-link github" title="GitHub">
                                                <Github size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="instructor-bio-section">
                                <h5>About the Instructor</h5>
                                <div className="instructor-bio-content">
                                    {instructor?.bio || 'No bio available for this instructor.'}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'resources':
                return (
                    <div className="p-tab-panel">
                        <h3>Downloadable Resources</h3>
                        {resources.length > 0 ? (
                            <div className="resource-grid">
                                {resources.map((res) => (
                                    <div key={res.id} className="resource-item glass-card border-0">
                                        <FileText size={20} />
                                        <div className="res-info">
                                            <p>{res.title}</p>
                                            <span>{res.file_type} • {res.file_size}</span>
                                        </div>
                                        <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="btn-text">Download</a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="discussion-placeholder glass-card border-0">
                                <FileText size={40} />
                                <p>No resources available for this lesson.</p>
                            </div>
                        )}
                    </div>
                );
            case 'discussions':
                const renderDiscussionItem = (disc, depth = 0) => {
                    const replies = discussions.filter(d => d.parent_id === disc.id);
                    const isReply = depth > 0;

                    return (
                        <div key={disc.id} className={`discussion-item-wrap ${isReply ? 'reply-nested' : ''}`} style={{ '--depth': depth }}>
                            <div className="discussion-item glass-card border-0">
                                <div className="disc-user-header">
                                    <div className="disc-user-avatar">
                                        {disc.profiles?.avatar_url ? (
                                            <img src={disc.profiles.avatar_url} alt={disc.profiles.full_name} />
                                        ) : (
                                            <div className="avatar-initials-sm">{disc.profiles?.full_name?.charAt(0) || 'U'}</div>
                                        )}
                                    </div>
                                    <div className="disc-user-meta">
                                        <span className="disc-author">{disc.profiles?.full_name || 'Anonymous User'}</span>
                                        <span className="disc-date">{new Date(disc.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="disc-content-body">
                                    {disc.title && <h4 className="disc-title">{disc.title}</h4>}
                                    <p className="disc-text">{disc.content}</p>
                                </div>

                                <div className="disc-actions">
                                    <button
                                        className="btn-reply-action"
                                        onClick={() => {
                                            setReplyingTo({ id: disc.id, name: disc.profiles?.full_name });
                                            setIsAskingQuestion(true);
                                        }}
                                    >
                                        <MessageSquare size={14} /> Reply
                                    </button>
                                </div>
                            </div>

                            {replies.length > 0 && depth < 3 && (
                                <div className="replies-container">
                                    {replies.map(reply => renderDiscussionItem(reply, depth + 1))}
                                </div>
                            )}
                        </div>
                    );
                };

                if (isAskingQuestion) {
                    return (
                        <div className="p-tab-panel">
                            <div className="form-head-actions">
                                <h3>{replyingTo ? `Replying to ${replyingTo.name}` : 'Ask a Question'}</h3>
                                <button className="btn-text" onClick={() => {
                                    setIsAskingQuestion(false);
                                    setReplyingTo(null);
                                }}>Back to Discussions</button>
                            </div>
                            <form className="question-form glass-card border-0" onSubmit={handlePostQuestion}>
                                {!replyingTo && (
                                    <div className="input-group">
                                        <label>Question Title</label>
                                        <input name="title" type="text" placeholder="Summary of your question" required />
                                    </div>
                                )}
                                <div className="input-group">
                                    <label>{replyingTo ? 'Your Reply' : 'Details'}</label>
                                    <textarea
                                        name="content"
                                        placeholder={replyingTo ? "Write your helpful response..." : "Describe your problem in detail..."}
                                        rows="6"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => {
                                        setIsAskingQuestion(false);
                                        setReplyingTo(null);
                                    }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{replyingTo ? 'Post Reply' : 'Post Question'}</button>
                                </div>
                            </form>
                        </div>
                    );
                }

                const rootDiscussions = [...discussions].filter(d => !d.parent_id).reverse();

                return (
                    <div className="p-tab-panel">
                        <div className="tab-header">
                            <h3>Community Q&A</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => {
                                setReplyingTo(null);
                                setIsAskingQuestion(true);
                            }}>Ask a Question</button>
                        </div>
                        {rootDiscussions.length > 0 ? (
                            <div className="discussions-list d-flex flex-column gap-3">
                                {rootDiscussions.map((disc) => renderDiscussionItem(disc))}
                            </div>
                        ) : (
                            <div className="discussion-placeholder glass-card border-0">
                                <MessageSquare size={40} />
                                <p>No questions yet for this lesson. Be the first to ask!</p>
                            </div>
                        )}
                    </div>
                );
            case 'notes':
                return (
                    <div className="p-tab-panel">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>My Notes</h3>
                            {noteSaving && <span className="text-muted" style={{ fontSize: '0.9rem' }}><Loader2 className="spinner" size={14} /> Saving...</span>}
                        </div>
                        <textarea
                            className="notes-textarea glass-card border-0"
                            placeholder="Type your notes here for this lesson... (Auto-saved)"
                            rows="10"
                            value={userNote}
                            onChange={(e) => handleSaveNote(e.target.value)}
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
                    {(() => {
                        const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson);
                        const isRestricted = !isUnlocked &&
                            course?.price > 0 &&
                            user?.role === 'student' &&
                            currentLessonIndex >= 10;

                        if (isRestricted) {
                            return (
                                <div className="restricted-overlay glass-card">
                                    <div className="restricted-content">
                                        <div className="lock-icon-bg">
                                            <Maximize size={48} className="text-primary" />
                                        </div>
                                        <h2>Unlock Full Course Access</h2>
                                        <p>You've reached the end of the free trial (first 10 lessons). To continue learning and access all {allLessons.length} lessons, please unlock the full course with a PIN.</p>

                                        <div className="gumroad-cta">
                                            <p>Don't have a PIN yet?</p>
                                            <a href="https://gumroad.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                                Buy Access PIN <ExternalLink size={18} />
                                            </a>
                                        </div>

                                        <div className="unlock-form">
                                            <input
                                                type="text"
                                                placeholder="Enter PIN Code"
                                                value={unlockPin}
                                                onChange={(e) => setUnlockPin(e.target.value)}
                                                className="pin-input"
                                            />
                                            <button
                                                className="btn btn-success"
                                                onClick={handleUnlock}
                                                disabled={isUnlocking}
                                            >
                                                {isUnlocking ? <Loader2 className="spinner" size={20} /> : 'Unlock Course'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <>
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
                                        <button
                                            className={`p-tab ${activeTab === 'info' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('info')}
                                        >
                                            Course Info
                                        </button>
                                        <button
                                            className={`p-tab ${activeTab === 'instructor' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('instructor')}
                                        >
                                            Instructor
                                        </button>
                                    </div>

                                    {renderTabContent()}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
