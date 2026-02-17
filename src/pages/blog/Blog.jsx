import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import './Blog.css';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchingPosts, setFetchingPosts] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([
                fetchCategories(),
                fetchPosts()
            ]);
            setLoading(false);
        };
        loadInitialData();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPosts = async (categoryName = null) => {
        try {
            setFetchingPosts(true);
            let query = supabase
                .from('blog_posts')
                .select(`
                    *,
                    profiles:author_id (full_name)
                `)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (categoryName) {
                query = query.eq('category', categoryName);
            }

            const { data, error } = await query;

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setFetchingPosts(false);
        }
    };

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        fetchPosts(categoryName);
    };

    return (
        <div className="blog-page">
            <header className="blog-hero">
                <div className="container">
                    <h1>Blog</h1>
                    <p>Insights, stories, and expertise from the world of professional learning.</p>
                </div>
            </header>

            <main className="container blog-content">
                {loading ? (
                    <div className="loading-container p-12 text-center w-full">
                        <Loader2 className="spinner mx-auto" size={40} color="var(--primary)" />
                        <p className="mt-4 text-slate-500">Loading insights...</p>
                    </div>
                ) : (
                    <div className="blog-grid">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <article key={post.id} className="blog-card">
                                    <div className="blog-card-image">
                                        <img src={post.featured_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"} alt={post.title} />
                                        <span className="blog-category">{post.category}</span>
                                    </div>
                                    <div className="blog-card-body">
                                        <div className="blog-meta">
                                            <span className="blog-date">
                                                <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="blog-author">
                                                <User size={14} /> {post.profiles?.full_name || 'Admin'}
                                            </span>
                                        </div>
                                        <h2 className="blog-title">{post.title}</h2>
                                        <p className="blog-excerpt">{post.excerpt}</p>
                                        <Link to={`/blog/${post.id}`} className="read-more">
                                            Read Article <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="no-posts p-12 text-center w-full glass-card">
                                <h3>No posts yet</h3>
                                <p>Check back later for more content.</p>
                            </div>
                        )}
                    </div>
                )}

                <aside className="blog-sidebar">
                    <div className="sidebar-widget">
                        <h3>Subscribe to Newsletter</h3>
                        <p style={{ marginBottom: '1rem' }}>Get the latest articles and course updates delivered to your inbox.</p>
                        <div className="subscribe-form">
                            <input type="email" placeholder="Email address" />
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3>Categories</h3>
                        <ul className="category-list">
                            <li>
                                <button
                                    className={`category-filter-btn ${!activeCategory ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(null)}
                                >
                                    All Posts
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        className={`category-filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(cat.name)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Blog;
