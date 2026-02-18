import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Mail, Search, Loader2, CheckCircle, Clock } from 'lucide-react';

const ContactSubmissionsView = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id, currentStatus) => {
        if (currentStatus === 'read') return;

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .update({ status: 'read' })
                .eq('id', id);

            if (error) throw error;
            setSubmissions(submissions.map(s =>
                s.id === id ? { ...s, status: 'read' } : s
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-view">
            <header className="admin-header">
                <div>
                    <p className="subtitle">Support Inquiries</p>
                    <h2>Contact <span className="primary-text">Submissions</span></h2>
                </div>
            </header>

            <div className="view-filters">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or message content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="activity-table glass-card">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="spinner mx-auto mb-4" size={32} />
                        <p>Loading submissions...</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Subject</th>
                                <th>Message Snippet</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubmissions.map(sub => (
                                <tr key={sub.id} className={sub.status === 'unread' ? 'font-bold bg-blue-50/30' : ''}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span>{sub.name}</span>
                                            <small className="text-slate-400">{sub.email}</small>
                                        </div>
                                    </td>
                                    <td>{sub.subject}</td>
                                    <td className="max-w-xs">
                                        <p className="text-sm truncate" title={sub.message}>
                                            {sub.message}
                                        </p>
                                    </td>
                                    <td>
                                        <span className={`badge-status ${sub.status === 'read' ? 'success' : 'warning'}`}>
                                            {sub.status === 'unread' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-row">
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => markAsRead(sub.id, sub.status)}
                                                disabled={sub.status === 'read'}
                                            >
                                                Mark Read
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSubmissions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-500">
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ContactSubmissionsView;
