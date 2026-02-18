import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';

const FaqManagementView = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ question: '', answer: '', category: 'General' });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (faq) => {
        setEditingId(faq.id);
        setEditForm({ question: faq.question, answer: faq.answer, category: faq.category });
        setIsAdding(false);
    };

    const handleSave = async (id) => {
        try {
            const { error } = await supabase
                .from('faqs')
                .update(editForm)
                .eq('id', id);

            if (error) throw error;
            setFaqs(faqs.map(f => f.id === id ? { ...f, ...editForm } : f));
            setEditingId(null);
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Error saving FAQ');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) throw error;
            setFaqs(faqs.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };

    const handleAdd = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .insert([{ ...editForm, order_index: faqs.length }])
                .select();

            if (error) throw error;
            setFaqs([...faqs, data[0]]);
            setIsAdding(false);
            setEditForm({ question: '', answer: '', category: 'General' });
        } catch (error) {
            console.error('Error adding FAQ:', error);
            alert('Error adding FAQ');
        }
    };

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div>
                    <p className="subtitle">Support Content</p>
                    <h2>FAQ <span className="primary-text">Management</span></h2>
                </div>
                {!isAdding && (
                    <button className="btn btn-primary btn-sm" onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                        setEditForm({ question: '', answer: '', category: 'General' });
                    }}>
                        <Plus size={18} /> Add FAQ
                    </button>
                )}
            </header>

            {isAdding && (
                <div className="faq-add-form glass-card">
                    <h3 className="faq-form-title">Add New FAQ</h3>
                    <div className="faq-form-grid">
                        <div className="form-group faq-form-full">
                            <label>Question</label>
                            <input
                                className="admin-input-premium"
                                value={editForm.question}
                                onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                                placeholder="e.g. How do I change my password?"
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                className="admin-input-premium"
                                value={editForm.category}
                                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                placeholder="General, Billing, etc."
                            />
                        </div>
                        <div className="form-group faq-form-full">
                            <label>Answer</label>
                            <textarea
                                className="admin-input-premium faq-answer-textarea"
                                value={editForm.answer}
                                onChange={e => setEditForm({ ...editForm, answer: e.target.value })}
                                placeholder="Provide a clear, helpful answer..."
                            />
                        </div>
                    </div>
                    <div className="faq-form-actions">
                        <button className="btn btn-primary" onClick={handleAdd}>Save FAQ</button>
                        <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="faq-admin-list">
                {loading ? (
                    <div className="p-12 text-center"><Loader2 className="spinner mx-auto" /></div>
                ) : (
                    <div className="grid gap-4">
                        {faqs.map(faq => (
                            <div key={faq.id} className="glass-card p-6">
                                {editingId === faq.id ? (
                                    <div className="animate-fade-in">
                                        <div className="form-group mb-4">
                                            <input
                                                className="admin-input-premium font-bold"
                                                value={editForm.question}
                                                onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <textarea
                                                className="admin-input-premium"
                                                value={editForm.answer}
                                                onChange={e => setEditForm({ ...editForm, answer: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="icon-btn success" onClick={() => handleSave(faq.id)}><Save size={18} /></button>
                                            <button className="icon-btn" onClick={() => setEditingId(null)}><X size={18} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-primary uppercase mb-1 block">{faq.category}</span>
                                            <h4 className="font-bold text-lg mb-2">{faq.question}</h4>
                                            <p className="text-slate-600 text-sm">{faq.answer}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="icon-btn" onClick={() => handleEdit(faq)}><Edit2 size={16} /></button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(faq.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaqManagementView;
