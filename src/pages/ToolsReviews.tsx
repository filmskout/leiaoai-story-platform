import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Building2, ExternalLink } from 'lucide-react';
import { listToolsWithCompany, listCompanyFundings, getCompanyResearch } from '@/services/tools';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getLogoUrlFromLink } from '@/lib/logos';

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
  const [researchMap, setResearchMap] = useState<Record<string, { summary?: string; funding_highlights?: string }>>({});
  const [researching, setResearching] = useState<string | null>(null);
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
        setResearchMap(prev => ({ ...prev, [domain]: { summary: cached.summary, funding_highlights: cached.funding_highlights } }));
      }
      // call API to refresh (will upsert and return latest)
      const resp = await fetch('/api/tools-research', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domains: [domain] }) });
      if (resp.ok) {
        const json = await resp.json();
        const r = json?.results?.[domain];
        if (r) setResearchMap(prev => ({ ...prev, [domain]: { summary: r.summary, funding_highlights: r.funding_highlights } }));
      }
    } catch (e) {
      console.error('research error', e);
    } finally {
      setResearching(null);
    }
  };

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
                      <div className="font-medium flex items-center gap-2">
                        {getLogoUrlFromLink(tool.website) && (
                          <img src={getLogoUrlFromLink(tool.website)} alt={tool.name} className="w-5 h-5 rounded" />
                        )}
                        {tool.name}
                      </div>
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

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">AI 工具库（来自 aidb）</h2>
              {extLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3 items-center">
                    {categories.map((cat) => (
                      <Button key={cat} size="sm" variant={selectedCategory === cat ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat)}>
                        {cat}
                      </Button>
                    ))}
                    <select className="border rounded-md px-2 py-1 h-9" value={selectedCompany} onChange={(e)=>setSelectedCompany(e.target.value)}>
                      {companyOptions.map(c => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    <select className="border rounded-md px-2 py-1 h-9" value={selectedSource} onChange={(e)=>setSelectedSource(e.target.value)}>
                      {sourceOptions.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" checked={ossOnly} onChange={(e)=>setOssOnly(e.target.checked)} /> 开源
                    </label>
                    <input className="ml-auto border rounded-md px-2 py-1 h-9" placeholder="搜索工具..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                    <div className="flex gap-2">
                      <Button size="sm" variant={sortKey === 'name_asc' ? 'default' : 'outline'} onClick={() => setSortKey('name_asc')}>A→Z</Button>
                      <Button size="sm" variant={sortKey === 'name_desc' ? 'default' : 'outline'} onClick={() => setSortKey('name_desc')}>Z→A</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {extTools
                      .filter((x) => selectedCategory === 'all' || (x.category || 'Uncategorized') === selectedCategory)
                      .filter((x) => selectedCompany === 'all' || (x.company || 'unknown') === selectedCompany)
                      .filter((x) => selectedSource === 'all' || (x.source || 'unknown') === selectedSource)
                      .filter((x) => !ossOnly || x.isOSS)
                      .filter((x) => {
                        const q = search.trim().toLowerCase();
                        if (!q) return true;
                        return String(x.name).toLowerCase().includes(q) || String(x.description||'').toLowerCase().includes(q);
                      })
                      .sort((a, b) => sortKey === 'name_asc' ? String(a.name).localeCompare(String(b.name)) : String(b.name).localeCompare(String(a.name)))
                      .map((x) => (
                        <div key={String(x.id)} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-medium flex items-center gap-2">
                              {x.link && (
                                <img src={getLogoUrlFromLink(x.link)} alt={x.name} className="w-5 h-5 rounded" />
                              )}
                              {x.name}
                            </div>
                            {x.link && (
                              <a href={x.link} target="_blank" rel="noreferrer" className="text-primary-600 text-sm inline-flex items-center">
                                官网 <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                          <div className="text-sm text-foreground-secondary mt-1">{x.category || 'Uncategorized'}{x.company ? `｜${x.company}` : ''}{x.source ? `｜${x.source}` : ''}{x.isOSS ? '｜开源' : ''}</div>
                          {x.description && (
                            <div className="text-sm text-foreground-secondary mt-1 line-clamp-2">{x.description}</div>
                          )}
                          {x.company && (
                            <div className="mt-2 text-sm">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">公司概览</div>
                                <Button size="sm" variant="outline" onClick={() => fetchResearch(x.company!)} disabled={researching === x.company}>{researching === x.company ? '刷新中...' : '刷新调研'}</Button>
                              </div>
                              <div className="text-foreground-secondary whitespace-pre-wrap mt-1">
                                {researchMap[x.company!]?.summary || '（点击“刷新调研”获取 GPT 摘要）'}
                              </div>
                              {researchMap[x.company!]?.funding_highlights && (
                                <div className="text-foreground-secondary mt-1">投融资：{researchMap[x.company!]?.funding_highlights}</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
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


