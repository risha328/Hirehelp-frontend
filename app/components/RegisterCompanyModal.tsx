'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Save, Building, Globe, MapPin, Plus } from 'lucide-react';
import { companiesAPI } from '../api/companies';
import { API_BASE_URL } from '../api/config';

interface RegisterCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RegisterCompanyModal({ isOpen, onClose, onSuccess }: RegisterCompanyModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<any>(null);
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
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
        if (isOpen) {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUser(payload);
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
        }
    }, [isOpen]);

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

            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.size) newErrors.size = 'Company size is required';
        if (!formData.description.trim()) newErrors.description = 'Company description is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            let finalLogoUrl = '';
            if (logoFile) {
                setUploading(true);
                try {
                    const result = await companiesAPI.uploadLogo(logoFile);
                    finalLogoUrl = result.logoUrl;
                } catch (error) {
                    console.error('Logo upload failed:', error);
                    setErrors(prev => ({ ...prev, logo: 'Failed to upload logo' }));
                    setLoading(false);
                    setUploading(false);
                    return;
                } finally {
                    setUploading(false);
                }
            }

            const companyData = {
                ...formData,
                logoUrl: finalLogoUrl,
                ownerId: user?.sub,
            };

            await companiesAPI.createCompany(companyData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Company creation failed:', error);
            setErrors({ submit: 'Failed to create company. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Register Your Company</h2>
                        <p className="text-gray-500 text-sm mt-1">Get started with your company profile</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {errors.submit}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Official registered name"
                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Industry */}
                        <div>
                            <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                                Industry *
                            </label>
                            <select
                                id="industry"
                                name="industry"
                                required
                                value={formData.industry}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all bg-white"
                            >
                                <option value="">Select industry</option>
                                {industries.map(industry => (
                                    <option key={industry} value={industry}>{industry}</option>
                                ))}
                            </select>
                            {errors.industry && <p className="mt-2 text-sm text-red-600">{errors.industry}</p>}
                        </div>

                        {/* Company Size */}
                        <div>
                            <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Size *
                            </label>
                            <select
                                id="size"
                                name="size"
                                required
                                value={formData.size}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all bg-white"
                            >
                                <option value="">Select company size</option>
                                {companySizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            {errors.size && <p className="mt-2 text-sm text-red-600">{errors.size}</p>}
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                                Headquarters Location *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="City, Country"
                                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all ${errors.location ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                />
                            </div>
                            {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
                        </div>

                        {/* Website */}
                        <div className="md:col-span-2">
                            <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Website
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://www.yourcompany.com"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                About Your Company *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Briefly describe what your company does..."
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all ${errors.description ? 'border-red-300' : 'border-gray-200'
                                    }`}
                            />
                            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Logo Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Logo
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center group hover:border-sky-500 transition-colors bg-gray-50">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="w-full h-full object-contain p-2"
                                        />
                                    ) : (
                                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-sky-500 transition-colors" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Click or drag to upload logo</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG or JPG, max 2MB</p>
                                    {logoFile && (
                                        <div className="mt-2 flex items-center text-sm text-sky-600 font-medium">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            {logoFile.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.logo && <p className="mt-2 text-sm text-red-600">{errors.logo}</p>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="inline-flex items-center px-8 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-600/20"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    {uploading ? 'Uploading Logo...' : 'Creating Company...'}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Company
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const AlertCircle = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
