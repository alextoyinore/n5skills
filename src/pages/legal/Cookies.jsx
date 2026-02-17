import React from 'react';
import FormalPage from './FormalPage';

const Cookies = () => {
    const content = (
        <>
            <section>
                <h2>Our Use of Cookies</h2>

            </section>

            <section>
                <h2>What are Cookies?</h2>
                <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
            </section>

            <section>
                <h2>Why do we use Cookies?</h2>
                <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies.</p>
                <ul>
                    <li>Essential cookies for site functionality</li>
                    <li>Performance and functionality cookies</li>
                    <li>Analytics and customization cookies</li>
                    <li>Advertising cookies</li>
                </ul>
            </section>

            <section>
                <h2>How can I control Cookies?</h2>
                <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
            </section>
        </>
    );

    return (
        <FormalPage
            title="Cookie Policy"
            subtitle="Transparent information about how we use digital storage."
            content={content}
        />
    );
};

export default Cookies;
