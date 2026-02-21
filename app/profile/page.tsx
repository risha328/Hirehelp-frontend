'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  Phone,
  Edit,
  Save,
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  Shield,
  Globe,
  MapPin,
  Building,
  Award,
  Link,
  Loader2
} from 'lucide-react';
import { authAPI } from '../api/auth';
import { getFileUrl, API_BASE_URL } from '../api/config';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  role: string;
  gender?: 'MALE' | 'FEMALE';
  phone?: string;
  title?: string;
  company?: string;
  location?: string;
  website?: string;
  bio?: string;
  resumeUrl?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    role: '',
    phone: '',
    title: '',
    company: '',
    location: '',
    website: '',
    bio: '',
  });

  // Resume upload state
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const profileData = await authAPI.getProfile();

      // Transform backend data to match frontend interface
      const userProfile: UserProfile = {
        id: profileData._id || profileData.id,
        name: profileData.name,
        email: profileData.email,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : '',
        role: profileData.role,
        gender: profileData.gender,
        phone: profileData.phone || '',
        title: profileData.title || '',
        company: profileData.company || '',
        location: profileData.location || '',
        website: profileData.website || '',
        bio: profileData.bio || '',
        resumeUrl: profileData.resumeUrl || '',
      };

      setUser(userProfile);
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        role: userProfile.role || '',
        phone: userProfile.phone || '',
        title: userProfile.title || '',
        company: userProfile.company || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        bio: userProfile.bio || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error instanceof Error && error.message.includes('Session expired')) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      const updatedUser: UserProfile = { ...user!, ...formData };
      setUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        phone: user.phone || '',
        title: user.title || '',
        company: user.company || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.bio || '',
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const getAvatarUrl = (gender?: string, name?: string) => {
    const style = gender === 'FEMALE' ? 'micah' : 'avataaars';
    const seed = name || 'user';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=6366f1`;
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'System Administrator';
      case 'COMPANY_ADMIN': return 'Company Administrator';
      case 'CANDIDATE': return ' Candidate';
      case 'RECRUITER': return 'Talent Recruiter';
      default: return role.replace('_', ' ');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800';
      case 'COMPANY_ADMIN': return 'bg-blue-100 text-blue-800';
      case 'CANDIDATE': return 'bg-emerald-100 text-emerald-800';
      case 'RECRUITER': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-white pt-16 lg:pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-white pt-16 lg:pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please log in to access your professional profile.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
          >
            Sign In to Continue
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-white pt-16 lg:pt-20">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading - sits below layout header */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">Manage your professional identity and account settings</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm hover:shadow-md flex-shrink-0"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
              <span className="text-emerald-800 font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-24">
              {/* Profile Header */}
              <div className="relative">
                {/* Background Pattern */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                {/* Profile Image */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                      <img
                        src={getAvatarUrl(user.gender, user.name)}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 shadow-lg hover:bg-indigo-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                {user.title && (
                  <p className="text-gray-600 mt-1">{user.title}</p>
                )}
                {user.company && (
                  <div className="flex items-center justify-center mt-2 text-gray-500">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{user.company}</span>
                  </div>
                )}

                {/* Role Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4 ${getRoleColor(user.role)}`}>
                  <Shield className="h-3 w-3 mr-1.5" />
                  {getRoleDisplayName(user.role)}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">48</div>
                    <div className="text-sm text-gray-500">Applied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-500">Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-500">Offers</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-100 px-6 py-5 space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{formatPhoneNumber(user.phone)}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-4 w-4 mr-3 text-gray-400" />
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  {isEditing && (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-gray-100">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">{user.name}</span>
                        </div>
                      )}
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                            placeholder="Enter your email"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">{user.email}</span>
                        </div>
                      )}
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">
                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Not set'}
                          </span>
                        </div>
                      )}
                      {errors.dateOfBirth && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-gray-100">
                    Your Information
                  </h4>
                  <div className="space-y-6">
                    {/* Job Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="e.g., Senior Frontend Developer"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">{user.title || 'Not specified'}</span>
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="e.g., TechCorp Inc."
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Building className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">{user.company || 'Not specified'}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="e.g., San Francisco, CA"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">{user.location || 'Not specified'}</span>
                        </div>
                      )}
                    </div>

                    {/* Website */}
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                        Website / Portfolio
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Link className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="website"
                            type="text"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.website ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                            placeholder="yourwebsite.com"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Link className="h-5 w-5 text-gray-400 mr-3" />
                          {user.website ? (
                            <a
                              href={`https://${user.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                            >
                              {user.website}
                            </a>
                          ) : (
                            <span className="text-gray-900 font-medium">Not specified</span>
                          )}
                        </div>
                      )}
                      {errors.website && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.website}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={4}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                          placeholder="Describe your professional background, skills, and experience..."
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 leading-relaxed">
                            {user.bio || 'No bio provided. Add a professional bio to showcase your experience.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resume Upload Section */}
                {user.role === 'CANDIDATE' && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-6 pb-3 border-b border-gray-100">
                      Resume
                    </h4>
                    <div className="space-y-4">
                      {user.resumeUrl ? (
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                              <p className="text-xs text-green-600">Click to view or download</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={getFileUrl(user.resumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              View
                            </a>
                            <button
                              onClick={() => setUser({ ...user, resumeUrl: '' })}
                              className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Upload your resume</p>
                              <p className="text-xs text-gray-500">PDF or DOCX files up to 2MB</p>
                            </div>
                            <div className="flex justify-center">
                              <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  // Validate file type
                                  if (!file.name.match(/\.(pdf|docx)$/)) {
                                    setResumeUploadError('Only PDF and DOCX files are allowed');
                                    return;
                                  }

                                  // Validate file size (2MB)
                                  if (file.size > 2 * 1024 * 1024) {
                                    setResumeUploadError('File size must be less than 2MB');
                                    return;
                                  }

                                  setIsUploadingResume(true);
                                  setResumeUploadError('');

                                  try {
                                    const formData = new FormData();
                                    formData.append('resume', file);

                                    const token = localStorage.getItem('access_token');
                                    const response = await fetch(`${API_BASE_URL}/users/upload-resume`, {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${token}`,
                                      },
                                      body: formData,
                                    });

                                    if (!response.ok) {
                                      throw new Error('Upload failed');
                                    }

                                    const result = await response.json();
                                    setUser({ ...user, resumeUrl: result.resumeUrl });
                                    setSuccessMessage('Resume uploaded successfully!');
                                    setTimeout(() => setSuccessMessage(''), 4000);
                                  } catch (error) {
                                    setResumeUploadError('Failed to upload resume. Please try again.');
                                  } finally {
                                    setIsUploadingResume(false);
                                  }
                                }}
                                className="hidden"
                                id="resume-upload"
                                disabled={isUploadingResume}
                              />
                              <label
                                htmlFor="resume-upload"
                                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${isUploadingResume ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                              >
                                {isUploadingResume ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <User className="h-4 w-4 mr-2" />
                                )}
                                {isUploadingResume ? 'Uploading...' : 'Choose File'}
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                      {resumeUploadError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {resumeUploadError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}