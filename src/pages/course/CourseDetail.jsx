import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Users, Globe, CheckCircle, PlayCircle, ChevronDown } from 'lucide-react';
import { COURSES } from '../../constants/mockData';
import './CourseDetail.css';

const CourseDetail = () => {
    const { id } = useParams();
    const course = COURSES.find(c => c.id === parseInt(id)) || COURSES[0];

    return (
        <div className="course-detail-page">
            <header className="detail-hero">
                <div className="container-narrow">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link> / <span>{course.category}</span>
                    </nav>
                    <h1 className="detail-title">{course.title}</h1>
                    <p className="detail-subtitle">Master the art of {course.category.toLowerCase()} with our most comprehensive guide. Created by {course.instructor} for professional-grade results.</p>

                    <div className="detail-hero-meta">
                        <div className="meta-group">
                            <div className="rating">
                                <Star size={18} fill="var(--accent)" color="var(--accent)" />
                                <span>{course.rating}</span>
                                <span className="reviews-count">({course.reviews} reviews)</span>
                            </div>
                            <div className="students">
                                <Users size={18} />
                                <span>156,000 enrolled</span>
                            </div>
                        </div>
                        <div className="instructor-badge">
                            <div className="instructor-avatar">
                                {course.instructor.charAt(0)}
                            </div>
                            <span>By {course.instructor}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="detail-preview-section">
                <div className="container-mid">
                    <div className="preview-frame glass-card">
                        <img src={course.image} alt={course.title} />
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
                            <div className="highlight-box">
                                <CheckCircle size={22} color="var(--primary)" />
                                <p>Professional workflow tools and industry-standard practices used by top {course.category} experts.</p>
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
                                        <p>Understanding the core pillars and architectural patterns required for high-level {course.category.toLowerCase()}.</p>
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
                                <h3>{course.instructor}</h3>
                                <p className="instructor-tagline">Senior Software Architect & Leading Educator</p>
                                <p className="instructor-description">
                                    With over a decade of experience in the technology sector, {course.instructor} has helped thousands of students transition into high-paying roles at top-tier companies. Their teaching philosophy focuses on practical application and deep conceptual understanding.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <aside className="detail-sidebar-editorial">
                    <div className="sticky-cta glass-card">
                        <div className="cta-pricing">
                            <span className="current-price">${course.price}</span>
                            {!course.isFree && <span className="original-price">$199.99</span>}
                            {!course.isFree && <span className="discount-badge">85% OFF</span>}
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
