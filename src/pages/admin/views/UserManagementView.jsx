import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Shield, UserX } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';

const UserManagementView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Debug: check current session role
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Current session user:", session?.user?.id);

            let query = supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (searchQuery) {
                query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
            }

            if (roleFilter !== 'all') {
                query = query.eq('role', roleFilter);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Supabase fetch error:", error);
                // Don't throw, just log it so we can see what's failing in the UI
            }

            console.log("Fetched users:", data);

            // If we have data but no email/created_at due to old schema, 
            // map them to empty strings to avoid crashes
            const sanitizedData = (data || []).map(user => ({
                ...user,
                email: user.email || '',
                full_name: user.full_name || 'Unnamed User',
                role: user.role || 'student',
                created_at: user.created_at || new Date().toISOString()
            }));

            setUsers(sanitizedData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role. Ensure you have admin permissions.');
        }
    };

    return (
        <div className="admin-view">
            <header className="admin-header">
                <h2>User Management</h2>
                {/* <button className="btn btn-primary btn-sm"><Plus size={18} /> Add New User</button> */}
            </header>
            <div className="view-filters">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="btn-filter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ appearance: 'none', paddingRight: '2rem' }}
                >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="activity-table glass-card">
                {loading ? (
                    <div className="p-4 text-center">Loading users...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info-cell">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" className="avatar-sm" />
                                            ) : (
                                                <div className="avatar-sm">{user.full_name?.charAt(0) || 'U'}</div>
                                            )}
                                            {user.full_name || 'Unnamed User'}
                                        </div>
                                    </td>
                                    <td>{user.email || 'No email'}</td>
                                    <td>
                                        {editingUser === user.id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                className="role-select-inline"
                                                autoFocus
                                                onBlur={() => setEditingUser(null)}
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`badge-role ${user.role}`}>{user.role}</span>
                                        )}
                                    </td>
                                    <td>{new Date(user.created_at || Date.now()).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-row">
                                            <button
                                                className="icon-btn"
                                                title="Edit Role"
                                                onClick={() => setEditingUser(user.id)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            {/* <button className="icon-btn delete" title="Suspend"><UserX size={16} /></button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">No users found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserManagementView;
