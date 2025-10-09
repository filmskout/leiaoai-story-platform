import { createClient, SupabaseClient } from '@supabase/supabase-js';

// SupabaseService 类，更可靠的异步初始化方式
class SupabaseService {
  private _client: SupabaseClient | null = null;
  private _isInitialized = false;
  private _isInitializing = false;
  private _error: Error | null = null;
  
  // 用于等待初始化完成的Promise
  public ready: Promise<SupabaseClient>;
  private _resolveReady!: (client: SupabaseClient) => void;
  private _rejectReady!: (error: Error) => void;
  
  constructor() {
    // 创建一个Promise，允许其他组件等待初始化完成
    this.ready = new Promise<SupabaseClient>((resolve, reject) => {
      this._resolveReady = resolve;
      this._rejectReady = reject;
    });
    
    // 立即开始初始化
    this.initialize();
  }
  
  public get isInitialized(): boolean {
    return this._isInitialized;
  }
  
  public get isInitializing(): boolean {
    return this._isInitializing;
  }
  
  public get error(): Error | null {
    return this._error;
  }
  
  public get client(): SupabaseClient | null {
    return this._client;
  }
  
  // 获取初始化状态信息
  public getState() {
    return {
      initialized: this._isInitialized,
      initializing: this._isInitializing,
      error: this._error
    };
  }
  
  // 异步初始化方法
  public async initialize(): Promise<SupabaseClient> {
    // 防止重复初始化
    if (this._isInitializing) {
      return this.ready;
    }
    
    if (this._isInitialized && this._client) {
      return this._client;
    }
    
    try {
      console.log('🚀 开始初始化Supabase客户端...');
      this._isInitializing = true;
      
      // 从环境变量获取配置
      const supabaseUrl = "https://fwjerftzoosqmijmnkyb.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amVyZnR6b29zcW1pam1ua3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMTI4NjgsImV4cCI6MjA3NDU4ODg2OH0.uqeFb9VgSN4LMqjH40IFDihaEbIMIV6OkrZ3A1lDmu8";
      
      // 验证配置
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(`Supabase 环境变量缺失: URL=${!supabaseUrl ? '缺失' : '存在'}, Key=${!supabaseAnonKey ? '缺失' : '存在'}`);
      }
      
      // 创建Supabase客户端
      this._client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'X-Client-Info': 'leoai-web-app'
          }
        }
      });
      
      // 短暂延迟以确保客户端初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Supabase客户端初始化成功');
      this._isInitialized = true;
      this._isInitializing = false;
      this._error = null;
      
      // 触发应用已加载完成事件
      window.dispatchEvent(new CustomEvent('app-loaded'));
      
      // 解决Promise
      this._resolveReady(this._client);
      return this._client;
      
    } catch (error) {
      console.error('❌ Supabase初始化失败:', error);
      this._isInitializing = false;
      this._isInitialized = false;
      this._error = error as Error;
      
      // 触发应用已加载完成事件 - 即使失败也需要结束loading状态
      window.dispatchEvent(new CustomEvent('app-loaded'));
      
      // 拒绝Promise
      this._rejectReady(this._error);
      throw error;
    }
  }
}

// 创建服务实例
export const supabaseService = new SupabaseService();

// 向后兼容的初始化状态获取函数
export const getInitializationState = () => supabaseService.getState();

