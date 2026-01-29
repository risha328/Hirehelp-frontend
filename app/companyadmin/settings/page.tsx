'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  Upload,
  X,
} from 'lucide-react';
import { companiesAPI } from '../../api/companies';

interface CompanyData {
  _id: string;
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  logo?: string;
}

export default function CompanySettingsPage() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyData = await companiesAPI.getMyCompany();
        setCompany(companyData);
      } catch (err) {
        setError('Failed to load company data');
        console.error('Error fetching company:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleCompanyChange = (field: keyof CompanyData, value: string) => {
    if (company) {
      setCompany({ ...company, [field]: value });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!company) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update company profile
      await companiesAPI.updateCompany(company._id, {
        name: company.name,
        description: company.description,
        website: company.website,
        industry: company.industry,
        size: company.size,
        location: company.location,
      });

      // Upload logo if selected
      if (logoFile) {
        await companiesAPI.uploadLogo(logoFile);
        // Refresh company data to get new logo URL
        const updatedCompany = await companiesAPI.getMyCompany();
        setCompany(updatedCompany);
        setLogoFile(null);
        setLogoPreview(null);
      }

      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={company?.name || ''}
            onChange={(e) => handleCompanyChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={company?.website || ''}
            onChange={(e) => handleCompanyChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <input
            type="text"
            value={company?.industry || ''}
            onChange={(e) => handleCompanyChange('industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size
          </label>
          <select
            value={company?.size || ''}
            onChange={(e) => handleCompanyChange('size', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={company?.location || ''}
            onChange={(e) => handleCompanyChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={company?.description || ''}
            onChange={(e) => handleCompanyChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            {logoPreview || company?.logo ? (
              <img
                src={logoPreview || company?.logo}
                alt="Company logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </label>
            {logoFile && (
              <button
                onClick={() => {
                  setLogoFile(null);
                  setLogoPreview(null);
                }}
                className="ml-2 inline-flex items-center px-2 py-1 border border-red-300 rounded text-xs text-red-700 bg-red-50 hover:bg-red-100"
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Upload a square image (PNG, JPG) up to 5MB
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Failed to load company data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-sm text-green-700">{success}</div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderProfileSettings()}
      </div>
    </div>
  );
}
