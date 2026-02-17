import React from 'react';
import FormalPage from './FormalPage';

const Government = () => {
    const content = (
        <>
            <section>
                <h2>Modernizing Public Service</h2>
                <p>Uwise partners with government agencies to bridge the digital skills gap and prepare the public workforce for the challenges of the 21st century.</p>
            </section>

            <section>
                <h2>Scalable Workforce Training</h2>
                <p>From cybersecurity to data-driven decision making, we provide the curriculum needed to modernize government operations and improve service delivery to citizens.</p>
                <ul>
                    <li>Compliance and security focused training</li>
                    <li>Customizable programs for specific agency goals</li>
                    <li>Transparent reporting and accountability</li>
                    <li>FedRAMP authorized hosting options</li>
                </ul>
            </section>

            <section>
                <h2>Economic Development</h2>
                <p>Empower your citizens with in-demand skills. Our platform can be deployed as part of broader regional economic development and workforce reskilling initiatives.</p>
            </section>
        </>
    );

    return (
        <FormalPage
            title="Uwise for Government"
            subtitle="Building a future-ready public sector workforce."
            content={content}
        />
    );
};

export default Government;
