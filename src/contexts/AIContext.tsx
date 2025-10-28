import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface GeoLocationData {
  countryCode: string;
  detectedLanguage: string;
}

interface AIModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  recommended: boolean;
  avgResponseTime?: number; // 平均响应时间（毫秒）
  responseCount?: number; // 响应次数（用于计算平均响应时间）
}

interface ModelConfigs {
  chat: {
    available: AIModelConfig[];
  };
  image: {
    available: AIModelConfig[];
  };
}

interface AIContextType {
  region: string;
  selectedChatModel: string;
  selectedImageModel: string;
  modelConfigs: ModelConfigs | null;
  isLoading: boolean;
  setSelectedChatModel: (model: string) => void;
  setSelectedImageModel: (model: string) => void;
  refreshGeoLocation: () => void;
  updateModelResponseTime: (modelId: string, responseTime: number) => void; // 更新模型响应时间
  getModelResponseTime: (modelId: string) => number | undefined; // 获取模型响应时间
  getPerformanceIndicator: (modelId: string) => string; // 获取性能指标图标
  getSortedModels: () => AIModelConfig[]; // 获取按响应时间排序的模型列表
  getRecommendedModel: () => string; // 获取推荐的模型（最快的）
  updateAverageResponseTime: (modelId: string, responseTime: number) => void; // 更新模型平均响应时间
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [region, setRegion] = useState('overseas');
  const [selectedChatModel, setSelectedChatModel] = useState('openai'); // 默认使用OpenAI GPT-4o
  const [selectedImageModel, setSelectedImageModel] = useState('dall-e');
  const [modelConfigs, setModelConfigs] = useState<ModelConfigs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshGeoLocation = async () => {
    setIsLoading(true);
    try {
      // 调用模型选择 Edge Function
      const { data, error } = await supabase.functions.invoke('geo-ai-model-selection', {
        method: 'GET',
      });

      if (error) {
        throw new Error(`模型选择服务错误: ${error.message}`);
      }

      console.log('获取到地理定位数据:', data);
      const modelData = data.data;
      setRegion(modelData.region);

      // 更新模型配置
      setModelConfigs(modelData.modelConfigs);

      // 读取已保存的用户选择
      const savedChatModel = localStorage.getItem('leoai-chat-model');

      // 推荐模型（服务端基于区域返回）
      const recommendedChatModel = modelData.recommendedModels.chat;

      // 如果用户未保存过，则采用推荐
      if (!savedChatModel) {
        setSelectedChatModel(recommendedChatModel);
        localStorage.setItem('leoai-chat-model', recommendedChatModel);
      } else {
        // 若已保存过，但该模型在当前区域不可用，则切到推荐
        const available = modelData.modelConfigs?.chat?.available || [];
        const savedAvailable = available.find(m => m.id === savedChatModel && m.enabled);
        const isChina = modelData.region === 'china' || modelData.region === 'CN';
        const isOverseas = !isChina;

        let nextModel = savedChatModel;
        if (!savedAvailable) {
          nextModel = recommendedChatModel;
        } else {
          // 区域优先策略：国内避免优先 OpenAI；海外避免优先 Qwen
          if (isChina && savedChatModel === 'openai') nextModel = 'qwen';
          if (isOverseas && savedChatModel === 'qwen') nextModel = 'openai';
        }

        if (nextModel !== savedChatModel) {
          setSelectedChatModel(nextModel);
          localStorage.setItem('leoai-chat-model', nextModel);
        } else {
          setSelectedChatModel(savedChatModel);
        }
      }

      // 图片模型
      const savedImageModel = localStorage.getItem('leoai-image-model');
      if (!savedImageModel) {
        setSelectedImageModel(modelData.recommendedModels.image);
        localStorage.setItem('leoai-image-model', modelData.recommendedModels.image);
      }

      // 保存区域信息
      localStorage.setItem('leoai-region', modelData.region);
      localStorage.setItem('leoai-recommended-model', recommendedChatModel);
    } catch (error) {
      console.error('获取基于地理位置的模型配置失败:', error);
      // 使用本地兜底配置
      setRegion('overseas');
      const defaultModel = 'openai';
      setSelectedChatModel(defaultModel);
      setSelectedImageModel('dall-e');
      setModelConfigs({
        chat: {
          available: [
            { id: 'openai', name: 'OpenAI GPT-4o', enabled: true, recommended: true },
            { id: 'qwen', name: 'Qwen Turbo', enabled: true, recommended: false },
            { id: 'deepseek', name: 'DeepSeek', enabled: true, recommended: false },
          ]
        },
        image: {
          available: [
            { id: 'dall-e', name: 'DALL·E', enabled: true, recommended: true }
          ]
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 设置初始化状态
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const savedChatModel = localStorage.getItem('leoai-chat-model');
        const savedImageModel = localStorage.getItem('leoai-image-model');
        const savedRegion = localStorage.getItem('leoai-region');
        const savedRecommendedModel = localStorage.getItem('leoai-recommended-model');

        if (savedChatModel) {
          setSelectedChatModel(savedChatModel);
        } else if (savedRecommendedModel) {
          setSelectedChatModel(savedRecommendedModel);
        } else {
          const currentLang = localStorage.getItem('i18nextLng') || 'en';
          const defaultModel = getRecommendedModelByUserPreference(currentLang);
          setSelectedChatModel(defaultModel);
          if (!modelConfigs) {
            setModelConfigs({
              chat: {
                available: [
                  { id: 'openai', name: 'OpenAI GPT-4o', enabled: true, recommended: true },
                  { id: 'qwen', name: 'Qwen Turbo', enabled: true, recommended: false },
                  { id: 'deepseek', name: 'DeepSeek', enabled: true, recommended: false },
                ]
              },
              image: {
                available: [
                  { id: 'dall-e', name: 'DALL·E', enabled: true, recommended: true }
                ]
              }
            });
          }
        }
        if (savedImageModel) setSelectedImageModel(savedImageModel);
        if (savedRegion) setRegion(savedRegion);
        await refreshGeoLocation();
      } catch (error) {
        console.error('初始化AI上下文失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleSetSelectedChatModel = (model: string) => {
    console.log(`切换模型为: ${model}`);
    setSelectedChatModel(model);
    localStorage.setItem('leoai-chat-model', model);
    window.dispatchEvent(new CustomEvent('model-changed', { detail: { model } }));
  };

  const handleSetSelectedImageModel = (model: string) => {
    setSelectedImageModel(model);
    localStorage.setItem('leoai-image-model', model);
  };

  const updateModelResponseTime = (modelId: string, responseTime: number) => {
    updateAverageResponseTime(modelId, responseTime);
  };

  const getModelResponseTime = (modelId: string): number | undefined => {
    if (!modelConfigs) return undefined;
    const model = modelConfigs.chat.available.find(m => m.id === modelId);
    if (model?.avgResponseTime) {
      return Math.round(model.avgResponseTime / 1000);
    }
    return undefined;
  };

  const getPerformanceIndicator = (modelId: string): string => {
    const responseTime = getModelResponseTime(modelId);
    if (responseTime === undefined) return '⚙️';
    if (responseTime <= 10) return '⚡';
    if (responseTime <= 20) return '🜀';
    return '🚀';
  };
  
  const getSortedModels = (): AIModelConfig[] => {
    if (!modelConfigs) return [];
    const models = [...modelConfigs.chat.available];
    return models.sort((a, b) => {
      const timeA = a.avgResponseTime || Number.MAX_SAFE_INTEGER;
      const timeB = b.avgResponseTime || Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    });
  };
  
  const getRecommendedModelByUserPreference = (userLanguage: string): string => {
    const isChineseUser = userLanguage.toLowerCase().startsWith('zh');
    const timezone = new Date().getTimezoneOffset() / -60;
    const possibleChineseUser = isChineseUser || timezone === 8;
    if (possibleChineseUser && isChineseUser) {
      return 'qwen';
    } else {
      return 'openai';
    }
  };
  
  const getRecommendedModel = (): string => {
    const userDefinedModel = localStorage.getItem('leoai-chat-model-preference');
    if (userDefinedModel) return userDefinedModel;
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    const languageBasedModel = getRecommendedModelByUserPreference(currentLang);
    const sortedModels = getSortedModels();
    const fastestModel = sortedModels.find(m => m.enabled);
    const fastestModelId = fastestModel?.id || 'deepseek';
    return languageBasedModel || fastestModelId;
  };
  
  const updateAverageResponseTime = (modelId: string, responseTime: number) => {
    if (!modelConfigs) return;
    setModelConfigs((prevConfigs) => {
      if (!prevConfigs) return prevConfigs;
      const newConfigs = {
        ...prevConfigs,
        chat: {
          ...prevConfigs.chat,
          available: [...prevConfigs.chat.available]
        }
      };
      const idx = newConfigs.chat.available.findIndex(m => m.id === modelId);
      if (idx >= 0) {
        const m = { ...newConfigs.chat.available[idx] };
        // 指数平滑更新
        const alpha = 0.3;
        const prev = m.avgResponseTime || responseTime;
        m.avgResponseTime = Math.round(alpha * responseTime + (1 - alpha) * prev);
        newConfigs.chat.available[idx] = m;
      }
      return newConfigs;
    });
  };

  return (
    <AIContext.Provider value={{
      region,
      selectedChatModel,
      selectedImageModel,
      modelConfigs,
      isLoading,
      setSelectedChatModel: handleSetSelectedChatModel,
      setSelectedImageModel: handleSetSelectedImageModel,
      refreshGeoLocation,
      updateModelResponseTime,
      getModelResponseTime,
      getPerformanceIndicator,
      getSortedModels,
      getRecommendedModel,
      updateAverageResponseTime,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
}