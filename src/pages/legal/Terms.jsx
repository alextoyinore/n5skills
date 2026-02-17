import React from 'react';
import FormalPage from './FormalPage';
import { useSettings } from '../../context/SettingsContext';

const Terms = () => {
    const { settings } = useSettings();
    const content = (
        <>
            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing and using the {settings.platform_name} platform, you agree to be bound by these Terms of Service
                and all applicable laws and regulations. If you do not agree with any of these terms,
                you are prohibited from using or accessing this site.
            </p>

            <h2>2. Use License</h2>
            <p>
                Permission is granted to temporarily download one copy of the materials (information or software)
                on {settings.platform_name}'s website for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
                The materials on {settings.platform_name}'s website are provided on an 'as is' basis. {settings.platform_name} makes no
                warranties, expressed or implied, and hereby disclaims and negates all other warranties
                including, without limitation, implied warranties or conditions of merchantability,
                fitness for a particular purpose, or non-infringement of intellectual property or other
                violation of rights.
            </p>
        </>
    );

    return (
        <FormalPage
            title="Terms of Service"
            subtitle="Last updated: February 2026"
            content={content}
        />
    );
};

export default Terms;
