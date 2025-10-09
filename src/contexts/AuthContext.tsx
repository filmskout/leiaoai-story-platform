import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, UserProfile } from '@/lib/supabase';
import { toast } from 'sonner';

// Authentication context interface
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isInitializing = true;

    const initialize = async () => {
      try {
        // Wait for auth service to initialize
        await authService.waitForInitialization();
        
        // Get current user and profile
        const currentUser = authService.getCurrentUser();
        const currentProfile = authService.getCurrentProfile();
        
        setUser(currentUser);
        setProfile(currentProfile);
        
        // Subscribe to auth changes
        unsubscribe = authService.addAuthListener((newUser) => {
          console.log('Auth state changed in context:', newUser?.email || 'logged out');
          setUser(newUser);
          setProfile(authService.getCurrentProfile());
          
          // Only update loading state if we're not currently in an explicit auth operation
          if (isInitializing) {
            setLoading(false);
            isInitializing = false;
          }
        });
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        // Set initial loading to false if no auth state change occurred
        setTimeout(() => {
          if (isInitializing) {
            setLoading(false);
            isInitializing = false;
          }
        }, 1000);
      }
    };

    initialize();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Login failed');
        return { error };
      }
      
      if (data?.user) {
        toast.success('Successfully signed in!');
        return { error: null };
      }
      
      return { error: new Error('Login failed') };
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signUp(email, password, metadata);
      
      if (error) {
        toast.error(error.message || 'Registration failed');
        return { error };
      }
      
      if (data?.user) {
        if (data.user.email_confirmed_at) {
          toast.success('Account created successfully!');
        } else {
          toast.success('Account created! Please check your email for verification.');
        }
        return { error: null };
      }
      
      return { error: new Error('Registration failed') };
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      console.log('Starting signOut process...');
      setLoading(true);
      
      // Clear all local state first
      setUser(null);
      setProfile(null);
      
      // Clear any cached data immediately
      localStorage.removeItem('leiaoai-language');
      sessionStorage.clear();
      
      // Clear Thirdweb connection if exists
      const thirdwebData = localStorage.getItem('thirdweb_wallet_data');
      if (thirdwebData) {
        localStorage.removeItem('thirdweb_wallet_data');
      }
      
      // Sign out from Supabase
      const result = await authService.signOut();
      
      if (result.error) {
        console.error('Supabase signOut error:', result.error);
      }
      
      console.log('SignOut process completed');
      toast.success('Successfully signed out');
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if signOut fails, clear local state
      setUser(null);
      setProfile(null);
      localStorage.removeItem('thirdweb_wallet_data');
      toast.error('Sign out completed with issues');
    } finally {
      // Use a short delay to ensure auth state change is processed
      setTimeout(() => {
        setLoading(false);
        console.log('SignOut loading state cleared');
      }, 500);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await authService.updateProfile(updates);
      
      if (error) {
        toast.error(error.message || 'Profile update failed');
        return { error };
      }
      
      if (data) {
        setProfile(data);
        toast.success('Profile updated successfully!');
        return { error: null };
      }
      
      return { error: new Error('Profile update failed') };
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed');
      return { error };
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    if (user) {
      const currentProfile = authService.getCurrentProfile();
      setProfile(currentProfile);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;