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

      // 根据区域选择模型
      const recommendedChatModel = modelData.recommendedModels.chat;
      
      // 更新模型配置
      setModelConfigs(modelData.modelConfigs);

      // 如果用户没有手动选择模型，则使用建议模型
      const savedChatModel = localStorage.getItem('leoai-chat-model');
      if (!savedChatModel) {
        setSelectedChatModel(recommendedChatModel);
      }

      // 保存图像模型选择
      const savedImageModel = localStorage.getItem('leoai-image-model');
      if (!savedImageModel) {
        setSelectedImageModel(modelData.recommendedModels.image);
      }

      // 保存区域信息到本地存储
      localStorage.setItem('leoai-region', modelData.region);
      localStorage.setItem('leoai-recommended-model', recommendedChatModel);
    } catch (error) {
      console.error('获取基于地理位置的模型配置失败:', error);
      // 使用本地兜底配置，提供 openai/qwen/deepseek 三模型
      setRegion('overseas');
      const defaultModel = 'openai'; // GPT-4o 作为默认
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
    // 设置初始化状态
    const initialize = async () => {
      try {
        setIsLoading(true);
        // 加载保存的偏好设置
        const savedChatModel = localStorage.getItem('leoai-chat-model');
        const savedImageModel = localStorage.getItem('leoai-image-model');
        const savedRegion = localStorage.getItem('leoai-region');
        const savedRecommendedModel = localStorage.getItem('leoai-recommended-model');

        // 优先使用用户手动选择的模型
        if (savedChatModel) {
          setSelectedChatModel(savedChatModel);
        } else if (savedRecommendedModel) {
          // 其次使用之前检测到的推荐模型
          setSelectedChatModel(savedRecommendedModel);
        } else {
          // 最后使用默认模型
          const currentLang = localStorage.getItem('i18nextLng') || 'en';
          const defaultModel = getRecommendedModelByUserPreference(currentLang);
          setSelectedChatModel(defaultModel);
          // 若远端未返回，初始化本地兜底模型列表
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
        
        if (savedImageModel) {
          setSelectedImageModel(savedImageModel);
        }

        if (savedRegion) {
          setRegion(savedRegion);
        }

        // 获取基于地理位置的配置
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
    // 触发自定义事件，通知UI更新
    window.dispatchEvent(new CustomEvent('model-changed', { detail: { model } }));
  };

  const handleSetSelectedImageModel = (model: string) => {
    setSelectedImageModel(model);
    localStorage.setItem('leoai-image-model', model);
  };

  // 更新模型响应时间（兼容旧版本API，实际调用updateAverageResponseTime）
  const updateModelResponseTime = (modelId: string, responseTime: number) => {
    updateAverageResponseTime(modelId, responseTime);
  };

  // 获取模型响应时间
  const getModelResponseTime = (modelId: string): number | undefined => {
    if (!modelConfigs) return undefined;
    
    const model = modelConfigs.chat.available.find(m => m.id === modelId);
    // 如果响应时间存在，从毫秒转换为秒
    if (model?.avgResponseTime) {
      return Math.round(model.avgResponseTime / 1000);
    }
    return undefined;
  };

  // 获取性能指标图标
  const getPerformanceIndicator = (modelId: string): string => {
    const responseTime = getModelResponseTime(modelId);
    if (responseTime === undefined) return '⚙️'; // 默认图标
    
    if (responseTime <= 10) return '⚡'; // 快速
    if (responseTime <= 20) return '🜀'; // 中等
    return '🚀'; // 较慢
  };
  
  // 获取按响应时间排序的模型列表
  const getSortedModels = (): AIModelConfig[] => {
    if (!modelConfigs) return [];
    
    // 复制模型列表，避免修改原始数据
    const models = [...modelConfigs.chat.available];
    
    // 按响应时间排序（从快到慢）
    return models.sort((a, b) => {
      const timeA = a.avgResponseTime || Number.MAX_SAFE_INTEGER;
      const timeB = b.avgResponseTime || Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    });
  };
  
  // 获取基于用户语言和区域的推荐模型
  const getRecommendedModelByUserPreference = (userLanguage: string): string => {
    // 获取用户当前语言 (i18n 语言设置)
    const isChineseUser = userLanguage.toLowerCase().startsWith('zh');
    
    // 检查是否可能是中国用户 (基于时区和语言等因素)
    const timezone = new Date().getTimezoneOffset() / -60;
    const possibleChineseUser = isChineseUser || timezone === 8; // 中国标准时区是UTC+8
    
    // 根据不同语言返回不同的模型
    // 简体及繁体中文用户（中国IP）默认使用 Qwen（阿里通义千问）
    // 英文和其他语言用户（海外IP）默认使用 OpenAI GPT-4o
    if (possibleChineseUser && isChineseUser) {
      return 'qwen'; // 中国用户使用Qwen（阿里通义千问）
    } else {
      return 'openai'; // 所有其他用户优先使用OpenAI GPT-4o
    }
  };
  
  // 获取推荐的模型（根据用户语言或者选择响应最快的）
  const getRecommendedModel = (): string => {
    // 优先级:
    // 1. 手动设置的模型
    // 2. 根据语言自动选择的模型
    // 3. 响应最快的模型
    
    // 检查是否有用户自定义设置
    const userDefinedModel = localStorage.getItem('leoai-chat-model-preference');
    if (userDefinedModel) {
      return userDefinedModel;
    }
    
    // 语言优化选择
    // 从 localStorage 获取当前语言
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    const languageBasedModel = getRecommendedModelByUserPreference(currentLang);
    
    // 获取响应最快的模型（在没有其他偏好设置的情况下作为备用）
    const sortedModels = getSortedModels();
    const fastestModel = sortedModels.find(m => m.enabled);
    const fastestModelId = fastestModel?.id || 'deepseek'; // 默认就是 deepseek
    
    // 返回语言优化选择或最快模型
    return languageBasedModel || fastestModelId;
  };
  
  // 更新模型平均响应时间（基于多次测量的实时平均）
  const updateAverageResponseTime = (modelId: string, responseTime: number) => {
    if (!modelConfigs) return;

    setModelConfigs((prevConfigs) => {
      if (!prevConfigs) return prevConfigs;

      // 深复制当前配置
      const newConfigs = {
        ...prevConfigs,
        chat: {
          ...prevConfigs.chat,
          available: [...prevConfigs.chat.available]
        }
      };

      // 查找并更新目标模型
      const modelIndex = newConfigs.chat.available.findIndex(model => model.id === modelId);
      if (modelIndex !== -1) {
        const model = newConfigs.chat.available[modelIndex];
        const currentCount = model.responseCount || 0;
        const currentAvgTime = model.avgResponseTime || 0;
        
        // 计算新的平均响应时间（毫秒）
        const newCount = currentCount + 1;
        // 响应时间传入的是秒，需要转换为毫秒进行存储
        const responseTimeMs = responseTime * 1000;
        const newAvgTime = Math.round((currentAvgTime * currentCount + responseTimeMs) / newCount);
        
        newConfigs.chat.available[modelIndex] = {
          ...model,
          avgResponseTime: newAvgTime,
          responseCount: newCount
        };

        // 自动设置最快的模型为默认推荐
        const sortedModels = [...newConfigs.chat.available].sort((a, b) => {
          const timeA = a.avgResponseTime || Number.MAX_SAFE_INTEGER;
          const timeB = b.avgResponseTime || Number.MAX_SAFE_INTEGER;
          return timeA - timeB;
        });
        
        // 更新推荐状态
        if (sortedModels.length > 0) {
          const fastestModelId = sortedModels[0].id;
          newConfigs.chat.available = newConfigs.chat.available.map(m => ({
            ...m,
            recommended: m.id === fastestModelId
          }));
        }

        // 保存到本地存储
        localStorage.setItem(`leoai-model-${modelId}-avgTime`, newAvgTime.toString());
        localStorage.setItem(`leoai-model-${modelId}-count`, newCount.toString());
        
        // 如果这个模型是最快的，自动设置为默认
        const fastestModel = sortedModels[0];
        if (fastestModel && fastestModel.id !== selectedChatModel) {
          // 不立即切换，只在本地存储中标记
          localStorage.setItem('leoai-fastest-model', fastestModel.id);
        }
      }

      return newConfigs;
    });
  };

  useEffect(() => {
    // 从本地存储加载模型响应时间统计
    const loadModelStats = () => {
      if (modelConfigs) {
        const newConfigs = {
          ...modelConfigs,
          chat: {
            ...modelConfigs.chat,
            available: [...modelConfigs.chat.available]
          }
        };

        // 从本地存储中加载并更新每个模型的数据
        newConfigs.chat.available.forEach((model, index) => {
          const savedAvgTime = localStorage.getItem(`leoai-model-${model.id}-avgTime`);
          const savedCount = localStorage.getItem(`leoai-model-${model.id}-count`);
          
          if (savedAvgTime && savedCount) {
            newConfigs.chat.available[index] = {
              ...model,
              avgResponseTime: parseInt(savedAvgTime),
              responseCount: parseInt(savedCount)
            };
          }
        });

        setModelConfigs(newConfigs);
      }
    };

    loadModelStats();
  }, [modelConfigs?.chat.available.length]); // 仅在模型列表加载时执行

  const value = {
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
    updateAverageResponseTime
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}