import React from 'react';
import FormalPage from './FormalPage';

const About = () => {
    const content = (
        <>
            <h2>Our Mission</h2>
            <p>
                At Uwise, we believe that education is a fundamental human right. Our mission is to provide
                unlimited access to world-class learning, empowering individuals to transform their lives
                and communities through knowledge.
            </p>

            <h2>Who We Are</h2>
            <p>
                Founded in 2026, Uwise has grown from a small startup to a global leader in online education.
                We partner with over 100 top universities and industry leaders to bring the best learning
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
            title="About Uwise"
            subtitle="Empowering learners worldwide since 2026"
            content={content}
        />
    );
};

export default About;
