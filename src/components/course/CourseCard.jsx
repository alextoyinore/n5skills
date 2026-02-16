import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
    // Standardize data from different sources (Mock vs Supabase)
    const title = course.title || 'Untitled Course';
    const image = course.image_url || course.image || 'https://via.placeholder.com/300x170';
    const instructor = course.profiles?.full_name || course.instructor || 'Expert Instructor';
    const category = course.categories?.name || course.category || 'Uncategorized';
    const rating = course.rating || '4.8';
    const reviews = course.reviews || '1.2k';
    const duration = course.duration || '12h 30m';
    const description = course.description || 'Master this subject with our expert-led comprehensive course.';

    return (
        <Link to={`/course/${course.id}`} className="course-card">
            <div className="course-image">
                <img src={image} alt={title} />
                <div className="course-badge">{category}</div>
            </div>
            <div className="course-info">
                <h3>{title}</h3>
                <p className="course-description">{description}</p>
                <p className="instructor">By {instructor}</p>

                <div className="course-meta">
                    <div className="rating">
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        <span>{rating}</span>
                        <span className="reviews">({reviews})</span>
                    </div>

                    <div className="duration">
                        <Clock size={16} />
                        <span>{duration}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
