import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';

const BlogManagementView = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blog_posts')
                .select(`
                    *,
                    profiles:author_id (full_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPosts(data || []);

            const published = data.filter(p => p.status === 'published').length;
            setStats({
                total: data.length,
                published,
                drafts: data.length - published
            });
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post');
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-view">
            <header className="admin-header">
                <h2>Blog Management</h2>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/blog/create')}>
                    <Plus size={18} /> New Post
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <span className="stat-icon purple">📝</span>
                    <div>
                        <p>Total Posts</p>
                        <h3>{stats.total}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-icon green">✅</span>
                    <div>
                        <p>Published</p>
                        <h3>{stats.published}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <span className="stat-icon blue">⏳</span>
                    <div>
                        <p>Drafts</p>
                        <h3>{stats.drafts}</h3>
                    </div>
                </div>
            </div>

            <div className="view-filters">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search blog posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-filter"><Filter size={18} /> Category: All</button>
            </div>

            <div className="activity-table glass-card">
                {loading ? (
                    <div className="loading-container p-8 text-center">
                        <Loader2 className="spinner mx-auto" size={32} />
                        <p className="mt-4">Loading posts...</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Post Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map(post => (
                                    <tr key={post.id}>
                                        <td>
                                            <div className="post-title-cell">
                                                <strong>{post.title}</strong>
                                                <small>{post.slug}</small>
                                            </div>
                                        </td>
                                        <td>{post.category}</td>
                                        <td>{post.profiles?.full_name || 'Anonymous'}</td>
                                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge-status ${post.status === 'published' ? 'success' : 'warning'}`}>
                                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-row">
                                                <button
                                                    className="icon-btn"
                                                    title="View"
                                                    onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                                                >
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button
                                                    className="icon-btn"
                                                    title="Edit"
                                                    onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="icon-btn delete"
                                                    title="Delete"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">No posts found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BlogManagementView;
