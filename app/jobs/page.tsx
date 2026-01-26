'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Star,
  Bookmark,
  Filter,
  TrendingUp,
  Globe,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  salary: string;
  experience: string;
  postedDate: string;
  isFeatured: boolean;
  isUrgent: boolean;
  tags: string[];
  description: string;
}

const jobTypes = [
  { id: 'all', label: 'Browse Jobs', icon: Briefcase, description: 'Find your next opportunity' },
  { id: 'remote', label: 'Remote Jobs', icon: Globe, description: 'Work from anywhere' },
  { id: 'full-time', label: 'Full-time Jobs', icon: Clock, description: 'Permanent positions' },
  { id: 'part-time', label: 'Part-time Jobs', icon: Users, description: 'Flexible schedules' },
  { id: 'contract', label: 'Contract Jobs', icon: TrendingUp, description: 'Project-based work' },
  { id: 'internship', label: 'Internships', icon: Award, description: 'Entry-level positions' },
];

const filters = {
  experience: ['Entry Level', 'Mid Level', 'Senior', 'Executive'],
  salaryRange: [
    { label: '$30k - $50k', value: '30-50' },
    { label: '$50k - $80k', value: '50-80' },
    { label: '$80k - $120k', value: '80-120' },
    { label: '$120k+', value: '120+' },
  ],
  postedDate: ['Last 24 hours', 'Last 3 days', 'Last week', 'Last month'],
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJobType, setActiveJobType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedSalary, setSelectedSalary] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [activeJobType, searchQuery, location, selectedExperience, selectedSalary, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=6366f1',
          location: 'San Francisco, CA',
          type: 'full-time',
          salary: '$120,000 - $160,000',
          experience: 'Senior',
          postedDate: '2 days ago',
          isFeatured: true,
          isUrgent: true,
          tags: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
          description: 'Join our team to build cutting-edge web applications using modern frontend technologies.'
        },
        {
          id: '2',
          title: 'UX/UI Designer',
          company: 'DesignStudio',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DesignStudio&backgroundColor=10b981',
          location: 'Remote',
          type: 'remote',
          salary: '$90,000 - $120,000',
          experience: 'Mid Level',
          postedDate: '1 day ago',
          isFeatured: true,
          isUrgent: false,
          tags: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'],
          description: 'Create beautiful and intuitive user experiences for our digital products.'
        },
        {
          id: '3',
          title: 'Backend Engineer',
          company: 'DataSystems',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DataSystems&backgroundColor=8b5cf6',
          location: 'New York, NY',
          type: 'full-time',
          salary: '$130,000 - $180,000',
          experience: 'Senior',
          postedDate: '3 days ago',
          isFeatured: false,
          isUrgent: true,
          tags: ['Node.js', 'Python', 'AWS', 'Docker'],
          description: 'Build scalable backend systems and APIs for enterprise applications.'
        },
        {
          id: '4',
          title: 'Marketing Intern',
          company: 'GrowthLab',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GrowthLab&backgroundColor=f59e0b',
          location: 'Austin, TX',
          type: 'internship',
          salary: '$25/hour',
          experience: 'Entry Level',
          postedDate: '1 week ago',
          isFeatured: false,
          isUrgent: false,
          tags: ['Marketing', 'Social Media', 'Content', 'Analytics'],
          description: 'Support our marketing team in executing campaigns and analyzing performance.'
        },
        {
          id: '5',
          title: 'Project Manager',
          company: 'ConsultPro',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=ConsultPro&backgroundColor=ef4444',
          location: 'Chicago, IL',
          type: 'contract',
          salary: '$70 - $100/hour',
          experience: 'Mid Level',
          postedDate: '4 days ago',
          isFeatured: true,
          isUrgent: false,
          tags: ['Agile', 'Scrum', 'Jira', 'Stakeholder Management'],
          description: 'Lead cross-functional teams in delivering complex software projects.'
        },
        {
          id: '6',
          title: 'Data Scientist',
          company: 'AnalyticsAI',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=AnalyticsAI&backgroundColor=3b82f6',
          location: 'Remote',
          type: 'remote',
          salary: '$140,000 - $190,000',
          experience: 'Senior',
          postedDate: '5 days ago',
          isFeatured: true,
          isUrgent: true,
          tags: ['Python', 'ML', 'TensorFlow', 'SQL'],
          description: 'Develop machine learning models and derive insights from complex datasets.'
        },
        {
          id: '7',
          title: 'Customer Support',
          company: 'ServiceFirst',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=ServiceFirst&backgroundColor=06b6d4',
          location: 'Miami, FL',
          type: 'part-time',
          salary: '$25 - $35/hour',
          experience: 'Entry Level',
          postedDate: '2 days ago',
          isFeatured: false,
          isUrgent: false,
          tags: ['Customer Service', 'Communication', 'Zendesk', 'CRM'],
          description: 'Provide exceptional customer support through multiple channels.'
        },
        {
          id: '8',
          title: 'DevOps Engineer',
          company: 'CloudTech',
          companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=CloudTech&backgroundColor=8b5cf6',
          location: 'Seattle, WA',
          type: 'full-time',
          salary: '$130,000 - $170,000',
          experience: 'Senior',
          postedDate: '1 day ago',
          isFeatured: true,
          isUrgent: true,
          tags: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
          description: 'Build and maintain our cloud infrastructure and deployment pipelines.'
        },
      ];
      
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Filter by job type
    if (activeJobType !== 'all') {
      filtered = filtered.filter(job => job.type === activeJobType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(loc)
      );
    }

    // Filter by experience
    if (selectedExperience.length > 0) {
      filtered = filtered.filter(job =>
        selectedExperience.includes(job.experience)
      );
    }

    // Filter by salary (simplified)
    if (selectedSalary.length > 0) {
      filtered = filtered.filter(job => {
        const salary = job.salary;
        return selectedSalary.some(range => {
          if (range === '120+') {
            return parseInt(salary.replace(/[^0-9]/g, '')) > 120000;
          }
          return true;
        });
      });
    }

    setFilteredJobs(filtered);
  };

  const toggleSaveJob = (jobId: string) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
  };

  const clearFilters = () => {
    setActiveJobType('all');
    setSearchQuery('');
    setLocation('');
    setSelectedExperience([]);
    setSelectedSalary([]);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'remote': return 'bg-cyan-100 text-cyan-800';
      case 'internship': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'full-time': return <Clock className="h-4 w-4" />;
      case 'part-time': return <Users className="h-4 w-4" />;
      case 'contract': return <TrendingUp className="h-4 w-4" />;
      case 'remote': return <Globe className="h-4 w-4" />;
      case 'internship': return <Award className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getExperienceColor = (exp: string) => {
    switch (exp) {
      case 'Entry Level': return 'bg-emerald-100 text-emerald-800';
      case 'Mid Level': return 'bg-blue-100 text-blue-800';
      case 'Senior': return 'bg-purple-100 text-purple-800';
      case 'Executive': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-200 via-white to-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-900 text-sm font-medium">
                {filteredJobs.length}+ opportunities available
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Opportunities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover your perfect role with top companies worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Type Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {jobTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveJobType(type.id)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    activeJobType === type.id
                      ? 'bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-100'
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activeJobType === type.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Search Box */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Jobs
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Job title, keyword, or company"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, state, or remote"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                  <div className="space-y-2">
                    {filters.experience.map((exp) => (
                      <label key={exp} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedExperience.includes(exp)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExperience([...selectedExperience, exp]);
                            } else {
                              setSelectedExperience(selectedExperience.filter(e => e !== exp));
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Salary Range</h4>
                  <div className="space-y-2">
                    {filters.salaryRange.map((range) => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSalary.includes(range.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSalary([...selectedSalary, range.value]);
                            } else {
                              setSelectedSalary(selectedSalary.filter(s => s !== range.value));
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {jobTypes.slice(1).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setActiveJobType(type.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeJobType === type.id
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredJobs.length} Jobs Found
                </h2>
                {activeJobType !== 'all' && (
                  <p className="text-gray-600 mt-1">
                    Showing {jobTypes.find(t => t.id === activeJobType)?.label.toLowerCase()}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Most Relevant</option>
                  <option>Newest</option>
                  <option>Salary: High to Low</option>
                  <option>Experience Level</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredJobs.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Jobs List */}
            {!loading && filteredJobs.length > 0 && (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white rounded-xl border transition-all duration-300 hover:shadow-lg ${
                      job.isFeatured
                        ? 'border-l-4 border-l-indigo-500 border-r border-t border-b'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Company Logo */}
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="w-10 h-10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.company)}`;
                              }}
                            />
                          </div>

                          {/* Job Details */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {job.title}
                              </h3>
                              {job.isFeatured && (
                                <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Featured
                                </span>
                              )}
                              {job.isUrgent && (
                                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                  Urgent
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center text-gray-600">
                                <Building className="h-4 w-4 mr-1.5" />
                                <span className="text-sm font-medium">{job.company}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-1.5" />
                                <span className="text-sm">{job.location}</span>
                              </div>
                            </div>

                            {/* Tags and Info */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
                                {getJobTypeIcon(job.type)}
                                <span className="ml-1.5">{job.type.replace('-', ' ')}</span>
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experience)}`}>
                                {job.experience}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {job.salary}
                              </span>
                              {job.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {job.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">
                                Posted {job.postedDate}
                              </div>
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => toggleSaveJob(job.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    savedJobs.has(job.id)
                                      ? 'text-indigo-600 bg-indigo-50'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <Bookmark className="h-5 w-5" />
                                </button>
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                  View Details
                                  <ChevronRight className="h-4 w-4 ml-1.5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredJobs.length > 0 && (
              <div className="mt-8 text-center">
                <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm">
                  <span>Load More Jobs</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Companies */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Companies</h2>
            <Link
              href="/companies"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all companies
              <ExternalLink className="h-4 w-4 ml-1.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Google', 'Microsoft', 'Amazon', 'Apple'].map((company) => (
              <div key={company} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{company}</h3>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 text-amber-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">4.8</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Open positions:</span>
                    <span className="font-medium text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg salary:</span>
                    <span className="font-medium text-gray-900">$145k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}