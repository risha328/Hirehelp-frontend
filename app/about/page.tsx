'use client';

import {
  Users,
  Target,
  Award,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Globe,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Building
} from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect exceptional talent with innovative companies, creating meaningful career opportunities that drive growth and success.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Our Passion',
      description: 'We believe every professional deserves to find work they love, and every company deserves access to the best talent.',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Our Integrity',
      description: 'Building trust through transparency, fairness, and ethical practices in every connection we facilitate.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to create seamless, intelligent matching between candidates and opportunities.',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const milestones = [
    { year: '2020', event: 'HireHelp founded with a vision to transform recruitment' },
    { year: '2021', event: 'Launched AI-powered matching algorithm' },
    { year: '2022', event: 'Expanded to 50+ countries worldwide' },
    { year: '2023', event: 'Reached 1 million successful placements' },
    { year: '2024', event: 'Named one of Fast Company\'s Most Innovative Companies' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former tech executive with 15+ years in HR technology',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=6366f1'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      bio: 'AI and machine learning expert from Stanford',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=10b981'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Talent',
      bio: 'Former LinkedIn Talent Solutions leader',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=8b5cf6'
    },
    {
      name: 'James Wilson',
      role: 'VP of Partnerships',
      bio: 'Ex-Google business development executive',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=f59e0b'
    }
  ];

  const stats = [
    { value: '1M+', label: 'Successful Placements', icon: Users },
    { value: '50K+', label: 'Companies Trust Us', icon: Building },
    { value: '95%', label: 'Satisfaction Rate', icon: Star },
    { value: '24h', label: 'Average Response Time', icon: Clock }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Profile',
      description: 'Build a comprehensive profile showcasing your skills, experience, and career goals.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      step: '2',
      title: 'Smart Matching',
      description: 'Our AI algorithm matches you with opportunities that align with your profile and preferences.',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      step: '3',
      title: 'Quality Connections',
      description: 'Connect directly with hiring managers and companies that fit your career path.',
      color: 'bg-emerald-50 border-emerald-200'
    },
    {
      step: '4',
      title: 'Career Growth',
      description: 'Receive guidance, feedback, and support throughout your job search journey.',
      color: 'bg-amber-50 border-amber-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-200 via-white to-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-900 text-sm font-medium">
                Transforming Careers Since 2020
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                HireHelp
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              We're redefining how talent and opportunity connect. Through innovative technology
              and human-centered design, we're building the world's most effective platform
              for career growth and talent acquisition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group"
              >
                <span className="text-lg">Explore Opportunities</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/companies"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300"
              >
                <span className="text-lg">For Employers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-24 md:h-32 text-white"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,138.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-200 to-white-500 rounded-xl">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Our Story */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Founded in 2020, HireHelp began with a simple observation: the traditional job search
              process was broken for both candidates and employers. We set out to build something better.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-xl"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">From Vision to Reality</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our founder, Sarah Chen, experienced firsthand the challenges of finding meaningful
                    work and hiring exceptional talent. After 15 years in HR technology, she realized
                    that what the industry needed wasn't another job board, but a smarter, more human
                    approach to career connections.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Today, HireHelp combines cutting-edge AI with deep human insight to create
                    meaningful connections that transform careers and businesses.
                  </p>
                  <div className="flex items-center text-indigo-600 font-medium">
                    <span>Learn more about our journey</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{milestone.year}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <h4 className="text-lg font-semibold text-gray-900">{milestone.event}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              These principles guide everything we do at HireHelp, from product development
              to customer support and company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-to-r opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How HireHelp Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Our platform is designed to make your career journey seamless and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className={`relative ${step.color} rounded-2xl border p-8 group hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-gray-900">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              A diverse team of innovators, thinkers, and problem-solvers dedicated to
              transforming the future of work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Impact */}
        <div className="mb-24">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-16">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Globe className="h-4 w-4 text-white mr-2" />
                  <span className="text-white text-sm font-medium">
                    Global Impact
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Building Connections Worldwide
                </h2>
                <p className="text-white/90 mb-8 leading-relaxed">
                  With operations in 50+ countries and support for 20+ languages, HireHelp
                  is truly global. We're proud to connect talent and opportunity across
                  borders, time zones, and cultures.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Remote Work Advocacy', 'Diversity & Inclusion', 'Sustainable Hiring', 'Community Growth'].map((item) => (
                    <div key={item} className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                      <CheckCircle className="h-4 w-4 text-white mr-2" />
                      <span className="text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[400px] bg-gradient-to-br from-blue-400 to-cyan-400">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                      <TrendingUp className="h-16 w-16 text-white" />
                    </div>
                    <div className="text-white text-4xl font-bold">50+</div>
                    <div className="text-white/90 mt-2">Countries Served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-10 blur-xl"></div>
            <div className="relative bg-white rounded-2xl p-12 border border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Career or Business?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals and companies who trust HireHelp for their
                career and talent needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group"
                >
                  <span className="text-lg">Start Your Journey</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300"
                >
                  <span className="text-lg">Contact Our Team</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}