import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useThirdweb } from '@/contexts/ThirdwebContext';
import { useNavigate } from 'react-router-dom';
import { getUserLocation, GeolocationInfo } from '@/lib/geolocation';
import { chineseSocialProviders, initChineseSocialLogin } from '@/lib/chineseSocial';
import { AlertCircle, Loader2, Eye, EyeOff, Globe, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [location, setLocation] = useState<GeolocationInfo | null>(null);
  
  const { signIn, signUp } = useAuth();
  const { connectWallet, isConnecting } = useThirdweb();
  const navigate = useNavigate();
  
  // Get user location for showing appropriate social login options
  useEffect(() => {
    getUserLocation().then(setLocation);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (activeTab === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      if (activeTab === 'signin') {
        await signIn(email, password);
        toast.success('Successfully signed in!');
        navigate('/');
      } else {
        await signUp(email, password);
        setSuccessMessage('Account created! Please check your email for verification.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (error.message.includes('User already registered')) {
          setError('Email already registered, please sign in');
        } else {
          setError(error.message);
        }
      } else {
        setError('Operation failed, please try again');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = async (providerId: string) => {
    try {
      if (location?.isChina) {
        await initChineseSocialLogin(providerId);
      } else {
        // For international users, use Thirdweb
        await connectWallet();
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Social login failed');
    }
  };
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Social Platform
          </h2>
          <p className="mt-2 text-gray-600">
            Join our AI experience sharing community
          </p>
        </div>
        
        {/* Auth Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setActiveTab('signin');
              resetForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'signin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              resetForm();
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {activeTab === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            )}
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 成功信息 */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">{successMessage}</p>
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
                <span>Processing...</span>
              </div>
            ) : (
              activeTab === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        {/* Social Login Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Location-based social login options */}
          {location?.isChina ? (
            // Chinese social platforms
            <div className="grid grid-cols-2 gap-2">
              {chineseSocialProviders.slice(0, 6).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSocialLogin(provider.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderColor: provider.color + '40' }}
                >
                  <span>{provider.icon}</span>
                  <span className="text-xs">{provider.name}</span>
                </button>
              ))}
            </div>
          ) : (
            // International platforms via Thirdweb
            <div className="space-y-2">
              <button
                onClick={() => handleSocialLogin('thirdweb')}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
                <Wallet className="w-4 h-4" />
                Connect Wallet & Social Login
              </button>
              <p className="text-xs text-gray-500 text-center">
                Google, Discord, Telegram, GitHub, Facebook, Apple, MetaMask & more
              </p>
            </div>
          )}
        </div>

        {/* Test Account Info */}
        <div className="bg-gray-100 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Test Account</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Username: <code className="bg-gray-200 px-1 rounded">leiaoaiagent</code></div>
            <div>Password: <code className="bg-gray-200 px-1 rounded">agentleiaoai</code></div>
            <div>Email: <code className="bg-gray-200 px-1 rounded">leiaoaiagent@example.com</code></div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('leiaoaiagent@example.com');
              setPassword('agentleiaoai');
              setActiveTab('signin');
            }}
            className="mt-2 text-xs text-blue-600 hover:text-blue-500 transition-colors"
          >
            Use test credentials
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>By signing {activeTab === 'signin' ? 'in' : 'up'}, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}