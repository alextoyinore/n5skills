import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const NotFoundPage = () => {
    const { settings } = useSettings();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.errorCode}>404</h1>
                <h2 style={styles.title}>Page Not Found</h2>
                <p style={styles.message}>
                    Oops! The page you are looking for does not exist or has been moved.
                </p>
                <Link to="/" style={styles.homeLink}>
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center'
    },
    content: {
        maxWidth: '500px'
    },
    errorCode: {
        fontSize: '6rem',
        fontWeight: 'bold',
        color: 'var(--primary-color, #0056b3)',
        margin: '0 0 1rem 0',
        lineHeight: 1
    },
    title: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: 'var(--text-color, #333)'
    },
    message: {
        fontSize: '1.1rem',
        color: 'var(--text-muted, #666)',
        marginBottom: '2rem',
        lineHeight: 1.5
    },
    homeLink: {
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--primary-color, #0056b3)',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    }
};

export default NotFoundPage;
