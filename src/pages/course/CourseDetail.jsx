import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Users, Globe, CheckCircle, PlayCircle, ChevronDown } from 'lucide-react';
import { COURSES } from '../../constants/mockData';
import { supabase } from '../../utils/supabaseClient';
import './CourseDetail.css';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRealCourse, setIsRealCourse] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            // First, try to find in mock data
            const mockCourse = COURSES.find(c => c.id === parseInt(id));

            if (mockCourse) {
                setCourse(mockCourse);
                setIsRealCourse(false);
                setLoading(false);
            } else {
                // If not in mock data, try Supabase (for admin-created courses)
                const { data, error } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        categories (name),
                        profiles:instructor_id (first_name, last_name)
                    `)
                    .eq('id', id)
                    .single();

                if (data) {
                    setCourse(data);
                    setIsRealCourse(true);
                }
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return <div className="course-detail-page"><div className="container-mid">Loading...</div></div>;
    }

    if (!course) {
        return <div className="course-detail-page"><div className="container-mid">Course not found</div></div>;
    }

    // Handle both mock and real course data
    const instructorName = isRealCourse
        ? (course.profiles ? `${course.profiles.first_name} ${course.profiles.last_name}` : 'Unknown Instructor')
        : course.instructor;
    const categoryName = isRealCourse
        ? (course.categories?.name || 'Uncategorized')
        : course.category;
    const courseImage = isRealCourse
        ? (course.image_url || 'https://via.placeholder.com/800x450')
        : course.image;
    const courseDescription = isRealCourse
        ? (course.description || `Master the art of ${categoryName.toLowerCase()} with our most comprehensive guide.`)
        : `Master the art of ${categoryName.toLowerCase()} with our most comprehensive guide. Created by ${instructorName} for professional-grade results.`;

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
                                <span>{isRealCourse ? '4.8' : course.rating}</span>
                                <span className="reviews-count">({isRealCourse ? '1,234' : course.reviews} reviews)</span>
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
                    <div className="preview-frame glass-card">
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
                            {isRealCourse && course.highlights && course.highlights.length > 0 ? (
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
                                        <p>Building a robust portfolio with 12+ real-world projects that stand out to recruiters.</p>
                                    </div>
                                    <div className="highlight-box">
                                        <CheckCircle size={22} color="var(--primary)" />
                                        <p>Deep dive into advanced concepts, moving beyond the basics to true mastery.</p>
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
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="curriculum-item">
                                    <div className="curr-number">0{i}</div>
                                    <div className="curr-body">
                                        <h4>Strategic Foundations: Part {i}</h4>
                                        <p>Understanding the core pillars and architectural patterns required for high-level {categoryName.toLowerCase()}.</p>
                                    </div>
                                    <div className="curr-duration">45m</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="detail-section instructor-reveal">
                        <h2 className="section-title">Your Instructor</h2>
                        <div className="instructor-editorial">
                            <div className="instructor-info-block">
                                <h3>{instructorName}</h3>
                                <p className="instructor-tagline">Senior Software Architect & Leading Educator</p>
                                <p className="instructor-description">
                                    With over a decade of experience in the technology sector, {instructorName} has helped thousands of students transition into high-paying roles at top-tier companies. Their teaching philosophy focuses on practical application and deep conceptual understanding.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <aside className="detail-sidebar-editorial">
                    <div className="sticky-cta glass-card">
                        <div className="cta-pricing">
                            <span className="current-price">₦{course.price?.toLocaleString()}</span>
                            {!(isRealCourse ? course.is_free : course.isFree) && <span className="original-price">₦319,984</span>}
                            {!(isRealCourse ? course.is_free : course.isFree) && <span className="discount-badge">85% OFF</span>}
                        </div>
                        <div className="cta-actions">
                            <Link to={`/learn/${course.id}`} className="btn btn-primary btn-lg btn-block">
                                Enroll Now
                            </Link>
                            <button className="btn btn-outline btn-lg btn-block">
                                Add to Wishlist
                            </button>
                        </div>
                        <ul className="cta-features">
                            <li><Clock size={16} /> 65+ Hours of Video</li>
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
