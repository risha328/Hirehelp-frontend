'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Briefcase,
  Users,
  CheckCircle,
  Search,
  Target,
  Zap,
  TrendingUp,
  Shield,
  BarChart3,
  Clock,
  Award,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: UserPlus,
      title: 'Get Started',
      description: 'Create your professional profile in under 5 minutes. Choose between company or candidate account types.',
      features: ['No credit card required', 'Free plan available', 'Email verification'],
      highlightIcon: Shield,
      highlightText: 'Secure registration'
    },
    {
      icon: Search,
      title: 'Discover Opportunities',
      description: 'Companies post detailed job openings. Candidates explore roles matched to their skills and preferences.',
      features: ['AI-powered job matching', 'Advanced search filters', 'Salary insights'],
      highlightIcon: Target,
      highlightText: 'Smart matching'
    },
    {
      icon: Users,
      title: 'Connect & Engage',
      description: 'Our platform facilitates meaningful connections between companies and qualified candidates.',
      features: ['Direct messaging', 'Interview scheduling', 'Profile analytics'],
      highlightIcon: MessageSquare,
      highlightText: 'Seamless communication'
    },
    {
      icon: CheckCircle,
      title: 'Achieve Success',
      description: 'Complete the hiring process with our tools for interviews, offers, and onboarding.',
      features: ['Offer management', 'Background checks', 'Onboarding support'],
      highlightIcon: Award,
      highlightText: 'Guaranteed satisfaction'
    },
  ];

  const stats = [
    { value: '75%', label: 'Faster Hiring', icon: Clock },
    { value: '95%', label: 'Candidate Quality', icon: TrendingUp },
    { value: '40%', label: 'Cost Reduction', icon: BarChart3 },
    { value: '4.8/5', label: 'User Rating', icon: Award },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-sky-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        {/* <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Streamlined Recruitment Process
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Transform Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Hiring Journey</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A modern, efficient platform designed to connect exceptional talent with forward-thinking companies.
            Our intuitive process saves time while delivering superior results.
          </p>
        </div> */}

        {/* Stats Bar */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-700 font-medium">{stat.label}</p>
            </div>
          ))}
        </div> */}

        {/* Main Process Steps */}
        <div className="max-w-6xl mx-auto">
          {/* Process Timeline */}
          <div className="hidden lg:block relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(activeStep * 100) / (steps.length - 1)}%`, left: 0 }}
            ></div>

            <div className="flex justify-between">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`relative flex flex-col items-center transition-all duration-300 ${index <= activeStep ? 'scale-110' : 'opacity-60'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transform transition-all duration-300 ${index <= activeStep
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -bottom-8 text-sm font-semibold">
                    <span className={index <= activeStep ? 'text-blue-600' : 'text-gray-400'}>
                      Step {index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Steps Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Active Step Details */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  {React.createElement(steps[activeStep].icon, { className: "h-7 w-7 text-white" })}
                </div>
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-2">
                    {React.createElement(steps[activeStep].highlightIcon, { className: "h-3 w-3 mr-1" })}
                    {steps[activeStep].highlightText}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {steps[activeStep].title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {steps[activeStep].description}
              </p>

              <div className="space-y-4 mb-8">
                {steps[activeStep].features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Right Column - Visual Process Flow */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${index === activeStep
                      ? 'border-blue-200 shadow-md'
                      : 'border-gray-100 shadow-sm'
                      }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${index === activeStep
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50'
                        : 'bg-gray-50'
                        }`}>
                        <step.icon className={`h-6 w-6 ${index === activeStep ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Step {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Card */}
              <div className="bg-blue-200 rounded-2xl p-8 text-gray-900">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl">
                    <Zap className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Ready to Get Started?</h4>
                    <p className="text-gray-700 mb-6">
                      Join thousands of companies and candidates already transforming their recruitment experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                        Post a Job
                      </button>
                      <button className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                        Explore Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  );
}