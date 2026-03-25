// pages/help.tsx
import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the Sign Up button on the home page, fill in your first name, last name, email, and password. Agree to the Terms of Service and click Sign Up. You\'ll be automatically logged in and redirected to the dashboard.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click the "Forgot password?" link on the login page. Enter your email address and we\'ll send you a password reset link. Check your email and click the link to create a new password.'
    },
    {
      question: 'Can I change my email address?',
      answer: 'Yes, you can change your email by going to your Profile page and clicking "Edit Profile". Update your email and click "Save Changes".'
    },
    {
      question: 'How do I delete my account?',
      answer: 'To delete your account, please contact our support team at pykinsu@outlook.com. We\'ll help you with the account deletion process.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data. Your passwords are securely hashed and stored. We never share your personal information with third parties.'
    },
    {
      question: 'Why am I unable to sign up?',
      answer: 'If you\'re unable to sign up, it might be because the email is already registered. Try logging in with that email or use a different email address. If you still have issues, contact pykinsu@outlook.com.'
    },
    {
      question: 'How do I take a quiz?',
      answer: 'Navigate to the Languages section, select your programming language, find the quiz you want to take, and click "Start Quiz". Answer all questions and click "Submit" to see your results.'
    },
    {
      question: 'Can I retake a quiz?',
      answer: 'Yes, you can retake any quiz multiple times. Your highest score will be displayed on your profile. Each attempt is recorded in your progress tracking.'
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Help & Support</h1>
        <p className="text-sm sm:text-base text-gray-700 mb-12">
          Find answers to common questions and get the support you need
        </p>

        {/* FAQs Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-black rounded p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-800">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-black rounded p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Email Support</h3>
              <p className="text-sm sm:text-base mb-4 text-gray-700">
                Have a question or issue? Send us an email and we'll get back to you as soon as possible.
              </p>
              <a 
                href="mailto:pykinsu@outlook.com"
                className="inline-block bg-black text-white font-bold py-2 px-4 rounded hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                Send Email
              </a>
            </div>

            <div className="border border-black rounded p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Response Time</h3>
              <p className="text-sm sm:text-base text-gray-700">
                We typically respond to all emails within <strong>24-48 hours</strong>. For urgent matters, please mention it in your subject line.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-l-4 border-black pl-6 sm:pl-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Information</h2>
          <div className="space-y-4 text-sm sm:text-base">
            <div>
              <p className="font-bold">Email</p>
              <a href="mailto:pykinsu@outlook.com" className="underline hover:opacity-70 text-gray-700">
                pykinsu@outlook.com
              </a>
            </div>
            <div>
              <p className="font-bold">GitHub</p>
              <a href="https://github.com/pykinsu" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 text-gray-700">
                github.com/pykinsu
              </a>
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
