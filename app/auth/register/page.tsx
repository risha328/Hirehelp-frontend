'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  Briefcase,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { authAPI, RegisterData } from '../../api/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'CANDIDATE'>('CANDIDATE');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';

    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    else if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateOfBirth)) newErrors.dateOfBirth = 'Invalid date format';

    if (!['SUPER_ADMIN', 'COMPANY_ADMIN', 'CANDIDATE'].includes(role)) newErrors.role = 'Invalid role selected';

    if (gender && !['MALE', 'FEMALE'].includes(gender)) newErrors.gender = 'Invalid gender selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const registerData: RegisterData = {
        name,
        email,
        password,
        confirmPassword,
        dateOfBirth,
        role,
        gender: gender || undefined,
      };

      const response = await authAPI.register(registerData);

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Store user data for quick access
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Redirect to dashboard
      router.push('/');
    } catch (err: any) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-white rounded-full"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-12">
              <Briefcase className="h-8 w-8" />
              <span className="text-2xl font-bold">HireFlow</span>
            </Link>
            
            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-6">
                Start Your Journey Today
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Join thousands of professionals and companies already using HireFlow.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>Post unlimited jobs (Free tier)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>Access to premium candidates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>Advanced analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" />
                  <span>14-day free trial for companies</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <blockquote className="text-lg italic text-green-100">
              "HireFlow helped us reduce hiring time by 60%. The platform is incredibly intuitive."
            </blockquote>
            <div className="mt-4 flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div className="ml-3">
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-green-100">HR Director, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">HireFlow</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Join HireFlow today and unlock opportunities
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setRole('CANDIDATE')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                  role === 'CANDIDATE'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <User className={`h-8 w-8 mb-2 ${
                  role === 'CANDIDATE' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  role === 'CANDIDATE' ? 'text-blue-700' : 'text-gray-700'
                }`}>Candidate</span>
                <span className="text-sm text-gray-500 mt-1">Looking for jobs</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('COMPANY_ADMIN')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                  role === 'COMPANY_ADMIN'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Building className={`h-8 w-8 mb-2 ${
                  role === 'COMPANY_ADMIN' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  role === 'COMPANY_ADMIN' ? 'text-blue-700' : 'text-gray-700'
                }`}>Company Admin</span>
                <span className="text-sm text-gray-500 mt-1">Hiring talent</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('SUPER_ADMIN')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                  role === 'SUPER_ADMIN'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Briefcase className={`h-8 w-8 mb-2 ${
                  role === 'SUPER_ADMIN' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  role === 'SUPER_ADMIN' ? 'text-blue-700' : 'text-gray-700'
                }`}>Super Admin</span>
                <span className="text-sm text-gray-500 mt-1">System admin</span>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Date of Birth Input */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dateOfBirth"
                  type="datetime-local"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="YYYY-MM-DDTHH:MM:SS.SSSZ"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Gender (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGender('MALE')}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center transition-all ${
                    gender === 'MALE'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    gender === 'MALE' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <User className={`h-4 w-4 ${gender === 'MALE' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${gender === 'MALE' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Male
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGender('FEMALE')}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center transition-all ${
                    gender === 'FEMALE'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    gender === 'FEMALE' ? 'bg-pink-500' : 'bg-gray-300'
                  }`}>
                    <User className={`h-4 w-4 ${gender === 'FEMALE' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${gender === 'FEMALE' ? 'text-pink-700' : 'text-gray-700'}`}>
                    Female
                  </span>
                </button>
              </div>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Password Requirements
              </h4>
              <div className="space-y-2">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center">
                    {req.met ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    )}
                    <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-600'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>

            {errors.submit && (
              <p className="text-sm text-red-600 text-center">{errors.submit}</p>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="text-blue-600 font-semibold hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              By signing up, you agree to our terms. We&apos;ll never share your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}