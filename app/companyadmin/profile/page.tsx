'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Users
} from 'lucide-react';
import { companiesAPI } from '../../api/companies';
import { API_BASE_URL } from '../../api/config';
import EditCompanyModal from '../../components/EditCompanyModal';
import RegisterCompanyModal from '../../components/RegisterCompanyModal';

export default function CompanyProfilePage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await companiesAPI.getMyCompany();
      setCompany(response.company);
      if (response.company) {
        try {
          const adminsResponse = await companiesAPI.getCompanyAdmins(response.company._id);
          setAdmins(adminsResponse);
        } catch (adminError) {
          console.error('Failed to fetch admins:', adminError);
        }
      }
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          label: 'Verified',
          color: 'bg-emerald-100 text-emerald-800',
          icon: CheckCircle,
          description: 'Your company is fully verified and active'
        };
      case 'pending':
        return {
          label: 'Under Review',
          color: 'bg-amber-100 text-amber-800',
          icon: Clock,
          description: 'Your company is being reviewed by our team'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          description: 'Please update your company information'
        };
      default:
        return {
          label: 'Not Registered',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          description: 'Register your company to get started'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Company Found</h2>
          <p className="text-gray-600 mb-8">
            You haven't registered a company yet. Register your company to access the profile.
          </p>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Register Your Company
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getVerificationStatus(company.verificationStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
              <p className="mt-2 text-gray-600">
                Manage your company information and settings
              </p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Company Status Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start space-x-4 mb-6 lg:mb-0">
                  {/* Company Logo */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                      {company.logoUrl ? (
                        <img
                          src={`${API_BASE_URL}${company.logoUrl}`}
                          alt={company.name}
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <Building className="h-10 w-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className={`p-1.5 rounded-full ${statusInfo.color} border-2 border-white`}>
                        <statusInfo.icon className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <statusInfo.icon className="h-3 w-3 mr-1.5" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-white/90 mb-3">{company.industry} • {company.size}</p>
                    <p className="text-white/80 text-sm">{statusInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Basic Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Company Name</div>
                <div className="text-sm font-medium text-gray-900">{company.name}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Industry</div>
                <div className="text-sm font-medium text-gray-900">{company.industry}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Company Size</div>
                <div className="text-sm font-medium text-gray-900">{company.size}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Description</div>
                <p className="text-sm text-gray-700">{company.description}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Contact Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-sm font-medium text-gray-900">{company.location}</div>
                </div>
              </div>

              {company.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-500">Website</div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}

              {company.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium text-gray-900">{company.email}</div>
                  </div>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="text-sm font-medium text-gray-900">{company.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Company Admins */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Company Admins</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins && admins.length > 0 ? (
                admins.map((admin) => (
                  <div key={admin._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{admin.name}</div>
                        <div className="text-xs text-gray-500">{admin.role.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="truncate">{admin.email}</span>
                      </div>
                      {admin.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2 text-gray-400" />
                          <span>{admin.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No other admins found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      <EditCompanyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          fetchCompany();
          setShowEditModal(false);
        }}
      />

      {/* Register Company Modal */}
      <RegisterCompanyModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          fetchCompany();
          setShowRegisterModal(false);
        }}
      />
    </div>
  );
}
