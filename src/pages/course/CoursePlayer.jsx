import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle, ChevronLeft, ChevronRight, MessageSquare, FileText, Settings, Maximize, Clock, SkipForward } from 'lucide-react';
import { COURSES } from '../../constants/mockData';
import './CoursePlayer.css';

const CoursePlayer = () => {
    const { id } = useParams();
    const course = COURSES.find(c => c.id === parseInt(id)) || COURSES[0];
    const [activeLesson, setActiveLesson] = useState(1);

    // Simulations for completion
    const [completedLessons, setCompletedLessons] = useState([1, 2]);

    const curriculum = [
        {
            title: "Module 1: Introduction",
            lessons: [
                { id: 1, title: "Welcome & Course Overview", duration: "5:30" },
                { id: 2, title: "Prerequisites & Setup", duration: "12:45" },
            ]
        },
        {
            title: "Module 2: Core Concepts",
            lessons: [
                { id: 3, title: "Building your first component", duration: "25:00" },
                { id: 4, title: "State vs Props", duration: "32:15" },
                { id: 5, title: "Lifecycle Methods Explained", duration: "18:20" },
            ]
        },
        {
            title: "Module 3: Advanced Patterns",
            lessons: [
                { id: 6, title: "Higher Order Components", duration: "45:00" },
                { id: 7, title: "Render Prop Pattern", duration: "22:10" },
            ]
        }
    ];

    const allLessons = curriculum.flatMap(module => module.lessons);
    const currentLessonData = allLessons.find(l => l.id === activeLesson);

    const toggleComplete = (id) => {
        if (completedLessons.includes(id)) {
            setCompletedLessons(completedLessons.filter(l => l !== id));
        } else {
            setCompletedLessons([...completedLessons, id]);
        }
    };

    const nextLesson = () => {
        const nextIndex = allLessons.findIndex(l => l.id === activeLesson) + 1;
        if (nextIndex < allLessons.length) {
            setActiveLesson(allLessons[nextIndex].id);
        }
    };

    const [activeTab, setActiveTab] = useState('overview');

    const [isAskingQuestion, setIsAskingQuestion] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="p-tab-panel">
                        <h3>About this Lesson</h3>
                        <p>This lesson explores the key principles behind {currentLessonData.title.toLowerCase()}. We will look at practical examples and implementation details that you can apply immediately to your projects.</p>

                        <div className="resource-section">
                            <h4>Lesson Resources</h4>
                            <div className="resource-item glass-card">
                                <FileText size={20} />
                                <div className="res-info">
                                    <p>Cheat Sheet: {currentLessonData.title}</p>
                                    <span>PDF Document • 2.4 MB</span>
                                </div>
                                <button className="btn-text">Download</button>
                            </div>
                        </div>
                    </div>
                );
            case 'resources':
                return (
                    <div className="p-tab-panel">
                        <h3>Downloadable Resources</h3>
                        <div className="resource-grid">
                            <div className="resource-item glass-card">
                                <FileText size={20} />
                                <div className="res-info">
                                    <p>Lesson Slides</p>
                                    <span>PDF • 5.1 MB</span>
                                </div>
                                <button className="btn-text">Download</button>
                            </div>
                            <div className="resource-item glass-card">
                                <FileText size={20} />
                                <div className="res-info">
                                    <p>Source Code Assets</p>
                                    <span>ZIP • 12.8 MB</span>
                                </div>
                                <button className="btn-text">Download</button>
                            </div>
                        </div>
                    </div>
                );
            case 'discussions':
                if (isAskingQuestion) {
                    return (
                        <div className="p-tab-panel">
                            <div className="form-head-actions">
                                <h3>Ask a Question</h3>
                                <button className="btn-text" onClick={() => setIsAskingQuestion(false)}>Back to Discussions</button>
                            </div>
                            <form className="question-form glass-card" onSubmit={(e) => { e.preventDefault(); setIsAskingQuestion(false); }}>
                                <div className="input-group">
                                    <label>Question Title</label>
                                    <input type="text" placeholder="e.g. How do I implement lifecycle methods in functional components?" required />
                                </div>
                                <div className="input-group">
                                    <label>Details</label>
                                    <textarea placeholder="Describe your problem in detail..." rows="6" required></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsAskingQuestion(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Post Question</button>
                                </div>
                            </form>
                        </div>
                    );
                }
                return (
                    <div className="p-tab-panel">
                        <div className="tab-header">
                            <h3>Community Q&A</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setIsAskingQuestion(true)}>Ask a Question</button>
                        </div>
                        <div className="discussion-placeholder glass-card">
                            <MessageSquare size={40} />
                            <p>No questions yet for this lesson. Be the first to ask!</p>
                        </div>
                    </div>
                );
            case 'notes':
                return (
                    <div className="p-tab-panel">
                        <h3>My Notes</h3>
                        <textarea
                            className="notes-textarea glass-card"
                            placeholder="Type your notes here for this lesson... (Auto-saved)"
                            rows="10"
                        ></textarea>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="player-page">
            <header className="player-header">
                <div className="player-nav-container">
                    <Link to="/dashboard" className="player-back">
                        <ChevronLeft size={20} /> Dashboard
                    </Link>
                    <div className="player-header-title">
                        <h2>{course.title}</h2>
                        <span className="lesson-info-badge">{currentLessonData.title}</span>
                    </div>
                    <div className="player-meta">
                        <div className="player-progress">
                            <div className="progress-bar-small">
                                <div className="progress-fill" style={{ width: `${(completedLessons.length / allLessons.length) * 100}%` }}></div>
                            </div>
                            <span>{Math.round((completedLessons.length / allLessons.length) * 100)}% Complete</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="player-layout">
                <aside className="curriculum-sidebar">
                    <div className="sidebar-sticky">
                        <div className="curriculum-header">
                            <h3>Course Curriculum</h3>
                        </div>
                        <div className="curriculum-list">
                            {curriculum.map((module, mIdx) => (
                                <div key={mIdx} className="curriculum-module">
                                    <div className="module-title">{module.title}</div>
                                    <div className="module-lessons">
                                        {module.lessons.map(lesson => (
                                            <div
                                                key={lesson.id}
                                                className={`curr-lesson ${activeLesson === lesson.id ? 'active' : ''}`}
                                                onClick={() => setActiveLesson(lesson.id)}
                                            >
                                                <div className="curr-status">
                                                    {completedLessons.includes(lesson.id) ? (
                                                        <CheckCircle size={16} color="var(--success)" fill="rgba(16, 185, 129, 0.1)" />
                                                    ) : (
                                                        <div className="curr-dot"></div>
                                                    )}
                                                </div>
                                                <div className="curr-info">
                                                    <p>{lesson.title}</p>
                                                    <span><Clock size={12} /> {lesson.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="player-content">
                    <div className="video-viewport">
                        <div className="video-mock glass-card">
                            <img src={course.image} alt="Video Preview" />
                            <div className="play-overlay">
                                <Play size={64} fill="currentColor" />
                            </div>
                            <div className="player-controls">
                                <div className="ctrl-progress">
                                    <div className="ctrl-progress-fill" style={{ width: '60%' }}></div>
                                </div>
                                <div className="ctrl-buttons">
                                    <div className="ctrl-left">
                                        <Play size={20} />
                                        <SkipForward size={20} onClick={nextLesson} />
                                        <span className="time-display">15:20 / {currentLessonData.duration}</span>
                                    </div>
                                    <div className="ctrl-right">
                                        <Settings size={20} />
                                        <Maximize size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lesson-details">
                        <div className="lesson-actions">
                            <h1>{currentLessonData.title}</h1>
                            <div className="btn-group">
                                <button
                                    className={`btn ${completedLessons.includes(activeLesson) ? 'btn-success' : 'btn-outline'}`}
                                    onClick={() => toggleComplete(activeLesson)}
                                >
                                    {completedLessons.includes(activeLesson) ? <><CheckCircle size={18} /> Lesson Completed</> : "Mark as Complete"}
                                </button>
                                <button className="btn btn-primary" onClick={nextLesson}>
                                    Next Lesson <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="player-tabs">
                            <button
                                className={`p-tab ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`p-tab ${activeTab === 'resources' ? 'active' : ''}`}
                                onClick={() => setActiveTab('resources')}
                            >
                                Resources
                            </button>
                            <button
                                className={`p-tab ${activeTab === 'discussions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('discussions')}
                            >
                                Discussions
                            </button>
                            <button
                                className={`p-tab ${activeTab === 'notes' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notes')}
                            >
                                Notes
                            </button>
                        </div>

                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
