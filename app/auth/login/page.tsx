'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { authAPI } from '../../api/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Store user data for quick access
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Redirect based on user role
      if (response.user.role === 'COMPANY_ADMIN') {
        router.push('/companyadmin');
      } else if (response.user.role === 'SUPER_ADMIN') {
        router.push('/superadmin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ================= LEFT SIDE (IMAGE) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 overflow-hidden">
        {/* Illustration */}
        <Image
          src="/images/login-left.png"
          alt="Login illustration"
          fill
          priority
          className="object-contain p-12"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-800/80" />

        {/* Branding content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-12">
              <Briefcase className="h-8 w-8" />
              <span className="text-2xl font-bold">HireFlow</span>
            </Link>

            <h2 className="text-4xl font-bold mb-6">
              Welcome Back to Your Career Hub
            </h2>

            <p className="text-lg text-blue-100 mb-10">
              Connect with opportunities that match your skills and ambitions.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">For Companies</h3>
                  <p className="text-blue-100 text-sm">
                    Hire verified talent faster
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">For Candidates</h3>
                  <p className="text-blue-100 text-sm">
                    Find roles that fit your goals
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
            <div className="text-center">
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm text-blue-100">Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-blue-100">Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm text-blue-100">Success</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (FORM) ================= */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">HireFlow</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">Remember me</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="inline ml-2 h-5 w-5" />}
            </button>

            {/* Demo */}
            {/* <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Demo: demo@demo.com / demo123
              </p>
            </div> */}
          </form>

          <p className="text-center mt-8 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
