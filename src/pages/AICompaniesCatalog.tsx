import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Star, 
  Building2, 
  ExternalLink, 
  Wrench, 
  Heart, 
  Plus, 
  Search,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Globe,
  Calendar,
  Tag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  listAICompaniesWithTools, 
  getCompanyDetails, 
  getToolDetails,
  submitRating,
  getUserRating,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  linkStoryToTool,
  linkStoryToCompany,
  getToolStories,
  getCompanyStories,
  searchAICompanies,
  searchTools,
  getToolsByCategory,
  getTopRatedTools,
  getLatestTools,
  getUserFavorites
} from '@/services/tools';

type Tool = {
  id: string;
  name: string;
  category: string;
  description: string;
  website?: string;
  logo_url?: string;
  industry_tags: string[];
  free_tier?: boolean;
  api_available?: boolean;
  tool_stats?: { average_rating?: number; total_ratings?: number };
};

type Company = {
  id: string;
  name: string;
  website?: string;
  description: string;
  founded_year?: number;
  headquarters?: string;
  industry_tags: string[];
  logo_url?: string;
  valuation_usd?: number;
  tools: Tool[];
};

// 模拟AI公司数据
const mockCompanies = [
  {
    id: 'openai',
    name: 'OpenAI',
    website: 'https://openai.com',
    description: 'AI研究公司，致力于确保人工通用智能造福全人类',
    founded_year: 2015,
    headquarters: 'San Francisco, CA',
    industry_tags: ['AI Research', 'LLM', 'Generative AI'],
    logo_url: 'https://openai.com/favicon.ico',
    valuation_usd: 300000000000,
    tools: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        category: 'Conversational AI',
        description: 'AI对话助手，能够进行自然语言对话和任务协助',
        website: 'https://chat.openai.com',
        industry_tags: ['Customer Support', 'Content Creation', 'Education'],
        features: ['对话生成', '代码编写', '文本总结', '翻译'],
        api_available: true,
        free_tier: true,
        average_rating: 4.5,
        total_ratings: 1250
      },
      {
        id: 'dalle',
        name: 'DALL-E',
        category: 'Image Generation',
        description: 'AI图像生成模型，根据文本描述创建图像',
        website: 'https://openai.com/dall-e',
        industry_tags: ['Design', 'Marketing', 'Creative'],
        features: ['文本到图像', '图像编辑', '风格转换'],
        api_available: true,
        free_tier: false,
        average_rating: 4.3,
        total_ratings: 890
      },
      {
        id: 'sora',
        name: 'Sora',
        category: 'Video Generation',
        description: 'AI视频生成模型，根据文本创建高质量视频',
        website: 'https://openai.com/sora',
        industry_tags: ['Video Production', 'Marketing', 'Entertainment'],
        features: ['文本到视频', '视频编辑', '场景生成'],
        api_available: false,
        free_tier: false,
        average_rating: 4.7,
        total_ratings: 320
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    website: 'https://anthropic.com',
    description: '专注于构建可靠、可解释的AI系统',
    founded_year: 2021,
    headquarters: 'San Francisco, CA',
    industry_tags: ['AI Safety', 'LLM', 'Constitutional AI'],
    logo_url: 'https://anthropic.com/favicon.ico',
    valuation_usd: 61500000000,
    tools: [
      {
        id: 'claude',
        name: 'Claude',
        category: 'Conversational AI',
        description: 'AI助手，专注于安全、有用和诚实的对话',
        website: 'https://claude.ai',
        industry_tags: ['Customer Support', 'Content Creation', 'Analysis'],
        features: ['长文本处理', '代码分析', '文档总结', '安全对话'],
        api_available: true,
        free_tier: true,
        average_rating: 4.6,
        total_ratings: 980
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    website: 'https://ai.google',
    description: '全球科技巨头，提供广泛的AI产品和服务',
    founded_year: 1998,
    headquarters: 'Mountain View, CA',
    industry_tags: ['Search', 'AI Platform', 'Cloud AI'],
    logo_url: 'https://www.google.com/favicon.ico',
    valuation_usd: 1800000000000,
    tools: [
      {
        id: 'gemini',
        name: 'Gemini',
        category: 'Conversational AI',
        description: 'Google的多模态AI模型',
        website: 'https://gemini.google.com',
        industry_tags: ['Multimodal AI', 'Search', 'Productivity'],
        features: ['文本生成', '图像理解', '代码生成', '搜索增强'],
        api_available: true,
        free_tier: true,
        average_rating: 4.2,
        total_ratings: 750
      }
    ]
  }
];

export default function AICompaniesCatalog() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // 评分和收藏状态
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  
  // 故事创建
  const [storyDialogOpen, setStoryDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyTags, setStoryTags] = useState<string[]>([]);

  // 获取所有类别
  const categories = ['all', ...Array.from(new Set(companies.flatMap(c => c.tools.map(t => t.category))))];
  
  // 获取所有地区
  const regions = ['all', 'Global', 'China', 'US', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America', 'Africa'];
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  // 获取所有技术领域
  const techAreas = ['all', 'Video Generation', 'LLM', 'Computer Vision', 'Speech Recognition', 'Robotics', 'Autonomous Driving', 'Fintech', 'Enterprise AI'];
  const [selectedTechArea, setSelectedTechArea] = useState('all');

  // 页面动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 加载用户数据
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // 筛选和搜索
  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery, selectedCategory, sortBy, selectedRegion, selectedTechArea]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await listAICompaniesWithTools();
      setCompanies(data as Company[]);
    } catch (error) {
      console.error('Failed to load companies:', error);
      // 如果API失败，使用模拟数据作为后备
      setCompanies(mockCompanies);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      // 加载用户评分和收藏
      const favorites = await getUserFavorites(user.id);
      const favoriteIds = new Set(favorites.map(f => f.tool_id));
      setUserFavorites(favoriteIds);
      
      // 加载用户评分
      const ratings: Record<string, number> = {};
      for (const company of companies) {
        for (const tool of company.tools) {
          const rating = await getUserRating(user.id, tool.id);
          if (rating) {
            ratings[tool.id] = rating.rating;
          }
        }
      }
      setUserRatings(ratings);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // 地区筛选
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(company => {
        const headquarters = company.headquarters || '';
        switch (selectedRegion) {
          case 'China':
            return headquarters.includes('中国') || headquarters.includes('China') || 
                   headquarters.includes('北京') || headquarters.includes('上海') || 
                   headquarters.includes('深圳') || headquarters.includes('杭州') ||
                   headquarters.includes('香港') || headquarters.includes('广州') ||
                   headquarters.includes('合肥') || headquarters.includes('苏州');
          case 'US':
            return headquarters.includes('US') || headquarters.includes('United States') ||
                   headquarters.includes('San Francisco') || headquarters.includes('New York') ||
                   headquarters.includes('Mountain View') || headquarters.includes('Redmond') ||
                   headquarters.includes('Menlo Park') || headquarters.includes('Seattle');
          case 'Europe':
            return headquarters.includes('UK') || headquarters.includes('London') ||
                   headquarters.includes('Spain') || headquarters.includes('Malaga') ||
                   headquarters.includes('France') || headquarters.includes('Paris') ||
                   headquarters.includes('Germany') || headquarters.includes('Berlin') ||
                   headquarters.includes('Cambridge') || headquarters.includes('Bristol');
          case 'Asia Pacific':
            return headquarters.includes('新加坡') || headquarters.includes('Singapore') ||
                   headquarters.includes('日本') || headquarters.includes('Japan') ||
                   headquarters.includes('韩国') || headquarters.includes('Korea') ||
                   headquarters.includes('印度') || headquarters.includes('India') ||
                   headquarters.includes('澳大利亚') || headquarters.includes('Australia') ||
                   headquarters.includes('悉尼') || headquarters.includes('Sydney');
          case 'Middle East':
            return headquarters.includes('阿联酋') || headquarters.includes('UAE') ||
                   headquarters.includes('迪拜') || headquarters.includes('Dubai') ||
                   headquarters.includes('以色列') || headquarters.includes('Israel') ||
                   headquarters.includes('耶路撒冷') || headquarters.includes('Jerusalem');
          case 'Latin America':
            return headquarters.includes('巴西') || headquarters.includes('Brazil') ||
                   headquarters.includes('墨西哥') || headquarters.includes('Mexico') ||
                   headquarters.includes('阿根廷') || headquarters.includes('Argentina') ||
                   headquarters.includes('圣保罗') || headquarters.includes('São Paulo');
          case 'Africa':
            return headquarters.includes('南非') || headquarters.includes('South Africa') ||
                   headquarters.includes('约翰内斯堡') || headquarters.includes('Johannesburg');
          case 'Global':
            return true; // 显示所有公司
          default:
            return true;
        }
      });
    }

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        company.tools.some(tool => 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // 技术领域筛选
    if (selectedTechArea !== 'all') {
      filtered = filtered.filter(company => 
        company.industry_tags.includes(selectedTechArea) ||
        company.tools.some(tool => 
          tool.industry_tags.includes(selectedTechArea) ||
          tool.category === selectedTechArea
        )
      );
    }

    // 类别筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.map(company => ({
        ...company,
        tools: company.tools.filter(tool => tool.category === selectedCategory)
      })).filter(company => company.tools.length > 0);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'valuation':
          return (b.valuation_usd || 0) - (a.valuation_usd || 0);
        case 'tools_count':
          return b.tools.length - a.tools.length;
        case 'rating':
          const aAvg = a.tools.reduce((sum, tool) => sum + (tool.tool_stats?.average_rating || 0), 0) / a.tools.length;
          const bAvg = b.tools.reduce((sum, tool) => sum + (tool.tool_stats?.average_rating || 0), 0) / b.tools.length;
          return bAvg - aAvg;
        default:
          return 0;
      }
    });

    setFilteredCompanies(filtered);
  };

  const handleRating = async (toolId: string, rating: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await submitRating(user.id, toolId, rating);
      setUserRatings(prev => ({ ...prev, [toolId]: rating }));
      // 重新加载数据以更新统计
      loadData();
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleFavorite = async (toolId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const isFav = userFavorites.has(toolId);
      if (isFav) {
        await removeFromFavorites(user.id, toolId);
        setUserFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(toolId);
          return newSet;
        });
      } else {
        await addToFavorites(user.id, toolId);
        setUserFavorites(prev => new Set([...prev, toolId]));
      }
      // 重新加载数据以更新统计
      loadData();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleCreateStory = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch('/api/create-tool-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: storyTitle,
          content: storyContent,
          tags: storyTags,
          toolId: selectedTool?.id,
          companyId: selectedCompany?.id,
          userId: user.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('故事创建成功:', result);
        
        // 重置表单
        setStoryDialogOpen(false);
        setStoryTitle('');
        setStoryContent('');
        setStoryTags([]);
        setSelectedTool(null);
        setSelectedCompany(null);
        
        // 可以添加成功提示
        alert('故事创建成功！');
      } else {
        console.error('故事创建失败');
        alert('故事创建失败，请重试');
      }
    } catch (error) {
      console.error('故事创建错误:', error);
      alert('故事创建失败，请重试');
    }
  };

  const openStoryDialog = (tool?: any, company?: any) => {
    setSelectedTool(tool || null);
    setSelectedCompany(company || null);
    
    // 预填充标签
    const tags: string[] = [];
    if (tool) {
      tags.push(tool.name, tool.category, ...tool.industry_tags);
    }
    if (company) {
      tags.push(company.name, ...company.industry_tags);
    }
    setStoryTags(tags);
    
    setStoryDialogOpen(true);
  };

  const renderStars = (rating: number, toolId: string, interactive: boolean = false) => {
    const userRating = userRatings[toolId] || 0;
    const displayRating = userRating || rating;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= displayRating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => handleRating(toolId, star) : undefined}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
        {userRating > 0 && (
          <span className="text-xs text-blue-600 ml-1">(已评分)</span>
        )}
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      <PageHero 
        titleKey="全球AI公司目录"
        subtitleKey="探索全球领先的AI公司及其工具套件，涵盖视频生成、大语言模型、计算机视觉等各技术领域"
        icon={Building2}
      />

      <div className="container-custom py-8">
        {/* 搜索和筛选 */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索公司、工具或技术... (支持中英文)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="选择地区" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>
                          {region === 'all' ? '所有地区' : region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTechArea} onValueChange={setSelectedTechArea}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="技术领域" />
                    </SelectTrigger>
                    <SelectContent>
                      {techAreas.map(area => (
                        <SelectItem key={area} value={area}>
                          {area === 'all' ? '所有技术领域' : area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? '所有类别' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">按名称</SelectItem>
                      <SelectItem value="valuation">按估值</SelectItem>
                      <SelectItem value="tools_count">按工具数量</SelectItem>
                      <SelectItem value="rating">按评分</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 公司列表 */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {company.logo_url && (
                        <img 
                          src={company.logo_url} 
                          alt={company.name}
                          className="w-12 h-12 rounded-lg object-contain"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          <Link to={`/ai-companies/${company.id}`}>{company.name}</Link>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600"
                          >
                            {company.website.replace('https://', '')}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStoryDialog(undefined, company)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        故事
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* 公司描述 */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {company.description}
                    </p>

                    {/* 公司信息 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {company.founded_year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>成立于 {company.founded_year}</span>
                        </div>
                      )}
                      {company.headquarters && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span>{company.headquarters}</span>
                        </div>
                      )}
                      {company.valuation_usd && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span>估值 {formatCurrency(company.valuation_usd)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-gray-400" />
                        <span>{company.tools.length} 个工具</span>
                      </div>
                    </div>

                    {/* 行业标签 */}
                    <div className="flex flex-wrap gap-2">
                      {company.industry_tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {company.industry_tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{company.industry_tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* 工具列表 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">工具套件</h4>
                      <div className="space-y-2">
                        {company.tools.slice(0, 3).map((tool) => (
                          <div key={tool.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{tool.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {tool.category}
                                </Badge>
                                {tool.free_tier && (
                                  <Badge variant="default" className="text-xs">
                                    免费
                                  </Badge>
                                )}
                                {tool.api_available && (
                                  <Badge variant="secondary" className="text-xs">
                                    API
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {tool.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {renderStars(tool.tool_stats?.average_rating || 0, tool.id, true)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleFavorite(tool.id)}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${
                                    userFavorites.has(tool.id) 
                                      ? 'text-red-500 fill-red-500' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openStoryDialog(tool, company)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {company.tools.length > 3 && (
                          <div className="text-center">
                            <Button variant="outline" size="sm">
                              查看全部 {company.tools.length} 个工具
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* 故事创建对话框 */}
        <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                创建故事 - {selectedTool?.name || selectedCompany?.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="story-title">标题</Label>
                <Input
                  id="story-title"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="输入故事标题..."
                />
              </div>
              
              <div>
                <Label htmlFor="story-content">内容</Label>
                <Textarea
                  id="story-content"
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="分享你的使用体验、评价或见解..."
                  rows={6}
                />
              </div>
              
              <div>
                <Label>标签（已预填充）</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {storyTags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStoryDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateStory}>
                  创建故事
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}