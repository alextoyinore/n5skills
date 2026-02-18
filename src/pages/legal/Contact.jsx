import React, { useState } from 'react';
import FormalPage from './FormalPage';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../utils/supabaseClient';
import { Send, CheckCircle, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('contact_submissions')
                .insert([formData]);

            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <div className="contact-grid-layout">
            <div className="contact-info-cards">
                <section className="contact-card-item">
                    <div className="contact-card-icon"><Mail size={24} /></div>
                    <div>
                        <h3>Email Us</h3>
                        <p>Support: support@{settings.platform_name.toLowerCase().replace(/\s+/g, '')}.com</p>
                        <p>Sales: sales@{settings.platform_name.toLowerCase().replace(/\s+/g, '')}.com</p>
                    </div>
                </section>

                <section className="contact-card-item">
                    <div className="contact-card-icon"><MapPin size={24} /></div>
                    <div>
                        <h3>Our Offices</h3>
                        <p>Remote-First with global hubs in Lagos, Abuja, London, and NYC.</p>
                    </div>
                </section>

                <section className="contact-card-item">
                    <div className="contact-card-icon"><Phone size={24} /></div>
                    <div>
                        <h3>Call Us</h3>
                        <p>+234 805 471 5485</p>
                        <p>Mon - Fri, 9am - 6pm WAT</p>
                    </div>
                </section>
            </div>

            <div className="contact-form-container">
                {submitted ? (
                    <div className="success-message animate-fade-in">
                        <div className="success-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                        <p className="text-slate-600 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
                        <button className="btn btn-outline" onClick={() => setSubmitted(false)}>Send Another Message</button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="contact-input"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="contact-input"
                                    placeholder="john@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className="contact-input"
                                placeholder="How can we help?"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                className="contact-textarea"
                                placeholder="Tell us more about your inquiry..."
                                required
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <button className="btn btn-primary submit-btn" disabled={loading}>
                            {loading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );

    return (
        <FormalPage
            title="Get in Touch"
            subtitle="We're here to help you succeed."
            content={content}
        />
    );
};

export default Contact;
