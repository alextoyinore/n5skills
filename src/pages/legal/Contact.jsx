import React from 'react';
import FormalPage from './FormalPage';
import { useSettings } from '../../context/SettingsContext';

const Contact = () => {
    const { settings } = useSettings();
    const content = (
        <>
            <section>
                <h2>Get in Touch</h2>
                <p>Have a question about our courses, subscriptions, or business solutions? We're here to help. Our support team is available 24/7 to ensure you have the best possible learning experience.</p>
            </section>

            <section>
                <h2>Support & Help Center</h2>
                <p>For immediate answers to common questions, please visit our Help Center. You'll find detailed guides on billing, course access, and technical troubleshooting.</p>
            </section>

            <section>
                <h2>Sales Inquiries</h2>
                <p>Interested in {settings.platform_name} for your business or government organization? Contact our sales team to schedule a demo and discuss custom pricing options.</p>
                <p>Email: sales@{settings.platform_name.toLowerCase().replace(/\s+/g, '')}.com</p>
            </section>

            <section>
                <h2>Office Locations</h2>
                <p>While we are a remote-first company, we maintain physical hubs in major cities to bring our teams together.</p>
                <ul>
                    <li>New York City, USA</li>
                    <li>London, United Kingdom</li>
                    <li>Berlin, Germany</li>
                    <li>Tokyo, Japan</li>
                </ul>
            </section>
        </>
    );

    return (
        <FormalPage
            title="Contact Us"
            subtitle="We'd love to hear from you."
            content={content}
        />
    );
};

export default Contact;
