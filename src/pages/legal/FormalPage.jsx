import React from 'react';
import './FormalPage.css';

const FormalPage = ({ title, subtitle, content }) => {
    return (
        <div className="formal-page">
            <div className="formal-header">
                <div className="container">
                    <h1>{title}</h1>
                    {subtitle && <p className="subtitle">{subtitle}</p>}
                </div>
            </div>

            <div className="formal-content container">
                <div className="content-inner">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default FormalPage;
