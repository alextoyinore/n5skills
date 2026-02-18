import React, { useState, useEffect } from 'react';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import './Faqs.css';

const Faqs = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const mockFaqs = [
        {
            id: 1,
            question: "How do I access my courses after purchase?",
            answer: "Once your payment is confirmed or you redeem a PIN, you can access your courses by clicking on 'My Learning' or 'Dashboard' in the navigation bar. All your enrolled courses will be listed there.",
            category: "General"
        },
        {
            id: 2,
            question: "Can I watch lessons on my mobile device?",
            answer: "Yes! Our platform is fully responsive and works perfectly on smartphones and tablets. You can even continue exactly where you left off on any device.",
            category: "General"
        },
        {
            id: 3,
            question: "How do I redeem a course PIN?",
            answer: "Go to any paid course page, click 'Enroll Now', and select the 'Redeem PIN' option. Enter your unique 8-character code and the course will be instantly added to your library.",
            category: "Enrollment"
        },
        {
            id: 4,
            question: "Are there any certificates upon completion?",
            answer: "Most of our professional development tracks include a digital certificate of completion that you can download and share on LinkedIn or with employers.",
            category: "Certification"
        }
    ];

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index');

            if (error) throw error;

            if (data && data.length > 0) {
                setFaqs(data);
            } else {
                setFaqs(mockFaqs);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setFaqs(mockFaqs);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(faqs.map(item => item.category))];
    const filteredFaqs = activeCategory === 'All'
        ? faqs
        : faqs.filter(f => f.category === activeCategory);

    const toggleAccordion = (id) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <div className="faqs-page pt-32" style={{ marginTop: '8rem' }}>
            <div className="faqs-container">
                <header className="faqs-header">
                    <div className="flex justify-center mb-4">
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                            <HelpCircle size={16} /> Help Center
                        </span>
                    </div>
                    <h1>Frequently Asked Questions</h1>
                    <p>Everything you need to know about the platform and courses.</p>
                </header>

                <div className="faq-categories">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`faq-category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="faq-list">
                    {filteredFaqs.map(faq => (
                        <div
                            key={faq.id}
                            className={`faq-item ${activeId === faq.id ? 'active' : ''}`}
                        >
                            <button className="faq-question" onClick={() => toggleAccordion(faq.id)}>
                                <h3>{faq.question}</h3>
                                <ChevronDown className="faq-icon" size={20} />
                            </button>
                            <div className="faq-answer">
                                <div className="faq-answer-content">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-contact-cta glass-card">
                    <MessageCircle className="mx-auto mb-4 text-primary" size={40} />
                    <h3 className="text-2xl font-bold">Still have questions?</h3>
                    <p>We're here to help! Send us a message and we'll get back to you as soon as possible.</p>
                    <Link to="/contact" className="btn btn-primary">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
