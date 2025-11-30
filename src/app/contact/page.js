'use client';

import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mailto fallback
        const subject = encodeURIComponent(`[Chronon Field] ${formData.subject}`);
        const body = encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:contact@chrononfield.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 text-center">
                Contact
            </h1>
            <p className="text-secondary text-center mb-12">
                Pour toute demande de collaboration ou d'information, veuillez utiliser le formulaire ci-dessous.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nom
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Sujet
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent/90 transition-all duration-200 transform hover:scale-[1.02]"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
}
