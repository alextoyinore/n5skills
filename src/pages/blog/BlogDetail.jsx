import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import './BlogDetail.css';

// Mock post data (in a real app, this would be fetched based on ID)
const BLOG_POSTS = {
    "1": {
        title: "The Future of AI in Professional Learning",
        content: `
            <p>Artificial Intelligence is no longer a futuristic concept; it is actively reshaping the landscape of professional education. As we move further into 2026, the integration of AI into learning platforms is providing unprecedented levels of personalization and efficiency.</p>
            
            <h2>Personalized Learning Paths</h2>
            <p>One of the most significant impacts of AI is the ability to create truly personalized learning experiences. Traditional "one-size-fits-all" curriculum is being replaced by dynamic paths that adapt to a learner's pace, existing knowledge, and career goals.</p>
            
            <blockquote>
                "AI isn't just a tool for automation; it's a catalyst for human potential, allowing us to focus on higher-level problem solving while machines handle the rote acquisition of data."
            </blockquote>

            <h2>Real-time Feedback Loops</h2>
            <p>Gone are the days of waiting weeks for assessment results. AI-powered systems can now provide instant feedback on coding exercises, design projects, and business simulations, allowing learners to correct mistakes and consolidate knowledge in real-time.</p>

            <p>As we look forward, the challenge for educators and institutions will be to strike the right balance between technological assistance and human-centric mentorship.</p>
        `,
        category: "Technology",
        author: "Dr. Sarah Chen",
        authorRole: "Director of AI Research",
        date: "Feb 10, 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
        readTime: "6 min read"
    }
    // ... add more if needed
};

const BlogDetail = () => {
    const { id } = useParams();
    const post = BLOG_POSTS[id] || BLOG_POSTS["1"]; // Fallback for demo

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                            <div className="author-avatar">{post.author[0]}</div>
                            <div>
                                <span className="author-name">{post.author}</span>
                                <span className="author-role">{post.authorRole}</span>
                            </div>
                        </div>
                        <div className="post-stats">
                            <span><Calendar size={14} /> {post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="blog-detail-hero">
                <div className="container">
                    <img src={post.image} alt={post.title} />
                </div>
            </div>

            <main className="blog-detail-content container narrow">
                <div
                    className="blog-body"
                    dangerouslySetInnerHTML={{ __html: post.content }}
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
                        <div className="author-card-avatar">{post.author[0]}</div>
                        <div className="author-card-info">
                            <h4>About {post.author}</h4>
                            <p>Dr. Sarah Chen is a leading expert in educational technology and has spent over a decade researching the intersection of AI and human cognitive development.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </article>
    );
};

export default BlogDetail;
