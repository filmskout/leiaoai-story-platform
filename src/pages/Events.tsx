import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Ticket } from 'lucide-react';
import { listUpcomingEvents, registerEvent } from '@/services/events';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface EventItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  starts_at: string;
  ends_at?: string;
}

export default function Events() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listUpcomingEvents();
        setEvents(data as unknown as EventItem[]);
      } catch (e) {
        console.error('Failed to load events', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      alert('请先登录');
      return;
    }
    try {
      setRegisteringId(eventId);
      await registerEvent(eventId, user.id);
      alert('报名成功');
    } catch (e) {
      console.error('register error', e);
      alert('报名失败，请重试');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">活动发布与报名</h1>
          <p className="text-foreground-secondary mt-2">发布活动、管理报名、订阅每月常规活动套餐</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" /> 发布新活动（占位）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-foreground-secondary">
                  即将支持：活动标题、时间地点、票种与价格、报名表单、容量控制、审核机制。
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>即将到来活动</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-3">
                    {events.length === 0 && (
                      <div className="text-sm text-foreground-secondary">暂无即将到来活动</div>
                    )}
                    {events.map((ev) => (
                      <div key={ev.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{ev.title}</div>
                          <div className="text-sm text-foreground-secondary">
                            {ev.location || '线上'} ｜ {new Date(ev.starts_at).toLocaleString()}
                          </div>
                        </div>
                        <Button size="sm" className="whitespace-nowrap" onClick={() => handleRegister(ev.id)} disabled={registeringId === ev.id}>
                          <Ticket className="w-4 h-4 mr-2" /> {registeringId === ev.id ? '提交中...' : '报名'}
                        </Button>
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
                <CardTitle>订阅活动套餐（占位）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-foreground-secondary">
                  <div>• 月度常规活动套餐：每月 2 次主题活动</div>
                  <div>• 年度大活动门票优惠：早鸟折扣、会员折扣</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


