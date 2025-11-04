'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // Create mailto link with pre-filled content
    const subject = encodeURIComponent(`FutureScan Support: ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:Future_Scan@tech-center.com?subject=${subject}&body=${body}`;

    // Open mailto link
    window.location.href = mailtoLink;

    // Reset form after a delay to allow mailto to open
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/20 rounded-full mb-4">
            <Mail className="text-[#ff6b35]" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support</h1>
          <p className="text-gray-400">
            Need help? Have feedback? We're here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-2 card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-green-300 font-semibold">Message sent!</p>
                  <p className="text-sm text-green-400 mt-1">
                    Your email client should have opened. We'll respond within 48 hours.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-red-300 font-semibold">Error</p>
                  <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 outline-none focus:border-[#ff6b35] transition-colors"
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 outline-none focus:border-[#ff6b35] transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 outline-none focus:border-[#ff6b35] transition-colors"
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 outline-none focus:border-[#ff6b35] transition-colors resize-none"
                  placeholder="Please provide details about your question or issue..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#ff6b35] hover:bg-[#e85a26] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <a
                    href="mailto:Future_Scan@tech-center.com"
                    className="text-[#ff6b35] hover:underline break-all"
                  >
                    Future_Scan@tech-center.com
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Response Time</p>
                  <p className="text-white">Within 48 hours</p>
                </div>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Common Questions</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Is FutureScan free to use?
                  </p>
                  <p className="text-sm text-gray-400">
                    Yes, all features are currently free and use public APIs.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">
                    How accurate are the signals?
                  </p>
                  <p className="text-sm text-gray-400">
                    Signals are data-driven but not financial advice. Always do your own
                    research.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Can I export my watchlist?
                  </p>
                  <p className="text-sm text-gray-400">
                    This feature is coming soon. Currently data is stored locally.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Support Hours</h3>
              <p className="text-sm text-gray-400">
                We monitor support requests during:
              </p>
              <p className="text-white mt-2">Monday - Friday</p>
              <p className="text-sm text-gray-400">9:00 AM - 6:00 PM EST</p>
              <p className="text-xs text-gray-500 mt-3">
                * We aim to respond to all messages within 48 hours, including weekends.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card p-6 mt-6 bg-yellow-500/5 border-yellow-500/20">
          <p className="text-sm text-gray-400">
            <strong className="text-yellow-500">Important:</strong> FutureScan provides
            information for educational purposes only and does not offer financial advice.
            Support inquiries related to personal investment decisions should be directed to
            qualified financial advisors.
          </p>
        </div>
      </div>
    </div>
  );
}
