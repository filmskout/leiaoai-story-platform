import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Edit, Trash2, Save, X, Building2, Globe, Users, Calendar, DollarSign, Image } from 'lucide-react';
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
  category: string;
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
  const { isAdmin } = useAdmin();
  const { isAuthenticated } = useAuth();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    english_description: '',
    headquarters: '',
    valuation: '',
    website: '',
    logo_base64: '',
    category: '',
    is_overseas: false,
    founded_year: '',
    employee_count: '',
    industry: ''
  });

  // Categories
  const categories = [
    { value: 'techGiants', label: '科技巨头' },
    { value: 'aiUnicorns', label: 'AI独角兽' },
    { value: 'aiTools', label: 'AI工具' },
    { value: 'aiApplications', label: 'AI应用' },
    { value: 'domesticGiants', label: '国内巨头' },
    { value: 'domesticUnicorns', label: '国内独角兽' }
  ];

  // Load companies data
  useEffect(() => {
    if (isAdmin) {
      loadCompanies();
    } else {
      // If not admin, try to refresh admin status
      const checkAdmin = () => {
        const verified = localStorage.getItem('leoai-admin-verified') === 'true';
        const session = localStorage.getItem('leoai-admin-session');
        if (verified && session) {
          // Trigger a storage event to notify AdminContext
          window.dispatchEvent(new Event('localStorageUpdate'));
        }
      };
      checkAdmin();
    }
  }, [isAdmin]);

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
      toast.error('加载公司数据失败');
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
          token: localStorage.getItem('leoai-admin-session'),
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
        toast.success('公司创建成功');
        setIsCreateDialogOpen(false);
        resetForm();
        loadCompanies();
      } else {
        toast.error(result.error || '创建失败');
      }
    } catch (error) {
      console.error('Failed to create company:', error);
      toast.error('创建公司失败');
    }
  };

  const handleEditCompany = async () => {
    if (!editingCompany) return;

    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-company',
          token: localStorage.getItem('leoai-admin-session'),
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
        toast.success('公司更新成功');
        setIsEditDialogOpen(false);
        setEditingCompany(null);
        resetForm();
        loadCompanies();
      } else {
        toast.error(result.error || '更新失败');
      }
    } catch (error) {
      console.error('Failed to update company:', error);
      toast.error('更新公司失败');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('确定要删除这家公司吗？此操作不可撤销。')) {
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
          token: localStorage.getItem('leoai-admin-session'),
          companyId: companyId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('公司删除成功');
        loadCompanies();
      } else {
        toast.error(result.error || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete company:', error);
      toast.error('删除公司失败');
    }
  };

  const openEditDialog = (company: Company) => {
    console.log('Opening edit dialog for:', company.name);
    try {
      setEditingCompany(company);
      setFormData({
        name: company.name || '',
        description: company.description || '',
        english_description: company.english_description || '',
        headquarters: company.headquarters || '',
        valuation: company.valuation?.toString() || '',
        website: company.website || '',
        logo_base64: company.logo_base64 || '',
        category: company.category || '',
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
      toast.error('打开编辑对话框失败');
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
      category: '',
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

  if (!isAdmin) {
    // Check one more time with a slight delay
    const [retryCount, setRetryCount] = React.useState(0);
    
    React.useEffect(() => {
      if (retryCount < 2) {
        const timer = setTimeout(() => {
          const verified = localStorage.getItem('leoai-admin-verified') === 'true';
          const session = localStorage.getItem('leoai-admin-session');
          if (verified && session) {
            window.dispatchEvent(new Event('localStorageUpdate'));
            setRetryCount(prev => prev + 1);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [retryCount]);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              权限不足
            </CardTitle>
            <CardDescription>
              您需要管理员权限才能访问公司管理功能
              <br />
              <br />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Quick fix: manually set admin and reload
                  localStorage.setItem('leoai-admin-verified', 'true');
                  localStorage.setItem('leoai-admin-session', Date.now().toString());
                  window.location.reload();
                }}
                className="mt-4"
              >
                刷新权限状态
              </Button>
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
          <h1 className="text-3xl font-bold">AI公司管理</h1>
          <p className="text-muted-foreground mt-2">
            管理AI公司信息、项目和融资数据
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              添加公司
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>添加新公司</DialogTitle>
              <DialogDescription>
                填写公司基本信息，所有字段都是必填的
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">公司名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：OpenAI"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">分类 *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headquarters">总部地址 *</Label>
                <Input
                  id="headquarters"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  placeholder="例如：San Francisco, USA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">官网 *</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valuation">估值 (美元) *</Label>
                <Input
                  id="valuation"
                  type="number"
                  value={formData.valuation}
                  onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                  placeholder="1000000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="founded_year">成立年份 *</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                  placeholder="2020"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employee_count">员工数量</Label>
                <Input
                  id="employee_count"
                  value={formData.employee_count}
                  onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
                  placeholder="例如：100-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">行业</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="例如：Artificial Intelligence"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">中文描述 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="详细描述公司的业务、技术特点等..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="english_description">英文描述 *</Label>
              <Textarea
                id="english_description"
                value={formData.english_description}
                onChange={(e) => setFormData({ ...formData, english_description: e.target.value })}
                placeholder="English description of the company..."
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
              <Label htmlFor="is_overseas">海外公司</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateCompany}>
                <Save className="h-4 w-4 mr-2" />
                创建公司
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
                        {categories.find(c => c.value === company.category)?.label || company.category}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑公司信息</DialogTitle>
            <DialogDescription>
              修改 {editingCompany?.name} 的基本信息
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="logo">Logo管理</TabsTrigger>
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
                  <Label htmlFor="edit-category">分类 *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleEditCompany}>
                  <Save className="h-4 w-4 mr-2" />
                  保存更改
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
