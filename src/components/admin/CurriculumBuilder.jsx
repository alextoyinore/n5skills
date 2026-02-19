import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Video, FileText, GripVertical, Edit3, Loader2, Link as LinkIcon, Download } from 'lucide-react';
import { uploadFile } from '../../utils/cloudinary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './CurriculumBuilder.css';

const CurriculumBuilder = ({ modules, setModules }) => {
    const [activeModule, setActiveModule] = useState(null);
    const [uploadingState, setUploadingState] = useState({}); // { lessonId: boolean }

    const handleResourceUpload = async (moduleId, lessonId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingState(prev => ({ ...prev, [lessonId]: true }));
        try {
            const result = await uploadFile(file);
            const newResource = {
                id: Date.now() + Math.random(),
                title: file.name,
                file_url: result.url,
                file_type: result.format || file.type.split('/')[1] || 'file',
                file_size: (result.bytes / 1024 / 1024).toFixed(2) + ' MB'
            };

            setModules(modules.map(m => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map(l => {
                            if (l.id === lessonId) {
                                return {
                                    ...l,
                                    resources: [...(l.resources || []), newResource]
                                };
                            }
                            return l;
                        })
                    };
                }
                return m;
            }));
        } catch (error) {
            console.error('Resource upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploadingState(prev => ({ ...prev, [lessonId]: false }));
            e.target.value = ''; // Reset input
        }
    };

    const removeResource = (moduleId, lessonId, resourceId) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return {
                                ...l,
                                resources: l.resources.filter(r => r.id !== resourceId)
                            };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
    };

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

    const updateModule = (moduleId, updates) => {
        setModules(modules.map(m => m.id === moduleId ? { ...m, ...updates } : m));
    };

    const addLesson = (moduleId) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: [...m.lessons, {
                        id: Date.now() + Math.random(),
                        title: 'New Lesson',
                        type: 'video',
                        duration: '0:00',
                        video_url: '',
                        reading_content: '',
                        resources: []
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

    const moveLesson = (moduleId, lessonId, direction) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                const index = m.lessons.findIndex(l => l.id === lessonId);
                if ((direction === 'up' && index === 0) || (direction === 'down' && index === m.lessons.length - 1)) {
                    return m;
                }
                const newLessons = [...m.lessons];
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];
                return { ...m, lessons: newLessons };
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
                                    placeholder="Module Title"
                                    onChange={(e) => updateModule(module.id, { title: e.target.value })}
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
                                <div className="module-description-field">
                                    <label>Module Description (Optional)</label>
                                    <textarea
                                        placeholder="Briefly describe what this module covers..."
                                        value={module.description || ''}
                                        onChange={(e) => updateModule(module.id, { description: e.target.value })}
                                        rows={2}
                                    />
                                </div>
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
                                                <div className="lesson-order-actions">
                                                    <button
                                                        className="icon-btn"
                                                        onClick={() => moveLesson(module.id, lesson.id, 'up')}
                                                        disabled={lIndex === 0}
                                                        title="Move Up"
                                                    >
                                                        <ChevronUp size={14} />
                                                    </button>
                                                    <button
                                                        className="icon-btn"
                                                        onClick={() => moveLesson(module.id, lesson.id, 'down')}
                                                        disabled={lIndex === module.lessons.length - 1}
                                                        title="Move Down"
                                                    >
                                                        <ChevronDown size={14} />
                                                    </button>
                                                </div>
                                                <button className="icon-btn delete" onClick={() => removeLesson(module.id, lesson.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {/* Lesson Description */}
                                            <div className="lesson-content-field">
                                                <label>Lesson Description (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Short summary of this lesson..."
                                                    value={lesson.description || ''}
                                                    onChange={(e) => updateLesson(module.id, lesson.id, { description: e.target.value })}
                                                />
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

                                            {(lesson.type === 'reading' || lesson.type === 'video') && (
                                                <div className="lesson-content-field">
                                                    <label>{lesson.type === 'video' ? 'Attached Reading (Optional)' : 'Reading Content (Markdown)'}</label>
                                                    <div className="markdown-editor">
                                                        <textarea
                                                            placeholder="# Heading&#10;&#10;Write your lesson content in **markdown**..."
                                                            value={lesson.reading_content || ''}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, { reading_content: e.target.value })}
                                                            rows={6}
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

                                            {/* Resources Section */}
                                            <div className="lesson-content-field">
                                                <label>Downloadable Resources</label>
                                                <div className="resources-manager">
                                                    {lesson.resources && lesson.resources.length > 0 && (
                                                        <div className="builder-resources-list">
                                                            {lesson.resources.map(res => (
                                                                <div key={res.id} className="builder-resource-item">
                                                                    <div className="res-main">
                                                                        <FileText size={14} />
                                                                        <span className="res-title">{res.title}</span>
                                                                        <span className="res-meta">({res.file_size})</span>
                                                                    </div>
                                                                    <button className="icon-btn delete" onClick={() => removeResource(module.id, lesson.id, res.id)}>
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="resource-upload-box">
                                                        <input
                                                            type="file"
                                                            id={`res-upload-${lesson.id}`}
                                                            hidden
                                                            onChange={(e) => handleResourceUpload(module.id, lesson.id, e)}
                                                        />
                                                        <button
                                                            className="btn-add-resource"
                                                            onClick={() => document.getElementById(`res-upload-${lesson.id}`).click()}
                                                            disabled={uploadingState[lesson.id]}
                                                        >
                                                            {uploadingState[lesson.id] ? (
                                                                <><Loader2 className="spinner" size={14} /> Uploading...</>
                                                            ) : (
                                                                <><Plus size={14} /> Add Resource</>
                                                            )}
                                                        </button>
                                                        <span className="upload-hint">Upload PDFs, ZIPs, or Docs for students</span>
                                                    </div>
                                                </div>
                                            </div>
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
