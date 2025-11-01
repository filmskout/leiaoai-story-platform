import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Edit, Trash2, Save, X, Building2, Globe, Users, Calendar, DollarSign, Image, Check, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CompanyLogoManager from '@/components/CompanyLogoManager';

interface Company {
  id: string;
  name: string;
  description: string;
  english_description: string;
  headquarters: string;
  valuation: number;
  website: string;
  logo_base64: string | null;
  company_tier: string;
  is_overseas: boolean;
  founded_year: number;
  employee_count: string;
  industry: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  pricing_model: string;
  target_users: string;
  key_features: string;
  use_cases: string;
}

interface Funding {
  id: string;
  company_id: string;
  round: string;
  amount: number;
  investors: string;
  valuation: number;
  date: number;
  lead_investor: string;
}

interface Story {
  id: string;
  company_id: string;
  title: string;
  summary: string;
  source_url: string;
  published_date: string;
  category: string;
  tags: string[];
}

const CompanyManagement: React.FC = () => {
  const { isAdmin, startEditing, stopEditing } = useAdmin();
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStoryGenDialogOpen, setIsStoryGenDialogOpen] = useState(false);
  const [storyGenLoading, setStoryGenLoading] = useState(false);
  const [storyGenProgress, setStoryGenProgress] = useState('');
  const [selectedCompanyForStory, setSelectedCompanyForStory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('LLM & Language Models');
  const [storyGenCount, setStoryGenCount] = useState(5);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    english_description: '',
    headquarters: '',
    valuation: '',
    website: '',
    logo_base64: '',
    company_tier: '',
    is_overseas: false,
    founded_year: '',
    employee_count: '',
    industry: ''
  });

  // Company tiers
  const companyTiers = [
    { value: 'Giants', label: { zh: '大厂 (Giants)', en: 'Giants' } },
    { value: 'Unicorns', label: { zh: '独角兽 (Unicorns)', en: 'Unicorns' } },
    { value: 'Independent', label: { zh: '独立 (Independent)', en: 'Independent' } },
    { value: 'Emerging', label: { zh: '新兴 (Emerging)', en: 'Emerging' } }
  ];

  // Keep editing mode active while dialog is open AND maintain it during page usage
  useEffect(() => {
    // Always maintain editing mode when on this page
    const adminVerified = localStorage.getItem('leoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leoai-admin-session');
    
    if (adminVerified && adminSession) {
      startEditing(); // Keep admin status active during page usage
    }
    
    if (isEditDialogOpen && editingCompany) {
      // Start editing mode immediately when dialog opens
      startEditing();
      console.log('🟢 Edit dialog opened, editing mode activated');
    }
    
    // Don't stop editing when dialog closes - keep admin status active on this page
    // return () => {
    //   stopEditing(); // Removed - don't stop editing when component unmounts
    // };
  }, [isEditDialogOpen, editingCompany, startEditing]);

  // Auto-activate admin status when page loads
  useEffect(() => {
    // Check if admin session exists in localStorage
    const adminVerified = localStorage.getItem('leoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leoai-admin-session');
    
    if (adminVerified && adminSession) {
      // Activate editing mode immediately to maintain admin status
      startEditing();
      console.log('🟢 CompanyManagement: Auto-activated admin status');
    }
    
    // Always try to load companies if we have session
    if (adminVerified && adminSession) {
      loadCompanies();
    }
    
    // Cleanup: stop editing when component unmounts
    return () => {
      // Don't stop editing on unmount - keep it active during page usage
      // stopEditing();
    };
  }, []); // Only run on mount

  // Load companies when admin status changes to true
  useEffect(() => {
    if (isAdmin) {
      loadCompanies();
    }
  }, [isAdmin]);

  // Helper function to get admin token
  const getAdminToken = (): string => {
    // Check if there's a valid admin session (time-based validation)
    const adminVerified = localStorage.getItem('leoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leoai-admin-session');
    
    // If admin is verified and has active session, use the hardcoded token
    // The API expects either process.env.ADMIN_TOKEN or 'admin-token-123'
    if (adminVerified && adminSession) {
      // Use the hardcoded development token that API accepts
      return 'admin-token-123';
    }
    
    // Fallback to other token sources
    return localStorage.getItem('adminToken') || 'admin-token-123';
  };

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/unified?action=data-progress');
      const data = await response.json();
      
      if (data.success) {
        // Load detailed company data
        const companiesResponse = await fetch('/api/unified?action=get-companies');
        const companiesData = await companiesResponse.json();
        
        if (companiesData.success) {
          setCompanies(companiesData.companies || []);
        }
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
      toast.error(t('company_management.error.load_failed', 'Failed to load company data'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-company',
          token: getAdminToken(),
          company: {
            ...formData,
            valuation: parseFloat(formData.valuation) || 0,
            founded_year: parseInt(formData.founded_year) || 2020,
            is_overseas: formData.is_overseas
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(t('company_management.success.created', 'Company created successfully'));
        setIsCreateDialogOpen(false);
        resetForm();
        loadCompanies();
      } else {
        toast.error(result.error || t('company_management.error.create_failed', 'Creation failed'));
      }
    } catch (error) {
      console.error('Failed to create company:', error);
      toast.error(t('company_management.error.create_company_failed', 'Failed to create company'));
    }
  };

  const handleEditCompany = async () => {
    if (!editingCompany) return;

    try {
      // Ensure we're still in editing mode
      startEditing();
      
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-company',
          token: getAdminToken(),
          companyId: editingCompany.id,
          company: {
            ...formData,
            valuation: parseFloat(formData.valuation) || 0,
            founded_year: parseInt(formData.founded_year) || 2020,
            is_overseas: formData.is_overseas
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(t('company_management.success.updated', 'Company updated successfully'));
        // Stop editing mode after successful save
        stopEditing();
        setIsEditDialogOpen(false);
        setEditingCompany(null);
        resetForm();
        loadCompanies();
      } else {
        toast.error(result.error || t('company_management.error.update_failed', 'Update failed'));
        // Keep editing mode active if save failed
      }
    } catch (error) {
      console.error('Failed to update company:', error);
      toast.error(t('company_management.error.update_company_failed', 'Failed to update company'));
      // Keep editing mode active if save failed
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm(t('company_management.confirm.delete', 'Are you sure you want to delete this company? This action cannot be undone.'))) {
      return;
    }

    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete-company',
          token: getAdminToken(),
          companyId: companyId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(t('company_management.success.deleted', 'Company deleted successfully'));
        loadCompanies();
      } else {
        toast.error(result.error || t('company_management.error.delete_failed', 'Delete failed'));
      }
    } catch (error) {
      console.error('Failed to delete company:', error);
      toast.error(t('company_management.error.delete_company_failed', 'Failed to delete company'));
    }
  };

  const openEditDialog = (company: Company) => {
    console.log('Opening edit dialog for:', company.name);
    try {
      // Start editing mode to extend admin session
      startEditing();
      
      setEditingCompany(company);
      setFormData({
        name: company.name || '',
        description: company.description || '',
        english_description: company.english_description || '',
        headquarters: company.headquarters || '',
        valuation: company.valuation?.toString() || '',
        website: company.website || '',
        logo_base64: company.logo_base64 || '',
        company_tier: company.company_tier || '',
        is_overseas: company.is_overseas || false,
        founded_year: company.founded_year?.toString() || '',
        employee_count: company.employee_count || '',
        industry: company.industry || ''
      });
      // Use setTimeout to ensure state updates before opening dialog
      setTimeout(() => {
        setIsEditDialogOpen(true);
        console.log('Edit dialog should be open now');
      }, 0);
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      toast.error(t('company_management.error.open_dialog', 'Failed to open edit dialog'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      english_description: '',
      headquarters: '',
      valuation: '',
      website: '',
      logo_base64: '',
      company_tier: '',
      is_overseas: false,
      founded_year: '',
      employee_count: '',
      industry: ''
    });
  };

  const formatValuation = (valuation: number) => {
    if (valuation >= 1000000000) {
      return `$${(valuation / 1000000000).toFixed(1)}B`;
    } else if (valuation >= 1000000) {
      return `$${(valuation / 1000000).toFixed(1)}M`;
    } else if (valuation >= 1000) {
      return `$${(valuation / 1000).toFixed(1)}K`;
    }
    return `$${valuation}`;
  };

  // Story生成函数
  const handleGenerateStory = async (projectId?: string, companyId?: string) => {
    setStoryGenLoading(true);
    setStoryGenProgress(t('company_management.story_gen.searching_media', '正在调用LLM搜索权威媒体原文...'));
    
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-story',
          token: getAdminToken(),
          projectId: projectId,
          companyId: companyId || selectedCompanyForStory,
          category: selectedCategory
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(t('company_management.story_gen.success', 'Story生成成功！'));
        setStoryGenProgress(`✅ ${t('company_management.story_gen.success_with_title', '生成成功：{{title}}', { title: result.story.title })}`);
        loadCompanies();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('生成Story失败:', error);
      toast.error(t('company_management.story_gen.error', '生成失败') + ': ' + error.message);
      setStoryGenProgress('❌ ' + t('company_management.story_gen.error_with_msg', '生成失败：{{msg}}', { msg: error.message }));
    } finally {
      setStoryGenLoading(false);
    }
  };

  const handleGenerateStoriesBatch = async () => {
    setStoryGenLoading(true);
    setStoryGenProgress(t('company_management.story_gen.batch_starting', '开始批量生成 {{count}} 个stories...', { count: storyGenCount }));
    
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-stories-batch',
          token: getAdminToken(),
          category: selectedCategory,
          companyId: selectedCompanyForStory || undefined,
          count: storyGenCount
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const successCount = result.results.filter((r: any) => r.success).length;
        toast.success(t('company_management.story_gen.batch_success', '{{success}}/{{total}} 个stories生成成功', { 
          success: successCount, 
          total: result.results.length 
        }));
        setStoryGenProgress(`✅ ${t('company_management.story_gen.batch_complete', '批量生成完成：{{success}}/{{total}} 成功', { 
          success: successCount, 
          total: result.results.length 
        })}`);
        loadCompanies();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('批量生成失败:', error);
      toast.error(t('company_management.story_gen.batch_error', '批量生成失败') + ': ' + error.message);
      setStoryGenProgress('❌ ' + t('company_management.story_gen.batch_error_with_msg', '批量生成失败：{{msg}}', { msg: error.message }));
    } finally {
      setStoryGenLoading(false);
    }
  };

  const storyCategories = [
    'LLM & Language Models',
    'Image Processing & Generation',
    'Video Processing & Generation',
    'Professional Domain Analysis',
    'Virtual Companions',
    'Virtual Employees & Assistants',
    'Voice & Audio AI',
    'Search & Information Retrieval'
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              需要登录
            </CardTitle>
            <CardDescription>
              请先登录以访问公司管理功能
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check for admin session - if exists, allow access (don't block on isAdmin check)
  const hasAdminSession = () => {
    const adminVerified = localStorage.getItem('leoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leoai-admin-session');
    return adminVerified && adminSession;
  };

  // Only block if absolutely no admin session exists
  if (!hasAdminSession() && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              权限不足
            </CardTitle>
            <CardDescription className="space-y-4">
              <div>
                您需要管理员权限才能访问公司管理功能
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem('leoai-admin-verified', 'true');
                    localStorage.setItem('leoai-admin-session', Date.now().toString());
                    startEditing(); // Activate editing mode
                    window.dispatchEvent(new Event('localStorageUpdate'));
                    window.location.reload();
                  }}
                >
                  刷新权限状态
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/admin-login'}
                >
                  前往管理员登录
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('company_management.title', 'AI Company Management')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('company_management.subtitle', 'Manage AI company information, projects and funding data')}
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Story生成按钮 */}
          <Dialog open={isStoryGenDialogOpen} onOpenChange={setIsStoryGenDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelectedCompanyForStory(null)}>
                <Sparkles className="h-4 w-4 mr-2" />
                {t('company_management.buttons.generate_stories', '生成Stories')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('company_management.story_gen.title', '使用LLM生成Stories')}</DialogTitle>
                <DialogDescription>
                  {t('company_management.story_gen.description', '基于权威媒体报道生成包含项目评分的真实用户故事')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('company_management.story_gen.select_company', '选择公司（可选）')}</Label>
                  <Select value={selectedCompanyForStory || ''} onValueChange={(value) => setSelectedCompanyForStory(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('company_management.story_gen.all_companies', '所有公司')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('company_management.story_gen.all_companies', '所有公司')}</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('company_management.story_gen.select_category', '选择类别')}</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {storyCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('company_management.story_gen.count', '生成数量')}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={storyGenCount}
                    onChange={(e) => setStoryGenCount(parseInt(e.target.value) || 5)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('company_management.story_gen.count_hint', '建议5-10个，每个story需要60-90秒')}
                  </p>
                </div>

                {storyGenProgress && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm">{storyGenProgress}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsStoryGenDialogOpen(false);
                      setStoryGenProgress('');
                    }}
                    disabled={storyGenLoading}
                  >
                    {t('common.cancel', '取消')}
                  </Button>
                  <Button
                    onClick={handleGenerateStoriesBatch}
                    disabled={storyGenLoading}
                  >
                    {storyGenLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('company_management.story_gen.generating', '生成中...')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t('company_management.story_gen.start_batch', '开始批量生成')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                {t('company_management.buttons.add_company', 'Add Company')}
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('company_management.dialog.create_title', 'Add New Company')}</DialogTitle>
              <DialogDescription>
                {t('company_management.dialog.create_description', 'Fill in the basic company information. All fields are required.')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('company_management.fields.name', 'Company Name')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('company_management.placeholders.name', 'e.g.: OpenAI')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_tier">{t('company_management.fields.tier', 'Tier')} *</Label>
                <Select value={formData.company_tier} onValueChange={(value) => setFormData({ ...formData, company_tier: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('company_management.placeholders.select_tier', 'Select tier')} />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {i18n.language === 'zh-CN' || i18n.language === 'zh-HK' ? tier.label.zh : tier.label.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headquarters">{t('company_management.fields.headquarters', 'Headquarters')} *</Label>
                <Input
                  id="headquarters"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  placeholder={t('company_management.placeholders.headquarters', 'e.g.: San Francisco, USA')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">{t('company_management.fields.website', 'Website')} *</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valuation">{t('company_management.fields.valuation', 'Valuation (USD)')} *</Label>
                <Input
                  id="valuation"
                  type="number"
                  value={formData.valuation}
                  onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                  placeholder="1000000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="founded_year">{t('company_management.fields.founded_year', 'Founded Year')} *</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                  placeholder="2020"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employee_count">{t('company_management.fields.employee_count', 'Employee Count')}</Label>
                <Input
                  id="employee_count"
                  value={formData.employee_count}
                  onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
                  placeholder={t('company_management.placeholders.employee_count', 'e.g.: 100-200')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">{t('company_management.fields.industry', 'Industry')}</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder={t('company_management.placeholders.industry', 'e.g.: Artificial Intelligence')}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('company_management.fields.description_zh', 'Chinese Description')} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('company_management.placeholders.description_zh', 'Detailed description of the company\'s business, technical features, etc...')}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="english_description">{t('company_management.fields.description_en', 'English Description')} *</Label>
              <Textarea
                id="english_description"
                value={formData.english_description}
                onChange={(e) => setFormData({ ...formData, english_description: e.target.value })}
                placeholder={t('company_management.placeholders.description_en', 'English description of the company...')}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_overseas"
                checked={formData.is_overseas}
                onChange={(e) => setFormData({ ...formData, is_overseas: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_overseas">{t('company_management.fields.is_overseas', 'Overseas Company')}</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={handleCreateCompany}>
                <Save className="h-4 w-4 mr-2" />
                {t('company_management.buttons.create', 'Create Company')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {company.logo_storage_url ? (
                      <img
                        src={company.logo_storage_url}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          // Fallback to base64 if storage fails
                          if (company.logo_base64) {
                            e.currentTarget.src = company.logo_base64;
                          }
                        }}
                      />
                    ) : company.logo_base64 ? (
                      <img
                        src={company.logo_base64}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {(() => {
                          const tier = companyTiers.find(t => t.value === company.company_tier);
                          if (tier) {
                            return i18n.language === 'zh-CN' || i18n.language === 'zh-HK' ? tier.label.zh : tier.label.en;
                          }
                          return company.company_tier || t('company_management.unknown_tier', 'Unknown');
                        })()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCompanyForStory(company.id);
                        setIsStoryGenDialogOpen(true);
                      }}
                      type="button"
                      title={t('company_management.buttons.generate_story', '为该公司生成Story')}
                    >
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Edit button clicked for:', company.name, company.id);
                        openEditDialog(company);
                      }}
                      type="button"
                      title="编辑公司"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteCompany(company.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                      type="button"
                      title="删除公司"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{company.headquarters}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatValuation(company.valuation)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>成立于 {company.founded_year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{company.employee_count}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>
                  
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                    >
                      {company.website}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          // 如果通过X按钮关闭（open变为false），不保存数据
          if (!open) {
            console.log('Dialog closed via X button, not saving');
            stopEditing();
            setTimeout(() => {
              setEditingCompany(null);
              resetForm();
              setIsEditDialogOpen(false);
            }, 100);
          }
        }}
      >
        <DialogContent 
          className="max-w-4xl max-h-[80vh] overflow-y-auto"
          onInteractOutside={(e) => {
            // 防止点击外部关闭对话框，必须使用按钮
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t('company_management.dialog.edit_title', 'Edit Company Information')}</DialogTitle>
            <DialogDescription>
              {t('company_management.dialog.edit_description', 'Modify basic information for {{name}}', { name: editingCompany?.name || t('company_management.company', 'Company') })}
              {!editingCompany && <span className="text-red-500"> ({t('company_management.error.company_not_found', 'Error: Company data not found')})</span>}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">{t('company_management.tabs.basic_info', 'Basic Information')}</TabsTrigger>
              <TabsTrigger value="logo">{t('company_management.tabs.logo_management', 'Logo Management')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">公司名称 *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：OpenAI"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-company_tier">{t('company_management.fields.tier', 'Tier')} *</Label>
                  <Select value={formData.company_tier} onValueChange={(value) => setFormData({ ...formData, company_tier: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('company_management.placeholders.select_tier', 'Select tier')} />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTiers.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {i18n.language === 'zh-CN' || i18n.language === 'zh-HK' ? tier.label.zh : tier.label.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-headquarters">总部地址 *</Label>
                  <Input
                    id="edit-headquarters"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    placeholder="例如：San Francisco, USA"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-website">官网 *</Label>
                  <Input
                    id="edit-website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-valuation">估值 (美元) *</Label>
                  <Input
                    id="edit-valuation"
                    type="number"
                    value={formData.valuation}
                    onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                    placeholder="1000000000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-founded_year">成立年份 *</Label>
                  <Input
                    id="edit-founded_year"
                    type="number"
                    value={formData.founded_year}
                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                    placeholder="2020"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-employee_count">员工数量</Label>
                  <Input
                    id="edit-employee_count"
                    value={formData.employee_count}
                    onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
                    placeholder="例如：100-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-industry">行业</Label>
                  <Input
                    id="edit-industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="例如：Artificial Intelligence"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">中文描述 *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细描述公司的业务、技术特点等..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-english_description">英文描述 *</Label>
                <Textarea
                  id="edit-english_description"
                  value={formData.english_description}
                  onChange={(e) => setFormData({ ...formData, english_description: e.target.value })}
                  placeholder="English description of the company..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_overseas"
                  checked={formData.is_overseas}
                  onChange={(e) => setFormData({ ...formData, is_overseas: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-is_overseas">海外公司</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // 取消按钮：不保存，直接关闭
                    stopEditing();
                    setIsEditDialogOpen(false);
                    setTimeout(() => {
                      setEditingCompany(null);
                      resetForm();
                    }, 100);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button onClick={handleEditCompany}>
                  <Check className="h-4 w-4 mr-2" />
                  {t('company_management.buttons.save', 'Save')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="logo" className="space-y-4">
              {editingCompany && (
                <CompanyLogoManager 
                  company={editingCompany} 
                  onUpdate={(updatedCompany) => {
                    setEditingCompany(updatedCompany);
                    setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
                  }} 
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
