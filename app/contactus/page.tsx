'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Globe,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  HeadphonesIcon as Support,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = [
    { id: 'general', label: 'General Inquiry', icon: MessageSquare },
    { id: 'support', label: 'Technical Support', icon: Support },
    { id: 'sales', label: 'Sales & Partnerships', icon: Users },
    { id: 'careers', label: 'Careers', icon: Building },
    { id: 'press', label: 'Press & Media', icon: Globe },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get in touch via email',
      details: 'contact@hirehelp.com',
      action: 'mailto:contact@hirehelp.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team',
      details: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Instant messaging support',
      details: 'Available 24/7',
      action: '#chat',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Support,
      title: 'Help Center',
      description: 'Find answers quickly',
      details: 'help.hirehelp.com',
      action: 'https://help.hirehelp.com',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '123 Market Street, Suite 100, San Francisco, CA 94105',
      phone: '+1 (415) 555-0123',
      email: 'sf@hirehelp.com',
      hours: 'Mon-Fri, 9AM-6PM PST',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'New York',
      country: 'United States',
      address: '456 Broadway, 20th Floor, New York, NY 10013',
      phone: '+1 (212) 555-0123',
      email: 'ny@hirehelp.com',
      hours: 'Mon-Fri, 9AM-6PM EST',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '78 Baker Street, London W1U 6RT',
      phone: '+44 20 7123 4567',
      email: 'london@hirehelp.com',
      hours: 'Mon-Fri, 9AM-6PM GMT',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '101 Cecil Street, #23-01, Singapore 069533',
      phone: '+65 6123 4567',
      email: 'singapore@hirehelp.com',
      hours: 'Mon-Fri, 9AM-6PM SGT',
      image: 'https://images.unsplash.com/photo-1532228119163-5a67fd3c9e69?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const socialLinks = [
    { platform: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/hirehelp', color: 'hover:bg-blue-100 hover:text-blue-600' },
    { platform: 'Twitter', icon: Twitter, url: 'https://twitter.com/hirehelp', color: 'hover:bg-sky-100 hover:text-sky-600' },
    { platform: 'Facebook', icon: Facebook, url: 'https://facebook.com/hirehelp', color: 'hover:bg-blue-100 hover:text-blue-600' },
    { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com/hirehelp', color: 'hover:bg-pink-100 hover:text-pink-600' },
  ];

  const faqs = [
    {
      question: 'How quickly can I expect a response?',
      answer: 'We typically respond within 1-2 business days. For urgent matters, please use our live chat or call us directly.'
    },
    {
      question: 'Do you offer enterprise solutions?',
      answer: 'Yes, we have dedicated solutions for large organizations. Contact our sales team for a custom demo.'
    },
    {
      question: 'Can I schedule a product demo?',
      answer: 'Absolutely! Visit our demo scheduling page or contact our sales team to arrange a personalized walkthrough.'
    },
    {
      question: 'Do you provide API access?',
      answer: 'Yes, we offer comprehensive API documentation for developers. Contact our technical support team for access.'
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: 'general',
      });
      
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-200 via-white to-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-900 text-sm font-medium">
                We're Here to Help
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get in Touch with
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                HireHelp
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Have questions, feedback, or need assistance? Our team is ready to help you
              with any inquiries about our platform, services, or partnership opportunities.
            </p>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320"
            className="w-full h-20 md:h-24 text-white"
          >
            <path 
              fill="currentColor" 
              fillOpacity="1" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,138.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Would You Like to Connect?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Choose the most convenient way to reach our team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.action}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${method.color} mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                    <div className="text-gray-900 font-medium">{method.details}</div>
                    <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                      <span>Contact now</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-600">
                    Fill out the form below and our team will get back to you as soon as possible.
                  </p>
                </div>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="mb-6 animate-fade-in">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-800 font-medium">Message sent successfully!</p>
                        <p className="text-emerald-700 text-sm mt-1">
                          Thank you for contacting us. We'll get back to you within 1-2 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {departments.map((dept) => {
                        const Icon = dept.icon;
                        const isSelected = formData.department === dept.id;
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, department: dept.id }))}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <Icon className="h-5 w-5 mb-1.5" />
                            <span className="text-xs font-medium text-center">{dept.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                          errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="What is this regarding?"
                      />
                      {errors.subject && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
                          errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Please provide details about your inquiry..."
                      />
                      {errors.message && (
                        <div className="absolute right-3 top-3">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      {formData.message.length}/2000 characters
                    </div>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-3" />
                          Send Message
                        </>
                      )}
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-3">
                      We typically respond within 1-2 business days
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-8">
            {/* Global Offices */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Global Offices</h3>
              </div>
              
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <img
                            src={office.image}
                            alt={office.city}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-900">{office.city}</h4>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{office.country}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{office.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2.5 text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm">
                View All Locations
              </button>
            </div>

            {/* Quick Contacts */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">General Inquiries</p>
                    <a href="mailto:info@hirehelp.com" className="text-sm text-blue-600 hover:text-blue-800">
                      info@hirehelp.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Sales Team</p>
                    <a href="tel:+15551234567" className="text-sm text-blue-600 hover:text-blue-800">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Clock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 9AM-6PM (Your Local Time)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <p className="text-sm text-gray-600 mb-6">
                Follow us on social media for updates, tips, and career opportunities.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center p-3 rounded-lg border border-gray-200 ${social.color} transition-all duration-300 group`}
                    >
                      <Icon className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform" />
                      <span className="ml-2 text-sm font-medium">{social.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Questions</h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 p-2 rounded-lg hover:bg-gray-50">
                      <span>{faq.question}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-2 p-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
              
              <a
                href="/faq"
                className="inline-flex items-center justify-center w-full mt-6 py-2.5 text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm"
              >
                View All FAQs
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-16">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <MapPin className="h-4 w-4 text-white mr-2" />
                  <span className="text-white text-sm font-medium">
                    Our Headquarters
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Visit Our San Francisco Office
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-white/80 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">123 Market Street</p>
                      <p className="text-white/80">Suite 100, San Francisco, CA 94105</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-white/80 mr-3 flex-shrink-0" />
                    <a href="tel:+14155550123" className="text-white hover:text-white/90">
                      +1 (415) 555-0123
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-white/80 mr-3 flex-shrink-0" />
                    <p className="text-white/80">Monday - Friday, 9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-white text-indigo-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </button>
              </div>
              <div className="relative min-h-[400px] bg-gradient-to-br from-blue-400 to-cyan-400">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                      <MapPin className="h-16 w-16 text-white" />
                    </div>
                    <div className="text-white text-4xl font-bold">4</div>
                    <div className="text-white/90 mt-2">Global Offices</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-10 blur-xl"></div>
            <div className="relative bg-white rounded-2xl p-12 border border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Our live chat support is available 24/7 for urgent inquiries and technical support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Start Live Chat
                </button>
                <button className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300">
                  <Phone className="h-5 w-5 mr-3" />
                  Schedule a Call
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-6">
                Average response time: &lt; 2 minutes during business hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}