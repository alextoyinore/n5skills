import React from 'react';
import FormalPage from './FormalPage';
import { useSettings } from '../../context/SettingsContext';

const About = () => {
    const { settings } = useSettings();
    const content = (
        <>
            <h2>Our Mission</h2>
            <p>
                At {settings.platform_name}, we believe that education is a fundamental human right. Our mission is to provide
                unlimited access to world-class learning, empowering individuals to transform their lives
                and communities through knowledge.
            </p>

            <h2>Who We Are</h2>
            <p>
                Founded in 2025, {settings.platform_name} has grown to be a global leader in online education.
                We partner with top universities and industry leaders to bring the best learning
                experiences to students everywhere.
            </p>

            <h2>Our Values</h2>
            <ul>
                <li><strong>Innovation:</strong> We are constantly looking for new ways to improve the learning experience.</li>
                <li><strong>Inclusion:</strong> We believe that everyone, regardless of background, should have access to quality education.</li>
                <li><strong>Impact:</strong> We measure our success by the success of our learners.</li>
            </ul>
        </>
    );

    return (
        <FormalPage
            title={`About ${settings.platform_name}`}
            subtitle="Empowering learners worldwide since 2025"
            content={content}
        />
    );
};

export default About;
