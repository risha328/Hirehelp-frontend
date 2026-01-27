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
  X
} from 'lucide-react';
import { companiesAPI, jobsAPI } from '../../api/companies';
import { usersAPI } from '../../api/users';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [jobsCount, setJobsCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'verified' | 'rejected' | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [viewModal, setViewModal] = useState(false);
  const [selectedCompanyForView, setSelectedCompanyForView] = useState<any>(null);
  const [companyAdmin, setCompanyAdmin] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCompanyForView) {
      fetchCompanyAdmin();
    }
  }, [selectedCompanyForView]);

  const fetchCompanyAdmin = async () => {
    if (!selectedCompanyForView) return;
    try {
      const users = await usersAPI.getUsersByRole('COMPANYADMIN');
      const admin = users.find((user: any) => user._id === selectedCompanyForView.ownerId);
      setCompanyAdmin(admin || null);
    } catch (error) {
      console.error('Failed to fetch company admin:', error);
      setCompanyAdmin(null);
    }
  };

  const fetchData = async () => {
    try {
      const [companiesData, jobsData] = await Promise.all([
        companiesAPI.getAllCompanies(),
        jobsAPI.getAllJobs(),
      ]);

      setCompanies(companiesData);

      // Count jobs per company
      const countMap: Record<string, number> = {};
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

  const handleVerification = async (companyId: string, status: 'verified' | 'rejected') => {
    try {
      if (status === 'verified') {
        await companiesAPI.verifyCompany(companyId);
      } else {
        await companiesAPI.rejectCompany(companyId);
      }
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to update company status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading companies...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No companies found
                  </td>
                </tr>
              ) : (
                companies.map((company: any) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{company.industry || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jobsCount[company._id] || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        company.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {company.verificationStatus === 'verified' ? 'Verified' :
                         company.verificationStatus === 'rejected' ? 'Rejected' :
                         'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCompanyForView(company);
                            setViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Company Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {company.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedCompany(company);
                                setModalAction('verified');
                                setShowModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Verify Company"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCompany(company);
                                setModalAction('rejected');
                                setShowModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Company"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
      {showModal && selectedCompany && modalAction && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {modalAction === 'verified' ? 'verify' : 'reject'} the company "{selectedCompany.name}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={async () => {
                  if (selectedCompany && modalAction) {
                    await handleVerification(selectedCompany._id, modalAction);
                    setShowModal(false);
                    setSelectedCompany(null);
                    setModalAction(null);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  modalAction === 'verified'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Company Details Modal */}
      {viewModal && selectedCompanyForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Company Details</h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedCompanyForView(null);
                  setCompanyAdmin(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Header */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  <img
                    src={selectedCompanyForView.logoUrl
                      ? `${process.env.NEXT_PUBLIC_API_URL}${selectedCompanyForView.logoUrl}`
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCompanyForView.name)}&backgroundColor=6366f1`
                    }
                    alt={selectedCompanyForView.name}
                    className="w-14 h-14"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCompanyForView.name)}`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCompanyForView.name}</h1>
                  <p className="text-gray-600">{selectedCompanyForView.industry || 'Industry not specified'}</p>
                </div>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{selectedCompanyForView.size || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedCompanyForView.location || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Website:</span>
                        <span className="font-medium">
                          {selectedCompanyForView.website ? (
                            <a href={selectedCompanyForView.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedCompanyForView.website}
                            </a>
                          ) : 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          selectedCompanyForView.verificationStatus === 'verified' ? 'text-green-600' :
                          selectedCompanyForView.verificationStatus === 'rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {selectedCompanyForView.verificationStatus === 'verified' ? 'Verified' :
                           selectedCompanyForView.verificationStatus === 'rejected' ? 'Rejected' :
                           'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{new Date(selectedCompanyForView.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Admin</h3>
                    {companyAdmin ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{companyAdmin.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{companyAdmin.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className="font-medium">{companyAdmin.role}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Loading admin details...</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Jobs:</span>
                        <span className="font-medium">{jobsCount[selectedCompanyForView._id] || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedCompanyForView.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedCompanyForView.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
