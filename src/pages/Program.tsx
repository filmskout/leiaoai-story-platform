import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { CalendarIcon, Upload, CheckCircle, Star, Users, Award, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { submitProgramApplication } from '@/services/programs';

interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded: boolean;
}

const Program: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { id: '1', name: 'Business Plan', type: 'pdf', url: '', uploaded: false },
    { id: '2', name: 'Financial Statements', type: 'pdf', url: '', uploaded: false },
    { id: '3', name: 'Company Profile', type: 'pdf', url: '', uploaded: false },
    { id: '4', name: 'Investment Deck', type: 'pdf', url: '', uploaded: false },
  ]);
  const [personalIntro, setPersonalIntro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate booking slots for the next 30 days
    const slots: BookingSlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        slots.push({
          id: `slot-${i}-1`,
          date: date.toISOString().split('T')[0],
          time: '09:00-10:00',
          available: Math.random() > 0.3
        });
        slots.push({
          id: `slot-${i}-2`,
          date: date.toISOString().split('T')[0],
          time: '14:00-15:00',
          available: Math.random() > 0.3
        });
      }
    }
    
    setBookingSlots(slots);
  }, []);

  const handleDocumentUpload = (docId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, url: URL.createObjectURL(file), uploaded: true }
        : doc
    ));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please login to apply');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
      await submitProgramApplication(user.id, {
        slug: slug || 'financial-pioneer-100',
        selectedDate: selectedDate || selectedDateStr,
        timeSlot: undefined,
        documents: documents.map(d => ({ name: d.name, type: d.type, url: d.url })),
        personalIntro
      });

      alert('Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlots = bookingSlots.filter(slot => slot.available);

  const programTitle = useMemo(() => {
    switch (slug) {
      case 'financial-pioneer-100':
        return '《金融先锋100》计划';
      default:
        return 'Program';
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">{programTitle}</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            汇聚金融科技领域的创新力量，为100位金融先锋提供专业投资对接、资源整合和品牌推广服务
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Program Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  计划简介
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  《金融先锋100》是LeiaoAI推出的年度重点计划，旨在发现和培养金融科技领域的优秀创新者。
                  通过严格的筛选机制，我们将选出100位最具潜力的金融先锋，为他们提供全方位的支持服务。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <div className="font-semibold">100位先锋</div>
                      <div className="text-sm text-gray-600">年度精选名额</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Award className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-semibold">专属勋章</div>
                      <div className="text-sm text-gray-600">身份认证标识</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  报名标准
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold">金融科技相关项目</div>
                      <div className="text-sm text-gray-600">从事金融科技、投资科技、区块链等领域的创新项目</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold">团队规模</div>
                      <div className="text-sm text-gray-600">核心团队不少于3人，具备相关行业经验</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold">项目阶段</div>
                      <div className="text-sm text-gray-600">已完成MVP或具备可演示的产品原型</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <div className="font-semibold">融资需求</div>
                      <div className="text-sm text-gray-600">有明确的融资需求和商业计划</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Model */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  收费模式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">免费</div>
                    <div className="text-sm text-gray-600 mb-2">基础报名</div>
                    <div className="text-xs text-gray-500">包含基础审核和初步对接</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">¥9,999</div>
                    <div className="text-sm text-gray-600 mb-2">深度服务</div>
                    <div className="text-xs text-gray-500">包含专业访谈、资源对接、品牌推广</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">¥19,999</div>
                    <div className="text-sm text-gray-600 mb-2">VIP服务</div>
                    <div className="text-xs text-gray-500">包含所有服务+专属投资对接</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Application Form */}
          <div className="space-y-6">
            {/* Booking System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                  预约访谈日期
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">选择日期</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <div className="text-sm font-medium mb-2">可选时间段：</div>
                      <div className="space-y-2">
                        {availableSlots
                          .filter(slot => slot.date === selectedDate)
                          .map(slot => (
                            <Button
                              key={slot.id}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              {slot.time}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-green-500" />
                  提交文档资料
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {doc.uploaded ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Upload className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-gray-500">{doc.type.toUpperCase()}</div>
                        </div>
                      </div>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(doc.id, file);
                        }}
                        className="w-32"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Introduction AI Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-purple-500" />
                  个人介绍AI生成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="请描述您的项目背景、团队经验、创新亮点等，AI将为您生成专业的个人介绍..."
                  value={personalIntro}
                  onChange={(e) => setPersonalIntro(e.target.value)}
                  rows={6}
                  className="mb-3"
                />
                <Button variant="outline" size="sm" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  AI生成个人介绍
                </Button>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !user}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      立即报名《金融先锋100》
                    </>
                  )}
                </Button>
                
                {!user && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    请先登录后再报名
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">入选后的专属权益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">专属勋章</h3>
                  <p className="text-sm text-gray-600">获得《金融先锋100》专属身份认证勋章</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">推荐页面</h3>
                  <p className="text-sm text-gray-600">个人资料将展示在官方推荐页面</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">访谈展示</h3>
                  <p className="text-sm text-gray-600">访谈精彩片段将在平台展示</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">投资对接</h3>
                  <p className="text-sm text-gray-600">优先获得投资机构对接机会</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Program;
