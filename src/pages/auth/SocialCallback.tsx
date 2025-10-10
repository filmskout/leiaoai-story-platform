import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function SocialCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleSocialCallback();
  }, [location]);

  const handleSocialCallback = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const provider = getProviderFromPath();

      if (!code) {
        throw new Error('Authorization code not found');
      }

      // Validate state parameter
      const storedState = sessionStorage.getItem(`${provider}_state`);
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for access token and user info
      const userInfo = await exchangeCodeForUser(provider, code);
      
      // Create or update user in Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userInfo.email || `${userInfo.id}@${provider}.social`,
        password: userInfo.id // Would use proper password handling in production
      });

      if (error && error.message.includes('Invalid login credentials')) {
        // User doesn't exist, create them
        const { error: signUpError } = await supabase.auth.signUp({
          email: userInfo.email || `${userInfo.id}@${provider}.social`,
          password: userInfo.id,
          options: {
            data: {
              full_name: userInfo.name,
              avatar_url: userInfo.avatar,
              provider: provider,
              provider_id: userInfo.id
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }
      } else if (error) {
        throw error;
      }

      // Clear stored state
      sessionStorage.removeItem(`${provider}_state`);

      setStatus('success');
      setMessage('Authentication successful! Redirecting...');

      // Notify parent window if in popup
      if (window.opener) {
        window.opener.postMessage({
          type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
          user: userInfo
        }, window.location.origin);
        window.close();
      } else {
        // Redirect to home page
        setTimeout(() => navigate('/'), 2000);
      }

    } catch (error: any) {
      console.error('Social callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');

      // Notify parent window if in popup
      if (window.opener) {
        window.opener.postMessage({
          type: `${getProviderFromPath().toUpperCase()}_AUTH_ERROR`,
          error: error.message
        }, window.location.origin);
        window.close();
      }
    }
  };

  const getProviderFromPath = (): string => {
    const pathParts = location.pathname.split('/');
    return pathParts[pathParts.length - 2]; // Gets provider from /auth/{provider}/callback
  };

  const exchangeCodeForUser = async (provider: string, code: string) => {
    // This would make API calls to the respective platform's token endpoints
    // For now, return mock data
    const mockUsers = {
      wechat: {
        id: 'wechat_' + Math.random().toString(36).substr(2, 9),
        name: 'WeChat User',
        email: null,
        avatar: 'https://via.placeholder.com/100'
      },
      qq: {
        id: 'qq_' + Math.random().toString(36).substr(2, 9),
        name: 'QQ User',
        email: null,
        avatar: 'https://via.placeholder.com/100'
      },
      douyin: {
        id: 'douyin_' + Math.random().toString(36).substr(2, 9),
        name: 'Douyin User',
        email: null,
        avatar: 'https://via.placeholder.com/100'
      },
      feishu: {
        id: 'feishu_' + Math.random().toString(36).substr(2, 9),
        name: 'Feishu User',
        email: `user@feishu.cn`,
        avatar: 'https://via.placeholder.com/100'
      },
      kuaishou: {
        id: 'kuaishou_' + Math.random().toString(36).substr(2, 9),
        name: 'Kuaishou User',
        email: null,
        avatar: 'https://via.placeholder.com/100'
      },
      xiaohongshu: {
        id: 'xhs_' + Math.random().toString(36).substr(2, 9),
        name: 'Xiaohongshu User',
        email: null,
        avatar: 'https://via.placeholder.com/100'
      }
    };

    return mockUsers[provider as keyof typeof mockUsers] || mockUsers.wechat;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
