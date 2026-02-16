import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Globe, CheckCircle, PlayCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Course Data
                const { data, error } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        categories (name),
                        profiles:instructor_id (full_name)
                    `)
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setCourse(data);

                    // Fetch real curriculum
                    const { data: modules } = await supabase
                        .from('course_modules')
                        .select('*, course_lessons(*)')
                        .eq('course_id', id)
                        .order('order_index');

                    if (modules) {
                        setCurriculum(modules.map(m => ({
                            title: m.title,
                            lessons: m.course_lessons.sort((a, b) => a.order_index - b.order_index)
                        })));
                    }
                }

                // 2. Check Enrollment if user is logged in
                if (user) {
                    const { data: enrollment } = await supabase
                        .from('enrollments')
                        .select('id')
                        .eq('course_id', id)
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (enrollment) setIsEnrolled(true);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user]);

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
                .insert([{ user_id: user.id, course_id: id }]);

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

    if (loading) {
        return (
            <div className="course-detail-page flex-center py-40">
                <Loader2 className="spinner" size={48} color="var(--primary)" />
                <p className="ml-4 text-xl font-medium text-slate-500">Loading course details...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="course-detail-page py-40 text-center">
                <div className="container-mid">
                    <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                    <Link to="/courses" className="btn btn-primary">Browse All Courses</Link>
                </div>
            </div>
        );
    }

    const instructorName = course.profiles?.full_name || 'Expert Instructor';
    const categoryName = course.categories?.name || 'Uncategorized';
    const courseImage = course.image_url || 'https://via.placeholder.com/800x450';
    const courseDescription = course.description || `Master the art of ${categoryName.toLowerCase()} with our most comprehensive guide.`;

    return (
        <div className="course-detail-page">
            <header className="detail-hero">
                <div className="container-narrow">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link> / <span>{categoryName}</span>
                    </nav>
                    <h1 className="detail-title">{course.title}</h1>
                    <p className="detail-subtitle">{courseDescription}</p>

                    <div className="detail-hero-meta">
                        <div className="meta-group">
                            <div className="rating">
                                <Star size={18} fill="#FFB800" color="#FFB800" />
                                <span>4.8</span>
                                <span className="reviews-count">(1,248 reviews)</span>
                            </div>
                            <div className="students">
                                <Users size={18} />
                                <span>156,000 enrolled</span>
                            </div>
                        </div>
                        <div className="instructor-badge">
                            <div className="instructor-avatar">
                                {instructorName.charAt(0)}
                            </div>
                            <span>By {instructorName}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="detail-preview-section">
                <div className="container-mid">
                    <div className="preview-frame glass-card border-0">
                        <img src={courseImage} alt={course.title} />
                        <div className="play-btn-large">
                            <PlayCircle size={80} />
                            <span>Preview this course</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-mid detail-grid">
                <main className="detail-main-content">
                    <section className="detail-section">
                        <h2 className="section-title">What you'll master</h2>
                        <div className="highlights-editorial-grid">
                            {course.highlights && course.highlights.length > 0 ? (
                                course.highlights.map((highlight, index) => (
                                    <div key={index} className="highlight-box">
                                        <CheckCircle size={22} color="var(--primary)" />
                                        <p>{highlight}</p>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="highlight-box">
                                        <CheckCircle size={22} color="var(--primary)" />
                                        <p>Professional workflow tools and industry-standard practices used by top {categoryName} experts.</p>
                                    </div>
                                    <div className="highlight-box">
                                        <CheckCircle size={22} color="var(--primary)" />
                                        <p>Deep dive into advanced concepts, moving beyond the basics to true mastery in {categoryName}.</p>
                                    </div>
                                    <div className="highlight-box">
                                        <CheckCircle size={22} color="var(--primary)" />
                                        <p>Lifetime access to all future updates and a dedicated community of learners.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="detail-section">
                        <h2 className="section-title">Curriculum</h2>
                        <div className="curriculum-editorial-list">
                            {curriculum.length > 0 ? (
                                curriculum.map((module, mIdx) => (
                                    <div key={mIdx} className="curriculum-module-group">
                                        <h3 className="module-title-detail">{module.title}</h3>
                                        {module.lessons.map((lesson, lIdx) => (
                                            <div key={lesson.id} className="curriculum-item">
                                                <div className="curr-number">{lIdx + 1}</div>
                                                <div className="curr-body">
                                                    <h4>{lesson.title}</h4>
                                                    <p>{lesson.content_type === 'video' ? 'Video Lesson' : 'Reading Material'}</p>
                                                </div>
                                                <div className="curr-duration">{lesson.duration || '10m'}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="no-curriculum py-10 text-center glass-card">
                                    <p className="text-slate-500">Curriculum is being updated. Stay tuned!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="detail-section instructor-reveal border-0">
                        <h2 className="section-title">Your Instructor</h2>
                        <div className="instructor-editorial">
                            <div className="instructor-info-block">
                                <h3>{instructorName}</h3>
                                <p className="instructor-tagline">Lead Educator & Industry Veteran</p>
                                <p className="instructor-description">
                                    With years of professional experience in {categoryName.toLowerCase()}, {instructorName} has helped thousands of students achieve their career goals. Their teaching approach bridge the gap between complex theory and real-world application.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <aside className="detail-sidebar-editorial">
                    <div className="sticky-cta glass-card border-0">
                        <div className="cta-pricing">
                            <span className="current-price">₦{course.price?.toLocaleString()}</span>
                            {!course.is_free && <span className="original-price">₦319,984</span>}
                            {!course.is_free && <span className="discount-badge">85% OFF</span>}
                        </div>
                        <div className="cta-actions">
                            <button
                                className="btn btn-primary btn-lg btn-block"
                                onClick={handleEnroll}
                                disabled={isEnrolling}
                            >
                                {isEnrolling ? <Loader2 className="spinner" size={20} /> : (isEnrolled ? 'Go to Course' : 'Enroll Now')}
                            </button>
                            <button className="btn btn-outline btn-lg btn-block">
                                Add to Wishlist
                            </button>
                        </div>
                        <ul className="cta-features">
                            <li><Clock size={16} /> Lifetime Access</li>
                            <li><Globe size={16} /> English & Subtitles</li>
                            <li><CheckCircle size={16} /> Certificate of Completion</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetail;
