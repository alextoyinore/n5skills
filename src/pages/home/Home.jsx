import React, { useState } from 'react';
import Hero from '../../components/ui/Hero';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import { COURSES, CATEGORIES } from '../../constants/mockData';
import './Home.css';

const Home = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredCourses = activeCategory === "All"
        ? COURSES
        : COURSES.filter(course => course.category === activeCategory);

    return (
        <div className="home-page">
            <Hero />

            <section className="categories-section container">
                <div className="section-header">
                    <h2>Explore Top Categories</h2>
                    <button className="btn-text">View All Categories</button>
                </div>
                <div className="category-chips">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
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

                <div className="courses-grid">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="no-courses">
                        <p>No courses found in this category.</p>
                    </div>
                )}
            </section>

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
        </div>
    );
};

export default Home;
