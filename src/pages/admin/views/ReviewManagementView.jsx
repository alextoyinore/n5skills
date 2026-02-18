import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Star, CheckCircle, XCircle, Loader2, Search, Filter } from 'lucide-react';

const ReviewManagementView = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('course_reviews')
                .select(`
                    *,
                    profiles:user_id (full_name, email),
                    courses:course_id (title)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (reviewId, currentStatus) => {
        setUpdating(reviewId);
        try {
            const { error } = await supabase
                .from('course_reviews')
                .update({ is_featured: !currentStatus })
                .eq('id', reviewId);

            if (error) throw error;

            setReviews(reviews.map(r =>
                r.id === reviewId ? { ...r, is_featured: !currentStatus } : r
            ));
        } catch (error) {
            console.error('Error updating review:', error);
            alert('Failed to update review status.');
        } finally {
            setUpdating(null);
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.review_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.courses?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div>
                    <p className="subtitle">User Feedback</p>
                    <h2>Review <span className="primary-text">Management</span></h2>
                </div>
            </header>

            <div className="view-filters">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search reviews, users, or courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="activity-table glass-card">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="spinner mx-auto mb-4" size={32} />
                        <p>Loading reviews...</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Rating</th>
                                <th>Review</th>
                                <th>Featured</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map(review => (
                                <tr key={review.id}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{review.profiles?.full_name}</span>
                                            <small className="text-slate-400">{review.profiles?.email}</small>
                                        </div>
                                    </td>
                                    <td>{review.courses?.title}</td>
                                    <td>
                                        <div className="flex text-yellow-400">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="max-w-xs">
                                        <p className="text-sm truncate" title={review.review_text}>
                                            {review.review_text}
                                        </p>
                                    </td>
                                    <td>
                                        <button
                                            className={`badge-status ${review.is_featured ? 'success' : 'neutral'} clickable`}
                                            onClick={() => toggleFeatured(review.id, review.is_featured)}
                                            disabled={updating === review.id}
                                        >
                                            {updating === review.id ? (
                                                <Loader2 className="spinner" size={14} />
                                            ) : review.is_featured ? (
                                                <><CheckCircle size={14} /> Featured</>
                                            ) : (
                                                'Not Featured'
                                            )}
                                        </button>
                                    </td>
                                    <td>{new Date(review.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {filteredReviews.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ReviewManagementView;
