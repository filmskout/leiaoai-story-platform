import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Building2, ExternalLink } from 'lucide-react';

export default function ToolsReviews() {
  const { t } = useTranslation();

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
            <div className="space-y-3 text-sm text-foreground-secondary">
              <div>• 集成公司概况、轮次金额、投资方等信息</div>
              <div>• 绑定平台 Stories 作为用户测评来源</div>
              <div>• 结合 `aidb` 目录中的应用能力，部署在 `db.leiao.ai`</div>
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
      </div>
    </div>
  );
}


