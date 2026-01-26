'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { companiesAPI } from '../api/companies';

export default function CompanyAdminPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await companiesAPI.getMyCompany();
        setCompany(companyData);
      } catch (error) {
        console.error('Failed to fetch company:', error);
        // Company not found or not registered yet
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {company ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-4">
            {company.logoUrl && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
                alt={`${company.name} logo`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-gray-600">{company.industry} • {company.size}</p>
              <p className="text-sm text-gray-500">Verification Status: {company.verificationStatus}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{company.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {company.website && (
              <div>
                <span className="font-medium">Website:</span> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
              </div>
            )}
            <div>
              <span className="font-medium">Location:</span> {company.location}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Company Admin</h2>
          <p className="text-gray-600 mb-4">
            You haven't registered a company yet. Register your company to start managing your hiring process.
          </p>
          <button
            onClick={() => router.push('/companies')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register Your Company
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500 mt-1">Posted this month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-gray-500 mt-1">Across all jobs</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Members</h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
          <p className="text-sm text-gray-500 mt-1">Active recruiters</p>
        </div>
      </div>
    </div>
  );
}
