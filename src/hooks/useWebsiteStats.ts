import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface WebsiteStats {
  total_users: number;
  total_qa: number;
  total_bp_analysis: number;
  avg_response_time: number;
}

interface UseWebsiteStatsReturn {
  stats: WebsiteStats;
  isLoading: boolean;
  error: string | null;
  incrementStat: (type: 'user_registration' | 'qa_session' | 'bp_analysis') => Promise<void>;
  updateResponseTime: (responseTime: number) => Promise<void>;
}

// 默认统计数据
const DEFAULT_STATS: WebsiteStats = {
  total_users: 12580,
  total_qa: 3240,
  total_bp_analysis: 123,
  avg_response_time: 8.3
};

export function useWebsiteStats(): UseWebsiteStatsReturn {
  const [stats, setStats] = useState<WebsiteStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('stats-manager', {
        method: 'GET',
        query: { action: 'get' }
      });

      if (error) {
        console.error('Failed to fetch stats:', error);
        setStats(DEFAULT_STATS); // 使用默认数据
      } else if (data?.success && data?.data) {
        setStats(data.data);
      } else {
        setStats(DEFAULT_STATS);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats(DEFAULT_STATS);
    } finally {
      setIsLoading(false);
    }
  };

  // 增加统计数据
  const incrementStat = async (type: 'user_registration' | 'qa_session' | 'bp_analysis') => {
    try {
      const { data, error } = await supabase.functions.invoke('stats-manager', {
        method: 'POST',
        body: { type },
        query: { action: 'increment' }
      });

      if (error) {
        console.error('Failed to increment stat:', error);
      } else if (data?.success && data?.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error incrementing stat:', err);
    }
  };

  // 更新响应时间
  const updateResponseTime = async (responseTime: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('stats-manager', {
        method: 'POST',
        body: { responseTime },
        query: { action: 'update_response_time' }
      });

      if (error) {
        console.error('Failed to update response time:', error);
      } else if (data?.success && data?.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error updating response time:', err);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    incrementStat,
    updateResponseTime
  };
}
