import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2, Eye, EyeOff, Mail, Chrome } from 'lucide-react';
import { WalletConnect } from '@/components/auth/WalletConnect';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signIn, signUp, signInWithGoogle, isAuthenticated } = useAuth();
  const { actualTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validation
    if (!email || !password) {
      setError(t('auth.error_required_fields', 'Please fill in all required fields'));
      return;
    }
    
    if (activeTab === 'signup' && password !== confirmPassword) {
      setError(t('auth.error_password_mismatch', 'Passwords do not match'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('auth.error_password_length', 'Password must be at least 6 characters'));
      return;
    }
    
    setLoading(true);
    
    try {
      if (activeTab === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || t('auth.error_signin_failed', 'Sign in failed'));
        } else {
          toast.success(t('auth.success_signin', 'Signed in successfully!'));
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, {
          full_name: email.split('@')[0] // Use email prefix as default name
        });
        if (error) {
          setError(error.message || t('auth.error_signup_failed', 'Sign up failed'));
        } else {
          setSuccessMessage(t('auth.success_signup', 'Account created successfully! You can now sign in.'));
          setActiveTab('signin');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (error: any) {
      setError(error.message || t('auth.error_unexpected', 'An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      // Navigation handled by redirect
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || t('auth.error_google_failed', 'Google sign in failed'));
      toast.error(t('auth.error_google_failed', 'Google sign in failed'));
    } finally {
      setLoading(false);
    }
  };

  // Handle successful wallet connection
  const handleWalletSuccess = () => {
    toast.success(t('auth.success_wallet', 'Wallet connected successfully!'));
    navigate('/');
  };

  // Handle wallet connection error
  const handleWalletError = (error: Error) => {
    setError(error.message || t('auth.error_wallet_failed', 'Wallet connection failed'));
  };

  // Reset form when switching tabs
  const handleTabChange = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setError('');
    setSuccessMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300",
      actualTheme === 'dark' 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-indigo-100"
    )}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* LeiaoAI Logo */}
          <div className="mx-auto mb-6">
            <img
              src={actualTheme === 'dark' ? '/leoai-logo-light.png' : '/leoai-logo-dark.png'}
              alt="LeiaoAI"
              className="h-16 w-auto mx-auto object-contain"
            />
          </div>
          <h2 className={cn(
            "text-3xl font-bold",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {t('auth.welcome', 'Welcome to LeiaoAI')}
          </h2>
          <p className={cn(
            "mt-2",
            actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>
            {activeTab === 'signin' 
              ? t('auth.signin_subtitle', 'Sign in to your account')
              : t('auth.signup_subtitle', 'Create a new account')
            }
          </p>
        </div>
        
        {/* Tab Selector */}
        <div className={cn(
          "flex rounded-lg p-1",
          actualTheme === 'dark' ? "bg-gray-800" : "bg-gray-100"
        )}>
          <button
            onClick={() => handleTabChange('signin')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === 'signin'
                ? actualTheme === 'dark'
                  ? 'bg-gray-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : actualTheme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {t('auth.signin', 'Sign In')}
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === 'signup'
                ? actualTheme === 'dark'
                  ? 'bg-gray-700 text-blue-400 shadow-sm'
                  : 'bg-white text-blue-600 shadow-sm'
                : actualTheme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {t('auth.signup', 'Sign Up')}
          </button>
        </div>

        {/* Social/Web3 Login Section */}
        <div className="space-y-4">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg transition-all duration-200 disabled:opacity-50 group",
              actualTheme === 'dark'
                ? "border-gray-600 bg-gray-800 hover:bg-gray-700 text-white hover:border-gray-500"
                : "border-gray-300 bg-white hover:bg-gray-50 text-gray-900 hover:border-gray-400 shadow-sm"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <Chrome className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-sm font-medium">
              {t('auth.google_signin', 'Continue with Google')}
            </span>
          </button>

          {/* Wallet Connection */}
          <WalletConnect 
            onSuccess={handleWalletSuccess}
            onError={handleWalletError}
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className={cn(
              "w-full border-t",
              actualTheme === 'dark' ? "border-gray-600" : "border-gray-300"
            )} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className={cn(
              "px-2",
              actualTheme === 'dark' 
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400"
                : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500"
            )}>
              {t('auth.divider_or', 'Or')}
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className={cn(
              "block text-sm font-medium mb-1",
              actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
            )}>
              {t('auth.email_label', 'Email Address')}
            </label>
            <div className="relative">
              <Mail className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                actualTheme === 'dark' ? "text-gray-400" : "text-gray-400"
              )} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "pl-10 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                  actualTheme === 'dark'
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={t('auth.email_placeholder', 'Enter your email')}
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className={cn(
              "block text-sm font-medium mb-1",
              actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
            )}>
              {t('auth.password_label', 'Password')}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                  actualTheme === 'dark'
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={t('auth.password_placeholder', 'Enter your password')}
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
          
          {/* Confirm Password Field (Sign Up Only) */}
          {activeTab === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className={cn(
                "block text-sm font-medium mb-1",
                actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
              )}>
                {t('auth.confirm_password_label', 'Confirm Password')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(
                  "w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                  actualTheme === 'dark'
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                )}
                placeholder={t('auth.confirm_password_placeholder', 'Confirm your password')}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={cn(
              "p-3 rounded-lg border flex items-start space-x-2",
              actualTheme === 'dark'
                ? "bg-red-900/20 border-red-800 text-red-400"
                : "bg-red-50 border-red-200 text-red-600"
            )}>
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className={cn(
              "p-3 rounded-lg border",
              actualTheme === 'dark'
                ? "bg-green-900/20 border-green-800 text-green-400"
                : "bg-green-50 border-green-200 text-green-600"
            )}>
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('auth.processing', 'Processing...')}</span>
              </div>
            ) : (
              activeTab === 'signin' 
                ? t('auth.signin_button', 'Sign In') 
                : t('auth.signup_button', 'Create Account')
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className={cn(
          "text-center text-sm",
          actualTheme === 'dark' ? "text-gray-400" : "text-gray-600"
        )}>
          <p>
            {activeTab === 'signin' 
              ? t('auth.footer_signin', 'By signing in, you agree to our')
              : t('auth.footer_signup', 'By creating an account, you agree to our')
            }{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              {t('auth.terms', 'Terms of Service')}
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              {t('auth.privacy', 'Privacy Policy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
