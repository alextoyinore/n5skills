import React, { useState } from 'react';
import StarRating from '../ui/StarRating';
import { Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './Reviews.css';

const ReviewForm = ({ courseId, onReviewSubmit, existingReview = null }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const reviewData = {
                course_id: courseId,
                user_id: user.id,
                rating,
                review_text: reviewText,
                updated_at: new Date().toISOString()
            };

            let result;
            if (existingReview) {
                result = await supabase
                    .from('course_reviews')
                    .update(reviewData)
                    .eq('id', existingReview.id);
            } else {
                result = await supabase
                    .from('course_reviews')
                    .insert([reviewData]);
            }

            if (result.error) throw result.error;

            if (onReviewSubmit) {
                onReviewSubmit();
            }

            if (!existingReview) {
                setRating(0);
                setReviewText('');
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="review-auth-prompt glass-card">
                <MessageSquare size={24} className="mb-2 text-primary" />
                <p>Please log in to leave a review for this course.</p>
            </div>
        );
    }

    return (
        <form className="review-form glass-card" onSubmit={handleSubmit}>
            <h3>{existingReview ? 'Edit Your Review' : 'Leave a Review'}</h3>

            <div className="form-group">
                <label>Rating</label>
                <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    readonly={false}
                    size={28}
                />
            </div>

            <div className="form-group">
                <label>Review Content</label>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this course..."
                    required
                    rows={4}
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                    <><Loader2 className="spinner mr-2" size={18} /> Submitting...</>
                ) : (
                    existingReview ? 'Update Review' : 'Submit Review'
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
