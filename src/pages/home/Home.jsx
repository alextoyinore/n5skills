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
    const [loading, setLoading] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
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

    const fetchCoursesByCategory = async (category) => {
        setFetchLoading(true);
        try {
            let query = supabase
                .from('courses')
                .select(`
                    *,
                    categories (name),
                    profiles:instructor_id (full_name)
                `)
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(8);

            if (category !== "All") {
                // If it's a specific category, we need to filter by the joined table field
                // In PostgREST, we can use 'categories.name'.eq if we use !inner or just filter on the related table
                query = query.filter('categories.name', 'eq', category);
            }

            const { data: courseData, error: courseError } = await query;

            if (courseError) throw courseError;
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
                                <p className="text-slate-500">No courses found in this category yet.</p>
                            </div>
                        )}
                    </>
                )}
            </section>

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
