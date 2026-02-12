import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero">
            <div className="hero-bg-elements">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-text"
                >
                    <span className="badge">NEW COURSES AVAILABLE</span>
                    <h1>Learn from the <span className="accent-text">Best</span>, Anywhere.</h1>
                    <p>
                        Master the skills that matter. Access world-class education from top universities
                        and industry leaders. Start your journey today.
                    </p>
                    <div className="hero-btns">
                        <Link to="/signup" className="btn btn-primary">
                            Get Started <ArrowRight size={20} />
                        </Link>
                        <button
                            className="btn btn-outline"
                            onClick={() => alert("Demo video coming soon!")}
                        >
                            <PlayCircle size={20} /> Watch Demo
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">15K+</span>
                            <span className="stat-label">Online Courses</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">2M+</span>
                            <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">100+</span>
                            <span className="stat-label">Partners</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hero-image"
                >
                    <div className="image-wrapper">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" alt="Students learning" />
                        <div className="floating-card card-1">
                            <div className="card-icon">🚀</div>
                            <div>
                                <strong>Career Growth</strong>
                                <p>Boost your salary by 40%</p>
                            </div>
                        </div>
                        <div className="floating-card card-2">
                            <div className="card-icon">🏆</div>
                            <div>
                                <strong>Certificates</strong>
                                <p>Recognized globally</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
