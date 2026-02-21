'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  X,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MessageSquare,
  Link as LinkIcon,
  Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { publicJobsAPI } from '../../api/jobs';
import { applicationsAPI } from '../../api/applications';
import { getFileUrl } from '../../api/config';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: string;
  createdAt: string;
  companyId: {
    _id: string;
    name: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    industry?: string;
    size?: string;
  };
  applicationDeadline?: string;
}

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  companyId: string;
  jobTitle: string;
  onSuccess: () => void;
}

function ApplyModal({ isOpen, onClose, jobId, companyId, jobTitle, onSuccess }: ApplyModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    portfolioUrl: '',
    linkedinUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get candidate profile data
  useEffect(() => {
    const fetchCandidateProfile = async () => {
      try {
        // Replace with actual API call to get candidate profile
        const profile = {
          firstName: 'John', // Example data
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
        };
        setFormData(prev => ({ ...prev, ...profile }));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (isOpen) {
      fetchCandidateProfile();
      setStep(1);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'coverLetter') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'resume') {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, resume: 'File size should be less than 5MB' }));
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Only PDF and DOC/DOCX files are allowed' }));
        return;
      }
      setResumeFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    } else {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({ ...prev, coverLetter: 'File size should be less than 2MB' }));
        return;
      }
      setCoverLetterFile(file);
      setErrors(prev => ({ ...prev, coverLetter: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!resumeFile) newErrors.resume = 'Resume is required';
    if (formData.portfolioUrl && !/^https?:\/\/.+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) return;

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Prepare application data
      const applicationData = new FormData();
      applicationData.append('jobId', jobId);
      applicationData.append('companyId', companyId);
      applicationData.append('firstName', formData.firstName);
      applicationData.append('lastName', formData.lastName);
      applicationData.append('email', formData.email);
      applicationData.append('phone', formData.phone);
      applicationData.append('coverLetter', formData.coverLetter);
      if (resumeFile) applicationData.append('resume', resumeFile);
      if (coverLetterFile) applicationData.append('coverLetterFile', coverLetterFile);
      if (formData.portfolioUrl) applicationData.append('portfolioUrl', formData.portfolioUrl);
      if (formData.linkedinUrl) applicationData.append('linkedinUrl', formData.linkedinUrl);

      // Submit application
      await applicationsAPI.submitApplication(applicationData);

      setUploadProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
        onSuccess();
        onClose();
        setStep(1);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          coverLetter: '',
          portfolioUrl: '',
          linkedinUrl: '',
        });
        setResumeFile(null);
        setCoverLetterFile(null);
        setUploadProgress(0);
      }, 500);

    } catch (error: any) {
      console.error('Failed to submit application:', error);
      setErrors(prev => ({ ...prev, submit: error.message || 'Failed to submit application' }));
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-400 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Apply for Position</h2>
                  <p className="text-sky-100">{jobTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${stepNumber < step
                        ? 'bg-white border-white'
                        : stepNumber === step
                          ? 'bg-white border-white'
                          : 'bg-transparent border-white/30'
                        }`}>
                        {stepNumber < step ? (
                          <CheckCircle className="h-5 w-5 text-sky-600" />
                        ) : (
                          <span className={`font-semibold ${stepNumber <= step ? 'text-sky-600' : 'text-white/50'
                            }`}>
                            {stepNumber}
                          </span>
                        )}
                      </div>
                      <div className={`ml-3 text-sm font-medium ${stepNumber <= step ? 'text-white' : 'text-white/60'
                        }`}>
                        {stepNumber === 1 ? 'Personal Info' : 'Documents & Links'}
                      </div>
                    </div>
                    {stepNumber < 2 && (
                      <div className={`flex-1 h-0.5 mx-4 ${stepNumber < step ? 'bg-white' : 'bg-white/30'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && uploadProgress > 0 && (
            <div className="bg-gray-50 px-8 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading documents...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-3" />
                    Personal Information
                  </h3>
                  <p className="text-gray-600 mb-6">Please provide your contact details</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900">
                        First Name *
                        {errors.firstName && (
                          <span className="ml-2 text-sm font-normal text-red-600">- {errors.firstName}</span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900">
                        Last Name *
                        {errors.lastName && (
                          <span className="ml-2 text-sm font-normal text-red-600">- {errors.lastName}</span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                        Email Address *
                        {errors.email && (
                          <span className="ml-2 text-sm font-normal text-red-600">- {errors.email}</span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
                        Phone Number *
                        {errors.phone && (
                          <span className="ml-2 text-sm font-normal text-red-600">- {errors.phone}</span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-6 space-y-2">
                    <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-900">
                      <MessageSquare className="h-4 w-4 inline-block mr-2 text-blue-600" />
                      Cover Letter (Optional)
                      <span className="text-sm font-normal text-gray-600 ml-2">- Introduce yourself and explain why you're a good fit</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      rows={4}
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Dear Hiring Manager,

I am writing to express my interest in the [Position Name] position at [Company Name]. With my background in [relevant field] and experience with [relevant skills], I believe I would be a great fit for this role.

[Share specific achievements and why you're excited about this opportunity]

Thank you for considering my application.

Best regards,
[Your Name]"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Markdown is supported</span>
                      <span>{formData.coverLetter.length}/2000 characters</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documents & Links */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    Documents & Professional Links
                  </h3>
                  <p className="text-gray-600 mb-6">Upload your resume and share your professional profiles</p>

                  {/* Resume Upload */}
                  <div className="space-y-4 mb-8">
                    <label className="block text-sm font-semibold text-gray-900">
                      Resume / CV *
                      {errors.resume && (
                        <span className="ml-2 text-sm font-normal text-red-600">- {errors.resume}</span>
                      )}
                    </label>

                    <div
                      className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all ${resumeFile
                        ? 'border-green-500 bg-green-50'
                        : errors.resume
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      <input
                        id="resume-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'resume')}
                      />

                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${resumeFile ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                          {resumeFile ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          ) : (
                            <Upload className="h-8 w-8 text-blue-600" />
                          )}
                        </div>

                        <div>
                          {resumeFile ? (
                            <>
                              <p className="font-semibold text-gray-900">{resumeFile.name}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-900">Click to upload your resume</p>
                              <p className="text-sm text-gray-600 mt-1">
                                PDF, DOC, DOCX up to 5MB
                              </p>
                            </>
                          )}
                        </div>

                        {!resumeFile && (
                          <button
                            type="button"
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Browse Files
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter Upload */}
                  <div className="space-y-4 mb-8">
                    <label className="block text-sm font-semibold text-gray-900">
                      Cover Letter (Optional)
                      {errors.coverLetter && (
                        <span className="ml-2 text-sm font-normal text-red-600">- {errors.coverLetter}</span>
                      )}
                    </label>

                    <div
                      className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all ${coverLetterFile
                        ? 'border-purple-500 bg-purple-50'
                        : errors.coverLetter
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      onClick={() => document.getElementById('coverletter-upload')?.click()}
                    >
                      <input
                        id="coverletter-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileChange(e, 'coverLetter')}
                      />

                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${coverLetterFile ? 'bg-purple-100' : 'bg-purple-100'
                          }`}>
                          {coverLetterFile ? (
                            <CheckCircle className="h-8 w-8 text-purple-600" />
                          ) : (
                            <Paperclip className="h-8 w-8 text-purple-600" />
                          )}
                        </div>

                        <div>
                          {coverLetterFile ? (
                            <>
                              <p className="font-semibold text-gray-900">{coverLetterFile.name}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB • Click to change
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-900">Upload cover letter (Optional)</p>
                              <p className="text-sm text-gray-600 mt-1">
                                PDF, DOC, TXT up to 2MB
                              </p>
                            </>
                          )}
                        </div>

                        {!coverLetterFile && (
                          <button
                            type="button"
                            className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Browse Files
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Portfolio URL */}
                    <div className="space-y-2">
                      <label htmlFor="portfolioUrl" className="block text-sm font-semibold text-gray-900">
                        Portfolio URL (Optional)
                        {errors.portfolioUrl && (
                          <span className="ml-2 text-sm font-normal text-red-600">- {errors.portfolioUrl}</span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="portfolioUrl"
                          name="portfolioUrl"
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.portfolioUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    {/* LinkedIn URL */}
                    <div className="space-y-2">
                      <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-gray-900">
                        LinkedIn Profile (Optional)
                        {errors.linkedinUrl && (
                          <span className="ml-2 text-sm font-normal text-red-600">- {errors.linkedinUrl}</span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </div>
                        <input
                          id="linkedinUrl"
                          name="linkedinUrl"
                          type="url"
                          value={formData.linkedinUrl}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.linkedinUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Application Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700">Position</span>
                      <span className="font-semibold text-gray-900">{jobTitle}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700">Name</span>
                      <span className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700">Email</span>
                      <span className="font-semibold text-gray-900">{formData.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700">Resume</span>
                      <span className="font-semibold text-gray-900">
                        {resumeFile ? resumeFile.name : 'Not uploaded'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div>
                {step === 2 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Personal Info
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {step === 1 ? 'Processing...' : 'Submitting Application...'}
                    </>
                  ) : (
                    <>
                      {step === 1 ? 'Continue to Documents' : 'Submit Application'}
                      {step === 2 && <CheckCircle className="h-5 w-5" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main Page Component - ADD THIS
export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
    fetchSimilarJobs();
  }, [jobId]);

  const fetchSimilarJobs = async () => {
    try {
      const allJobs = await publicJobsAPI.getAllJobs();
      // Filter out the current job and limit to 3 similar jobs
      const similarJobsData = allJobs
        .filter((job: any) => job._id !== jobId)
        .slice(0, 3)
        .map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.companyId.name,
          location: job.location,
          salary: job.salary,
          type: job.jobType,
          posted: new Date(job.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
          }),
          urgent: job.jobType === 'full-time' && Math.random() > 0.7,
          featured: job.jobType === 'remote' && Math.random() > 0.8
        }));
      setSimilarJobs(similarJobsData);
    } catch (err) {
      console.error('Failed to fetch similar jobs:', err);
      setSimilarJobs([]);
    }
  };

  const checkApplicationStatus = async () => {
    // Only check application status if user is authenticated and is a candidate
    if (!user || user.role !== 'CANDIDATE') {
      setHasApplied(false);
      return;
    }

    try {
      const applications = await applicationsAPI.getApplicationsByCandidate();
      const hasAppliedForJob = applications.some(app => app.jobId._id === jobId);
      setHasApplied(hasAppliedForJob);
    } catch (err: any) {
      console.error('Failed to check application status:', err);
      // If unauthorized, redirect to login
      if (err.message?.includes('401') || err.status === 401) {
        console.log('Unauthorized access, redirecting to login');
        // Clear invalid token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/auth/login';
        return;
      }
      setHasApplied(false);
    }
  };

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobData = await publicJobsAPI.getJobById(jobId);
      setJob(jobData);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'remote': return 'bg-cyan-100 text-cyan-800';
      case 'internship': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-sky-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-sky-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist or has been removed.'}</p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-8 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse Other Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-sky-400 via-sky-500 to-white pt-24 lg:pt-28 border-b border-sky-100">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <Link
                  href="/jobs"
                  className="inline-flex items-center text-sky-700 hover:text-sky-900 text-sm font-medium bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-sky-100 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Link>
              </div>

              <div className="flex items-start space-x-6 mb-8">
                {/* Company Logo */}
                <div className="w-24 h-24 rounded-2xl bg-white shadow-sm border border-sky-100 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={getFileUrl(job.companyId.logoUrl) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}&backgroundColor=0ea5e9`}
                    alt={job.companyId.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`;
                    }}
                  />
                </div>

                <div className="flex-1 pt-1">
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">{job.title}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-700">
                      <Building className="h-5 w-5 mr-2 text-sky-600" />
                      <span className="text-xl font-semibold">{job.companyId.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-gray-800 text-sm font-medium border border-sky-100 shadow-sm">
                  <MapPin className="h-4 w-4 mr-2 text-sky-600" />
                  {job.location}
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-gray-800 text-sm font-medium border border-sky-100 shadow-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-sky-600" />
                  {job.salary}
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-gray-800 text-sm font-medium border border-sky-100 shadow-sm">
                  <Briefcase className="h-4 w-4 mr-2 text-sky-600" />
                  {job.experienceLevel}
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-gray-800 text-sm font-medium border border-sky-100 shadow-sm">
                  <Calendar className="h-4 w-4 mr-2 text-sky-600" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons - restored to previous style (white/sidebar) */}
            <div className="flex flex-col space-y-4 min-w-[300px] lg:mt-12">
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={hasApplied || (job.applicationDeadline ? new Date(job.applicationDeadline) < new Date() : false)}
                className={`w-full px-8 py-4 font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl ${hasApplied || (job.applicationDeadline && new Date(job.applicationDeadline) < new Date())
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                  : 'bg-white text-sky-600 hover:bg-sky-50 shadow-sky-200/50 border-2 border-sky-100'
                  }`}
              >
                {hasApplied ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    Applied Successfully
                  </span>
                ) : (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) ? (
                  <span className="flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 mr-3" />
                    Deadline Crossed
                  </span>
                ) : (
                  'Apply Now'
                )}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={toggleSave}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center border-2 ${isBookmarked
                    ? 'bg-sky-50 text-sky-600 border-sky-200 shadow-inner'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-sky-100 shadow-sm'
                    }`}
                >
                  <Bookmark className={`h-5 w-5 mr-3 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
                <button className="p-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl hover:bg-white border-2 border-sky-100 shadow-sm transition-all">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Highlights */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 ml-3">Job Highlights</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{job.jobType}</div>
                      <div className="text-sm text-gray-600">Employment Type</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <Award className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{job.experienceLevel}</div>
                      <div className="text-sm text-gray-600">Experience Level</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <DollarSign className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{job.salary}</div>
                      <div className="text-sm text-gray-600">Annual Salary</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-amber-50 rounded-xl">
                    <Clock className="h-5 w-5 text-amber-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">Date Posted</div>
                    </div>
                  </div>
                </div>

                {/* Skills Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg font-medium border border-sky-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-sky-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 ml-3">Job Description</h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 ml-3">Similar Jobs</h2>
                    </div>
                    <Link href="/jobs" className="text-sm text-sky-600 hover:text-sky-800 font-medium flex items-center">
                      View all jobs
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarJobs.map((similarJob) => (
                      <Link
                        key={similarJob.id}
                        href={`/jobs/${similarJob.id}`}
                        className="block group"
                      >
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                              {similarJob.title}
                            </h4>
                            {similarJob.urgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                                Urgent
                              </span>
                            )}
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">{similarJob.company}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{similarJob.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium text-gray-900">{similarJob.salary}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{similarJob.posted}</span>
                            <span className="inline-flex items-center px-3 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                              {similarJob.type}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 ml-3">Requirements & Qualifications</h2>
                  </div>

                  <div className="space-y-4">
                    {job.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 ml-3">Responsibilities</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-center p-3 bg-amber-50 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Profile */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-sky-600 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 ml-3">About Company</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-sm mx-auto mb-4 flex items-center justify-center">
                    <img
                      src={getFileUrl(job.companyId.logoUrl) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.companyId.name)}`}
                      alt={job.companyId.name}
                      className="w-16 h-16"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{job.companyId.name}</h4>
                  {job.companyId.industry && (
                    <p className="text-gray-600 mt-1">{job.companyId.industry}</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{job.companyId.size || 'Not specified'}</span>
                  </div>
                  {job.companyId.website && (
                    <a
                      href={job.companyId.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sky-600 hover:text-sky-800 font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-3" />
                      Company Website
                    </a>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-900 mb-3">Company Description</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {job.companyId.description || 'No company description available.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Quick Facts */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Job Quick Facts</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Job Type</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.jobType}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-emerald-600 mr-3" />
                    <span className="text-gray-700">Experience</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.experienceLevel}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">Location</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.location}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-amber-600 mr-3" />
                    <span className="text-gray-700">Salary</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.salary}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Posted Date</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-gray-700">Deadline</span>
                  </div>
                  <span className={`font-semibold ${job.applicationDeadline && new Date(job.applicationDeadline) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                    {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'No Deadline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Now Card */}
            <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-white rounded-2xl p-8 text-center border border-sky-100 shadow-xl">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/40">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
              <p className="text-sky-900/80 mb-8 font-medium">
                {hasApplied
                  ? 'Your application has been submitted successfully!'
                  : 'Take the next step in your career journey with HireHelp'
                }
              </p>

              {hasApplied ? (
                <div className="space-y-4">
                  <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-sm">
                    <div className="flex items-center justify-center text-sky-900 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-bold">Application Submitted</span>
                    </div>
                    <p className="text-sky-800 text-sm">
                      We'll review your application and get back to you soon.
                    </p>
                  </div>
                  <Link
                    href="/profile/applications"
                    className="w-full px-6 py-4 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-all shadow-md block border-2 border-sky-100"
                  >
                    View Status
                  </Link>
                </div>
              ) : (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) ? (
                <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/60">
                  <div className="flex items-center justify-center text-red-700 mb-2">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-bold">Deadline Passed</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    This position is no longer accepting new applications.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full px-6 py-4 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-all transform hover:scale-[1.02] shadow-xl shadow-sky-300/20 border-2 border-sky-100"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={jobId}
        companyId={job.companyId._id}
        jobTitle={job.title}
        onSuccess={() => {
          setShowApplyModal(false);
          setHasApplied(true);
        }}
      />
    </div >
  );
}