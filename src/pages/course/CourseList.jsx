import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import { Sliders, X, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import './CourseList.css';

const CourseList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [priceFilter, setPriceFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const category = new URLSearchParams(location.search).get('category') || 'All';
        setActiveCategory(category);
    }, [location.search]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Categories
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('name')
                .order('name');

            if (catError) throw catError;
            setCategories(["All", ...catData.map(c => c.name)]);

            // 2. Fetch All Published Courses
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select(`
                    *,
                    categories (name)
                `)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (courseError) {
                console.error('Course fetch error:', courseError);
                throw courseError;
            }

            setCourses(courseData || []);

        } catch (error) {
            console.error('Error fetching course list:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        const categoryMatch = activeCategory === 'All' || (course.categories?.name || course.category) === activeCategory;
        const levelMatch = levelFilter === 'All' || course.level === levelFilter;
        const priceMatch = priceFilter === 'All' || (priceFilter === 'Free' ? course.price === 0 : course.price > 0);
        return categoryMatch && levelMatch && priceMatch;
    });

    return (
        <div className="course-list-page">
            <header className="course-list-header container">
                <div className="header-top">
                    <h1>{activeCategory === 'All' ? 'All Courses' : activeCategory}</h1>
                    <button
                        className="filter-drawer-toggle"
                        onClick={() => setIsFilterDrawerOpen(true)}
                    >
                        <Sliders size={20} />
                        Filters
                    </button>
                </div>
            </header>

            <main className="course-list-content container">
                {/* Course Grid */}
                <div className="courses-results">
                    {loading ? (
                        <div className="flex-center py-20">
                            <Loader2 className="spinner" size={40} color="var(--primary)" />
                        </div>
                    ) : (
                        <>
                            <p className="results-count">Showing {filteredCourses.length} results</p>
                            <div className="course-grid">
                                {filteredCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>

                            {filteredCourses.length === 0 && (
                                <div className="no-results py-20 text-center">
                                    <p className="text-muted">No courses found matching your filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Mobile Filter Drawer Overlay */}
            {isFilterDrawerOpen && (
                <div className="filter-drawer-overlay" onClick={() => setIsFilterDrawerOpen(false)}>
                    <div className="filter-drawer" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h2>Filters</h2>
                            <button onClick={() => setIsFilterDrawerOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="drawer-body">
                            <div className="filter-group">
                                <h3>Category</h3>
                                <div className="filter-options">
                                    <select
                                        className="filter-select"
                                        value={activeCategory}
                                        onChange={(e) => setActiveCategory(e.target.value)}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h3>Price</h3>
                                <div className="filter-options">
                                    <select
                                        className="filter-select"
                                        value={priceFilter}
                                        onChange={(e) => setPriceFilter(e.target.value)}
                                    >
                                        <option value="All">All Prices</option>
                                        <option value="Free">Free</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                            <div className="filter-group">
                                <h3>Level</h3>
                                <div className="filter-options">
                                    <select
                                        className="filter-select"
                                        value={levelFilter}
                                        onChange={(e) => setLevelFilter(e.target.value)}
                                    >
                                        <option value="All">All Levels</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="drawer-footer">
                            <button className="btn btn-primary w-full" onClick={() => setIsFilterDrawerOpen(false)}>
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseList;
