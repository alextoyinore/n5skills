import React from 'react';
import { Link } from 'react-router-dom';

const ServerErrorPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.errorCode}>500</h1>
                <h2 style={styles.title}>Internal Server Error</h2>
                <p style={styles.message}>
                    Sorry, something went wrong on our end. We are working to fix the issue. Please try again later.
                </p>
                <div style={styles.buttonContainer}>
                    <button
                        onClick={() => window.location.reload()}
                        style={styles.retryButton}
                    >
                        Retry
                    </button>
                    <Link to="/" style={styles.homeLink}>
                        Return to Home
                    </Link>
                </div>
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
        color: '#d32f2f', // Red for error
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
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem'
    },
    retryButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: 'transparent',
        color: 'var(--primary-color, #0056b3)',
        border: '1px solid var(--primary-color, #0056b3)',
        borderRadius: '4px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '1rem'
    },
    homeLink: {
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--primary-color, #0056b3)',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        fontSize: '1rem'
    }
};

export default ServerErrorPage;
