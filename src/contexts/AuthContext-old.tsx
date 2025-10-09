import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, supabaseService } from '@/lib/supabase';
import { useThirdwebAuth, ThirdwebUser } from '@/lib/thirdweb';
import { toast } from 'sonner';

// Unified user interface that combines Supabase and Thirdweb users
interface UnifiedUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  user_metadata?: any;
  provider: 'supabase' | 'thirdweb';
  raw_user: User | ThirdwebUser;
}

interface AuthContextType {
  user: UnifiedUser | null;
  supabaseUser: User | null;
  thirdwebUser: ThirdwebUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get Thirdweb authentication state
  const { user: thirdwebUser, isLoading: thirdwebLoading, logout: thirdwebLogout } = useThirdwebAuth();

  // Helper function to create unified user from Supabase user
  const createUnifiedUserFromSupabase = (supabaseUser: User): UnifiedUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || null,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email || null,
      avatar_url: supabaseUser.user_metadata?.avatar_url || null,
      user_metadata: supabaseUser.user_metadata,
      provider: 'supabase',
      raw_user: supabaseUser
    };
  };

  // Helper function to create unified user from Thirdweb user
  const createUnifiedUserFromThirdweb = (thirdwebUser: ThirdwebUser): UnifiedUser => {
    return {
      id: `thirdweb_${thirdwebUser.address.toLowerCase()}`,
      email: thirdwebUser.email || null,
      name: thirdwebUser.name || `User ${thirdwebUser.address.slice(0, 8)}`,
      avatar_url: thirdwebUser.profileImage || null,
      user_metadata: {
        address: thirdwebUser.address,
        provider: 'thirdweb'
      },
      provider: 'thirdweb',
      raw_user: thirdwebUser
    };
  };

  // Effect to update unified user when either Supabase or Thirdweb user changes
  useEffect(() => {
    if (supabaseUser) {
      // Prioritize Supabase user if both exist
      setUser(createUnifiedUserFromSupabase(supabaseUser));
    } else if (thirdwebUser) {
      // Use Thirdweb user if no Supabase user
      setUser(createUnifiedUserFromThirdweb(thirdwebUser));
    } else {
      // No user authenticated
      setUser(null);
    }
    
    // Update loading state based on both providers
    setLoading(thirdwebLoading);
  }, [supabaseUser, thirdwebUser, thirdwebLoading]);

  // 在组件挂载时加载用户信息
  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;

    // 初始化用户认证状态
    async function initializeAuth() {
      try {
        // 等待Supabase初始化完成
        await supabaseService.ready;
        
        // 获取当前用户
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.warn('获取用户信息失败:', error.message);
          if (isMounted) {
            setSupabaseUser(null);
            setLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          setSupabaseUser(data.user);
        }

        // 设置认证状态监听
        const { data: authData } = supabase.auth.onAuthStateChange(async (_event, session) => {
          console.log('Auth state change:', _event, !!session?.user);
          
          if (isMounted) {
            const user = session?.user || null;
            setSupabaseUser(user);
            
            // Ensure profile exists for new authenticated users
            if (user && _event === 'SIGNED_IN') {
              try {
                await ensureProfile(user);
                console.log('✅ User signed in successfully:', user.email);
              } catch (error) {
                console.warn('Failed to ensure profile in auth callback:', error);
              }
            }
          }
        });
        
        subscription = authData.subscription;
        
        if (isMounted) {
          setLoading(false);
        }
        
      } catch (error) {
        console.error('Auth初始化失败:', error);
        
        if (isMounted) {
          setSupabaseUser(null);
          setLoading(false);
        }
      }
    }

    // 立即开始初始化
    initializeAuth();
    
    // 5秒后如果还没有加载，就显示空状态
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('用户认证状态加载超时，使用空状态');
        setSupabaseUser(null);
        setLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // 登录方法
  const signIn = async (email: string, password: string) => {
    try {
      // 等待Supabase实例准备就绪
      await supabaseService.ready;
      
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        throw result.error;
      }

      // 如果登录成功，确保用户资料存在
      if (result.data.user) {
        await ensureProfile(result.data.user);
        console.log('✅ Login successful:', result.data.user.email);
        toast.success('Successfully signed in!');
      }

      return result;
    } catch (error) {
      console.error('登录失败:', error);
      throw new Error(`登录失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 注册方法
  const signUp = async (email: string, password: string) => {
    try {
      // 等待Supabase实例准备就绪
      await supabaseService.ready;
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
        }
      });
      
      if (result.error) {
        throw result.error;
      }

      // 如果注册成功，创建用户资料
      if (result.data.user) {
        await ensureProfile(result.data.user);
      }

      return result;
    } catch (error) {
      console.error('注册失败:', error);
      throw new Error(`注册失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 登出方法 - 处理统一登出
  const signOut = async () => {
    try {
      // 根据当前用户类型执行相应的登出操作
      if (user?.provider === 'supabase') {
        // 等待Supabase实例准备就绪
        await supabaseService.ready;
        await supabase.auth.signOut();
      } else if (user?.provider === 'thirdweb') {
        // 断开Thirdweb连接
        await thirdwebLogout();
      }
      
      // 清除所有本地用户状态
      setSupabaseUser(null);
      setUser(null);
      
      return { error: null };
    } catch (error) {
      console.error('登出失败:', error);
      // 登出失败不应该阻止应用运行，只是清理本地状态
      setSupabaseUser(null);
      setUser(null);
      return { error: null };
    }
  };
  
  // 确保用户资料存在
  const ensureProfile = async (user: User) => {    
    try {
      // 等待Supabase实例准备就绪
      await supabaseService.ready;
      
      // 检查是否已存在用户资料
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.warn('检查用户资料失败:', profileError.message);
        return;
      }

      if (!existingProfile) {
        // 创建新的用户资料
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            username: user.user_metadata?.username || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('创建用户资料失败:', insertError.message);
        }
      }
    } catch (error) {
      console.error('检查/创建用户资料失败:', error);
      // 不抛出错误，让认证流程继续
    }
  };
  
  // 更新用户资料
  const updateProfile = async (updates: any) => {
    try {
      // 等待Supabase实例准备就绪
      await supabaseService.ready;
      
      if (!user) {
        throw new Error('用户未登录');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('更新用户资料失败:', error);
      throw new Error(`更新失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      thirdwebUser, 
      loading, 
      isAuthenticated, 
      signIn, 
      signUp, 
      signOut, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

