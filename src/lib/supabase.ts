import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Supabase configuration with proper error handling
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

// Create Supabase client with proper configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'leoai-social-platform'
    }
  }
});

// Database profile interface
export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  social_links: Record<string, any> | null;
  preferences: Record<string, any> | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication service class
class AuthService {
  private static instance: AuthService;
  private authListeners: ((user: User | null) => void)[] = [];
  private currentUser: User | null = null;
  private currentProfile: UserProfile | null = null;
  private initialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initialize() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting initial session:', error);
      } else if (session?.user) {
        this.currentUser = session.user;
        await this.loadUserProfile(session.user.id);
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        // Update current user state
        this.currentUser = session?.user || null;
        
        if (this.currentUser) {
          await this.loadUserProfile(this.currentUser.id);
        } else {
          this.currentProfile = null;
        }
        
        // Notify listeners with slight delay to ensure all state updates are complete
        setTimeout(() => {
          this.authListeners.forEach(listener => {
            try {
              listener(this.currentUser);
            } catch (error) {
              console.error('Auth listener error:', error);
            }
          });
        }, 100);
      });

      this.initialized = true;
    } catch (error) {
      console.error('Auth service initialization failed:', error);
    }
  }

  public async waitForInitialization(): Promise<void> {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Load user profile from database
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      this.currentProfile = data;
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current profile
  public getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  // Sign in with email and password
  public async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await this.ensureProfileExists(data.user);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in failed:', error);
      return { data: null, error };
    }
  }

  // Sign up with email and password
  public async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await this.ensureProfileExists(data.user);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up failed:', error);
      return { data: null, error };
    }
  }

  // Sign out
  public async signOut() {
    console.log('AuthService: Starting signOut...');
    try {
      // Clear local state first
      this.currentUser = null;
      this.currentProfile = null;
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('AuthService: SignOut completed successfully');
      return { error: null };
    } catch (error: any) {
      console.error('AuthService: Sign out failed:', error);
      // Even if signOut fails, clear local state
      this.currentUser = null;
      this.currentProfile = null;
      return { error };
    }
  }

  // Ensure profile exists in database
  private async ensureProfileExists(user: User) {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        // Create new profile
        const profileData = {
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          username: user.user_metadata?.username || user.email?.split('@')[0] || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('profiles')
          .insert(profileData);

        if (error) {
          console.error('Failed to create profile:', error);
        } else {
          console.log('Profile created successfully for user:', user.email);
          await this.loadUserProfile(user.id);
        }
      }
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
    }
  }

  // Update user profile
  public async updateProfile(updates: Partial<UserProfile>) {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', this.currentUser.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.currentProfile = data;
      return { data, error: null };
    } catch (error: any) {
      console.error('Profile update failed:', error);
      return { data: null, error };
    }
  }

  // Add auth state listener
  public addAuthListener(listener: (user: User | null) => void) {
    this.authListeners.push(listener);
    // Immediately call with current user
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(listener);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export Supabase client for direct usage if needed
export default supabase;