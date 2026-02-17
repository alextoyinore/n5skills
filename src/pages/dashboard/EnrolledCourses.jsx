import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './EnrolledCourses.css';

const EnrolledCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchEnrolledCourses();
        }
    }, [user]);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select(`
                    course_id,
                    last_lesson_id,
                    courses (
                        id,
                        title,
                        image_url,
                        categories (name),
                        course_modules (
                            id,
                            course_lessons (id, title)
                        )
                    )
                `)
                .eq('user_id', user.id);

            if (enrollError) throw enrollError;

            const { data: completions, error: compError } = await supabase
                .from('lesson_completions')
                .select('lesson_id')
                .eq('user_id', user.id);

            if (compError) throw compError;
            const completedLessonIds = new Set(completions.map(c => c.lesson_id));

            const processed = enrollments.map(en => {
                const course = en.courses;
                const allLessons = course.course_modules.flatMap(m => m.course_lessons);
                const totalLessons = allLessons.length;
                const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
                const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                // Find the title of the last accessed lesson
                let lastLessonTitle = 'Introduction';
                if (en.last_lesson_id) {
                    const lastLesson = allLessons.find(l => l.id === en.last_lesson_id);
                    if (lastLesson) lastLessonTitle = lastLesson.title;
                }

                return {
                    id: course.id,
                    title: course.title,
                    image: course.image_url || 'https://via.placeholder.com/300x170',
                    category: course.categories?.name || 'Uncategorized',
                    progress: progress,
                    lastLesson: lastLessonTitle
                };
            });

            setCourses(processed);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="enrolled-page flex-center" style={{ minHeight: '80vh' }}>
                <Loader2 className="spinner" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="enrolled-page">
            <div className="enrolled-container container">
                <header className="enrolled-header">
                    <Link to="/dashboard" className="back-link">
                        <ArrowLeft size={18} /> <span>Back to Dashboard</span>
                    </Link>
                    <div className="enrolled-header-info">
                        <div className="enrolled-icon-badge">
                            <BookOpen size={28} />
                        </div>
                        <div className="header-text-wrap">
                            <h1>All My Courses</h1>
                            <p>You are currently enrolled in <strong>{courses.length}</strong> {courses.length === 1 ? 'course' : 'courses'}.</p>
                        </div>
                    </div>
                </header>

                {courses.length > 0 ? (
                    <div className="enrolled-courses-grid">
                        {courses.map(course => (
                            <div key={course.id} className="dashboard-card glass-card border-0">
                                <div className="card-thumb">
                                    <img src={course.image} alt={course.title} />
                                    <Link to={`/learn/${course.id}`} className="play-btn"><PlayCircle size={40} /></Link>
                                </div>
                                <div className="card-details">
                                    <span className="category-tag">{course.category}</span>
                                    <h3>{course.title}</h3>
                                    <p className="last-lesson-title">Running: {course.lastLesson}</p>
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <span className="progress-percent">{course.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="enrolled-empty-state glass-card border-0">
                        <BookOpen size={64} />
                        <h2>No courses found</h2>
                        <p>You haven't enrolled in any courses yet. Start your learning journey today!</p>
                        <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;
