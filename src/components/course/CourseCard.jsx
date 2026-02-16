import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
    return (
        <Link to={`/course/${course.id}`} className="course-card">
            <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-badge">{course.category}</div>
            </div>
            <div className="course-info">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <p className="instructor">By {course.instructor}</p>

                <div className="course-meta">
                    <div className="rating">
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        <span>{course.rating}</span>
                        <span className="reviews">({course.reviews})</span>
                    </div>

                    <div className="duration">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
