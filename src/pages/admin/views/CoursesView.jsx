import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';

const CoursesView = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft'

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*, categories(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        if (filterStatus === 'all') return true;
        return course.status === filterStatus;
    });

    return (
        <div className="admin-view">
            <header className="admin-header">
                <h2>Manage Courses</h2>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/courses/create')}>
                    <Plus size={18} /> Add New Course
                </button>
            </header>
            <div className="view-filters">
                <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Search courses..." />
                </div>
                <div className="filter-buttons">
                    <button
                        className={`btn-filter ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        All ({courses.length})
                    </button>
                    <button
                        className={`btn-filter ${filterStatus === 'published' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('published')}
                    >
                        Published ({courses.filter(c => c.status === 'published').length})
                    </button>
                    <button
                        className={`btn-filter ${filterStatus === 'draft' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('draft')}
                    >
                        Drafts ({courses.filter(c => c.status === 'draft').length})
                    </button>
                </div>
            </div>
            <div className="activity-table glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Loading courses...</td></tr>
                        ) : filteredCourses.length === 0 ? (
                            <tr><td colSpan="5">No courses found.</td></tr>
                        ) : (
                            filteredCourses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.title}</td>
                                    <td>{course.categories?.name || '-'}</td>
                                    <td>${course.price}</td>
                                    <td>
                                        <span className={`badge-status ${course.status === 'published' ? 'success' : 'warning'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-filter btn-sm"
                                            onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                                            title={course.status === 'draft' ? 'Continue Editing' : 'Edit Course'}
                                        >
                                            <Edit size={16} />
                                            {course.status === 'draft' ? 'Continue' : 'Edit'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoursesView;
