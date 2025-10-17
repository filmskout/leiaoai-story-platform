import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PageHero } from '@/components/PageHero';
import { Building, ExternalLink, Star, ArrowLeft, Globe2, Tag, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCompanyDetails,
  getCompanyStories,
  submitRating,
} from '@/services/tools';

type Tool = {
  id: string;
  name: string;
  category: string;
  description: string;
  website?: string;
  logo_url?: string;
  industry_tags?: string[];
  tool_stats?: { average_rating?: number; total_ratings?: number };
};

type Funding = {
  id: string;
  round: string;
  amount_usd?: number;
  investors?: string[];
  announced_on?: string;
};

type Company = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  logo_url?: string;
  valuation_usd?: number;
  funding_status?: string;
  industry_tags: string[];
  headquarters?: string;
  social_links?: Record<string, string>;
  tools: Tool[];
  fundings: Funding[];
  company_stats?: { total_tools?: number; average_tool_rating?: number };
};

export default function CompanyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const detail = await getCompanyDetails(id as string);
        setCompany(detail as Company);
        const s = await getCompanyStories(id as string);
        setStories(s || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const avgRating = useMemo(() => {
    if (!company || !company.tools?.length) return 0;
    const sum = company.tools.reduce((acc, t) => acc + (t.tool_stats?.average_rating || 0), 0);
    return +(sum / company.tools.length).toFixed(1);
  }, [company]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <PageHero
        titleKey={company?.name || 'AI 公司'}
        subtitleKey="公司详情、工具套件、融资信息与社区故事"
        icon={Building}
      />

      <div className="container-custom py-8">
        <div className="mb-4">
          <Link to="/ai-companies">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />返回目录</Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : !company ? (
          <div className="text-center text-muted-foreground">未找到公司</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                      {company.logo_url && (
                        <img src={company.logo_url} alt={company.name} className="w-8 h-8 rounded bg-background/50 p-1" />
                      )}
                      {company.name}
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                          <ExternalLink className="w-4 h-4 inline-block ml-1" />
                        </a>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{avgRating}</span>
                      <BarChart3 className="w-4 h-4 ml-3" />
                      <span>{company.company_stats?.total_tools || company.tools.length} 工具</span>
                    </div>
                  </div>
                  {company.industry_tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {company.industry_tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {company.headquarters && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe2 className="w-4 h-4" />
                        {company.headquarters}
                      </div>
                    )}
                    {company.valuation_usd != null && (
                      <div className="text-muted-foreground">估值：${(company.valuation_usd/1_000_000_000).toFixed(1)}B</div>
                    )}
                    {company.funding_status && <div className="text-muted-foreground">融资阶段：{company.funding_status}</div>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>工具与服务</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.tools.map((tool) => (
                      <Card key={tool.id} className="border border-muted-foreground/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{tool.name}</span>
                            {tool.website && (
                              <a href={tool.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{tool.category}</Badge>
                            {tool.industry_tags?.slice(0,3).map((t) => (
                              <Badge key={t} variant="secondary">{t}</Badge>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{tool.tool_stats?.average_rating?.toFixed(1) ?? '0.0'} ({tool.tool_stats?.total_ratings ?? 0})</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>社区故事与评测</CardTitle>
                </CardHeader>
                <CardContent>
                  {stories.length === 0 ? (
                    <div className="text-sm text-muted-foreground">暂无故事</div>
                  ) : (
                    <div className="space-y-3">
                      {stories.map((s) => (
                        <div key={s.id} className="border-b pb-3">
                          <Link to={`/story/${s.id}`} className="font-medium hover:underline">{s.title}</Link>
                          <div className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>融资信息</CardTitle>
                </CardHeader>
                <CardContent>
                  {company.fundings?.length ? (
                    <div className="space-y-3">
                      {company.fundings.map((f) => (
                        <div key={f.id} className="text-sm flex items-center justify-between">
                          <div>
                            <div className="font-medium">{f.round}</div>
                            <div className="text-muted-foreground text-xs">{f.announced_on || ''}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{f.amount_usd ? `$${(f.amount_usd/1_000_000).toFixed(0)}M` : '-'}</div>
                            <div className="text-muted-foreground text-xs line-clamp-1">{f.investors?.join(', ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">暂无融资信息</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最新资讯</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    我们会定期从权威来源抓取资讯并生成摘要，稍后将在此展示。
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}


