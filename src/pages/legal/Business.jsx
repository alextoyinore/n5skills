import React from 'react';
import FormalPage from './FormalPage';
import { useSettings } from '../../context/SettingsContext';

const Business = () => {
    const { settings } = useSettings();
    const content = (
        <>
            <section>
                <h2>Empower Your Workforce</h2>
                <p>In today's rapidly evolving digital landscape, staying ahead means constantly upgrading your team's capabilities. {settings.platform_name} for Business provides a comprehensive solution for talent development.</p>
            </section>

            <section>
                <h2>Enterprise-Grade Learning</h2>
                <p>Access the world's best instructors and most relevant content. Our platform is built for the needs of modern organizations, from startups to Fortune 500 companies.</p>
                <ul>
                    <li>Curated learning paths for critical roles</li>
                    <li>Skill assessments and gap analysis</li>
                    <li>LMS integration (SCORM/xAPI)</li>
                    <li>Dedicated customer success manager</li>
                </ul>
            </section>

            <section>
                <h2>Measure What Matters</h2>
                <p>Our advanced analytics dashboard gives you deep insights into your team's progress, engagement, and skill mastery. Track ROI and identify your top talent with ease.</p>
            </section>
        </>
    );

    return (
        <FormalPage
            title={`${settings.platform_name} for Business`}
            subtitle="The strategic partner for skills-based organizational growth."
            content={content}
        />
    );
};

export default Business;
