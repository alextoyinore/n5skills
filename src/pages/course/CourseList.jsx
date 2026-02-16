import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COURSES, CATEGORIES } from '../../constants/mockData';
import CourseCard from '../../components/course/CourseCard';
import { Sliders, X } from 'lucide-react';
import './CourseList.css';

const CourseList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [priceFilter, setPriceFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    useEffect(() => {
        const category = new URLSearchParams(location.search).get('category') || 'All';
        setActiveCategory(category);
    }, [location.search]);

    const filteredCourses = COURSES.filter(course => {
        const categoryMatch = activeCategory === 'All' || course.category === activeCategory;
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
                        <Sliders size={20} /> Filters
                    </button>
                </div>
                <p>Browse our catalog of world-class courses and start learning today.</p>
            </header>

            <div className={`filter-overlay ${isFilterDrawerOpen ? 'active' : ''}`} onClick={() => setIsFilterDrawerOpen(false)} />

            <aside className={`filter-drawer ${isFilterDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Filters</h3>
                    <button className="close-drawer" onClick={() => setIsFilterDrawerOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    <div className="filter-item">
                        <label>Category</label>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Difficulty</label>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Price</label>
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                        >
                            <option value="All">All Prices</option>
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>

                    <button
                        className="btn btn-primary apply-filters-btn"
                        onClick={() => setIsFilterDrawerOpen(false)}
                    >
                        Apply Filters
                    </button>
                </div>
            </aside>

            <div className="container course-list-content">
                <div className="results-info">
                    Showing {filteredCourses.length} courses
                </div>

                <main className="courses-main">
                    <div className="course-list-grid">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="no-results">
                            <h2>No courses found</h2>
                            <p>Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CourseList;
