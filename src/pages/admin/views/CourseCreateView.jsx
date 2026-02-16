
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image, DollarSign, Save } from 'lucide-react';
import { uploadImage } from '../../../utils/cloudinary';
import { supabase } from '../../../utils/supabaseClient';
import CurriculumBuilder from '../../../components/admin/CurriculumBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const CourseCreateView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user: authUser } = useAuth();
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category_id: '',
        category_name: '',
        level: 'Beginner',
        price: 49.99,
        image_url: ''
    });
    const [modules, setModules] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [highlights, setHighlights] = useState([]);
    const [newHighlight, setNewHighlight] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase.from('categories').select('*').order('name');
                if (error) throw error;
                if (data) setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Load existing course data if editing
    useEffect(() => {
        if (!id) return;

        const loadCourseData = async () => {
            try {
                // Fetch course data
                const { data: course, error: courseError } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (courseError) throw courseError;

                // Populate course data
                setCourseId(id);
                setCourseData({
                    title: course.title,
                    description: course.description,
                    category_id: course.category_id,
                    category_name: '',
                    level: course.level,
                    price: course.price,
                    image_url: course.image_url || ''
                });
                setHighlights(course.highlights || []);

                // Fetch category name
                if (course.category_id) {
                    const { data: category } = await supabase
                        .from('categories')
                        .select('name')
                        .eq('id', course.category_id)
                        .single();
                    if (category) {
                        setCourseData(prev => ({ ...prev, category_name: category.name }));
                    }
                }

                // Fetch modules and lessons
                const { data: modulesData, error: modulesError } = await supabase
                    .from('course_modules')
                    .select('*, course_lessons(*)')
                    .eq('course_id', id)
                    .order('order_index');

                if (modulesError) throw modulesError;

                // Transform modules data
                const transformedModules = modulesData.map(module => ({
                    title: module.title,
                    lessons: module.course_lessons
                        .sort((a, b) => a.order_index - b.order_index)
                        .map(lesson => ({
                            title: lesson.title,
                            type: lesson.content_type,
                            video_url: lesson.video_url || '',
                            reading_content: lesson.reading_content || '',
                            duration: lesson.duration
                        }))
                }));

                setModules(transformedModules);
            } catch (error) {
                console.error('Error loading course:', error);
                alert('Failed to load course data: ' + error.message);
            }
        };

        loadCourseData();
    }, [id]);

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            if (type === 'thumbnail') {
                setCourseData({ ...courseData, image_url: result.url });
            }
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const saveDraft = async () => {
        console.log('=== saveDraft START ===');
        try {
            setIsSaving(true);

            // Use user from context instead of async call
            console.log('Checking auth user from context:', authUser);
            if (!authUser || !authUser.id) {
                console.error('No user found in context');
                throw new Error('You must be logged in to save a course');
            }

            if (courseId) {
                console.log('Updating existing draft, courseId:', courseId);
                // Update existing draft
                const { error: courseError } = await supabase
                    .from('courses')
                    .update({
                        title: courseData.title,
                        description: courseData.description,
                        category_id: courseData.category_id,
                        level: courseData.level,
                        price: courseData.price,
                        image_url: courseData.image_url,
                        highlights: highlights.length > 0 ? highlights : null
                    })
                    .eq('id', courseId);

                if (courseError) throw courseError;

                // Delete existing modules and lessons, then re-insert
                await supabase.from('course_modules').delete().eq('course_id', courseId);

                // Save modules & lessons
                for (let i = 0; i < modules.length; i++) {
                    const module = modules[i];
                    const { data: savedModule, error: moduleError } = await supabase
                        .from('course_modules')
                        .insert([{
                            course_id: courseId,
                            title: module.title,
                            order_index: i
                        }])
                        .select()
                        .single();

                    if (moduleError) throw moduleError;

                    const lessonsToSave = module.lessons.map((lesson, lIndex) => ({
                        module_id: savedModule.id,
                        title: lesson.title,
                        content_type: lesson.type,
                        video_url: lesson.type === 'video' ? lesson.video_url : null,
                        reading_content: lesson.type === 'reading' ? lesson.reading_content : null,
                        duration: lesson.duration,
                        order_index: lIndex
                    }));

                    if (lessonsToSave.length > 0) {
                        const { error: lessonsError } = await supabase
                            .from('course_lessons')
                            .insert(lessonsToSave);
                        if (lessonsError) throw lessonsError;
                    }
                }
            } else {
                console.log('Creating new draft');

                // Log the data we're about to insert
                const courseDataToInsert = {
                    title: courseData.title || 'Untitled Course',
                    description: courseData.description,
                    category_id: courseData.category_id,
                    level: courseData.level,
                    price: courseData.price,
                    image_url: courseData.image_url,
                    instructor_id: authUser.id,
                    highlights: highlights.length > 0 ? highlights : null,
                    status: 'draft'
                };
                console.log('Data to insert:', courseDataToInsert);

                console.log('Calling supabase.from(courses).insert...');
                // Create new draft
                const { data: course, error: courseError } = await supabase
                    .from('courses')
                    .insert([courseDataToInsert])
                    .select()
                    .single();

                console.log('INSERT completed, response:', { course, courseError });

                if (courseError) {
                    console.error('Course creation error:', courseError);
                    throw courseError;
                }
                console.log('Course created:', course);
                setCourseId(course.id);

                // Save modules & lessons
                for (let i = 0; i < modules.length; i++) {
                    const module = modules[i];
                    const { data: savedModule, error: moduleError } = await supabase
                        .from('course_modules')
                        .insert([{
                            course_id: course.id,
                            title: module.title,
                            order_index: i
                        }])
                        .select()
                        .single();

                    if (moduleError) throw moduleError;

                    const lessonsToSave = module.lessons.map((lesson, lIndex) => ({
                        module_id: savedModule.id,
                        title: lesson.title,
                        content_type: lesson.type,
                        video_url: lesson.type === 'video' ? lesson.video_url : null,
                        reading_content: lesson.type === 'reading' ? lesson.reading_content : null,
                        duration: lesson.duration,
                        order_index: lIndex
                    }));

                    if (lessonsToSave.length > 0) {
                        const { error: lessonsError } = await supabase
                            .from('course_lessons')
                            .insert(lessonsToSave);
                        if (lessonsError) throw lessonsError;
                    }
                }
            }

            setLastSaved(new Date());
            console.log('=== saveDraft SUCCESS ===');
        } catch (error) {
            console.error('Auto-save Error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishCourse = async () => {
        try {
            // Save draft first to ensure all data is saved
            await saveDraft();

            // Update status to published
            const { error } = await supabase
                .from('courses')
                .update({ status: 'published' })
                .eq('id', courseId);

            if (error) throw error;

            alert('Course published successfully!');
            navigate('/admin/courses');
        } catch (error) {
            console.error('Publish Error:', error);
            alert('Failed to publish course: ' + error.message);
        }
    };

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div className="admin-welcome">
                    <p className="subtitle">Creator Mode</p>
                    <h2>{id ? 'Edit Course' : 'Create New Course'}</h2>
                </div>
                <div className="header-actions">
                    {lastSaved && (
                        <div className="save-indicator">
                            {isSaving ? (
                                <span className="saving">Saving...</span>
                            ) : (
                                <span className="saved">
                                    <Save size={14} /> Saved {new Date(lastSaved).toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    )}
                    <div className="step-indicator">Step {step} of 3</div>
                    <button className="btn-filter" onClick={() => navigate('/admin/courses')}>Cancel & Back</button>
                </div>
            </header>

            <div className="create-form-container glass-card">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="form-step"
                        >
                            <h3>1. Basic Information</h3>
                            <div className="form-group">
                                <label>Course Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Advanced JavaScript Masterclass"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Describe what students will learn..."
                                    rows="5"
                                    value={courseData.description}
                                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group relative">
                                    <label>Category</label>
                                    <div className="searchable-select">
                                        <input
                                            type="text"
                                            placeholder="Search category..."
                                            value={categorySearch || courseData.category_name}
                                            onChange={(e) => {
                                                setCategorySearch(e.target.value);
                                                setShowCategoryList(true);
                                            }}
                                            onFocus={() => setShowCategoryList(true)}
                                        />
                                        <AnimatePresence>
                                            {showCategoryList && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="dropdown-list glass-card"
                                                >
                                                    {filteredCategories.length > 0 ? (
                                                        filteredCategories.map(cat => (
                                                            <div
                                                                key={cat.id}
                                                                className="dropdown-item"
                                                                onClick={() => {
                                                                    setCourseData({
                                                                        ...courseData,
                                                                        category_id: cat.id,
                                                                        category_name: cat.name
                                                                    });
                                                                    setCategorySearch('');
                                                                    setShowCategoryList(false);
                                                                }}
                                                            >
                                                                <span>{cat.icon}</span> {cat.name}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="dropdown-item disabled">No categories found</div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {showCategoryList && <div className="click-overlay" onClick={() => setShowCategoryList(false)} />}
                                </div>
                                <div className="form-group">
                                    <label>Difficulty Level</label>
                                    <select
                                        value={courseData.level}
                                        onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>What You'll Master (Highlights)</label>
                                <div className="highlights-input-container">
                                    {highlights.map((highlight, index) => (
                                        <div key={index} className="highlight-item">
                                            <span>{highlight}</span>
                                            <button
                                                type="button"
                                                className="icon-btn delete"
                                                onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <div className="highlight-input-row">
                                        <input
                                            type="text"
                                            placeholder="e.g. Professional workflow tools and industry-standard practices"
                                            value={newHighlight}
                                            onChange={(e) => setNewHighlight(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newHighlight.trim()) {
                                                        setHighlights([...highlights, newHighlight.trim()]);
                                                        setNewHighlight('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-filter"
                                            onClick={() => {
                                                if (newHighlight.trim()) {
                                                    setHighlights([...highlights, newHighlight.trim()]);
                                                    setNewHighlight('');
                                                }
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="button-group">
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        console.log('Next Step button clicked, current step:', step);
                                        try {
                                            console.log('Calling saveDraft...');
                                            await saveDraft();
                                            console.log('saveDraft completed successfully');
                                            console.log('Setting step to 2...');
                                            setStep(2);
                                            console.log('Step set to 2');
                                        } catch (error) {
                                            console.error('Error saving draft:', error);
                                            alert('Failed to save: ' + error.message);
                                        }
                                    }}
                                >
                                    Next Step: Curriculum
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="form-step"
                        >
                            <h3>2. Curriculum Builder</h3>
                            <CurriculumBuilder modules={modules} setModules={setModules} />
                            <div className="button-group">
                                <button className="btn-filter" onClick={() => setStep(1)}>Back</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        try {
                                            await saveDraft();
                                            setStep(3);
                                        } catch (error) {
                                            console.error('Error saving draft:', error);
                                            alert('Failed to save: ' + error.message);
                                        }
                                    }}
                                >
                                    Next Step: Media & Pricing
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="form-step"
                        >
                            <h3>3. Media & Pricing</h3>

                            <div className="upload-area">
                                <div className="upload-box" onClick={() => document.getElementById('thumb-upload').click()}>
                                    <input
                                        type="file"
                                        id="thumb-upload"
                                        hidden
                                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                                        accept="image/*"
                                    />
                                    {courseData.image_url ? (
                                        <img src={courseData.image_url} alt="Preview" className="upload-preview" />
                                    ) : (
                                        <>
                                            <Image size={40} />
                                            <p>{isUploading ? 'Uploading...' : 'Upload Thumbnail Image'}</p>
                                            <span>(Max 5MB, JPG/PNG)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Price (USD)</label>
                                <div className="input-with-icon">
                                    <DollarSign size={18} />
                                    <input
                                        type="number"
                                        placeholder="49.99"
                                        value={courseData.price}
                                        onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="btn-filter" onClick={() => setStep(2)}>Back</button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={async () => {
                                        try {
                                            await saveDraft();
                                            alert('Draft saved successfully!');
                                        } catch (error) {
                                            console.error('Error saving draft:', error);
                                            alert('Failed to save: ' + error.message);
                                        }
                                    }}
                                    disabled={isUploading}
                                >
                                    <Save size={18} /> Save Draft
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePublishCourse}
                                    disabled={isUploading}
                                >
                                    Publish Course
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default CourseCreateView;
