'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Building,
  Users,
  Briefcase,
  CheckCircle,
  Filter,
  X,
  Grid3x3,
  List,
  Sparkles,
  ArrowRight,
  Eye,
  Globe
} from 'lucide-react';
import { companiesAPI } from '../api/companies';
import Footer from '../components/Footer';

interface Company {
  _id: string;
  name: string;
  industry: string;
  size?: string;
  location?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  jobsCount?: number;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'newest' | 'verified';

export default function CompaniesPage() {
  const router = useRouter();

  // State Management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const industries = [
    'Information Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Marketing & Advertising',
    'Other'
  ];

  const companySizes = [
    '1–10 employees',
    '11–50 employees',
    '51–200 employees',
    '201–500 employees',
    '500+ employees'
  ];

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [companies, searchTerm, selectedIndustries, selectedSizes, verifiedOnly, sortBy]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await companiesAPI.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...companies];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        company =>
          company.name.toLowerCase().includes(term) ||
          (company.industry && company.industry.toLowerCase().includes(term)) ||
          (company.location && company.location.toLowerCase().includes(term))
      );
    }

    // Industry filter
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(company =>
        selectedIndustries.includes(company.industry)
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(company =>
        company.size && selectedSizes.includes(company.size)
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      filtered = filtered.filter(company => company.verificationStatus === 'verified');
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'verified':
          if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
          if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
          return 0;
        default:
          return 0;
      }
    });

    setFilteredCompanies(filtered);
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustries([]);
    setSelectedSizes([]);
    setVerifiedOnly(false);
  };

  const stats = [
    { value: companies.length.toString(), label: 'Total Companies', icon: Building },
    { value: industries.length.toString(), label: 'Industries', icon: Briefcase },
    { value: companies.filter(c => c.verificationStatus === 'verified').length.toString(), label: 'Verified', icon: CheckCircle },
    { value: new Set(companies.map(c => c.location)).size.toString(), label: 'Locations', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-white to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-white">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 -left-20 w-[600px] h-[600px] bg-white/20 rounded-full mix-blend-soft-light filter blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 -right-20 w-[600px] h-[600px] bg-sky-200/20 rounded-full mix-blend-soft-light filter blur-[120px]"
          />
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md mb-8 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Discover Top Companies
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Explore Leading
              <span className="block bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                Companies
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
            >
              Connect with innovative organizations hiring top talent across industries
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies by name, industry, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 placeholder-gray-500 shadow-lg"
                />
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 text-center"
                >
                  <div className="flex justify-center mb-2">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(selectedIndustries.length > 0 || selectedSizes.length > 0 || verifiedOnly) && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {selectedIndustries.length + selectedSizes.length + (verifiedOnly ? 1 : 0)}
                  </span>
                )}
              </button>

              {verifiedOnly && (
                <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Only
                  <button onClick={() => setVerifiedOnly(false)} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {(selectedIndustries.length > 0 || selectedSizes.length > 0 || verifiedOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="newest">Newest First</option>
                <option value="verified">Verified First</option>
              </select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {industries.map(industry => (
                    <label key={industry} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIndustries.includes(industry)}
                        onChange={() => toggleIndustry(industry)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {companySizes.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show verified only</span>
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
          </p>
        </div>

        {/* Companies Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedIndustries.length > 0 || selectedSizes.length > 0 || verifiedOnly
                ? 'Try adjusting your filters or search term'
                : 'No companies are currently registered'}
            </p>
            {(searchTerm || selectedIndustries.length > 0 || selectedSizes.length > 0 || verifiedOnly) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${viewMode === 'list' ? 'flex items-center p-6' : 'p-6'}`}
              >
                <div className={viewMode === 'list' ? 'flex items-center flex-1 gap-6' : ''}>
                  {/* Company Logo */}
                  <div className={viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100">
                      <img
                        src={company.logoUrl
                          ? `${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`
                          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}&backgroundColor=6366f1`
                        }
                        alt={company.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Company Name & Verification */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      {company.verificationStatus === 'verified' && (
                        <div className="flex-shrink-0 ml-2" title="Verified Company">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>

                    {/* Industry Tag */}
                    {company.industry && (
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-3">
                        {company.industry}
                      </span>
                    )}

                    {/* Company Info */}
                    <div className="space-y-2 mb-4">
                      {company.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          {company.location}
                        </div>
                      )}
                      {company.size && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          {company.size}
                        </div>
                      )}
                      {company.jobsCount !== undefined && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                          {company.jobsCount} active {company.jobsCount === 1 ? 'job' : 'jobs'}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {company.description && viewMode === 'grid' && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {company.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* View Details Button */}
                <div className={viewMode === 'list' ? 'flex-shrink-0 ml-6' : 'mt-4'}>
                  <button
                    onClick={() => router.push(`/companies/${company._id}`)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
