'use client';

import { useState, useEffect } from 'react';
import {
  Building,
  Plus,
  Edit,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Search,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  Clock,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { companiesAPI, jobsAPI } from '../../api/companies';
import { usersAPI } from '../../api/users';
import { getFileUrl } from '../../api/config';

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
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface JobsCount {
  [key: string]: number;
}

type FilterStatus = 'all' | 'pending' | 'verified' | 'rejected';

export default function CompaniesPage() {
  // State Management
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [jobsCount, setJobsCount] = useState<JobsCount>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'verified' | 'rejected' | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompanyForView, setSelectedCompanyForView] = useState<Company | null>(null);
  const [companyAdmin, setCompanyAdmin] = useState<CompanyAdmin | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch company admin when view modal opens
  useEffect(() => {
    if (selectedCompanyForView) {
      fetchCompanyAdmin();
    }
  }, [selectedCompanyForView]);

  // Apply filters when companies, search term, or status filter changes
  useEffect(() => {
    applyFilters();
  }, [companies, searchTerm, statusFilter]);

  const fetchCompanyAdmin = async () => {
    if (!selectedCompanyForView) return;

    setLoadingAdmin(true);
    try {
      const users = await usersAPI.getUsersByRole('COMPANYADMIN');
      const admin = users.find((user: any) => user._id === selectedCompanyForView.ownerId);
      setCompanyAdmin(admin || null);
    } catch (error) {
      console.error('Failed to fetch company admin:', error);
      setCompanyAdmin(null);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesData, jobsData] = await Promise.all([
        companiesAPI.getAllCompanies(),
        jobsAPI.getAllJobs(),
      ]);

      setCompanies(companiesData);

      // Count jobs per company
      const countMap: JobsCount = {};
      jobsData.forEach((job: any) => {
        const companyId = typeof job.companyId === 'string' ? job.companyId : job.companyId._id;
        countMap[companyId] = (countMap[companyId] || 0) + 1;
      });
      setJobsCount(countMap);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...companies];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        company =>
          company.name.toLowerCase().includes(term) ||
          (company.industry && company.industry.toLowerCase().includes(term)) ||
          (company.location && company.location.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(company => company.verificationStatus === statusFilter);
    }

    setFilteredCompanies(filtered);
  };

  const handleVerification = async (companyId: string, status: 'verified' | 'rejected') => {
    try {
      if (status === 'verified') {
        await companiesAPI.verifyCompany(companyId);
      } else {
        await companiesAPI.rejectCompany(companyId);
      }
      await fetchData();
      setShowConfirmModal(false);
      setSelectedCompany(null);
      setConfirmAction(null);
    } catch (error) {
      console.error('Failed to update company status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      verified: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };

    const labels = {
      verified: 'Verified',
      rejected: 'Rejected',
      pending: 'Pending Verification'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const openConfirmModal = (company: Company, action: 'verified' | 'rejected') => {
    setSelectedCompany(company);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const openViewModal = (company: Company) => {
    setSelectedCompanyForView(company);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedCompanyForView(null);
    setCompanyAdmin(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and verify company registrations
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>

          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {(['all', 'pending', 'verified', 'rejected'] as FilterStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
            <div className="text-xs text-gray-500">Total Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {companies.filter(c => c.verificationStatus === 'pending').length}
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {companies.filter(c => c.verificationStatus === 'verified').length}
            </div>
            <div className="text-xs text-gray-500">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {companies.filter(c => c.verificationStatus === 'rejected').length}
            </div>
            <div className="text-xs text-gray-500">Rejected</div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                      <span className="ml-2 text-gray-500">Loading companies...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? (
                      <div>
                        <p className="mb-2">No companies match your filters</p>
                        <button
                          onClick={clearFilters}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    ) : (
                      'No companies found'
                    )}
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={company.logoUrl
                              ? getFileUrl(company.logoUrl)
                              : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}&backgroundColor=6366f1`
                            }
                            alt={company.name}
                            className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-xs text-gray-500">ID: {company._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{company.industry || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {jobsCount[company._id] || 0}
                      </div>
                      <div className="text-xs text-gray-500">active jobs</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(company.verificationStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {company.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(company.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openViewModal(company)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {company.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => openConfirmModal(company, 'verified')}
                              className="text-green-400 hover:text-green-600 transition-colors"
                              title="Verify Company"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openConfirmModal(company, 'rejected')}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Reject Company"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        <button
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="More Options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedCompany && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full ${confirmAction === 'verified' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                  {confirmAction === 'verified' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  {confirmAction === 'verified' ? 'Verify Company' : 'Reject Company'}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                {confirmAction === 'verified' ? (
                  <>Are you sure you want to verify <span className="font-semibold">{selectedCompany.name}</span>? This will allow them to post jobs and access all features.</>
                ) : (
                  <>Are you sure you want to reject <span className="font-semibold">{selectedCompany.name}</span>? They will not be able to use the platform.</>
                )}
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedCompany(null);
                    setConfirmAction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerification(selectedCompany._id, confirmAction)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${confirmAction === 'verified'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {confirmAction === 'verified' ? 'Verify Company' : 'Reject Company'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Company Details Modal */}
      {showViewModal && selectedCompanyForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
              </div>
              <button
                onClick={closeViewModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Company Header */}
              <div className="flex items-start space-x-6 mb-8">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  <img
                    src={selectedCompanyForView.logoUrl
                      ? getFileUrl(selectedCompanyForView.logoUrl)
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCompanyForView.name)}&backgroundColor=6366f1`
                    }
                    alt={selectedCompanyForView.name}
                    className="w-20 h-20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCompanyForView.name)}`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {selectedCompanyForView.name}
                      </h1>
                      <p className="text-gray-600">{selectedCompanyForView.industry || 'Industry not specified'}</p>
                    </div>
                    <div>
                      {getStatusBadge(selectedCompanyForView.verificationStatus)}
                    </div>
                  </div>

                  {/* Quick Info Row */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {selectedCompanyForView.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedCompanyForView.location}
                      </div>
                    )}
                    {selectedCompanyForView.size && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedCompanyForView.size} employees
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {jobsCount[selectedCompanyForView._id] || 0} active jobs
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {formatDate(selectedCompanyForView.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Company Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  {selectedCompanyForView.description && (
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedCompanyForView.description}</p>
                    </div>
                  )}

                  {/* Company Information */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Company ID</p>
                        <p className="text-sm font-mono">{selectedCompanyForView._id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Industry</p>
                        <p className="text-sm">{selectedCompanyForView.industry || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Company Size</p>
                        <p className="text-sm">{selectedCompanyForView.size || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="text-sm">{selectedCompanyForView.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        {selectedCompanyForView.website ? (
                          <a
                            href={selectedCompanyForView.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            {selectedCompanyForView.website}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">Not specified</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                        <p className="text-sm">{formatDate(selectedCompanyForView.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Admin & Stats */}
                <div className="space-y-6">
                  {/* Company Admin */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Administrator</h3>
                    {loadingAdmin ? (
                      <div className="flex justify-center py-4">
                        <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                      </div>
                    ) : companyAdmin ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{companyAdmin.name}</p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            <a href={`mailto:${companyAdmin.email}`} className="hover:text-blue-600">
                              {companyAdmin.email}
                            </a>
                          </div>
                          {companyAdmin.phone && (
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              <a href={`tel:${companyAdmin.phone}`} className="hover:text-blue-600">
                                {companyAdmin.phone}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">Role: {companyAdmin.role}</p>
                          <p className="text-xs text-gray-500 mt-1">Admin ID: {companyAdmin._id.slice(-8)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No admin information available</p>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Jobs Posted</span>
                        <span className="text-lg font-semibold text-gray-900">{jobsCount[selectedCompanyForView._id] || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Jobs</span>
                        <span className="text-lg font-semibold text-green-600">{jobsCount[selectedCompanyForView._id] || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Age</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.floor((new Date().getTime() - new Date(selectedCompanyForView.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {selectedCompanyForView.verificationStatus === 'pending' && (
                    <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                      <h3 className="text-sm font-semibold text-yellow-800 mb-3">Pending Verification</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            closeViewModal();
                            openConfirmModal(selectedCompanyForView, 'verified');
                          }}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Verify Company
                        </button>
                        <button
                          onClick={() => {
                            closeViewModal();
                            openConfirmModal(selectedCompanyForView, 'rejected');
                          }}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Reject Company
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}