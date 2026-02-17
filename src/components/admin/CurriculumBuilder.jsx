import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Video, FileText, GripVertical, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './CurriculumBuilder.css';

const CurriculumBuilder = ({ modules, setModules }) => {
    const [activeModule, setActiveModule] = useState(null);

    // Deduplicate IDs on mount/update to fix existing corrupt data
    useEffect(() => {
        const seenModuleIds = new Set();
        const seenLessonIds = new Set();
        let hasChanges = false;

        const newModules = modules.map(m => {
            let mId = m.id;
            if (seenModuleIds.has(mId)) {
                mId = Date.now() + Math.random();
                hasChanges = true;
            }
            seenModuleIds.add(mId);

            const newLessons = m.lessons.map(l => {
                let lId = l.id;
                if (seenLessonIds.has(lId)) {
                    lId = Date.now() + Math.random();
                    hasChanges = true;
                }
                seenLessonIds.add(lId);
                return l.id !== lId ? { ...l, id: lId } : l;
            });

            if (m.id !== mId || newLessons !== m.lessons) {
                return { ...m, id: mId, lessons: newLessons };
            }
            return m;
        });

        // Only update if we actually found and fixed duplicates to avoid infinite loops
        if (hasChanges) {
            console.log('Fixed duplicate IDs in curriculum');
            setModules(newModules);
        }
    }, [modules, setModules]);

    const addModule = () => {
        const newModule = {
            id: Date.now() + Math.random(),
            title: `New Module ${modules.length + 1}`,
            lessons: []
        };
        setModules([...modules, newModule]);
    };

    const removeModule = (moduleId) => {
        setModules(modules.filter(m => m.id !== moduleId));
    };

    const updateModuleTitle = (moduleId, title) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, title } : m));
    };

    const addLesson = (moduleId, type) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: [...m.lessons, {
                        id: Date.now() + Math.random(), // Ensure unique ID
                        title: 'New Lesson',
                        type: type, // 'video', 'reading'
                        duration: '0:00',
                        video_url: '',
                        reading_content: ''
                    }]
                };
            }
            return m;
        }));
    };

    const removeLesson = (moduleId, lessonId) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.filter(l => l.id !== lessonId)
                };
            }
            return m;
        }));
    };

    const updateLesson = (moduleId, lessonId, updates) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
                };
            }
            return m;
        }));
    };

    return (
        <div className="curriculum-builder-container">
            <div className="builder-header">
                <h3>Curriculum Structure</h3>
                <button className="btn-add-module" onClick={addModule}>
                    <Plus size={18} /> Add Module
                </button>
            </div>

            <div className="modules-list">
                {modules.map((module, mIndex) => (
                    <div key={module.id} className="module-item glass-card">
                        <div className="module-header" onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}>
                            <div className="module-info">
                                <GripVertical size={18} className="drag-handle" />
                                <span className="module-number">Module {mIndex + 1}:</span>
                                <input
                                    className="module-title-input"
                                    value={module.title}
                                    onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="module-actions">
                                <span className="lesson-count">{module.lessons.length} Lessons</span>
                                <button className="icon-btn delete" onClick={(e) => { e.stopPropagation(); removeModule(module.id); }}>
                                    <Trash2 size={16} />
                                </button>
                                {activeModule === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {activeModule === module.id && (
                            <div className="lessons-container">
                                <div className="lessons-list">
                                    {module.lessons.map((lesson, lIndex) => (
                                        <div key={lesson.id} className="lesson-item">
                                            <div className="lesson-main">
                                                {lesson.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
                                                <input
                                                    className="lesson-title-input"
                                                    value={lesson.title}
                                                    onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                                />
                                                <span className="lesson-type-badge">{lesson.type}</span>
                                            </div>
                                            <div className="lesson-meta">
                                                <input
                                                    className="lesson-duration-input"
                                                    value={lesson.duration}
                                                    placeholder="Duration"
                                                    onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                                />
                                                <button className="icon-btn delete" onClick={() => removeLesson(module.id, lesson.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {/* Content Fields */}
                                            {lesson.type === 'video' && (
                                                <div className="lesson-content-field">
                                                    <label>Video URL</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        value={lesson.video_url || ''}
                                                        onChange={(e) => updateLesson(module.id, lesson.id, { video_url: e.target.value })}
                                                    />
                                                </div>
                                            )}

                                            {lesson.type === 'reading' && (
                                                <div className="lesson-content-field">
                                                    <label>Reading Content (Markdown)</label>
                                                    <div className="markdown-editor">
                                                        <textarea
                                                            placeholder="# Heading&#10;&#10;Write your lesson content in **markdown**..."
                                                            value={lesson.reading_content || ''}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, { reading_content: e.target.value })}
                                                            rows={8}
                                                        />
                                                        {lesson.reading_content && (
                                                            <div className="markdown-preview">
                                                                <div className="preview-label">Preview:</div>
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {lesson.reading_content}
                                                                </ReactMarkdown>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="lesson-adder">
                                    <button className="btn-add-lesson" onClick={() => addLesson(module.id, 'video')}>
                                        <Plus size={14} /> Add Video
                                    </button>
                                    <button className="btn-add-lesson" onClick={() => addLesson(module.id, 'reading')}>
                                        <Plus size={14} /> Add Reading
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {modules.length === 0 && (
                <div className="empty-state">
                    <p>No modules added yet. Start by adding your first module.</p>
                </div>
            )}
        </div>
    );
};

export default CurriculumBuilder;
