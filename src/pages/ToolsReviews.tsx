import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Building2, ExternalLink } from 'lucide-react';
import { listToolsWithCompany } from '@/services/tools';
import LoadingSpinner from '@/components/LoadingSpinner';

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
      </div>
    </div>
  );
}


