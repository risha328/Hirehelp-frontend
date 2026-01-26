'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { companiesAPI } from '../api/companies';
import { usersAPI } from '../api/users';

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasCompany, setHasCompany] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    description: '',
    website: '',
    location: '',
    logoUrl: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const industries = [
    'Information Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Marketing & Advertising',
    'Other',
  ];

  const companySizes = [
    '1–10 employees',
    '11–50 employees',
    '51–200 employees',
    '201–500 employees',
    '500+ employees',
  ];

  useEffect(() => {
    // Check if user is logged in and has a company
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      if (payload.companyId) {
        setHasCompany(true);
      }
    } catch (error) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setErrors(prev => ({ ...prev, logo: 'File size must be less than 2MB' }));
        return;
      }
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        setErrors(prev => ({ ...prev, logo: 'Only PNG and JPG files are allowed' }));
        return;
      }
      setLogoFile(file);
      setErrors(prev => ({ ...prev, logo: '' }));
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return '';

    setUploading(true);
    try {
      const result = await companiesAPI.uploadLogo(logoFile);
      return result.logoUrl;
    } catch (error) {
      console.error('Logo upload failed:', error);
      setErrors(prev => ({ ...prev, logo: 'Failed to upload logo' }));
      return '';
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      let logoUrl = '';
      if (logoFile) {
        logoUrl = await uploadLogo();
        if (!logoUrl) {
          setLoading(false);
          return;
        }
      }

      const companyData = {
        ...formData,
        logoUrl,
        ownerId: user.sub,
      };

      await companiesAPI.createCompany(companyData);

      alert('Company created successfully! Your company is pending verification by our team.');
      router.push('/companyadmin');
    } catch (error) {
      console.error('Company creation failed:', error);
      alert('Failed to create company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (hasCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Already Registered</h2>
              <p className="text-gray-600 mb-6">
                You are already associated with a company. Please contact support if you believe this is an error.
              </p>
              <button
                onClick={() => router.push('/companyadmin')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Register Your Company</h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create your company profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. HireHelp Technologies Pvt. Ltd."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            <p className="mt-1 text-xs text-gray-500">Use the official registered name of your organization.</p>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry *
            </label>
            <select
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
          </div>

          {/* Company Size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Company Size *
            </label>
            <select
              id="size"
              name="size"
              required
              value={formData.size}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select company size</option>
              {companySizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
          </div>

          {/* Company Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              About Your Company *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe what your company does, your mission, and what kind of talent you are looking for."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            <p className="mt-1 text-xs text-gray-500">This description will be visible to candidates on job listings.</p>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Company Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://www.yourcompany.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Optional but recommended for verification.</p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Headquarters Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            <p className="mt-1 text-xs text-gray-500">Helps candidates find relevant opportunities.</p>
          </div>

          {/* Company Logo */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Company Logo
            </label>
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleLogoChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
            <p className="mt-1 text-xs text-gray-500">Upload logo (PNG or JPG, max 2MB). A logo increases candidate trust and visibility.</p>
          </div>

          {/* Verification Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">🔒 Company Verification Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    After submission, your company will be reviewed by our team. You can create job drafts, but publishing jobs will be enabled only after verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="text-sm text-gray-600">
            <p>By creating a company, you confirm that you are authorized to represent this organization.</p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Company...' : uploading ? 'Uploading Logo...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
