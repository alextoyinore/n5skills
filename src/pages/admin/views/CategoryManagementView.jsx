import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';

const CategoryManagementView = () => {
    const [categories, setCategories] = useState([]);
    const [isContentLoading, setIsContentLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '' });

    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsContentLoading(true);
        try {
            const { data, error } = await supabase.from('categories').select('*').order('name');
            if (error) {
                console.error('Fetch categories error:', error);
            } else {
                setCategories(data);
            }
        } finally {
            setIsContentLoading(false);
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, icon: category.icon || '' });
        setIsAdding(true);
    };

    const handleCancel = () => {
        setEditingCategory(null);
        setNewCategory({ name: '', icon: '' });
        setIsAdding(false);
    };

    const handleSaveCategory = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!newCategory.name) {
            alert('Please enter a category name');
            return;
        }

        setIsSaving(true);

        try {
            const slug = newCategory.name.toLowerCase().trim().replace(/\s+/g, '-');
            const categoryData = {
                name: newCategory.name.trim(),
                icon: newCategory.icon || null,
                slug
            };

            let error;

            if (editingCategory) {
                // Update existing category
                const { error: updateError } = await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategory.id);
                error = updateError;
            } else {
                // Insert new category
                const { error: insertError } = await supabase
                    .from('categories')
                    .insert([categoryData]);
                error = insertError;
            }

            if (error) {
                console.error('Supabase error saving category:', error);
                if (error.code === '23505') {
                    alert('A category with this name already exists.');
                } else {
                    alert(`Error saving category: ${error.message}`);
                }
            } else {
                handleCancel(); // Reset form and close it
                fetchCategories(); // Refresh list
            }
        } catch (err) {
            console.error('Unexpected error in handleSaveCategory:', err);
            alert(`Unexpected error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This may affect courses linked to this category.')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchCategories();
    };

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div className="admin-welcome">
                    <p className="subtitle">Organization</p>
                    <h2>Course Categories</h2>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => { setIsAdding(true); setEditingCategory(null); setNewCategory({ name: '', icon: '' }); }} disabled={isSaving}>
                    <Plus size={18} /> {isSaving ? 'Working...' : 'New Category'}
                </button>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card mb-2"
                        style={{ padding: '1.5rem', marginBottom: '2rem' }}
                    >
                        <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                        <div className="form-row" style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Data Science"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Icon (Emoji or Icon Name)</label>
                                <input
                                    type="text"
                                    placeholder="📁"
                                    value={newCategory.icon}
                                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="button-group">
                            <button className="btn-filter" onClick={handleCancel} disabled={isSaving}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveCategory} disabled={isSaving}>
                                {isSaving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="activity-table glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Category Name</th>
                            <th>Slug</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isContentLoading ? (
                            <tr><td colSpan="4">Loading categories...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="4">No categories found. Create one above!</td></tr>
                        ) : categories.map(cat => (
                            <tr key={cat.id}>
                                <td style={{ fontSize: '1.5rem' }}>{cat.icon || '📁'}</td>
                                <td style={{ fontWeight: '700' }}>{cat.name}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{cat.slug}</td>
                                <td>
                                    <div className="action-row">
                                        <button className="icon-btn" title="Edit" onClick={() => handleEditClick(cat)}><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(cat.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagementView;
