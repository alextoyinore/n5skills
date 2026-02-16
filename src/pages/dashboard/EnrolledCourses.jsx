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
                    courses (
                        id,
                        title,
                        image_url,
                        categories (name),
                        course_modules (
                            id,
                            course_lessons (id)
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

                return {
                    id: course.id,
                    title: course.title,
                    image: course.image_url || 'https://via.placeholder.com/300x170',
                    category: course.categories?.name || 'Uncategorized',
                    progress: progress
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
            <div className="container p-10">
                <header className="enrolled-header mb-8">
                    <Link to="/dashboard" className="back-link flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="icon-badge p-3 bg-primary/10 rounded-xl text-primary">
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">All My Courses</h1>
                            <p className="text-slate-500">You are currently enrolled in {courses.length} courses.</p>
                        </div>
                    </div>
                </header>

                {courses.length > 0 ? (
                    <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {courses.map(course => (
                            <div key={course.id} className="course-card-enrolled glass-card p-4 hover-lift">
                                <div className="card-thumb-enrolled relative mb-4" style={{ borderRadius: '12px', overflow: 'hidden', height: '180px' }}>
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    <Link to={`/learn/${course.id}`} className="play-overlay absolute inset-0 flex-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                        <PlayCircle size={60} color="white" />
                                    </Link>
                                </div>
                                <div className="card-details-enrolled">
                                    <span className="category-tag-enrolled text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-md mb-2 inline-block">
                                        {course.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1">{course.title}</h3>

                                    <div className="progress-section">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-slate-500">Course Progress</span>
                                            <span className="text-sm font-bold text-primary">{course.progress}%</span>
                                        </div>
                                        <div className="progress-bar-bg h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="progress-bar-fill h-full bg-primary transition-all duration-500"
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/learn/${course.id}`}
                                        className="btn btn-primary w-full mt-6 flex-center gap-2"
                                    >
                                        {course.progress === 100 ? 'Review Course' : (course.progress > 0 ? 'Continue Learning' : 'Start Course')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state text-center py-20 glass-card">
                        <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-bold text-slate-900">No courses found</h2>
                        <p className="text-slate-500 mb-8">You haven't enrolled in any courses yet.</p>
                        <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;
