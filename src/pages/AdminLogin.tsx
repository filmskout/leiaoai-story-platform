import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertCircle, Loader2, Eye, EyeOff, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');
  
  const { signIn, isAuthenticated, user } = useAuth();
  const { actualTheme } = useTheme();
  const navigate = useNavigate();

  // Admin verification code (in a real app, this would be environment variable or more secure)
  const ADMIN_VERIFICATION_CODE = 'LEOAI2025ADMIN';

  // Redirect if already authenticated and verified as admin
  useEffect(() => {
    if (isAuthenticated && localStorage.getItem('leoai-admin-verified') === 'true') {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle initial login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        setStep('verification');
        toast.success('Credentials verified. Please enter admin code.');
      } else {
        setError(error.message || 'Invalid credentials');
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle admin verification
  const handleAdminVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!adminCode) {
      setError('Please enter the admin verification code');
      return;
    }
    
    if (adminCode !== ADMIN_VERIFICATION_CODE) {
      setError('Invalid admin verification code');
      return;
    }
    
    // Mark as admin verified
    localStorage.setItem('leoai-admin-verified', 'true');
    localStorage.setItem('leoai-admin-session', Date.now().toString());
    
    toast.success('Admin access granted!');
    navigate('/');
  };

  // Reset to credentials step
  const resetToCredentials = () => {
    setStep('credentials');
    setAdminCode('');
    setError('');
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300",
      actualTheme === 'dark' 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-red-50 via-orange-50 to-red-100"
    )}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className={cn(
            "mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center",
            actualTheme === 'dark' ? "bg-red-600" : "bg-red-500"
          )}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className={cn(
            "text-3xl font-bold",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            Admin Access
          </h2>
          <p className={cn(
            "mt-2 text-sm",
            actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>
            {step === 'credentials' 
              ? 'Enter your administrator credentials'
              : 'Enter admin verification code'
            }
          </p>
        </div>

        {/* Credentials Form */}
        {step === 'credentials' && (
          <form className="mt-8 space-y-6" onSubmit={handleCredentialsSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="admin-email" className={cn(
                  "block text-sm font-medium mb-1",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors",
                    actualTheme === 'dark'
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                  placeholder="Enter admin email"
                />
              </div>
              
              {/* Password Field */}
              <div>
                <label htmlFor="admin-password" className={cn(
                  "block text-sm font-medium mb-1",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors",
                      actualTheme === 'dark'
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    )}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
                      actualTheme === 'dark' 
                        ? "text-gray-400 hover:text-gray-200" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={cn(
                "p-3 rounded-lg border flex items-start space-x-2",
                actualTheme === 'dark'
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              )}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Continue to Verification'
              )}
            </button>
          </form>
        )}

        {/* Admin Code Verification */}
        {step === 'verification' && (
          <form className="mt-8 space-y-6" onSubmit={handleAdminVerification}>
            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg border flex items-center space-x-3",
                actualTheme === 'dark'
                  ? "bg-green-900/20 border-green-800 text-green-400"
                  : "bg-green-50 border-green-200 text-green-600"
              )}>
                <UserCheck className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">Credentials verified. Enter admin code to proceed.</p>
              </div>
              
              {/* Admin Code Field */}
              <div>
                <label htmlFor="admin-code" className={cn(
                  "block text-sm font-medium mb-1",
                  actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
                )}>
                  Admin Verification Code
                </label>
                <input
                  id="admin-code"
                  name="adminCode"
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className={cn(
                    "w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors font-mono text-center tracking-wider",
                    actualTheme === 'dark'
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  )}
                  placeholder="Enter verification code"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={cn(
                "p-3 rounded-lg border flex items-start space-x-2",
                actualTheme === 'dark'
                  ? "bg-red-900/20 border-red-800 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              )}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Grant Admin Access
              </button>
              
              <button
                type="button"
                onClick={resetToCredentials}
                className={cn(
                  "w-full py-2 px-4 border rounded-lg text-sm font-medium transition-colors",
                  actualTheme === 'dark'
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                Back to Credentials
              </button>
            </div>
          </form>
        )}
        
        {/* Footer Warning */}
        <div className={cn(
          "text-center text-xs border-t pt-4",
          actualTheme === 'dark' ? "text-gray-400 border-gray-700" : "text-gray-500 border-gray-200"
        )}>
          <p>⚠️ Admin access is restricted and monitored</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;