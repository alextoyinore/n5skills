import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import './Blog.css';

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Future of AI in Professional Learning",
        excerpt: "Discover how artificial intelligence is transforming how we acquire new skills and stay competitive in the modern workforce.",
        category: "Technology",
        author: "Dr. Sarah Chen",
        date: "Feb 10, 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "10 Essential Skills for Remote Product Managers",
        excerpt: "Leading a product team from afar requires a unique set of skills. We've compiled the top 10 you need to master this year.",
        category: "Product",
        author: "Marcus Thorne",
        date: "Feb 08, 2026",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Mastering Design Systems at Scale",
        excerpt: "Learn the secrets behind building and maintaining consistent design languages across multi-national organizations.",
        category: "Design",
        author: "Elena Rodriguez",
        date: "Feb 05, 2026",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800"
    }
];

const Blog = () => {
    return (
        <div className="blog-page">
            <header className="blog-hero">
                <div className="container">
                    <h1>N5SKILLS Blog</h1>
                    <p>Insights, stories, and expertise from the world of professional learning.</p>
                </div>
            </header>

            <main className="container blog-content">
                <div className="blog-grid">
                    {BLOG_POSTS.map(post => (
                        <article key={post.id} className="blog-card">
                            <div className="blog-card-image">
                                <img src={post.image} alt={post.title} />
                                <span className="blog-category">{post.category}</span>
                            </div>
                            <div className="blog-card-body">
                                <div className="blog-meta">
                                    <span className="blog-date"><Calendar size={14} /> {post.date}</span>
                                    <span className="blog-author"><User size={14} /> {post.author}</span>
                                </div>
                                <h2 className="blog-title">{post.title}</h2>
                                <p className="blog-excerpt">{post.excerpt}</p>
                                <Link to={`/blog/${post.id}`} className="read-more">
                                    Read Article <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <aside className="blog-sidebar">
                    <div className="sidebar-widget">
                        <h3>Subscribe to Newsletter</h3>
                        <p>Get the latest articles and course updates delivered to your inbox.</p>
                        <div className="subscribe-form">
                            <input type="email" placeholder="Email address" />
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3>Categories</h3>
                        <ul className="category-list">
                            <li><Link to="#">Technology (42)</Link></li>
                            <li><Link to="#">Design (28)</Link></li>
                            <li><Link to="#">Business (35)</Link></li>
                            <li><Link to="#">Product (19)</Link></li>
                            <li><Link to="#">Marketing (24)</Link></li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Blog;
