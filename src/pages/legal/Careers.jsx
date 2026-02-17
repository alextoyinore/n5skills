import React from 'react';
import FormalPage from './FormalPage';
import { useSettings } from '../../context/SettingsContext';

const Careers = () => {
    const { settings } = useSettings();
    const content = (
        <>
            <section>
                <h2>Join the Mission</h2>
                <p>At {settings.platform_name}, we're on a mission to democratize education and help everyone, everywhere, learn the skills they need to succeed. We're looking for passionate, curious, and driven individuals to join our global team.</p>
            </section>

            <section>
                <h2>Why Work Here?</h2>
                <p>We're a remote-first company that values autonomy, impact, and continuous learning. When you join {settings.platform_name}, you're not just taking a job — you're helping shape the future of education.</p>
                <ul>
                    <li>Unlimited learning opportunities</li>
                    <li>Flexible work-from-anywhere policy</li>
                    <li>Competitive compensation and benefits</li>
                    <li>Inclusive and diverse global community</li>
                </ul>
            </section>

            <section>
                <h2>Current Openings</h2>
                <p>We're always looking for talented engineers, designers, content creators, and educators. Check back often or send us your resume spontaneously.</p>
            </section>
        </>
    );

    return (
        <FormalPage
            title={`Careers at ${settings.platform_name}`}
            subtitle="Build the future of learning with us."
            content={content}
        />
    );
};

export default Careers;
