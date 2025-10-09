// 此文件现已弃用，统一使用 @/lib/supabase 中的客户端
// 为保持兼容性，从 @/lib/supabase 导入并重新导出

import { supabase as originalSupabase, supabaseService as originalSupabaseService } from './supabase';
import { SupabaseClient, User } from '@supabase/supabase-js';

// 定义兼容的事件名
export const SUPABASE_EVENTS = {
  INITIALIZED: 'supabase-initialized',
  INITIALIZED_SUCCESS: 'supabase-initialized-success',
  INITIALIZED_ERROR: 'supabase-initialized-error',
  STATE_CHANGE: 'supabase-state-change'
};

// 定义兼容的初始化状态类型
export type InitializationState = {
  initialized: boolean;
  initializing: boolean;
  error: Error | null;
  progress: number;
};

// 重新导出 supabase 服务和客户端
export const supabaseService = originalSupabaseService;
export const supabase = originalSupabase;

// 兼容性函数 - 获取状态变化
export const onSupabaseStateChange = (callback: (state: InitializationState) => void): (() => void) => {
  // 创建一个适配器函数，将原始状态转换为此接口所需的状态格式
  const adaptedCallback = () => {
    const originalState = supabaseService.getState();
    const adaptedState: InitializationState = {
      initialized: originalState.initialized,
      initializing: originalState.initializing,
      error: originalState.error,
      progress: 100 // 原始实现没有进度，默认设为100
    };
    callback(adaptedState);
  };
  
  // 立即调用一次
  setTimeout(adaptedCallback, 0);
  
  // 监听原始服务的事件 (如果有)
  const customEventName = 'app-loaded'; // 使用supabase.ts中触发的事件
  const handler = () => adaptedCallback();
  
  window.addEventListener(customEventName, handler);
  
  // 返回清理函数
  return () => {
    window.removeEventListener(customEventName, handler);
  };
};

// 兼容性函数 - 初始化完成监听
export const onSupabaseInitialized = (callback: (success: boolean, error?: Error) => void): (() => void) => {
  // 创建一个适配器函数
  const adaptedCallback = () => {
    const state = supabaseService.getState();
    callback(state.initialized, state.error || undefined);
  };
  
  // 立即调用一次
  setTimeout(adaptedCallback, 0);
  
  // 监听原始服务的事件
  const customEventName = 'app-loaded'; // 使用supabase.ts中触发的事件
  const handler = () => adaptedCallback();
  
  window.addEventListener(customEventName, handler);
  
  // 返回清理函数
  return () => {
    window.removeEventListener(customEventName, handler);
  };
};
