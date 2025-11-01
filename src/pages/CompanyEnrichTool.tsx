import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Building, Globe, DollarSign, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyData {
  name: string;
  description?: string;
  website?: string;
  valuation_usd?: number;
  founded_year?: number;
  headquarters?: string;
  company_tier?: string;
  logo_url?: string;
  industry_tags?: string[];
}

export default function CompanyEnrichTool() {
  const { isAdmin } = useAdmin();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrichedData, setEnrichedData] = useState<CompanyData | null>(null);
  const [generatedSQL, setGeneratedSQL] = useState('');

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">需要管理员权限</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const enrichCompanyWithLLM = async () => {
    if (!companyName.trim()) {
      toast.error('请输入公司名称');
      return;
    }

    setLoading(true);
    setEnrichedData(null);
    setGeneratedSQL('');

    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enrich-company-llm',
          companyName: companyName.trim(),
          token: localStorage.getItem('leoai-admin-session')
        })
      });

      const result = await response.json();

      if (result.success) {
        setEnrichedData(result.data);
        setGeneratedSQL(result.sql || '');
        toast.success('公司信息补齐成功！');
      } else {
        toast.error(result.error || '补齐失败');
      }
    } catch (error: any) {
      console.error('Error enriching company:', error);
      toast.error(`补齐失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!enrichedData) return;

    setLoading(true);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-enriched-company',
          token: localStorage.getItem('leoai-admin-session'),
          companyData: enrichedData
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('公司信息已保存到数据库！');
        setEnrichedData(null);
        setCompanyName('');
        setGeneratedSQL('');
      } else {
        toast.error(result.error || '保存失败');
      }
    } catch (error: any) {
      console.error('Error saving company:', error);
      toast.error(`保存失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copySQL = () => {
    if (generatedSQL) {
      navigator.clipboard.writeText(generatedSQL);
      toast.success('SQL已复制到剪贴板');
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            LLM 公司信息补齐工具
          </CardTitle>
          <CardDescription>
            使用大语言模型自动补齐公司信息（名称、描述、网站、估值、成立年份、总部、层级等）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">公司名称</Label>
            <div className="flex gap-2">
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例如：百度、阿里巴巴、腾讯、OpenAI等"
                onKeyPress={(e) => e.key === 'Enter' && enrichCompanyWithLLM()}
              />
              <Button 
                onClick={enrichCompanyWithLLM} 
                disabled={loading || !companyName.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    补齐中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    补齐信息
                  </>
                )}
              </Button>
            </div>
          </div>

          {enrichedData && (
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">补齐的信息</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copySQL}>
                    复制SQL
                  </Button>
                  <Button size="sm" onClick={saveToDatabase}>
                    保存到数据库
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    公司名称
                  </Label>
                  <div className="p-2 bg-muted rounded">{enrichedData.name}</div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    网站
                  </Label>
                  <div className="p-2 bg-muted rounded">{enrichedData.website || '未找到'}</div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    总部
                  </Label>
                  <div className="p-2 bg-muted rounded">{enrichedData.headquarters || '未找到'}</div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    成立年份
                  </Label>
                  <div className="p-2 bg-muted rounded">{enrichedData.founded_year || '未找到'}</div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    估值 (USD)
                  </Label>
                  <div className="p-2 bg-muted rounded">
                    {enrichedData.valuation_usd 
                      ? `$${(enrichedData.valuation_usd / 1_000_000_000).toFixed(1)}B`
                      : '未找到'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>层级</Label>
                  <div className="p-2 bg-muted rounded">
                    <Badge variant="outline">{enrichedData.company_tier || '待确定'}</Badge>
                  </div>
                </div>
              </div>

              {enrichedData.description && (
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Textarea
                    value={enrichedData.description}
                    readOnly
                    rows={4}
                    className="bg-muted"
                  />
                </div>
              )}

              {enrichedData.industry_tags && enrichedData.industry_tags.length > 0 && (
                <div className="space-y-2">
                  <Label>行业标签</Label>
                  <div className="flex flex-wrap gap-2">
                    {enrichedData.industry_tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {generatedSQL && (
                <div className="space-y-2">
                  <Label>生成的SQL</Label>
                  <Textarea
                    value={generatedSQL}
                    readOnly
                    rows={8}
                    className="font-mono text-xs bg-muted"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

