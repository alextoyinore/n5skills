import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        platform_name: 'Uwise',
        support_email: 'support@uwise.com'
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('platform_settings')
                .select('*')
                .single();

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching platform settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Optional: Realtime subscription for settings
        const subscription = supabase
            .channel('public:platform_settings')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'platform_settings' }, payload => {
                setSettings(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const formatPlatformName = (name) => {
        if (!name) return null;
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            const mid = Math.ceil(name.length / 2);
            const firstHalf = name.slice(0, mid);
            const secondHalf = name.slice(mid);
            return (
                <>
                    <span className="logo-bold">{firstHalf}</span>{secondHalf}
                </>
            );
        } else {
            const firstWord = words[0];
            const rest = words.slice(1).join(' ');
            return (
                <>
                    <span className="logo-bold">{firstWord}</span> {rest}
                </>
            );
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, fetchSettings, formatPlatformName }}>
            {children}
        </SettingsContext.Provider>
    );
};
