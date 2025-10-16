import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Ticket } from 'lucide-react';
import { listUpcomingEvents, registerEvent, createEvent, createTicket, listTickets, listRegistrations } from '@/services/events';
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
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState(''); // ISO from datetime-local
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState<number | ''>('');
  const [ticketQuota, setTicketQuota] = useState<number | ''>('');
  const [regs, setRegs] = useState<any[]>([]);
  const formatPrice = (cents?: number, currency: string = 'CNY') => {
    if (typeof cents !== 'number') return '-';
    const amount = (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : '';
    return `${symbol}${amount}${symbol ? '' : ' ' + currency}`;
  };

  const exportRegsCSV = () => {
    if (regs.length === 0) {
      alert('暂无报名记录');
      return;
    }
    const header = ['id','event_id','user_id','user_email','ticket_id','status','created_at'];
    const rows = regs.map((r:any)=>[
      r.id, r.event_id, r.user_id, r.user?.email || '', r.ticket_id || '', r.status, r.created_at
    ]);
    const csv = [header, ...rows].map(arr => arr.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-registrations-${activeEventId || 'list'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const handleCreate = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!title || !startsAt) {
      alert('请填写标题与开始时间');
      return;
    }
    try {
      setCreating(true);
      await createEvent(user.id, {
        title,
        description: description || undefined,
        location: location || undefined,
        startsAt,
        capacity: capacity === '' ? undefined : Number(capacity),
        visibility: 'public'
      });
      // reload list
      const data = await listUpcomingEvents();
      setEvents(data as unknown as EventItem[]);
      // reset form
      setTitle('');
      setLocation('');
      setStartsAt('');
      setDescription('');
      setCapacity('');
      alert('活动已创建');
    } catch (e) {
      console.error('create event error', e);
      alert('创建失败，请重试');
    } finally {
      setCreating(false);
    }
  };

  const loadEventDetail = async (eventId: string) => {
    setActiveEventId(eventId);
    try {
      const [t, r] = await Promise.all([listTickets(eventId), listRegistrations(eventId)]);
      setTickets(t as any[]);
      setRegs(r as any[]);
    } catch (e) {
      console.error('load event detail error', e);
    }
  };

  const handleCreateTicket = async () => {
    if (!activeEventId) return;
    if (!ticketName) {
      alert('请输入票种名称');
      return;
    }
    try {
      await createTicket(activeEventId, {
        name: ticketName,
        priceCents: ticketPrice === '' ? 0 : Number(ticketPrice),
        quota: ticketQuota === '' ? undefined : Number(ticketQuota)
      });
      const t = await listTickets(activeEventId);
      setTickets(t as any[]);
      setTicketName('');
      setTicketPrice('');
      setTicketQuota('');
    } catch (e) {
      console.error('create ticket error', e);
      alert('创建票种失败');
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
                  <Calendar className="w-5 h-5 mr-2" /> 发布新活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">标题</label>
                    <input className="w-full border rounded-md px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="活动标题" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">地点</label>
                    <input className="w-full border rounded-md px-3 py-2" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="线上/线下地址" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">开始时间</label>
                    <input type="datetime-local" className="w-full border rounded-md px-3 py-2" value={startsAt} onChange={(e)=>setStartsAt(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">容量（可选）</label>
                    <input type="number" className="w-full border rounded-md px-3 py-2" value={capacity} onChange={(e)=>setCapacity(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">简介（可选）</label>
                    <textarea className="w-full border rounded-md px-3 py-2" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="活动简介" />
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" onClick={handleCreate} disabled={creating}>{creating ? '创建中...' : '创建活动'}</Button>
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
                      <div key={ev.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{ev.title}</div>
                            <div className="text-sm text-foreground-secondary">
                              {ev.location || '线上'} ｜ {new Date(ev.starts_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => loadEventDetail(ev.id)}>管理</Button>
                            <Button size="sm" className="whitespace-nowrap" onClick={() => handleRegister(ev.id)} disabled={registeringId === ev.id}>
                              <Ticket className="w-4 h-4 mr-2" /> {registeringId === ev.id ? '提交中...' : '报名'}
                            </Button>
                          </div>
                        </div>

                        {activeEventId === ev.id && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                              <div className="font-medium mb-2">票种管理</div>
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <input className="border rounded-md px-2 py-1" placeholder="名称" value={ticketName} onChange={(e)=>setTicketName(e.target.value)} />
                                <input type="number" className="border rounded-md px-2 py-1" placeholder="价格(分)" value={ticketPrice} onChange={(e)=>setTicketPrice(e.target.value === '' ? '' : Number(e.target.value))} />
                                <input type="number" className="border rounded-md px-2 py-1" placeholder="配额(可选)" value={ticketQuota} onChange={(e)=>setTicketQuota(e.target.value === '' ? '' : Number(e.target.value))} />
                                <Button size="sm" onClick={handleCreateTicket}>新增票种</Button>
                              </div>
                              <div className="space-y-2 text-sm">
                                {tickets.length === 0 && <div className="text-foreground-secondary">暂无票种</div>}
                                {tickets.map((t: any) => (
                                  <div key={t.id} className="flex justify-between">
                                    <div>{t.name}</div>
                                    <div className="text-foreground-secondary">{formatPrice(t.price_cents, t.currency)} {t.quota ? `｜配额 ${t.quota}` : ''}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <div className="font-medium mb-2">报名明细</div>
                              <div className="space-y-2 text-sm max-h-64 overflow-auto">
                                {regs.length === 0 && <div className="text-foreground-secondary">暂无报名</div>}
                                {regs.map((r: any) => (
                                  <div key={r.id} className="flex justify-between">
                                    <div>{r.user_id}</div>
                                    <div className="text-foreground-secondary">{new Date(r.created_at).toLocaleString()}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2">
                                <Button size="sm" variant="outline" onClick={exportRegsCSV}>导出报名 CSV</Button>
                              </div>
                            </div>
                          </div>
                        )}
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


