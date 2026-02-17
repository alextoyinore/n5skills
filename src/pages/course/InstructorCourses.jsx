import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import CourseCard from '../../components/course/CourseCard';
import { Loader2, Globe, Twitter, Linkedin, Github, Mail, Star, Users, PlayCircle, BookOpen } from 'lucide-react';
import './InstructorCourses.css';

const InstructorCourses = () => {
    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Instructor Profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (profileError) throw profileError;
                setInstructor(profile);

                // 2. Fetch Instructor Courses
                const { data: courseData, error: courseError } = await supabase
                    .from('courses')
                    .select(`
                        *,
                        categories(name)
                    `)
                    .eq('instructor_id', id)
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (courseError) throw courseError;
                setCourses(courseData || []);

            } catch (error) {
                console.error('Error fetching instructor data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex-center py-40">
                <Loader2 className="spinner" size={48} color="var(--primary)" />
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="container py-20 text-center">
                <h2>Instructor not found</h2>
                <Link to="/courses" className="btn btn-primary mt-4">Browse All Courses</Link>
            </div>
        );
    }

    return (
        <div className="instructor-courses-page">
            {/* Instructor Header */}
            <section className="instructor-hero">
                <div className="container">
                    <div className="instructor-hero-content">
                        <div className="instructor-avatar-container">
                            {instructor.avatar_url ? (
                                <img src={instructor.avatar_url} alt={instructor.full_name} />
                            ) : (
                                <div className="avatar-placeholder">{instructor.full_name.charAt(0)}</div>
                            )}
                        </div>
                        <div className="instructor-hero-text">
                            <span className="badge-instructor">Expert Instructor</span>
                            <h1>{instructor.full_name}</h1>
                            <p className="instructor-headline">{instructor.headline || 'Industry Expert & Global Instructor'}</p>

                            <div className="instructor-stats-row">
                                <div className="stat-item">
                                    <Star size={18} />
                                    <span>4.9 Rating</span>
                                </div>
                                <div className="stat-item">
                                    <Users size={18} />
                                    <span>15,000+ Students</span>
                                </div>
                                <div className="stat-item">
                                    <BookOpen size={18} />
                                    <span>{courses.length} Courses</span>
                                </div>
                            </div>

                            <div className="instructor-bio">
                                <p>{instructor.bio || "Dedicated instructor sharing years of industry experience to help students master new skills and advance their careers."}</p>
                            </div>

                            <div className="instructor-socials">
                                <a href={`mailto:${instructor.email}`} className="social-icon"><Mail size={20} /></a>
                                {instructor.website && <a href={instructor.website} target="_blank" rel="noreferrer" className="social-icon"><Globe size={20} /></a>}
                                {instructor.socials?.twitter && <a href={`https://twitter.com/${instructor.socials.twitter}`} target="_blank" rel="noreferrer" className="social-icon"><Twitter size={20} /></a>}
                                {instructor.socials?.linkedin && <a href={instructor.socials.linkedin} target="_blank" rel="noreferrer" className="social-icon"><Linkedin size={20} /></a>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="instructor-catalog container">
                <div className="catalog-header">
                    <h2>Courses by {instructor.full_name}</h2>
                    <span className="results-count">Showing {courses.length} courses</span>
                </div>

                <div className="course-list-grid">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="no-courses glass-card border-0 p-10 text-center">
                        <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
                        <h3>No courses yet</h3>
                        <p>This instructor hasn't published any courses yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InstructorCourses;
