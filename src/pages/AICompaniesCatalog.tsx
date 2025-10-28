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
  Building, 
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
  Tag,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Crown,
  Zap,
  Target,
  Sparkles,
  Layers
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  getProjectsByCategory,
  getTopRatedTools,
  getLatestTools,
  getUserFavorites
} from '@/services/tools';

type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  website?: string;
  logo_url?: string;
  industry_tags: string[];
  free_tier?: boolean;
  api_available?: boolean;
  project_stats?: { average_rating?: number; total_ratings?: number };
  project_category?: string;
  project_subcategory?: string;
  focus_areas?: string[];
  project_type?: string;
  pricing_model?: string;
  target_audience?: string;
  technology_stack?: string[];
  use_cases?: string[];
  integrations?: string[];
  documentation_url?: string;
  github_url?: string;
  demo_url?: string;
  pricing_url?: string;
  launch_date?: string;
  status?: string;
};

type Company = {
  id: string;
  name: string;
  website?: string;
  description: string;
  detailed_description?: string;
  founded_year?: number;
  headquarters?: string;
  industry_tags: string[];
  logo_url?: string;
  logo_base64?: string;
  valuation_usd?: number;
  projects: Project[];
  fundings: any[];
  stories: any[];
  company_type?: string;
  company_tier?: string;
  company_category?: string;
  focus_areas?: string[];
};

