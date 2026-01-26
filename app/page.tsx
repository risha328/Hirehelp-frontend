'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <Hero />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose HireFlow?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built for modern recruitment with enterprise-grade features
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              API response times under 200ms. Experience seamless job searching and application.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with JWT authentication, RBAC, and data encryption.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
            <p className="text-gray-600">
              Real-time insights on job performance, applications, and candidate pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-gray-400">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-gray-400">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Transform Your Hiring Process?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of companies that have streamlined their recruitment with HireFlow SaaS.
        </p>
        <Link 
          href="/auth/register"
          className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          No credit card required. 14-day free trial.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HireFlow</span>
            </div>
            <div className="flex space-x-6 text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}