import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailLoading, setEmailLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);

    // Consolidated profile syncing logic with safety timeout
    const fetchProfile = useCallback(async (userId) => {
        console.log(`[AuthProvider] Starting profile fetch for ${userId}...`);
        try {
            // Race profile fetch with a 3-second timeout to prevent stuck loading state
            const fetchPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timed out')), 3000)
            );

            const { data: profile, error } = await Promise.race([
                fetchPromise,
                timeoutPromise
            ]);

            if (error && error.code !== 'PGRST116') {
                console.error("[AuthProvider] Profile fetch error:", error);
                return null;
            }
            console.log("[AuthProvider] Profile fetched successfully.");
            return profile;
        } catch (err) {
            console.warn("[AuthProvider] Profile fetch hanging/failed, falling back to basic data:", err.message);
            return null;
        }
    }, []);

    // Helper to constructing the user object
    const formatUser = useCallback(async (sessionUser) => {
        if (!sessionUser) return null;

        const profile = await fetchProfile(sessionUser.id);
        const metadata = sessionUser.user_metadata || {};

        if (!profile) {
            console.log("[AuthProvider] Using metadata fallback for user data.");
        }

        // Merge sources: Profile > Metadata > Fallback
        return {
            id: sessionUser.id,
            email: sessionUser.email,
            name: profile?.full_name || metadata.full_name || sessionUser.email?.split('@')[0] || 'User',
            avatar: profile?.avatar_url || metadata.avatar_url || `https://ui-avatars.com/api/?name=${sessionUser.email}`,
            role: profile?.role || metadata.role || 'student', // Metadata role is key here if DB hangs
            headline: profile?.headline || '',
            bio: profile?.bio || '',
            website: profile?.website || '',
            socials: profile?.socials || {}
        };
    }, [fetchProfile]);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                // Check active session
                const { data: { session: initSession } } = await supabase.auth.getSession();

                if (mounted) {
                    setSession(initSession);
                    if (initSession?.user) {
                        const formattedUser = await formatUser(initSession.user);
                        if (mounted) setUser(formattedUser);
                    } else {
                        if (mounted) setUser(null);
                    }
                }
            } catch (error) {
                console.error("Auth initialization failed:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;

            console.log(`Auth event: ${event}`);
            setSession(currentSession);

            if (currentSession?.user) {
                // If it's a LOGIN or UPDATE event, refresh user data
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
                    const formattedUser = await formatUser(currentSession.user);
                    if (mounted) setUser(formattedUser);
                }
            } else if (event === 'SIGNED_OUT') {
                if (mounted) setUser(null);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [formatUser]);

    const login = async (email, password) => {
        setEmailLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data.user;
        } finally {
            setEmailLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        setEmailLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } },
            });
            if (error) throw error;
            return data.user;
        } finally {
            setEmailLoading(false);
        }
    };

    const signInWithOAuth = async (provider) => {
        if (provider === 'google') setGoogleLoading(true);
        else if (provider === 'github') setGithubLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin },
            });
            if (error) throw error;
            return data;
        } finally {
            if (provider === 'google') setGoogleLoading(false);
            else if (provider === 'github') setGithubLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        setSession(null);
        await supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        loading,
        emailLoading,
        googleLoading,
        githubLoading,
        login,
        signup,
        signInWithOAuth,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
