import React, { useEffect, useState } from 'react';
import StarRating from '../ui/StarRating';
import { supabase } from '../../utils/supabaseClient';
import { Loader2 } from 'lucide-react';
import './Reviews.css';

const ReviewList = ({ courseId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [courseId, refreshTrigger]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('course_reviews')
                .select('*, profiles(full_name)')
                .eq('course_id', courseId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Database Error in ReviewList:', error);
                throw error;
            }
            console.log('Fetched reviews:', data);
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center py-10">
                <Loader2 className="spinner" size={30} color="var(--primary)" />
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="no-reviews py-10 text-center text-slate-500">
                <p>No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="reviews-list">
            {reviews.map((review) => (
                <div key={review.id} className="review-item">
                    <div className="review-header">
                        <div className="reviewer-meta">
                            <div className="reviewer-avatar">
                                {review.profiles?.full_name?.charAt(0) || review.user_id.charAt(0)}
                            </div>
                            <div>
                                <span className="reviewer-name">
                                    {review.profiles?.full_name || 'Anonymous Learner'}
                                </span>
                                <span className="review-date">
                                    {new Date(review.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <StarRating rating={review.rating} readonly={true} size={16} />
                    </div>
                    <div className="review-content">
                        <p>{review.review_text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
