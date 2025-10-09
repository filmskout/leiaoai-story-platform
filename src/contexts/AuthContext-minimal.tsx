import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // 设为false，避免长时间加载

  // 最小化的初始化逻辑
  useEffect(() => {
    console.log('AuthProvider初始化完成，使用简化模式');
    setUser(null);
    setLoading(false);
  }, []);

  // 简化的认证方法
  const signIn = async (email: string, password: string) => {
    console.log('登录请求:', email);
    // 暂时返回错误，避免实际的Supabase调用
    return { error: { message: '登录功能暂时不可用' } };
  };

  const signUp = async (email: string, password: string) => {
    console.log('注册请求:', email);
    return { error: { message: '注册功能暂时不可用' } };
  };

  const signOut = async () => {
    console.log('登出请求');
    setUser(null);
    return { error: null };
  };

  const updateProfile = async (updates: any) => {
    console.log('更新用户资料:', updates);
    return { error: { message: '更新功能暂时不可用' } };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}