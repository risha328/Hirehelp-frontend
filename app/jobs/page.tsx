'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { jobsAPI, companiesAPI } from '../api/companies';
import { getFileUrl } from '../api/config';
import Footer from '../components/Footer';

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
  applicationDeadline?: string;
}

interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  website?: string;
  size?: string;
  location?: string;
  rating?: number;
  openJobs?: number;
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

function JobsPageContent() {
  const searchParams = useSearchParams();
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
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Read query parameter on mount and when it changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      // Map URL parameter to job type
      const jobTypeMap: { [key: string]: string } = {
        'remote': 'remote',
        'full-time': 'full-time',
        'part-time': 'part-time',
        'contract': 'contract',
        'internship': 'internship'
      };
      
      if (jobTypeMap[typeParam]) {
        setActiveJobType(jobTypeMap[typeParam]);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFeaturedCompanies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeJobType, searchQuery, location]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchJobs uses currentPage, activeJobType, searchQuery, location from closure
  }, [currentPage, activeJobType, searchQuery, location]);

  useEffect(() => {
    filterJobs();
  }, [selectedExperience, selectedSalary, jobs]);

  const transformJob = (job: any): Job => {
    const company = job.companyId || job.company;
    const companyName = company?.name ?? 'Company';
    const logoUrl = company?.logoUrl ?? '';
    const logoResolved = getFileUrl(logoUrl || undefined);
    // Fallback initials: use company name only if it's real; else job title/id so we don't show "CO" (from "Company")
    const initialsSeed = (companyName && companyName.trim() !== '' && companyName !== 'Company')
      ? companyName
      : (job.title || job._id || 'Job');
    return {
    id: job._id,
    title: job.title,
    company: companyName,
    companyLogo: logoResolved || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initialsSeed)}&backgroundColor=6366f1`,
    location: job.location,
    type: job.jobType || 'full-time',
    salary: job.salary || 'Salary not specified',
    experience: job.experienceLevel || 'Not specified',
    postedDate: new Date(job.createdAt).toLocaleDateString(),
    isFeatured: false,
    isUrgent: false,
    tags: job.skills || [],
    description: job.description,
    applicationDeadline: job.applicationDeadline,
  };
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getJobsPaginated({
        page: currentPage,
        limit: 10,
        jobType: activeJobType !== 'all' ? activeJobType : undefined,
        search: searchQuery.trim() || undefined,
        location: location.trim() || undefined,
      });
      const transformedJobs: Job[] = (res.data || []).map(transformJob);
      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
      setTotalJobs(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
      setFilteredJobs([]);
      setTotalJobs(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const companiesData = await companiesAPI.getFeaturedCompanies();
      setFeaturedCompanies(companiesData);
    } catch (error) {
      console.error('Failed to fetch featured companies:', error);
      setFeaturedCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];
    if (selectedExperience.length > 0) {
      filtered = filtered.filter(job => selectedExperience.includes(job.experience));
    }
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

  // Full Page Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white">
        {/* Hero Section Skeleton */}
        <div className="relative bg-gradient-to-b from-blue-200 via-white to-white">
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
          <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full mb-6 animate-pulse">
                <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>
              <div className="h-12 w-96 bg-gray-300 rounded-lg mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 w-2/3 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Job Type Navigation Skeleton */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Search Box Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 animate-pulse">
                  <div className="space-y-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-28 mb-3"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List Skeleton */}
            <div className="lg:col-span-3">
              {/* Results Header Skeleton */}
              <div className="flex items-center justify-between mb-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-40"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
              </div>

              {/* Job Cards Skeleton */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex items-center space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-28"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="flex items-center justify-between">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-9 bg-gray-200 rounded-lg w-32"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Companies Skeleton */}
          <div className="mt-20 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-pulse">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-64 ml-12"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse shadow-sm">
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-200 via-white to-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-900 text-sm font-medium">
                {totalJobs > 0 ? `${totalJobs} opportunity${totalJobs !== 1 ? 'ies' : ''} available` : 'Loading opportunities...'}
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

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Type Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {jobTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveJobType(type.id)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${activeJobType === type.id
                    ? 'bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-100'
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${activeJobType === type.id
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
                    <label className="block text-base font-semibold text-gray-900 mb-2">
                      Search Jobs
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Job title, keyword, or company"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-900 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, state, or remote"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeJobType === type.id
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
                  {totalJobs} Job{totalJobs !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600 mt-1">
                  {totalJobs > 0
                    ? `Showing ${((currentPage - 1) * 10) + 1}–${Math.min(currentPage * 10, totalJobs)} of ${totalJobs}`
                    : 'No jobs match your filters'}
                </p>
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
                    className={`bg-white rounded-xl border transition-all duration-300 hover:shadow-lg ${job.isFeatured
                      ? 'border-l-4 border-l-indigo-500 border-r border-t border-b'
                      : 'border-gray-200'
                      } ${job.applicationDeadline && new Date(job.applicationDeadline) < new Date() ? 'opacity-75 grayscale' : ''}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Company Logo */}
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="w-10 h-10 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('dicebear')) return;
                                const fallbackSeed = (job.company && job.company.trim() !== '' && job.company !== 'Company')
                                  ? job.company
                                  : (job.title || job.id || 'Job');
                                target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fallbackSeed)}&backgroundColor=6366f1`;
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
                              {job.applicationDeadline && new Date(job.applicationDeadline) < new Date() && (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                  <AlertCircle className="h-3 w-3 mr-1 text-gray-500" />
                                  Deadline Crossed
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
                                  className={`p-2 rounded-lg transition-colors ${savedJobs.has(job.id)
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

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((p, idx, arr) => (
                      <span key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-2 text-gray-400">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-[2.25rem] py-2 px-2 rounded-lg font-medium transition-colors ${
                            currentPage === p
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Companies */}
        <div className="mt-20 mb-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Companies</h2>
              </div>
              <p className="text-gray-600 ml-12 text-sm sm:text-base">
                Discover top employers actively hiring and verified by our team
              </p>
            </div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 shadow-sm"
            >
              View all companies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingCompanies ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse shadow-sm">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCompanies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No featured companies</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back later for featured companies. We're constantly adding new verified employers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCompanies.map((company, index) => (
                <Link
                  key={company._id}
                  href={`/companies/${company._id}`}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Verified Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">Verified</span>
                    </div>
                  </div>

                  {/* Company Logo */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 group-hover:border-indigo-300 transition-colors shadow-sm group-hover:shadow-md">
                        {company.logoUrl ? (
                          <img
                            src={getFileUrl(company.logoUrl)}
                            alt={company.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}&backgroundColor=6366f1`;
                            }}
                          />
                        ) : (
                          <Building className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-indigo-600 transition-colors mb-1 line-clamp-2">
                      {company.name}
                    </h3>

                    {/* Rating */}
                    {company.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= Math.round(company.rating || 0)
                                  ? 'text-amber-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600 ml-1">
                          {(company.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Company Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {company.industry && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-1">{company.industry}</span>
                      </div>
                    )}
                    {company.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-1">{company.location}</span>
                      </div>
                    )}
                    
                    {/* Open Jobs CTA */}
                    {company.openJobs !== undefined && company.openJobs > 0 && (
                      <div className="pt-3 mt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Open positions</span>
                          <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                            {company.openJobs}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-indigo-600 font-medium group-hover:gap-2 transition-all">
                          <span>View jobs</span>
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    }>
      <JobsPageContent />
    </Suspense>
  );
}