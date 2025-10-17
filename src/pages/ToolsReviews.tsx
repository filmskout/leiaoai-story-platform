import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Building2, ExternalLink, Wrench } from 'lucide-react';
import { listToolsWithCompany, listCompanyFundings, getCompanyResearch } from '@/services/tools';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getLogoUrlFromLink } from '@/lib/logos';
import { PageHero } from '@/components/PageHero';
import { motion } from 'framer-motion';

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
  const [researchMap, setResearchMap] = useState<Record<string, { summary?: string; funding_highlights?: string; current_round?: string; overall_score?: number; score_breakdown?: any }>>({});
  const [researching, setResearching] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  // aidb external tools
  const [extLoading, setExtLoading] = useState(true);
  const [extTools, setExtTools] = useState<Array<{ id: string | number; name: string; description?: string; link?: string; category?: string; source?: string; company?: string; isOSS?: boolean }>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'name_asc' | 'name_desc'>('name_asc');
  const [search, setSearch] = useState('');
  const [companyOptions, setCompanyOptions] = useState<string[]>(['all']);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [sourceOptions, setSourceOptions] = useState<string[]>(['all']);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [ossOnly, setOssOnly] = useState<boolean>(false);
  // LLM 模型选择（顺序为回退优先级）
  const modelOptions = ['gpt-4o', 'gpt-4o-mini', 'qwen-turbo', 'deepseek-chat'];
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4o', 'gpt-4o-mini']);
  const [usedModelMap, setUsedModelMap] = useState<Record<string, string | undefined>>({});

  const categoryColor = (cat?: string) => {
    const key = String(cat || 'Uncategorized').toLowerCase();
    if (key.includes('agent')) return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-900/40';
    if (key.includes('image') || key.includes('vision')) return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-900/40';
    if (key.includes('nlp') || key.includes('text') || key.includes('chat')) return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/40';
    if (key.includes('audio') || key.includes('voice')) return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/40';
    if (key.includes('video')) return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/40';
    if (key.includes('data') || key.includes('db') || key.includes('analytics')) return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-900/40';
    return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700';
  };

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

  const fetchResearch = async (domain?: string) => {
    if (!domain) return;
    try {
      setResearching(domain);
      // try cache first
      const cached = await getCompanyResearch(domain);
      if (cached) {
        setResearchMap(prev => ({ ...prev, [domain]: { summary: cached.summary, funding_highlights: cached.funding_highlights, current_round: cached.current_round, overall_score: cached.overall_score, score_breakdown: cached.score_breakdown } }));
      }
      // call API to refresh (will upsert and return latest)
      const resp = await fetch('/api/tools-research', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domains: [domain], models: selectedModels }) });
      if (resp.ok) {
        const json = await resp.json();
        const r = json?.results?.[domain];
        if (r) setResearchMap(prev => ({ ...prev, [domain]: { summary: r.summary, funding_highlights: r.funding_highlights, current_round: r.current_round, overall_score: r.overall_score, score_breakdown: r.score_breakdown } }));
      }
    } catch (e) {
      console.error('research error', e);
    } finally {
      setResearching(null);
    }
  };

  // 批量后台刷新调研（无按钮，首次加载后自动触发）
  useEffect(() => {
    const triggerBatch = async () => {
      const domains = Array.from(new Set(extTools.map(x => String(x.company || '')).filter(Boolean)));
      if (domains.length === 0) return;
      try {
        const resp = await fetch('/api/tools-research', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domains, models: selectedModels }) });
        if (resp.ok) {
          const json = await resp.json();
          if (json?.results) {
            const newMap: Record<string, any> = {};
            Object.entries(json.results).forEach(([domain, data]: [string, any]) => {
              if (data) {
                newMap[domain] = {
                  summary: data.summary,
                  funding_highlights: data.funding_highlights,
                  current_round: data.current_round,
                  overall_score: data.overall_score,
                  score_breakdown: data.score_breakdown
                };
                if (data.used_model) {
                  setUsedModelMap(prev => ({ ...prev, [domain]: data.used_model }));
                }
              }
            });
            setResearchMap(prev => ({ ...prev, ...newMap }));
          }
        }
      } catch (e) {
        console.error('batch research error', e);
      }
    };
    if (!extLoading && extTools.length > 0) {
      triggerBatch();
    }
  }, [extLoading, extTools, selectedModels]);

  // load AIverse public JSON (object with tools array)
  useEffect(() => {
    const loadExt = async () => {
      setExtLoading(true);
      try {
        const resp = await fetch('/AIverse/aiverse_tools_2024_2025_comprehensive.json');
        const json = await resp.json();
        const raw = Array.isArray(json) ? json : (json?.tools || []);
        const withDerived = raw.map((x: any) => {
          const url = String(x.link || '');
          let domain = '';
          try { domain = new URL(url).hostname.replace(/^www\./,''); } catch {}
          const source = String(x.source || '').trim() || (domain || 'unknown');
          const desc = String(x.description || '').toLowerCase();
          const isOSS = /github\.com|huggingface\.co/.test(domain) || /open[- ]?source/.test(desc) || /opensource/.test(desc);
          return { id: x.id, name: x.name, description: x.description, link: x.link, category: x.category, source, company: domain || undefined, isOSS };
        });
        setExtTools(withDerived);
        const cats = Array.from(new Set(withDerived.map((x: any) => String(x.category || 'Uncategorized')))).filter(Boolean) as string[];
        setCategories(['all', ...cats]);
        const companies = Array.from(new Set(withDerived.map((x: any) => String(x.company || 'unknown')))).filter(Boolean) as string[];
        setCompanyOptions(['all', ...companies]);
        const sources = Array.from(new Set(withDerived.map((x: any) => String(x.source || 'unknown')))).filter(Boolean) as string[];
        setSourceOptions(['all', ...sources]);
      } catch (e) {
        console.error('load aidb tools error', e);
      } finally {
        setExtLoading(false);
      }
    };
    loadExt();
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* 页面标题 - 使用PageHero组件保持一致性 */}
      <PageHero 
        titleKey="AI 工具测评"
        subtitleKey="结合 Stories 打造大众点评式测评体系，含投融资信息"
        icon={Wrench}
      />

      <div className="container-custom py-8">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>AI 工具库</CardTitle>
            </CardHeader>
            <CardContent>
              {extLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3 items-center">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full cursor-pointer text-sm border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/40'}`}
                      >
                        {cat}
                      </span>
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                      <label className="text-sm text-foreground-secondary">模型</label>
                      <select className="border rounded-md px-2 py-1 h-9 min-w-[160px]" value={selectedModels[0]} onChange={(e)=>{
                        const first = e.target.value;
                        const rest = modelOptions.filter(x => x !== first);
                        setSelectedModels([first, ...rest]);
                      }}>
                        {modelOptions.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <input className="ml-2 border rounded-md px-2 py-1 h-9" placeholder="搜索工具..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                    <div className="flex gap-2">
                      <Button size="sm" variant={sortKey === 'name_asc' ? 'default' : 'outline'} onClick={() => setSortKey('name_asc')}>A→Z</Button>
                      <Button size="sm" variant={sortKey === 'name_desc' ? 'default' : 'outline'} onClick={() => setSortKey('name_desc')}>Z→A</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {extTools
                      .filter((x) => selectedCategory === 'all' || (x.category || 'Uncategorized') === selectedCategory)
                      // 只按分类和搜索筛选
                      .filter((x) => {
                        const q = search.trim().toLowerCase();
                        if (!q) return true;
                        return String(x.name).toLowerCase().includes(q) || String(x.description||'').toLowerCase().includes(q);
                      })
                      .sort((a, b) => sortKey === 'name_asc' ? String(a.name).localeCompare(String(b.name)) : String(b.name).localeCompare(String(a.name)))
                      .map((x) => (
                        <div key={String(x.id)} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-medium flex items-center gap-2 flex-wrap">
                              {x.link && (
                                <img src={getLogoUrlFromLink(x.link)} alt={x.name} className="w-5 h-5 rounded" />
                              )}
                              <span>{x.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs border ${categoryColor(x.category)}`}>
                                {x.category || 'Uncategorized'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {x.company && (
                              <Button size="sm" variant="outline" onClick={() => {
                                const next = !flipped[String(x.id)];
                                setFlipped(prev => ({ ...prev, [String(x.id)]: next }));
                                if (next && x.company && !researchMap[x.company]) {
                                  fetchResearch(x.company);
                                }
                              }}>
                                  {flipped[String(x.id)] ? '返回' : '评分'}
                                </Button>
                              )}
                              {x.link && (
                                <a href={x.link} target="_blank" rel="noreferrer" className="text-primary-600 text-sm inline-flex items-center">
                                  link <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              )}
                            </div>
                          </div>
                          {!flipped[String(x.id)] ? (
                            <>
                              <div className="text-sm text-foreground-secondary mt-1">{x.company ? `公司：${x.company}` : ''}{x.source ? `${x.company ? ' ｜' : ''}来源：${x.source}` : ''}{x.isOSS ? ' ｜开源' : ''}</div>
                              {x.description && (
                                <div className="text-sm text-foreground-secondary mt-2 whitespace-pre-wrap">{x.description}</div>
                              )}
                            </>
                          ) : (
                            <div className="mt-2 text-sm">{x.company && (researchMap[x.company] || researching === x.company) ? (
                              <div className="text-foreground-secondary space-y-2">
                                {(researchMap[x.company]?.current_round || researchMap[x.company]?.overall_score !== undefined) && (
                                  <div className="font-medium">
                                    {researchMap[x.company]?.current_round ? `轮次：${researchMap[x.company]?.current_round}` : ''}
                                    {researchMap[x.company]?.overall_score !== undefined ? `${researchMap[x.company]?.current_round ? '｜' : ''}总分：${researchMap[x.company]?.overall_score}` : ''}
                                  </div>
                                )}
                                {usedModelMap[x.company] && (
                                  <div className="text-xs">模型：{usedModelMap[x.company]}</div>
                                )}
                                {researchMap[x.company]?.score_breakdown && Object.keys(researchMap[x.company]?.score_breakdown || {}).length > 0 && (
                                  <div>
                                    <div className="text-xs font-medium mb-2">分项评分</div>
                                    <div className="space-y-1.5">
                                      {Object.entries(researchMap[x.company]?.score_breakdown || {}).map(([key, value]: [string, any]) => {
                                        const labels: Record<string, string> = { scale: '规模', growth: '增长', moat: '护城河', team: '团队', risk: '风险' };
                                        const score = typeof value === 'number' ? Math.max(0, Math.min(100, value)) : 0;
                                        return (
                                          <div key={key} className="flex items-center gap-2 text-xs">
                                            <div className="w-14 text-right">{labels[key] || key}</div>
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${score}%` }}></div>
                                            </div>
                                            <div className="w-10 text-right font-medium">{score}</div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                {researchMap[x.company]?.funding_highlights && (
                                  <div className="text-xs">投融资：{researchMap[x.company]?.funding_highlights}</div>
                                )}
                                {researching === x.company && !researchMap[x.company] && (
                                  <div className="text-xs">分析中...</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-foreground-secondary text-xs">调研数据加载中...</div>
                            )}</div>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
        </motion.div>

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
    </motion.div>
  );
}


