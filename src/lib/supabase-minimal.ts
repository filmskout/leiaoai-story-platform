// 此文件现已弃用，统一使用 @/lib/supabase 中的客户端
// 为保持兼容性，从 @/lib/supabase 导入并重新导出

import { supabase as originalSupabase, supabaseService } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

console.log('使用统一的Supabase客户端');

// 为了向后兼容，保留getSupabase函数，但实际返回原始客户端
export const getSupabase = (): SupabaseClient => {
  if (supabaseService.client) {
    return supabaseService.client;
  }
  
  // 如果尚未初始化，等待初始化
  console.log('等待Supabase客户端初始化...');
  supabaseService.ready.then(() => {
    console.log('Supabase客户端初始化完成');
  }).catch(error => {
    console.error('Supabase客户端初始化失败:', error);
  });
  
  // 返回代理对象，确保方法可用
  return originalSupabase as unknown as SupabaseClient;
};

// 导出统一的客户端
export const supabase = originalSupabase;

// 导出数据库类型定义（从原文件复制）
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          company: string | null;
          job_title: string | null;
          industry: string | null;
          investment_focus: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          social_providers: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: any;
        Update: any;
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          is_public: boolean;
          view_count: number;
          like_count: number;
          comment_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: any;
        Update: any;
      };
    };
  };
}