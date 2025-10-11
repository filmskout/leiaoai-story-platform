import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Download, Upload, Edit3, Image, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// BMC Section Type
type BMCSection = {
  id: string;
  title: string;
  items: string[];
  color: string;
  description: string;
};

// Section Modal Component
const SectionModal = ({ 
  section, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  section: BMCSection; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (items: string[]) => void; 
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<string[]>(section.items);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(items);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 size={20} />
            {section.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{section.description}</p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add new item */}
          <div className="flex gap-2">
            <Input
              placeholder={t('bmc.add_item_placeholder', 'Add new item...')}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAddItem} disabled={!newItem.trim()}>
              <Plus size={16} />
            </Button>
          </div>
          
          {/* Items list */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <span className="flex-1">{item}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
          
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('bmc.no_items', 'No items yet. Add some items to get started.')}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('bmc.save_changes', 'Save Changes')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main BMC Component
export default function BMCCanvas() {
  const { t, i18n } = useTranslation();
  const { actualTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get BMC data based on current language
  const getBMCData = useCallback((): Record<string, BMCSection> => {
    const isZH = i18n.language.startsWith('zh');
    
    return {
      key_partners: {
        id: 'key_partners',
        title: isZH ? '关键合作' : 'Key Partners',
        items: isZH ? [
          '战略联盟',
          '合资企业', 
          '供应商关系',
          '买方-供应商合作'
        ] : [
          'Strategic alliances',
          'Joint ventures',
          'Supplier relationships',
          'Buyer-supplier partnerships'
        ],
        color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        description: isZH ? '谁是你的关键合作伙伴和供应商？' : 'Who are your key partners and suppliers?'
      },
      key_activities: {
        id: 'key_activities',
        title: isZH ? '关键业务' : 'Key Activities',
        items: isZH ? [
          '生产/制造',
          '问题解决',
          '平台/网络管理',
          '研究与开发'
        ] : [
          'Production/Manufacturing',
          'Problem solving',
          'Platform/Network management',
          'Research & Development'
        ],
        color: 'bg-green-50 border-green-200 hover:bg-green-100',
        description: isZH ? '你的价值主张需要哪些关键活动？' : 'What key activities does your value proposition require?'
      },
      key_resources: {
        id: 'key_resources',
        title: isZH ? '核心资源' : 'Key Resources',
        items: isZH ? [
          '物理资源',
          '知识产权',
          '人力资源',
          '财务资源'
        ] : [
          'Physical resources',
          'Intellectual property',
          'Human resources',
          'Financial resources'
        ],
        color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        description: isZH ? '你的价值主张需要哪些核心资源？' : 'What key resources does your value proposition require?'
      },
      value_proposition: {
        id: 'value_proposition',
        title: isZH ? '价值主张' : 'Value Proposition',
        items: isZH ? [
          '新颖性/创新',
          '性能提升',
          '定制化',
          '完成工作',
          '设计/品牌地位',
          '价格/成本降低',
          '风险降低',
          '可及性',
          '便利性/可用性'
        ] : [
          'Newness/Innovation',
          'Performance improvement',
          'Customization',
          'Getting the job done',
          'Design/Brand status',
          'Price/Cost reduction',
          'Risk reduction',
          'Accessibility',
          'Convenience/Usability'
        ],
        color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        description: isZH ? '你为客户提供什么价值？' : 'What value do you deliver to customers?'
      },
      customer_relationships: {
        id: 'customer_relationships',
        title: isZH ? '客户关系' : 'Customer Relationships',
        items: isZH ? [
          '个人协助',
          '专门个人协助',
          '自助服务',
          '自动化服务',
          '社区',
          '共同创造'
        ] : [
          'Personal assistance',
          'Dedicated personal assistance',
          'Self-service',
          'Automated services',
          'Communities',
          'Co-creation'
        ],
        color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
        description: isZH ? '每个客户细分市场期望什么样的关系？' : 'What relationship does each customer segment expect?'
      },
      channels: {
        id: 'channels',
        title: isZH ? '渠道通路' : 'Channels',
        items: isZH ? [
          '销售团队',
          '网络销售',
          '合作商店',
          '自有商店',
          '批发商'
        ] : [
          'Sales force',
          'Web sales',
          'Partner stores',
          'Own stores',
          'Wholesaler'
        ],
        color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        description: isZH ? '通过哪些渠道接触客户？' : 'Through which channels do you reach customers?'
      },
      customer_segments: {
        id: 'customer_segments',
        title: isZH ? '客户细分' : 'Customer Segments',
        items: isZH ? [
          '大众市场',
          '利基市场',
          '细分市场',
          '多元化',
          '多边平台'
        ] : [
          'Mass market',
          'Niche market',
          'Segmented',
          'Diversified',
          'Multi-sided platforms'
        ],
        color: 'bg-red-50 border-red-200 hover:bg-red-100',
        description: isZH ? '你在为谁创造价值？' : 'For whom are you creating value?'
      },
      cost_structure: {
        id: 'cost_structure',
        title: isZH ? '成本结构' : 'Cost Structure',
        items: isZH ? [
          '固定成本',
          '可变成本',
          '规模经济',
          '范围经济'
        ] : [
          'Fixed costs',
          'Variable costs',
          'Economies of scale',
          'Economies of scope'
        ],
        color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
        description: isZH ? '你的企业中最重要的成本是什么？' : 'What are the most important costs in your business?'
      },
      revenue_streams: {
        id: 'revenue_streams',
        title: isZH ? '收入来源' : 'Revenue Streams',
        items: isZH ? [
          '资产销售',
          '使用费',
          '订阅费',
          '借贷/租赁/租借',
          '许可',
          '经纪费',
          '广告'
        ] : [
          'Asset sale',
          'Usage fee',
          'Subscription fee',
          'Lending/Renting/Leasing',
          'Licensing',
          'Brokerage fee',
          'Advertising'
        ],
        color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
        description: isZH ? '客户愿意为什么价值付费？' : 'For what value are customers willing to pay?'
      }
    };
  }, [i18n.language]);
  
  const [bmcData, setBmcData] = useState<Record<string, BMCSection>>(() => getBMCData());
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  // Update BMC data when language changes
  React.useEffect(() => {
    setBmcData(getBMCData());
  }, [getBMCData]);

  const handleSectionUpdate = useCallback((sectionId: string, items: string[]) => {
    setBmcData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        items
      }
    }));
  }, []);

  const handleExportJSON = () => {
    // 隐藏 JSON 导出功能（保留函数以防内部调用，但不在 UI 暴露）
    const exportData = Object.values(bmcData).reduce((acc, section) => {
      acc[section.id] = section.items;
      return acc;
    }, {} as Record<string, string[]>);
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-model-canvas.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    // 隐藏 JSON 导入功能（保留函数以防内部调用，但不在 UI 暴露）
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        
        // Update BMC data with imported data
        setBmcData(prev => {
          const updated = { ...prev };
          Object.keys(importedData).forEach(key => {
            if (updated[key] && Array.isArray(importedData[key])) {
              updated[key] = {
                ...updated[key],
                items: importedData[key]
              };
            }
          });
          return updated;
        });
      } catch (error) {
        alert('Invalid JSON file format');
      }
    };
    input.click();
  };

  const handleExportPNG = useCallback(async () => {
    if (!user) return navigate('/auth');

    // Create a canvas element for export
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    const sectionSpacing = 20;
    const itemSpacing = 25;
    const headerHeight = 35;
    const canvasWidth = 1400;
    const canvasHeight = 900;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Theme-aware colors
    const isDark = actualTheme === 'dark';
    const bgColor = isDark ? '#0f0f0f' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';
    const headerColor = isDark ? '#e4e4e7' : '#18181b';
    const borderColor = isDark ? '#27272a' : '#e4e4e7';
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw title
    ctx.fillStyle = headerColor;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(t('bmc.title', 'Business Model Canvas'), canvasWidth / 2, 35);
    
    // Draw grid layout
    const gridCols = 5;
    const gridRows = 3;
    const cellWidth = (canvasWidth - padding * 2) / gridCols;
    const cellHeight = (canvasHeight - 80 - padding * 2) / gridRows;
    const startY = 60;
    
    // Define grid positions for each section
    const gridPositions = {
      key_partners: { col: 0, row: 0, colSpan: 1, rowSpan: 2 },
      key_activities: { col: 1, row: 0, colSpan: 1, rowSpan: 1 },
      value_proposition: { col: 2, row: 0, colSpan: 1, rowSpan: 2 },
      customer_relationships: { col: 3, row: 0, colSpan: 1, rowSpan: 1 },
      customer_segments: { col: 4, row: 0, colSpan: 1, rowSpan: 2 },
      key_resources: { col: 1, row: 1, colSpan: 1, rowSpan: 1 },
      channels: { col: 3, row: 1, colSpan: 1, rowSpan: 1 },
      cost_structure: { col: 0, row: 2, colSpan: 2, rowSpan: 1 },
      revenue_streams: { col: 2, row: 2, colSpan: 3, rowSpan: 1 }
    };
    
    // Draw each section
    Object.values(bmcData).forEach(section => {
      const pos = gridPositions[section.id];
      if (!pos) return;
      
      const x = padding + pos.col * cellWidth;
      const y = startY + pos.row * cellHeight;
      const width = cellWidth * pos.colSpan - 2;
      const height = cellHeight * pos.rowSpan - 2;
      
      // Draw section border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw section title
      ctx.fillStyle = headerColor;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(section.title, x + 10, y + 25);
      
      // Draw section items
      ctx.fillStyle = textColor;
      ctx.font = '13px Arial';
      let itemY = y + 45;
      
      section.items.slice(0, 8).forEach((item, index) => {
        if (itemY + 20 > y + height - 10) return; // Prevent overflow
        ctx.fillText(`• ${item}`, x + 10, itemY);
        itemY += 18;
      });
      
      if (section.items.length > 8) {
        ctx.fillStyle = isDark ? '#71717a' : '#6b7280';
        ctx.fillText(`+${section.items.length - 8} more...`, x + 10, itemY);
      }
    });
    
    // Add watermark
    ctx.fillStyle = isDark ? '#3f3f46' : '#d1d5db';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Generated by LeiaoAI Platform', canvasWidth - 20, canvasHeight - 10);
    
    // Export as PNG
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `business-model-canvas-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }, [bmcData, actualTheme, user, t]);

  const handleSaveToDashboard = useCallback(async () => {
    console.log('🔵 BMC Save: Starting', { hasUser: !!user, sectionsCount: Object.keys(bmcData).length });
    
    if (!user) {
      console.log('🔴 BMC Save: No user, cannot save');
      alert(t('bmc.login_required', 'Please sign in to save your BMC.'));
      return;
    }

    try {
      // 准备JSON数据
      const dataToSave = Object.values(bmcData).reduce((acc, section) => {
        acc[section.id] = section.items;
        return acc;
      }, {} as Record<string, string[]>);
      
      console.log('🔵 BMC Save: Data prepared', { sections: Object.keys(dataToSave).length });

      // 生成PNG图片
      const canvasElement = document.getElementById('bmc-canvas');
      if (!canvasElement) {
        console.error('🔴 BMC Save: Canvas element not found');
        alert(t('bmc.save_failed', 'Failed to save. Please try again later.'));
        return;
      }
      
      console.log('🔵 BMC Save: Generating image...');

      // 使用html2canvas生成PNG
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: actualTheme === 'dark' ? '#1e293b' : '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // 转换为Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });
      
      console.log('🟢 BMC Save: Image generated', { size: blob.size });

      // 上传到Supabase Storage
      const fileName = `bmc_${user.id}_${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bmc-images')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('🔴 BMC Save: Upload error', uploadError);
        alert(t('bmc.save_failed', 'Failed to save. Please try again later.'));
        return;
      }

      console.log('🟢 BMC Save: Image uploaded', { path: uploadData.path });

      // 获取公开URL
      const { data: urlData } = supabase.storage
        .from('bmc-images')
        .getPublicUrl(fileName);

      // 保存到数据库（包含JSON数据和图片URL）
      console.log('🔵 BMC Save: Saving to database...');
      const { error } = await supabase.from('bmc_boards').insert({
        user_id: user.id,
        data: dataToSave,
        image_url: urlData.publicUrl,
        title: t('bmc.title', 'Business Model Canvas'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('🔴 BMC Save: Database error', error);
        alert(t('bmc.save_failed', 'Failed to save. Please try again later.'));
        return;
      }
      
      console.log('🟢 BMC Save: Success!');
      alert(t('bmc.save_success', 'Saved to your dashboard.'));
      navigate('/dashboard');
    } catch (e) {
      console.error('🔴 BMC Save: Error', e);
      alert(t('bmc.save_failed', 'Failed to save. Please try again later.'));
    }
  }, [user, bmcData, actualTheme, navigate, t]);

  return (
    <div id="bmc-canvas" className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('bmc.title', 'Business Model Canvas')}</h2>
          <p className="text-muted-foreground">{t('bmc.subtitle', 'Click on any section to edit and customize your business model')}</p>
        </div>
        <div className="flex gap-2">
          {/* 隐藏 JSON 导入/导出按钮，不在 UI 暴露 */}
          <Button 
            variant="outline" 
            onClick={handleSaveToDashboard}
            disabled={!user}
          >
            <Save size={16} className="mr-2" />
            {t('bmc.save_to_dashboard', 'Save to Dashboard')}
          </Button>
          <Button variant="outline" onClick={handleExportPNG}>
            <Image size={16} className="mr-2" />
            {t('bmc.export_png', 'Export as Image')}
          </Button>
        </div>
      </div>

      {/* BMC Grid Layout */}
      <div className="grid grid-cols-5 gap-4 min-h-[600px]">
        {/* Row 1 */}
        <SectionCard 
          section={bmcData.key_partners} 
          onClick={() => setSelectedSection('key_partners')}
          className="row-span-2"
        />
        <SectionCard 
          section={bmcData.key_activities} 
          onClick={() => setSelectedSection('key_activities')}
        />
        <SectionCard 
          section={bmcData.value_proposition} 
          onClick={() => setSelectedSection('value_proposition')}
          className="row-span-2"
        />
        <SectionCard 
          section={bmcData.customer_relationships} 
          onClick={() => setSelectedSection('customer_relationships')}
        />
        <SectionCard 
          section={bmcData.customer_segments} 
          onClick={() => setSelectedSection('customer_segments')}
          className="row-span-2"
        />
        
        {/* Row 2 */}
        <SectionCard 
          section={bmcData.key_resources} 
          onClick={() => setSelectedSection('key_resources')}
          className="col-span-2"
        />
        <SectionCard 
          section={bmcData.channels} 
          onClick={() => setSelectedSection('channels')}
        />
        
        {/* Row 3 */}
        <SectionCard 
          section={bmcData.cost_structure} 
          onClick={() => setSelectedSection('cost_structure')}
          className="col-span-2"
        />
        <SectionCard 
          section={bmcData.revenue_streams} 
          onClick={() => setSelectedSection('revenue_streams')}
          className="col-span-3"
        />
      </div>

      {/* Section Modals */}
      {selectedSection && (
        <SectionModal
          section={bmcData[selectedSection]}
          isOpen={!!selectedSection}
          onClose={() => setSelectedSection(null)}
          onSave={(items) => handleSectionUpdate(selectedSection, items)}
        />
      )}
    </div>
  );
}

// Section Card Component
const SectionCard = ({ 
  section, 
  onClick, 
  className 
}: { 
  section: BMCSection; 
  onClick: () => void; 
  className?: string;
}) => {
  const { t } = useTranslation();
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 border-2 hover:shadow-lg dark:hover:shadow-xl',
        section.color,
        'dark:bg-gray-800/50 dark:border-gray-700',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-center">
          {section.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {section.items.slice(0, 4).map((item, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs block w-full justify-start truncate"
            >
              {item}
            </Badge>
          ))}
          {section.items.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{section.items.length - 4} {t('bmc.more', 'more')}
            </Badge>
          )}
          {section.items.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-2">
              {t('bmc.click_to_add', 'Click to add items')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};