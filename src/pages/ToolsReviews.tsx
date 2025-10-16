import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Building2, ExternalLink } from 'lucide-react';
import { listToolsWithCompany, listCompanyFundings } from '@/services/tools';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ToolItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  website?: string;
  company?: { id: string; name: string; website?: string };
}

export default function ToolsReviews() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [fundingOpen, setFundingOpen] = useState(false);
  const [fundingLoading, setFundingLoading] = useState(false);
  const [fundings, setFundings] = useState<any[]>([]);
  const [fundingCompany, setFundingCompany] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listToolsWithCompany();
        setTools((data as unknown as any[]) || []);
      } catch (e) {
        console.error('Failed to load tools', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openFundings = async (company?: { id: string; name: string }) => {
    if (!company?.id) return;
    setFundingCompany(company);
    setFundingOpen(true);
    setFundingLoading(true);
    try {
      const data = await listCompanyFundings(company.id);
      setFundings(data as any[]);
    } catch (e) {
      console.error('load fundings error', e);
    } finally {
      setFundingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">AI 工具测评</h1>
          <p className="text-foreground-secondary mt-2">结合 Stories 打造大众点评式测评体系，含投融资信息</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>工具库与投融资数据（占位）</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-3">
                {tools.length === 0 && (
                  <div className="text-sm text-foreground-secondary">暂无工具数据</div>
                )}
                {tools.map((tool) => (
                  <div key={tool.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{tool.name}</div>
                      {tool.website && (
                        <a href={tool.website} target="_blank" rel="noreferrer" className="text-primary-600 text-sm inline-flex items-center">
                          官网 <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-foreground-secondary mt-1">
                      {tool.category || '未分类'} {tool.company?.name ? `｜${tool.company.name}` : ''}
                    </div>
                    {tool.company?.id && (
                      <div className="mt-2">
                        <Button size="sm" variant="outline" onClick={() => openFundings({ id: tool.company!.id, name: tool.company!.name })}>
                          <Building2 className="w-4 h-4 mr-2" /> 查看融资详情
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <Link to="/stories">
                <Button size="sm" variant="outline">
                  <Star className="w-4 h-4 mr-2" /> 去查看测评 Stories
                </Button>
              </Link>
              <a href="https://ow4l9vcrew3d.space.minimax.io/" target="_blank" rel="noreferrer" className="inline-flex">
                <Button size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" /> 参考成品站点
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Dialog open={fundingOpen} onOpenChange={setFundingOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>融资详情{fundingCompany?.name ? `｜${fundingCompany.name}` : ''}</DialogTitle>
            </DialogHeader>
            {fundingLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-3">
                {fundings.length === 0 && (
                  <div className="text-sm text-foreground-secondary">暂无融资记录</div>
                )}
                {fundings.map((f) => (
                  <div key={f.id} className="p-3 border rounded-lg text-sm">
                    <div className="font-medium">{f.round || '未披露轮次'} {f.amount_usd ? `｜$${Number(f.amount_usd).toLocaleString()}` : ''}</div>
                    <div className="text-foreground-secondary">
                      {f.investors && f.investors.length ? `投资方：${f.investors.join(', ')}` : '投资方未披露'}
                    </div>
                    {f.announced_on && (
                      <div className="text-foreground-secondary">公布日期：{new Date(f.announced_on).toLocaleDateString()}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


