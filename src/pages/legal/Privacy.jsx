import React from 'react';
import FormalPage from './FormalPage';

const Privacy = () => {
    const content = (
        <>
            <h2>Information We Collect</h2>
            <p>
                We collect information that you provide directly to us when you create an account,
                enroll in a course, or communicate with us. This may include your name, email address,
                and payment information.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
                We use the information we collect to provide, maintain, and improve our services,
                to process transactions, and to send you technical notices and support messages.
            </p>

            <h2>Data Protection</h2>
            <p>
                We take reasonable measures to help protect information about you from loss,
                theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
        </>
    );

    return (
        <FormalPage
            title="Privacy Policy"
            subtitle="Your privacy is important to us"
            content={content}
        />
    );
};

export default Privacy;
