import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Globe, CheckCircle, PlayCircle, Loader2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/ui/StarRating';
import ReviewForm from '../../components/course/ReviewForm';
import ReviewList from '../../components/course/ReviewList';
import './CourseDetail.css';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [curriculum, setCurriculum] = useState([]);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});
    const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching course detail for ID:', id);

            if (!course || course.id !== id) {
                setLoading(true);
            }

            try {
                const { data, error: courseError } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        categories (name)
                    `)
                    .eq('id', id)
                    .single();

                if (courseError) {
                    console.error('Course detail fetch error:', courseError);
                    if (courseError.code === 'PGRST116') {
                        setCourse(null);
                    }
                    setLoading(false);
                    return;
                }

                if (data) {
                    setCourse(data);

                    if (data.instructor_id) {
                        supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', data.instructor_id)
                            .single()
                            .then(({ data: profile }) => {
                                if (profile) {
                                    setCourse(prev => (prev && prev.id === data.id) ? { ...prev, instructor: profile } : prev);
                                }
                            });
                    }

                    const { data: modules } = await supabase
                        .from('course_modules')
                        .select('*, course_lessons(*)')
                        .eq('course_id', id)
                        .order('order_index');

                    if (modules) {
                        setCurriculum(modules.map(m => {
                            const totalDuration = m.course_lessons.reduce((acc, lesson) => {
                                const mins = parseInt(lesson.duration) || 0;
                                return acc + mins;
                            }, 0);

                            return {
                                id: m.id,
                                title: m.title,
                                description: m.description,
                                lessonCount: m.course_lessons.length,
                                totalTime: totalDuration > 0 ? `${totalDuration}m` : '0m',
                                lessons: m.course_lessons.sort((a, b) => a.order_index - b.order_index)
                            };
                        }));

                        if (modules.length > 0) {
                            setExpandedModules({ [modules[0].id]: true });
                        }
                    }
                }

                if (user) {
                    const { data: enrollment } = await supabase
                        .from('enrollments')
                        .select('id')
                        .eq('course_id', id)
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (enrollment) setIsEnrolled(true);
                    else setIsEnrolled(false);
                } else {
                    setIsEnrolled(false);
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchReviewStats();
    }, [id, user?.id, refreshTrigger]);

    const fetchReviewStats = async () => {
        try {
            const { data, error } = await supabase
                .from('course_reviews')
                .select('rating')
                .eq('course_id', id);

            if (error) throw error;

            if (data && data.length > 0) {
                const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
                setReviewStats({
                    average: (sum / data.length).toFixed(1),
                    count: data.length
                });
            } else {
                setReviewStats({ average: 0, count: 0 });
            }
        } catch (error) {
            console.error('Error fetching review stats:', error);
        }
    };

    const handleReviewSubmit = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/course/${id}` } });
            return;
        }

        if (isEnrolled) {
            navigate(`/learn/${id}`);
            return;
        }

        setIsEnrolling(true);
        try {
            const { error } = await supabase
                .from('enrollments')
                .insert([{
                    user_id: user.id,
                    course_id: id,
                    is_unlocked: course.is_free // Auto-unlock if course is free
                }]);

            if (error) throw error;
            setIsEnrolled(true);
            navigate(`/learn/${id}`);
        } catch (error) {
            console.error('Enrollment error:', error);
            alert('Failed to enroll: ' + error.message);
        } finally {
            setIsEnrolling(false);
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    if (loading && (!course || course.id !== id)) {
        return (
            <div className="course-detail-page flex-center py-40" style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
                <Loader2 className="spinner" size={48} color="var(--primary)" />
                <p style={{ marginLeft: '1rem', fontSize: '1.25rem', color: '#64748B' }}>Loading course details...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="course-detail-page" style={{ padding: '10rem 0', textAlign: 'center' }}>
                <div className="container-mid">
                    <h2 className="detail-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Course not found</h2>
                    <Link to="/courses" className="btn btn-primary">Browse All Courses</Link>
                </div>
            </div>
        );
    }

    const instructorName = course.instructor?.full_name || 'Expert Instructor';

    return (
        <div className="course-detail-page" style={{ padding: '0', marginTop: '4rem' }}>
            {/* Hero Section */}
            <section className="detail-hero">
                <div className="container-mid">
                    <div className="description-container">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span className="category-tag" style={{ background: '#F1F5F9', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                {course.categories?.name || 'Education'}
                            </span>
                        </div>

                        <h1 className="detail-title">
                            {course.title}
                        </h1>

                        <p className="detail-subtitle">

                        </p>

                        <div className="hero-instructor-line" style={{ marginTop: '1.5rem' }}>
                            <div className="instructor-avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                                {course.instructor?.avatar_url ? (
                                    <img src={course.instructor.avatar_url} alt={instructorName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    instructorName.charAt(0)
                                )}
                            </div>
                            <span>Course by <span className="instructor-name-link">{instructorName}</span></span>
                        </div>
                    </div>

                    <div className="detail-hero-meta">
                        <div className="meta-group">
                            <div className="rating">
                                <StarRating rating={reviewStats.average} size={18} />
                                <span>{reviewStats.average || '0.0'}</span>
                                <span className="reviews-count">({reviewStats.count} {reviewStats.count === 1 ? 'review' : 'reviews'})</span>
                            </div>
                            <div className="students">
                                <Users size={20} />
                                <span>12,340 students</span>
                            </div>
                        </div>
                        <div className="meta-group">
                            <div className="students">
                                <Globe size={20} />
                                <span>English</span>
                            </div>
                            <div className="students">
                                <Clock size={20} />
                                <span>Last updated June 2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="container-mid detail-grid">
                {/* Preview Image - Full Width */}
                <div className="detail-preview-section">
                    <div className="preview-frame">
                        <img
                            src={course.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072'}
                            alt={course.title}
                        />
                        <div className="play-btn-large">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255,255,255,0.9)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}>
                                <PlayCircle size={40} fill="currentColor" />
                            </div>
                            <span>Watch Intro</span>
                        </div>
                    </div>
                </div>

                {/* Left Column */}
                <div className="detail-main-col">


                    {/* Learning Objectives */}
                    <div className="detail-section">
                        <h2 className="detail-section-title" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--dark)' }}>What you'll master</h2>
                        <div className="highlights-editorial-grid">
                            {(course.highlights || course.learning_objectives || [
                                'Professional industry workflow',
                                'Core concepts and architecture',
                                'Real-world project implementation',
                                'Advanced optimization techniques',
                                'Best practices and security',
                                'Deployment and scaling'
                            ]).map((obj, i) => (
                                <div key={i} className="highlight-box">
                                    <div className="highlight-icon-wrapper">
                                        <CheckCircle size={20} />
                                    </div>
                                    <p>{obj}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="detail-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                            <h2 className="detail-section-title" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--dark)' }}>Course Curriculum</h2>
                            <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
                                {curriculum.length} modules • {curriculum.reduce((acc, m) => acc + m.lessonCount, 0)} lessons
                            </span>
                        </div>

                        <div className="curriculum-accordion">
                            {curriculum.map((module, idx) => (
                                <div key={module.id} className="module-accordion-item">
                                    <button
                                        className={`module-header ${expandedModules[module.id] ? 'active' : ''}`}
                                        onClick={() => toggleModule(module.id)}
                                    >
                                        <div className="module-title-info">
                                            <div className="module-meta-top">
                                                <span className="module-index">Module 0{idx + 1}</span>
                                                <span className="module-stats">{module.lessonCount} lessons • {module.totalTime}</span>
                                            </div>
                                            <h4 className="module-title-detail">{module.title}</h4>
                                        </div>
                                        {expandedModules[module.id] ? <ChevronUp className="accordion-icon" /> : <ChevronDown className="accordion-icon" />}
                                    </button>

                                    <div className={`module-content ${expandedModules[module.id] ? 'expanded' : 'collapsed'}`}>
                                        {module.description && <p className="module-description-text">{module.description}</p>}
                                        <div className="lessons-list">
                                            {module.lessons.map((lesson, lIdx) => (
                                                <div key={lesson.id} className="curriculum-item">
                                                    <span className="curr-number">{lIdx + 1 < 10 ? `0${lIdx + 1}` : lIdx + 1}</span>
                                                    <div className="curr-body">
                                                        <h4>{lesson.title}</h4>
                                                        {lesson.is_preview && <span style={{ fontSize: '0.75rem', background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>PREVIEW</span>}
                                                    </div>
                                                    <div className="curr-duration">
                                                        {lesson.duration}m
                                                    </div>
                                                    <PlayCircle size={18} style={{ opacity: 0.3 }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructor Profile */}
                    {course.instructor && (
                        <div className="detail-section">
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--dark)' }}>Your Instructor</h2>
                            <div className="instructor-editorial-premium">
                                <div className="instructor-card-inner">
                                    <div className="instructor-sidebar-info">
                                        <div className="instructor-avatar-giant">
                                            {course.instructor.avatar_url ? (
                                                <img src={course.instructor.avatar_url} alt={instructorName} />
                                            ) : (
                                                instructorName.charAt(0)
                                            )}
                                        </div>
                                    </div>
                                    <div className="instructor-main-bio">
                                        <div className="instructor-bio-header">
                                            <h3>{course.instructor_id ? (
                                                <Link to={`/instructor/${course.instructor_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{instructorName}</Link>
                                            ) : instructorName}</h3>
                                            <div className="instructor-headline">{course.instructor.headline || 'Industry Expert & Global Instructor'}</div>
                                            <div className="instructor-quick-stats">
                                                <div className="q-stat">
                                                    <Star size={18} />
                                                    <span>4.9 Instructor Rating</span>
                                                </div>
                                                <div className="q-stat">
                                                    <Users size={18} />
                                                    <span>45k+ Students</span>
                                                </div>
                                                <div className="q-stat">
                                                    <PlayCircle size={18} />
                                                    <span>12 Courses</span>
                                                </div>
                                            </div>

                                        </div>

                                        <p className="instructor-bio-text">
                                            {course.instructor.bio || "An expert with years of real-world experience, dedicated to sharing practical knowledge and industry-standard workflows with students worldwide."}
                                        </p>


                                        <div className="instructor-social-links">
                                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'left' }}>
                                                {/* Social icons if available */}
                                                <Globe size={20} style={{ color: '#94A3B8', cursor: 'pointer' }} />
                                                <Users size={20} style={{ color: '#94A3B8', cursor: 'pointer' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ratings & Reviews Section */}
                    <div className="detail-section" id="reviews">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <MessageSquare size={28} className="text-primary" />
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--dark)' }}>
                                Student Reviews
                            </h2>
                        </div>

                        <div className="reviews-grid">
                            <div className="reviews-submission">
                                <ReviewForm courseId={id} onReviewSubmit={handleReviewSubmit} />
                            </div>

                            <div className="reviews-display">
                                <div className="reviews-summary-premium glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>
                                            {reviewStats.average || '0.0'}
                                        </div>
                                        <div>
                                            <StarRating rating={reviewStats.average} size={20} />
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                                Course Rating ({reviewStats.count} reviews)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ReviewList courseId={id} refreshTrigger={refreshTrigger} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column / Sidebar */}
                <aside className="detail-sidebar-editorial">
                    <div className="sticky-cta">
                        <div className="cta-pricing">
                            {course.is_free || course.price == 0 ? (
                                <span className="current-price">Free</span>
                            ) : (
                                <>
                                    <span className="current-price">${course.price}</span>
                                    {/* Optional: Show original price if you add a sale_price or original_price column later */}
                                </>
                            )}
                        </div>

                        <div className="cta-actions">
                            <button
                                className="btn btn-primary"
                                onClick={handleEnroll}
                                disabled={isEnrolling}
                                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
                            >
                                {isEnrolling ? <Loader2 className="spinner" size={20} /> : null}
                                {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                            </button>
                            {!isEnrolled && (
                                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
                                    30-Day Money-Back Guarantee
                                </p>
                            )}
                        </div>

                        <ul className="cta-features">
                            <li><Clock size={18} /> Full lifetime access</li>
                            <li><PlayCircle size={18} /> Access on mobile and TV</li>
                            <li><CheckCircle size={18} /> Certificate of completion</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetail;
