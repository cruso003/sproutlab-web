'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircuitBoard, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useUIStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const addNotification = useUIStore(state => state.addNotification);
  const router = useRouter();

  // Clear any existing auth state when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any stale auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('sproutlab-auth-store');
      sessionStorage.clear();
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Login Successful',
          message: 'Welcome to SproutLab!'
        });
        router.push('/dashboard');
      }
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  // Handle auth errors
  useEffect(() => {
    if (error) {
      setErrors({ general: error });
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: error
      });
    }
  }, [error, addNotification]);

  useEffect(() => {
    if (isAuthenticated) {
      addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully logged in to SproutLab!'
      });
      router.push('/dashboard');
    }
  }, [isAuthenticated, addNotification, router]);

  // Show loading if checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, don't show login form
  if (isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23ffffff%27%20fill-opacity=%270.1%27%3E%3Ccircle%20cx=%2730%27%20cy=%2730%27%20r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CircuitBoard className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SproutLab</h1>
          </div>
          <p className="text-gray-400">Sign in to access the platform</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your credentials to access SproutLab
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Error */}
                {(errors.general || error) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">
                      {errors.general || error || 'Login failed'}
                    </span>
                  </motion.div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="Enter your username"
                    required
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm">{errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have access yet?{' '}
                  <a href="mailto:sproutlab@saharasprout.com?subject=Access Request" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Request Access
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
