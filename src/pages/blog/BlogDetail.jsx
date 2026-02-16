import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Share2, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import './BlogDetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blog_posts')
                .select(`
                    *,
                    profiles:author_id (full_name)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setPost(data);
        } catch (error) {
            console.error('Error fetching blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="blog-detail flex-center" style={{ minHeight: '60vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-detail container text-center p-20">
                <h2>Post not found</h2>
                <Link to="/blog" className="back-to-blog mt-4 inline-flex items-center gap-2 text-primary font-semibold">
                    <ArrowLeft size={18} /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <article className="blog-detail">
            <header className="blog-detail-header">
                <div className="container narrow">
                    <Link to="/blog" className="back-to-blog">
                        <ArrowLeft size={18} /> Back to Blog
                    </Link>
                    <span className="blog-detail-category">{post.category}</span>
                    <h1>{post.title}</h1>
                    <div className="blog-detail-meta">
                        <div className="author-info">
                            <div className="author-avatar">{post.profiles?.full_name?.charAt(0) || 'A'}</div>
                            <div>
                                <span className="author-name">{post.profiles?.full_name || 'Administrator'}</span>
                                <span className="author-role">Author</span>
                            </div>
                        </div>
                        <div className="post-stats">
                            <span><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{Math.ceil(JSON.stringify(post.content).length / 1000)} min read</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="blog-detail-hero">
                <div className="container">
                    <img src={post.featured_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"} alt={post.title} />
                </div>
            </div>

            <main className="blog-detail-content container narrow">
                <div
                    className="blog-body"
                    dangerouslySetInnerHTML={{ __html: typeof post.content === 'string' ? post.content : (post.content?.html || '') }}
                />

                <footer className="blog-detail-footer">
                    <div className="share-section">
                        <span>Share this article:</span>
                        <div className="share-btns">
                            <button className="share-btn"><Facebook size={18} /></button>
                            <button className="share-btn"><Twitter size={18} /></button>
                            <button className="share-btn"><Linkedin size={18} /></button>
                            <button className="share-btn"><Share2 size={18} /></button>
                        </div>
                    </div>
                    <div className="author-card">
                        <div className="author-card-avatar">{post.profiles?.full_name?.charAt(0) || 'A'}</div>
                        <div className="author-card-info">
                            <h4>About {post.profiles?.full_name || 'the Author'}</h4>
                            <p>An expert contributor to the platform, sharing insights and professional expertise on {post.category?.toLowerCase()}.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </article>
    );
};

export default BlogDetail;
