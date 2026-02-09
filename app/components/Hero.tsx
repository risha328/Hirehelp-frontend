'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  CheckCircle
} from 'lucide-react';
import TypingAnimation from './TypingAnimation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSearch = (e: any) => {
    e.preventDefault();
    console.log({ searchQuery, location, jobType });
  };

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' },
  ];

  const stats = [
    { value: '50K+', label: 'Active Jobs' },
    { value: '10K+', label: 'Companies' },
    { value: '200K+', label: 'Candidates' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-200 via-white to-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Light Blue Gradient Circles */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-cyan-100 rounded-full opacity-50 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your
              <TypingAnimation
                words={['Dream Career', 'Perfect Role', 'Next Opportunity', 'Future Path']}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 pb-2"
                cursorClassName="text-blue-500"
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with innovative companies and discover opportunities that match
              your skills, passion, and career aspirations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg group"
            >
              <span className="text-lg">Get Started Free</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/companies"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
            >
              <Building className="h-5 w-5 mr-2" />
              <span className="text-lg">Browse Companies</span>
            </Link>
          </div>

          {/* Badge */}
          {/* <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                Trusted by 10,000+ companies worldwide
              </span>
            </div>
          </div> */}


          {/* Simple Search Box */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-xl shadow-lg p-1 border border-gray-200">
              <form onSubmit={handleSearch} className="flex items-center">
                {/* Job Title/Keyword */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, keywords, or company"
                      className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border-0 focus:outline-none focus:ring-0 text-base placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300 mx-2"></div>

                {/* Location */}
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, state, or remote"
                      className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border-0 focus:outline-none focus:ring-0 text-base placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300 mx-2"></div>

                {/* Job Type */}
                <div className="flex-1">
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 text-gray-900 bg-white border-0 focus:outline-none focus:ring-0 text-base appearance-none"
                    >
                      {jobTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="ml-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                'Remote Jobs',
                'Full Time',
                '$100k+ Salary',
                'Tech',
                'Startups',
                'Internships'
              ].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {index === 0 && <Briefcase className="h-6 w-6 text-blue-600" />}
                    {index === 1 && <Building className="h-6 w-6 text-blue-600" />}
                    {index === 2 && <Users className="h-6 w-6 text-blue-600" />}
                    {index === 3 && <CheckCircle className="h-6 w-6 text-blue-600" />}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg group"
            >
              <span className="text-lg">Get Started Free</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/companies"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
            >
              <Building className="h-5 w-5 mr-2" />
              <span className="text-lg">Browse Companies</span>
            </Link>
          </div> */}

          {/* Trusted Companies */}
          {/* <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">
                Trusted by industry leaders
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix'].map((company) => (
                  <div key={company} className="text-gray-400 font-bold text-lg hover:text-gray-600 transition-colors">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Scroll Indicator */}
          {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-blue-400 rounded-full mt-2"></div>
              </div>
            </div>
          </div> */}
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
  );
}