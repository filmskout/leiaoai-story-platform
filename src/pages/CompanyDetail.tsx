import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PageHero } from '@/components/PageHero';
import { Building, ExternalLink, Star, ArrowLeft, Globe2, Tag, BarChart3, Wrench, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCompanyDetails,
  getCompanyStories,
  submitRating,
} from '@/services/tools';

type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  website?: string;
  logo_url?: string;
  industry_tags?: string[];
  project_stats?: { average_rating?: number; total_ratings?: number };
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
  projects: Project[];
  fundings: Funding[];
  company_stats?: { total_tools?: number; average_tool_rating?: number };
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    if (!company || !company.projects?.length) return 0;
    const sum = company.projects.reduce((acc, t) => acc + (t.project_stats?.average_rating || 0), 0);
    return +(sum / company.projects.length).toFixed(1);
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
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/ai-companies')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />返回目录
          </Button>
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
                      {(company.logo_storage_url || company.logo_url || company.logo_base64) && (
                        <img 
                          src={company.logo_storage_url || company.logo_url || company.logo_base64} 
                          alt={company.name} 
                          className="w-8 h-8 rounded bg-background/50 p-1"
                          onError={(e) => {
                            // Fallback chain: storage_url -> logo_url -> logo_base64
                            if (company.logo_storage_url && e.currentTarget.src !== company.logo_url) {
                              e.currentTarget.src = company.logo_url || '';
                            } else if (company.logo_url && e.currentTarget.src !== company.logo_base64) {
                              e.currentTarget.src = company.logo_base64 || '';
                            }
                          }}
                        />
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
                      <span>{company.projects?.length || 0} 项目</span>
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

              <Card className="border border-border/50 dark:border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    工具与服务
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.projects.map((project) => (
                      <Card key={project.id} className="border border-border/30 hover:border-border dark:hover:border-border/50 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span className="truncate">{project.name}</span>
                            {project.website && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={project.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="outline" className="text-xs">{project.category}</Badge>
                            {project.industry_tags?.slice(0,3).map((t) => (
                              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{project.project_stats?.average_rating?.toFixed(1) ?? '0.0'} ({project.project_stats?.total_ratings ?? 0})</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50 dark:border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    社区故事与评测
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stories.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-2">暂无相关故事</div>
                      <div className="text-sm text-muted-foreground">成为第一个分享使用体验的用户</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stories.map((s) => (
                        <motion.div 
                          key={s.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-border/30 rounded-lg overflow-hidden hover:shadow-md transition-all"
                        >
                          {s.cover_image_url && (
                            <div className="aspect-video w-full overflow-hidden">
                              <img
                                src={s.cover_image_url}
                                alt={s.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <Link 
                              to={`/story/${s.id}`} 
                              state={{ fromCompany: id }}
                              className="block"
                            >
                              <h4 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
                                {s.title}
                              </h4>
                              {s.excerpt && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {s.excerpt}
                                </p>
                              )}
                            </Link>
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {s.created_at && (
                                  <span>{new Date(s.created_at).toLocaleDateString()}</span>
                                )}
                                {s.category && (
                                  <Link 
                                    to={`/stories/category/${encodeURIComponent(s.category)}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-primary"
                                  >
                                    {s.category}
                                  </Link>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Heart className="w-3.5 h-3.5" />
                                  {s.likes_count || 0}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  {s.comments_count || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
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


