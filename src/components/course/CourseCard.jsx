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
                <p className="instructor">By {course.instructor}</p>

                <div className="course-meta">
                    <div className="rating">
                        <Star size={16} fill="var(--accent)" color="var(--accent)" />
                        <span>{course.rating}</span>
                        <span className="reviews">({course.reviews})</span>
                    </div>
                    <div className="duration">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <div className="course-footer">
                    <div className="price">
                        {course.isFree ? <span className="free">Free</span> : <span className="amount">${course.price}</span>}
                    </div>
                    <span className="btn-enroll">Enroll Now</span>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
