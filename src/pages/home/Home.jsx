import React, { useState, useEffect } from 'react';
import Hero from '../../components/ui/Hero';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import { supabase } from '../../utils/supabaseClient';
import { Loader2 } from 'lucide-react';
import './Home.css';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
        fetchTestimonials();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);

            // Fetch Categories
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('name')
                .order('name');

            if (catError) throw catError;
            setCategories(["All", ...catData.map(c => c.name)]);

            // Initial fetch for "All"
            await fetchCoursesByCategory("All");

        } catch (error) {
            console.error('Error fetching home categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('course_reviews')
                .select(`
                    id,
                    rating,
                    review_text,
                    created_at,
                    profiles:user_id (full_name, avatar_url),
                    courses:course_id (title)
                `)
                .or('rating.eq.5,is_featured.eq.true')
                .limit(6);

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };

    const fetchCoursesByCategory = async (category) => {
        setFetchLoading(true);
        try {
            const selectQuery = category === "All"
                ? "*, categories (name)"
                : "*, categories!inner (name)";

            let query = supabase
                .from('courses')
                .select(selectQuery)
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(8);

            if (category !== "All") {
                query = query.eq('categories.name', category);
            }

            const { data: courseData, error: courseError } = await query;

            if (courseError) {
                console.error('Supabase Query Error:', courseError);
                throw courseError;
            }

            setCourses(courseData || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleCategoryChange = async (cat) => {
        setActiveCategory(cat);
        await fetchCoursesByCategory(cat);
    };

    return (
        <div className="home-page">
            <Hero />

            <section className="categories-section container">
                <div className="section-header">
                    <h2>Explore Top Categories</h2>
                    <Link to="/courses" className="btn-text">View All Categories</Link>
                </div>
                <div className="category-chips">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <section className="courses-section container">
                <div className="section-header">
                    <h2>Most Popular Courses</h2>
                    <p>Showing {activeCategory} courses</p>
                </div>

                {loading || fetchLoading ? (
                    <div className="flex-center py-20">
                        <Loader2 className="spinner" size={40} color="var(--primary)" />
                    </div>
                ) : (
                    <>
                        <div className="courses-grid">
                            {courses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {courses.length === 0 && (
                            <div className="no-courses py-20 text-center glass-card w-full">
                                <p className="text-slate-500 text-center">No courses found in this category yet.</p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {testimonials.length > 0 && (
                <section className="testimonials-section container py-20">
                    <div className="section-header text-center mb-12">
                        <h2 className="text-3xl font-bold">What Our Students Say</h2>
                        <p className="text-slate-600">Join thousands of successful learners on their journey.</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map(t => (
                            <div key={t.id} className="testimonial-card glass-card">
                                <div className="testimonial-rating">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <p className="testimonial-text">"{t.review_text}"</p>
                                <div className="testimonial-author">
                                    <div className="author-info">
                                        <strong>{t.profiles?.full_name}</strong>
                                        <span>Learner, {t.courses?.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {!user && (
                <section className="cta-banner container">
                    <div className="cta-content">
                        <h2>Ready to start your next career move?</h2>
                        <p>Join millions of learners from around the world and start learning today.</p>
                        <div className="cta-btns">
                            <Link to="/signup" className="btn btn-primary">Join for Free</Link>
                            <Link to="/about" className="btn btn-outline">For Business</Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