export default function AICompaniesCatalog() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyTier, setSelectedCompanyTier] = useState('all');
  const [selectedProjectCategory, setSelectedProjectCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  const [storyDialog, setStoryDialog] = useState<{ open: boolean; project?: Project; company?: Company }>({ open: false });
  const [storyContent, setStoryContent] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Company tier filters（重命名：Tier1->Giants，Tier2->Unicorns）
  const companyTiers = [
    { value: 'all', label: 'All Tiers' },
    { value: 'Giants', label: 'Giants', icon: Crown, color: 'text-yellow-600' },
    { value: 'Unicorns', label: 'Unicorns (≥ $1B)', icon: Sparkles, color: 'text-pink-500' },
    { value: 'Independent', label: 'Independent', icon: Zap, color: 'text-blue-500' },
    { value: 'Emerging', label: 'Emerging', icon: Target, color: 'text-green-500' }
  ];

  // Giants 名单与特例
  const GIANTS_SET = new Set([
    'OpenAI', 'Google', 'Microsoft', 'Meta', 'xAI', 'Baidu', 'Tencent', 'ByteDance', 'Alibaba'
  ]);

  const FORCE_UNICORNS_SET = new Set([
    'Adobe'
  ]);

  // Project category filters
  const projectCategories = [
    { value: 'all', label: 'All Project Categories' },
    { value: 'LLM & Language Models', label: 'LLM & Language Models', icon: Layers, color: 'text-purple-500' },
    { value: 'Image Processing & Generation', label: 'Image Processing & Generation', icon: Target, color: 'text-pink-500' },
    { value: 'Video Processing & Generation', label: 'Video Processing & Generation', icon: Target, color: 'text-red-500' },
    { value: 'Professional Domain Analysis', label: 'Professional Domain Analysis', icon: Building, color: 'text-blue-500' },
    { value: 'Virtual Companions', label: 'Virtual Companions', icon: Users, color: 'text-green-500' },
    { value: 'Virtual Employees & Assistants', label: 'Virtual Employees & Assistants', icon: Users, color: 'text-indigo-500' },
    { value: 'Voice & Audio AI', label: 'Voice & Audio AI', icon: Target, color: 'text-orange-500' },
    { value: 'Search & Information Retrieval', label: 'Search & Information Retrieval', icon: Search, color: 'text-cyan-500' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Company Name' },
    { value: 'company_tier', label: 'Company Tier' },
    { value: 'tools_count', label: 'Number of Tools' },
    { value: 'valuation', label: 'Valuation' },
    { value: 'rating', label: 'Average Rating' },
    { value: 'founded_year', label: 'Founded Year' }
  ];

  // 检测页面可见性 - 从详情页返回时重新加载数据
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && companies.length === 0) {
        console.log('📄 页面恢复可见且数据为空，重新加载...');
        loadCompanies();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [companies.length]);

  // 初始加载
  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (isAuthenticated && companies.length > 0) {
      loadUserData();
    }
  }, [isAuthenticated, companies]);

  useEffect(() => {
    // 过滤（移除 company type 相关逻辑）
    let temp = [...companies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(c => c.name?.toLowerCase().includes(q));
    }

    if (selectedCompanyTier !== 'all') {
      temp = temp.filter(company => computeDisplayTier(company) === selectedCompanyTier);
    }

    if (selectedProjectCategory !== 'all') {
      temp = temp.filter(company => company.projects?.some((p: any) => p.project_category === selectedProjectCategory));
    }

    // 排序（映射到计算后的展示层级）
    const sorters: Record<string, (a: Company, b: Company) => number> = {
      name: (a, b) => (a.name || '').localeCompare(b.name || ''),
      company_tier: (a, b) => {
        const tierOrder: Record<string, number> = { Giants: 1, Unicorns: 2, Independent: 3, Emerging: 4 };
        const aVal = tierOrder[computeDisplayTier(a) || 'zzz'] || 5;
        const bVal = tierOrder[computeDisplayTier(b) || 'zzz'] || 5;
        return aVal - bVal;
      }
    };

    const sorter = sorters[sortBy] || sorters.name;
    temp.sort((a, b) => sortOrder === 'asc' ? sorter(a, b) : -sorter(a, b));

    setFilteredCompanies(temp);
  }, [companies, searchQuery, selectedCompanyTier, selectedProjectCategory, sortBy, sortOrder]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      console.log('🔄 开始加载公司数据...');
      const data = await listAICompaniesWithTools();
      console.log('📊 加载的公司数据:', data?.length || 0, '家公司');
      console.log('📝 数据示例:', data?.[0]);
      setCompanies(data || []);
      
      // 如果没有数据，显示提示
      if (!data || data.length === 0) {
        console.log('⚠️ 数据库中没有公司数据，可能需要先运行数据生成');
      }
    } catch (error: any) {
      console.error('❌ 加载公司数据失败:', error);
      console.error('错误详情:', error.message, error.stack);
      setCompanies([]);
      alert(`加载失败: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('✅ 公司数据加载完成，loading状态已关闭');
    }
  };

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      // Load user ratings
      const ratings: Record<string, number> = {};
      for (const company of companies) {
        for (const project of company.projects) {
          const rating = await getUserRating(project.id, user.id);
          if (rating) ratings[project.id] = rating;
        }
      }
      setUserRatings(ratings);

      // Load user favorites
      const favorites = await getUserFavorites(user.id);
      setUserFavorites(new Set(favorites));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...companies];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(query) ||
        company.description.toLowerCase().includes(query) ||
        company.industry_tags.some(tag => tag.toLowerCase().includes(query)) ||
        company.projects.some(project => 
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
        )
      );
    }

    // Company type filter
    if (selectedCompanyType !== 'all') {
      filtered = filtered.filter(company => 
        company.company_type === selectedCompanyType
      );
    }

    // Company tier filter
    if (selectedCompanyTier !== 'all') {
      filtered = filtered.filter(company => 
        computeDisplayTier(company) === selectedCompanyTier
      );
    }

    // Project category filter
    if (selectedProjectCategory !== 'all') {
      filtered = filtered.filter(company => 
        company.projects.some(project => project.project_category === selectedProjectCategory)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company_tier':
          const tierOrder: Record<string, number> = { Giants: 1, Unicorns: 2, Independent: 3, Emerging: 4 };
          aValue = tierOrder[computeDisplayTier(a) || 'zzz'] || 5;
          bValue = tierOrder[computeDisplayTier(b) || 'zzz'] || 5;
          break;
        case 'projects_count':
          aValue = a.projects.length;
          bValue = b.projects.length;
          break;
        case 'valuation':
          aValue = a.valuation_usd || 0;
          bValue = b.valuation_usd || 0;
          break;
        case 'rating':
          aValue = a.projects.reduce((sum, project) => sum + (project.project_stats?.average_rating || 0), 0) / a.projects.length || 0;
          bValue = b.projects.reduce((sum, project) => sum + (project.project_stats?.average_rating || 0), 0) / b.projects.length || 0;
          break;
        case 'founded_year':
          aValue = a.founded_year || 0;
          bValue = b.founded_year || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCompanies(filtered);
  };

  // Pagination logic
  const getPaginatedCompanies = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCompanyTier, selectedProjectCategory]);

  // Tag navigation handler
  const navigateToTag = (tag: string) => {
    const filteredByTag = companies.filter(company =>
      company.industry_tags?.includes(tag) || 
      company.projects.some(p => p.industry_tags?.includes(tag))
    );
    setFilteredCompanies(filteredByTag);
    setSearchQuery(tag);
    setCurrentPage(1);
  };

  const handleRating = async (projectId: string, rating: number) => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }

    try {
      await submitRating(projectId, rating, user.id);
      setUserRatings(prev => ({ ...prev, [projectId]: rating }));
      
      // Reload companies to get updated ratings
      loadCompanies();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleFavorite = async (projectId: string) => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }

    try {
      const isFav = userFavorites.has(projectId);
      if (isFav) {
        await removeFromFavorites(projectId, user.id);
        setUserFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
      } else {
        await addToFavorites(projectId, user.id);
        setUserFavorites(prev => new Set(prev).add(projectId));
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const openStoryDialog = (project: Project, company: Company) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setStoryDialog({ open: true, project, company });
  };

  const submitStory = async () => {
    if (!storyDialog.project || !storyDialog.company || !storyTitle.trim() || !storyContent.trim()) {
      return;
    }

    try {
      const storyData = {
        title: storyTitle,
        content: storyContent,
        tags: [storyDialog.company.name, storyDialog.project.name, ...storyDialog.project.industry_tags]
      };
      await linkStoryToTool(storyDialog.project.id, JSON.stringify(storyData));
      
      setStoryDialog({ open: false });
      setStoryTitle('');
      setStoryContent('');
    } catch (error) {
      console.error('Error submitting story:', error);
    }
  };

  const renderStars = (rating: number, projectId: string, interactive: boolean = false) => {
    const userRating = userRatings[projectId] || 0;
    const displayRating = userRating || rating;
    
    return (
      <div className="flex items-center gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= displayRating 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-muted-foreground/40'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
            onClick={interactive ? () => handleRating(projectId, star) : undefined}
          />
        ))}
        <span className="text-xs sm:text-sm text-muted-foreground ml-0.5 sm:ml-1">
          {rating.toFixed(1)}
        </span>
        {userRating > 0 && (
          <span className="text-xs text-primary ml-0.5 sm:ml-1 hidden sm:inline">(Rated)</span>
        )}
      </div>
    );
  };

  const formatValuation = (valuation?: number) => {
    if (!valuation) return 'N/A';
    if (valuation >= 1e12) return `$${(valuation / 1e12).toFixed(1)}T`;
    if (valuation >= 1e9) return `$${(valuation / 1e9).toFixed(1)}B`;
    if (valuation >= 1e6) return `$${(valuation / 1e6).toFixed(1)}M`;
    return `$${valuation.toLocaleString()}`;
  };

  const getCompanyTypeIcon = (companyType?: string) => {
    switch (companyType) {
      case 'AI Giant':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Independent AI':
        return <Zap className="w-4 h-4 text-blue-500" />;
      default:
        return <Building className="w-4 h-4 text-green-500" />;
    }
  };

  // 计算显示用Tier（基于名称与估值规则）
  const computeDisplayTier = (company: Company): string | undefined => {
    const name = company.name?.trim() || '';
    const valuation = (company as any).valuation as number | undefined;
    if (GIANTS_SET.has(name)) return 'Giants';
    if (FORCE_UNICORNS_SET.has(name)) return 'Unicorns';
    if (typeof valuation === 'number' && valuation >= 1_000_000_000) return 'Unicorns';
    // 兼容旧数据：Tier 1/2 映射
    const raw = (company as any).company_tier || (company as any).tier;
    if (raw === 'Tier 1') return 'Giants';
    if (raw === 'Tier 2') return 'Unicorns';
    return raw;
  };

  const getCompanyTierBadge = (tier?: string) => {
    if (!tier) return null;
    const textMap: Record<string,string> = { Giants: 'Giant', Unicorns: 'Unicorn' };
    const colorMap: Record<string,string> = {
      Giants: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      Unicorns: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      Independent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Emerging: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    const Icon = tier === 'Giants' ? Crown : tier === 'Unicorns' ? Sparkles : undefined;
    return (
      <Badge className={`text-xs inline-flex items-center gap-1 ${colorMap[tier] || 'bg-gray-100 text-gray-800'}`}>
        {Icon && <Icon className="w-3.5 h-3.5" />} {textMap[tier] || tier}
      </Badge>
    );
  };

  // map selected filter to computed tier
  const tierMatches = (company: Company) => {
    if (selectedCompanyTier === 'all') return true;
    return computeDisplayTier(company) === selectedCompanyTier;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (!loading && companies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              暂无AI公司数据
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              数据库中还没有AI公司数据，请先运行数据生成。
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/reconfigure-data')}
              className="w-full"
            >
              前往数据生成页面
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              刷新页面
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">AI Companies Catalog</h1>
          <p className="text-xl opacity-90">Discover AI Giants, Independent AI companies, and their specialized tools</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search companies, tools, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg mb-6"
            >
              <div>
                <Label className="text-sm font-medium mb-2 block">Company Tier</Label>
                <Select value={selectedCompanyTier} onValueChange={setSelectedCompanyTier}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTiers.map(tier => (
                      <SelectItem key={tier.value} value={tier.value}>
                        <div className="flex items-center gap-2">
                          {tier.icon && <tier.icon className={`w-4 h-4 ${tier.color}`} />}
                          {tier.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Project Category</Label>
                <Select value={selectedProjectCategory} onValueChange={setSelectedProjectCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          {category.icon && <category.icon className={`w-4 h-4 ${category.color}`} />}
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Order</Label>
                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4" />
                        Ascending
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="w-4 h-4" />
                        Descending
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCompanies.length} of {companies.length} companies
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCompanyTier !== 'all' && ` at ${selectedCompanyTier} tier`}
            {selectedProjectCategory !== 'all' && ` with ${selectedProjectCategory} projects`}
          </p>
        </div>

        {/* Companies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPaginatedCompanies().map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-border/50 dark:border-border/30 hover:border-border dark:hover:border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {company.logo_storage_url ? (
                            <img
                              src={company.logo_storage_url}
                              alt={company.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Fallback to logo_url if storage fails
                                if (company.logo_url) {
                                  e.currentTarget.src = company.logo_url;
                                }
                              }}
                            />
                          ) : company.logo_url ? (
                            <img
                              src={company.logo_url}
                              alt={company.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Fallback to base64 if URL fails
                                if (company.logo_base64) {
                                  e.currentTarget.src = company.logo_base64;
                                }
                              }}
                            />
                          ) : company.logo_base64 ? (
                            <img
                              src={company.logo_base64}
                              alt={company.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            {getCompanyTypeIcon(company.company_type)}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            {getCompanyTierBadge(computeDisplayTier(company))}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Globe className="w-3 h-3" />
                              <span>{company.headquarters || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {company.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {company.description}
                    </p>

                    {/* Company Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-muted-foreground" />
                        <span>{company.projects.length} projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{formatValuation(company.valuation_usd)}</span>
                      </div>
                    </div>

                    {/* Focus Areas */}
                    {company.focus_areas && company.focus_areas.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Focus Areas</h4>
                        <div className="flex flex-wrap gap-1">
                          {company.focus_areas.slice(0, 3).map((area) => (
                            <Badge 
                              key={area} 
                              variant="outline" 
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => navigateToTag(area)}
                            >
                              {area}
                            </Badge>
                          ))}
                          {company.focus_areas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{company.focus_areas.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tools Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        Key Projects
                      </h4>
                      <div className="space-y-2">
                        {company.projects.slice(0, 2).map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <Link to={`/project/${project.id}`} className="flex items-center gap-2 min-w-0 flex-1 group">
                              <div className="w-6 h-6 rounded bg-background flex items-center justify-center">
                                {project.logo_url ? (
                                  <img
                                    src={project.logo_url}
                                    alt={project.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <Wrench className="w-3 h-3 text-muted-foreground" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium truncate block group-hover:text-primary transition-colors">{project.name}</span>
                                {project.project_category && (
                                  <span className="text-xs text-muted-foreground truncate block">{project.project_category}</span>
                                )}
                              </div>
                            </Link>
                            <div className="flex items-center gap-1">
                              {renderStars(project.project_stats?.average_rating || 0, project.id, true)}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleFavorite(project.id)}
                                className="hover:bg-muted/50 p-1 sm:p-2"
                              >
                                <Heart 
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    userFavorites.has(project.id) 
                                      ? 'text-red-500 fill-red-500' 
                                      : 'text-muted-foreground hover:text-red-500'
                                  }`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openStoryDialog(project, company)}
                                className="hover:bg-muted/50 p-1 sm:p-2"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {company.projects.length > 2 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{company.projects.length - 2} more projects
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full">
                      <Link to={`/ai-companies/${company.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {getPaginatedCompanies().map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border border-border/50 dark:border-border/30 hover:border-border dark:hover:border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold">{company.name}</h3>
                              {getCompanyTypeIcon(company.company_type)}
                              {getCompanyTierBadge(computeDisplayTier(company))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                <span>{company.headquarters || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Wrench className="w-4 h-4" />
                                <span>{company.projects.length} projects</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatValuation(company.valuation_usd)}</span>
                              </div>
                            </div>
                          </div>
                          {company.website && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={company.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                          {company.description}
                        </p>

                        {/* Focus Areas */}
                        {company.focus_areas && company.focus_areas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {company.focus_areas.slice(0, 5).map((area) => (
                              <Badge 
                                key={area} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => navigateToTag(area)}
                              >
                                {area}
                              </Badge>
                            ))}
                            {company.focus_areas.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{company.focus_areas.length - 5}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {company.projects.slice(0, 3).map((project) => (
                              <div key={project.id} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                                  {project.logo_url ? (
                                    <img
                                      src={project.logo_url}
                                      alt={project.name}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Wrench className="w-3 h-3 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{project.name}</span>
                                  {project.project_category && (
                                    <div className="text-xs text-muted-foreground">{project.project_category}</div>
                                  )}
                                </div>
                                {renderStars(project.project_stats?.average_rating || 0, project.id, true)}
                              </div>
                            ))}
                            {company.projects.length > 3 && (
                              <span className="text-sm text-muted-foreground">
                                +{company.projects.length - 3} more
                              </span>
                            )}
                          </div>

                          <Button asChild>
                            <Link to={`/ai-companies/${company.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredCompanies.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-8 px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="ml-1">Previous</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] < page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="mr-1">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
                <ChevronRight className="w-4 h-4 -ml-2" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length}
            </div>
          </div>
        )}

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCompanyTier('all');
                setSelectedProjectCategory('all');
                setSortBy('name');
                setSortOrder('asc');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Story Creation Dialog */}
      <Dialog open={storyDialog.open} onOpenChange={(open) => setStoryDialog({ open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Create Story for {storyDialog.project?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="story-title">Story Title</Label>
              <Input
                id="story-title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Enter a compelling title for your story..."
              />
            </div>
            <div>
              <Label htmlFor="story-content">Story Content</Label>
              <Textarea
                id="story-content"
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Share your experience with this tool..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStoryDialog({ open: false })}>
                Cancel
              </Button>
              <Button onClick={submitStory} disabled={!storyTitle.trim() || !storyContent.trim()}>
                Submit Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}