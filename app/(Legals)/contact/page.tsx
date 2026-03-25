// pages/contact.tsx
'use client';

import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submission - to be replaced with Firebase function later
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-sm sm:text-base text-gray-700 mb-8">
            Have questions about CodeLearn? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-bold py-3 px-6 rounded hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Email</h3>
              <a href="mailto:pykinsu@outlook.com" className="text-sm sm:text-base underline hover:opacity-70">
                pykinsu@outlook.com
              </a>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">GitHub</h3>
              <a href="https://github.com/pykinsu" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base underline hover:opacity-70">
                github.com/pykinsu
              </a>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Response Time</h3>
              <p className="text-sm sm:text-base">
                We typically respond to all messages within 24-48 hours.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Beta Feedback</h3>
              <p className="text-sm sm:text-base">
                Your feedback helps us improve CodeLearn. Don't hesitate to share your suggestions and report any issues!
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center text-xs sm:text-sm">
            <p>© 2025 CodeLearn. Crafted with ❤️ by <a href="https://github.com/pykinsu" className="underline hover:opacity-70">@pykinsu</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
