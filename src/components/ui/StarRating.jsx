import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ rating = 0, max = 5, onRatingChange, readonly = true, size = 18 }) => {
    const [hover, setHover] = useState(0);

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= max; i++) {
            const isFull = (hover || rating) >= i;
            const isHalf = !isFull && (hover || rating) >= i - 0.5;

            stars.push(
                <button
                    key={i}
                    type="button"
                    className={`star-btn ${readonly ? 'readonly' : ''}`}
                    onClick={() => !readonly && onRatingChange && onRatingChange(i)}
                    onMouseEnter={() => !readonly && setHover(i)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    disabled={readonly}
                >
                    {isHalf ? (
                        <StarHalf size={size} className="star-icon half" />
                    ) : (
                        <Star
                            size={size}
                            className={`star-icon ${isFull ? 'full' : 'empty'}`}
                            fill={isFull ? "var(--warning)" : "none"}
                        />
                    )}
                </button>
            );
        }
        return stars;
    };

    return (
        <div className="star-rating">
            {renderStars()}
            {!readonly && rating > 0 && <span className="rating-value">{rating.toFixed(1)}</span>}
        </div>
    );
};

export default StarRating;
