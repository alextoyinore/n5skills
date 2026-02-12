import React from 'react';
import FormalPage from './FormalPage';

const Subscriptions = () => {
    const content = (
        <>
            <section>
                <h2>Choose Your Path to Success</h2>
                <p>N5SKILLS offers flexible membership options designed to fit your learning goals and budget. Whether you're looking to master a new skill or provide training for your entire team, we have a plan for you.</p>
            </section>

            <section>
                <h2>Premium Membership</h2>
                <p>Our most popular option for individual learners. Get unlimited access to our entire library of professional courses, hands-on projects, and certificate programs.</p>
                <ul>
                    <li>Unlimited access to 8,000+ courses</li>
                    <li>Downloadable resources and exercise files</li>
                    <li>Professional certificates of completion</li>
                    <li>Offline viewing on mobile devices</li>
                </ul>
            </section>

            <section>
                <h2>Professional Certification</h2>
                <p>Focused learning paths designed to prepare you for industry-recognized certifications in cloud computing, data science, project management, and more.</p>
            </section>

            <section>
                <h2>Team & Enterprise</h2>
                <p>Scale your organization's skills with our team-based plans. Includes administrative tools, progress tracking, and custom learning paths tailored to your business needs.</p>
            </section>
        </>
    );

    return (
        <FormalPage
            title="Subscriptions"
            subtitle="Flexible plans for every stage of your learning journey."
            content={content}
        />
    );
};

export default Subscriptions;
