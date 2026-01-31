'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Shield,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { authAPI } from '../../api/auth';

export default function SuperAdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return {
          label: 'Super Admin',
          color: 'bg-purple-100 text-purple-800',
          icon: Shield,
          description: 'Full platform administration access'
        };
      case 'COMPANYADMIN':
        return {
          label: 'Company Admin',
          color: 'bg-blue-100 text-blue-800',
          icon: User,
          description: 'Company management access'
        };
      case 'CANDIDATE':
        return {
          label: 'Candidate',
          color: 'bg-green-100 text-green-800',
          icon: User,
          description: 'Job seeker access'
        };
      default:
        return {
          label: 'User',
          color: 'bg-gray-100 text-gray-800',
          icon: User,
          description: 'Standard user access'
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
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-8">
            Unable to load your profile. Please try logging in again.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleDisplay(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="mt-2 text-gray-600">
                Manage your account information and settings
              </p>
            </div>
            <button
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* User Status Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start space-x-4 mb-6 lg:mb-0">
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className={`p-1.5 rounded-full ${roleInfo.color} border-2 border-white`}>
                        <roleInfo.icon className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`}>
                        <roleInfo.icon className="h-3 w-3 mr-1.5" />
                        {roleInfo.label}
                      </span>
                    </div>
                    <p className="text-white/90 mb-3">{user.email}</p>
                    <p className="text-white/80 text-sm">{roleInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Basic Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Full Name</div>
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Email Address</div>
                <div className="text-sm font-medium text-gray-900">{user.email}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Role</div>
                <div className="text-sm font-medium text-gray-900">{roleInfo.label}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">User ID</div>
                <div className="text-sm font-medium text-gray-900">{user.id}</div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Account Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Account Status</div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Active</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Last Login</div>
                <div className="text-sm font-medium text-gray-900">Recent</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Account Created</div>
                <div className="text-sm font-medium text-gray-900">Date not available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