// 代理对象，用于向后兼容
export const supabase = {
  // 原始客户端属性
  get client() {
    return supabaseService.client;
  },
  // 认证相关方法
  auth: {
    getUser: async () => {
      try {
        const client = await supabaseService.ready;
        return client.auth.getUser();
      } catch (error) {
        console.error('无法获取用户信息:', error);
        return { data: { user: null }, error: error as Error };
      }
    },
    signInWithPassword: async (credentials: {email: string, password: string}) => {
      try {
        const client = await supabaseService.ready;
        return client.auth.signInWithPassword(credentials);
      } catch (error) {
        console.error('登录失败:', error);
        return { data: { user: null, session: null }, error: error as Error };
      }
    },
    signUp: async (credentials: {email: string, password: string, options?: any}) => {
      try {
        const client = await supabaseService.ready;
        return client.auth.signUp(credentials);
      } catch (error) {
        console.error('注册失败:', error);
        return { data: { user: null, session: null }, error: error as Error };
      }
    },
    signOut: async () => {
      try {
        const client = await supabaseService.ready;
        return client.auth.signOut();
      } catch (error) {
        console.error('登出失败:', error);
        return { error: error as Error };
      }
    },
    onAuthStateChange: (callback: any) => {
      // 立即初始化一个订阅对象，在初始化后更新
      let subscription: any = { unsubscribe: () => {} };
      
      // 异步处理
      supabaseService.ready
        .then(client => {
          const authSubscription = client.auth.onAuthStateChange(callback);
          subscription = authSubscription.data.subscription;
          return authSubscription;
        })
        .catch(error => {
          console.error('监听认证状态变化失败:', error);
        });
      
      // 返回代理订阅对象
      return { 
        data: { 
          subscription: {
            unsubscribe: () => {
              if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
              }
            }
          }
        }
      };
    }
  },
  // 数据表操作
  from: (table: string) => {
    // 直接返回当前supabase客户端的from方法，避免异步处理
    const client = supabaseService.client;
    if (!client) {
      console.error(`警告: Supabase客户端未初始化，无法访问表 ${table}`);
      throw new Error('Supabase客户端未初始化');
    }
    return client.from(table);
  },
  // 文件存储
  storage: {
    from: (bucket: string) => {
      // 直接返回当前supabase客户端的storage方法，避免异步处理
      const client = supabaseService.client;
      if (!client) {
        console.error(`警告: Supabase客户端未初始化，无法访问存储桶 ${bucket}`);
        throw new Error('Supabase客户端未初始化');
      }
      return client.storage.from(bucket);
    }
  },
  // Edge Functions调用
  functions: {
    invoke: async (functionName: string, options?: {body?: any, method?: string, headers?: Record<string, string>}) => {
      try {
        const client = await supabaseService.ready;
        return client.functions.invoke(functionName, options);
      } catch (error) {
        console.error(`无法调用函数 ${functionName}:`, error);
        throw error;
      }
    }
  },
  // RPC调用
  rpc: async (procedure: string, params?: any) => {
    try {
      const client = await supabaseService.ready;
      return client.rpc(procedure, params);
    } catch (error) {
      console.error(`无法执行RPC ${procedure}:`, error);
      throw error;
    }
  }
};

// 使用supabaseService.ready Promise来等待初始化完成
supabaseService.ready
  .then(() => console.log('🎉 Supabase初始化完成并准备就绪'))
  .catch((err) => console.error('⚠️ Supabase初始化失败:', err));

// 数据库表类型定义
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
        Insert: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          company?: string | null;
          job_title?: string | null;
          industry?: string | null;
          investment_focus?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          social_providers?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          company?: string | null;
          job_title?: string | null;
          industry?: string | null;
          investment_focus?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          social_providers?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
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
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          category?: string;
          is_public?: boolean;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          category?: string;
          is_public?: boolean;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          category: string;
          is_answered: boolean;
          view_count: number;
          answer_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          category?: string;
          is_answered?: boolean;
          view_count?: number;
          answer_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          category?: string;
          is_answered?: boolean;
          view_count?: number;
          answer_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_chat_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          session_title: string;
          created_at: string;
          updated_at: string;
          language: string;
          ai_model: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_title?: string;
          created_at?: string;
          updated_at?: string;
          language?: string;
          ai_model?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_title?: string;
          created_at?: string;
          updated_at?: string;
          language?: string;
          ai_model?: string;
          is_active?: boolean;
        };
      };
      ai_chat_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string | null;
          role: 'user' | 'assistant';
          content: string;
          message_type: 'text' | 'audio' | 'image';
          audio_url: string | null;
          created_at: string;
          ai_model: string | null;
          processing_time_ms: number | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id?: string | null;
          role: 'user' | 'assistant';
          content: string;
          message_type?: 'text' | 'audio' | 'image';
          audio_url?: string | null;
          created_at?: string;
          ai_model?: string | null;
          processing_time_ms?: number | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string | null;
          role?: 'user' | 'assistant';
          content?: string;
          message_type?: 'text' | 'audio' | 'image';
          audio_url?: string | null;
          created_at?: string;
          ai_model?: string | null;
          processing_time_ms?: number | null;
        };
      };
      business_plans: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_url: string;
          file_size: number | null;
          file_type: string;
          upload_status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
          analysis_result: Record<string, any> | null;
          analysis_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_url: string;
          file_size?: number | null;
          file_type?: string;
          upload_status?: 'uploaded' | 'processing' | 'analyzed' | 'failed';
          analysis_result?: Record<string, any> | null;
          analysis_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_url?: string;
          file_size?: number | null;
          file_type?: string;
          upload_status?: 'uploaded' | 'processing' | 'analyzed' | 'failed';
          analysis_result?: Record<string, any> | null;
          analysis_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferred_language: string;
          preferred_ai_model: string;
          preferred_image_model: string;
          theme_preference: 'light' | 'dark' | 'auto';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferred_language?: string;
          preferred_ai_model?: string;
          preferred_image_model?: string;
          theme_preference?: 'light' | 'dark' | 'auto';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferred_language?: string;
          preferred_ai_model?: string;
          preferred_image_model?: string;
          theme_preference?: 'light' | 'dark' | 'auto';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
