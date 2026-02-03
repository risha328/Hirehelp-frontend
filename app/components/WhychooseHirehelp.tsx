'use client';

import { Zap, Shield, TrendingUp } from 'lucide-react';

export default function WhychooseHirehelp() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'API response times under 200ms. Experience seamless job searching and application.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with JWT authentication, RBAC, and data encryption.',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Real-time insights on job performance, applications, and candidate pipelines.',
    },
  ];

  return (
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
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <feature.icon className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
