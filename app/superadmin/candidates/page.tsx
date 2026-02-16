'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import CandidateDetailsModal from '../../components/superadmin/CandidateDetailsModal';
import { usersAPI } from '../../api/users';

interface Candidate {
  _id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  dateOfBirth: string;
  gender?: string;
  phone?: string;
  title?: string;
  company?: string;
  companyId?: string;
  location?: string;
  website?: string;
  bio?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
  skills?: string[];
  experience?: number;
  education?: string;
  status?: 'active' | 'inactive' | 'interviewing';
}

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');

  // Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      router.push('/auth/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await usersAPI.getUsersByRole('CANDIDATE');
        // Enrich with mock data for demo
        const enrichedData = data.map((candidate: any, index: number) => ({
          ...candidate,
          skills: ['React', 'TypeScript', 'Node.js', 'AWS'].slice(0, 2 + index % 3),
          experience: [1, 2, 3, 5, 8][index % 5],
          education: ['BSc Computer Science', 'MSc Software Engineering', 'BEng'][index % 3],
          status: ['active', 'inactive', 'interviewing'][index % 3] as 'active' | 'inactive' | 'interviewing',
        }));
        setCandidates(enrichedData);
        setFilteredCandidates(enrichedData);
      } catch (err: any) {
        console.error('Failed to fetch candidates:', err);
        if (err.message.includes('Session expired') || err.message.includes('No access token')) {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [router]);

  useEffect(() => {
    let results = [...candidates];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        candidate.title?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(candidate => candidate.status === statusFilter);
    }

    // Apply experience filter
    if (experienceFilter !== 'all') {
      const minExp = parseInt(experienceFilter);
      results = results.filter(candidate =>
        candidate.experience && candidate.experience >= minExp
      );
    }

    setFilteredCandidates(results);
  }, [searchQuery, statusFilter, experienceFilter, candidates]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'interviewing': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case 'active': return <CheckCircle className="h-3 w-3 mr-1" />;
  //     case 'interviewing': return <TrendingUp className="h-3 w-3 mr-1" />;
  //     case 'inactive': return <XCircle className="h-3 w-3 mr-1" />;
  //     default: return null;
  //   }
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      {/* Header */}
      <div className="">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                  <p className="text-gray-600 mt-1">
                    Manage and review all candidate profiles in your organization
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </button> */}
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates by name, email, skills, or role..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            {/* <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="interviewing">Interviewing</option>
                <option value="inactive">Inactive</option>
              </select>
            </div> */}

            {/* Experience Filter */}
            {/* <div>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="all">All Experience</option>
                <option value="1">1+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
                <option value="8">8+ years</option>
              </select>
            </div> */}
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <span className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCandidates.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{candidates.length}</span> candidates
              </span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Interviewing</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Inactive</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* No Results */}
            {filteredCandidates.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setExperienceFilter('all');
                  }}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Candidates Table */}
            {filteredCandidates.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Skills
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th> */}
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member Since
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-sm">
                                  <span className="text-lg font-bold text-indigo-600">
                                    {candidate.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                  {candidate.name}
                                  {candidate.emailVerified && (
                                    <Shield className="h-4 w-4 text-emerald-500 ml-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.email}</div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.title || 'Not specified'}</div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills?.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills && candidate.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                                  +{candidate.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.experience} years</div>
                          </td> */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status || 'inactive')}`}>
                              {getStatusIcon(candidate.status || 'inactive')}
                              <span className="ml-1 capitalize">{candidate.status || 'inactive'}</span>
                            </span>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(candidate.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => handleViewCandidate(candidate)}
                              >
                                <Eye className="h-4 w-4 cursor-pointer" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Load More */}
            {/* {filteredCandidates.length > 0 && (
              <div className="mt-12 text-center">
                <button className="inline-flex items-center px-8 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm">
                  <span>Load More Candidates</span>
                  <TrendingUp className="h-4 w-4 ml-2" />
                </button>
              </div>
            )} */}
          </>
        )}

        {/* Quick Stats */}
        {/* {!loading && candidates.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
                <div className="text-gray-600">Total Candidates</div>
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.status === 'active').length}
                </div>
                <div className="text-gray-600">Active Candidates</div>
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.status === 'interviewing').length}
                </div>
                <div className="text-gray-600">In Interview Process</div>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(candidates.reduce((acc, c) => acc + (c.experience || 0), 0) / candidates.length * 10) / 10}
                </div>
                <div className="text-gray-600">Avg. Experience (years)</div>
                <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2"></div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      <CandidateDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        candidate={selectedCandidate} 
      />
    </div>
  );
}