import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Users, BarChart3, Settings, LogOut, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { updateProgramStatus, ProgramStatus, addProgramReviewLog, listProgramReviewLogs } from '@/services/programs';

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { isAdmin, adminSessionValid, revokeAdminAccess, adminFeatures } = useAdmin();
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const [apps, setApps] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [logsMap, setLogsMap] = useState<Record<string, any[]>>({});
  const [noteText, setNoteText] = useState<Record<string, string>>({});

  // Don't render if not admin
  if (!isAdmin || !adminSessionValid) {
    return null;
  }
  useEffect(() => {
    const load = async () => {
      setLoadingApps(true);
      try {
        const { data, error } = await supabase.from('program_applications').select('*').order('created_at', { ascending: false }).limit(50);
        if (error) throw error;
        setApps(data || []);
      } catch (e) {
        console.error('load program apps error', e);
      } finally {
        setLoadingApps(false);
      }
    };
    load();
  }, []);

  const setStatus = async (id: string, st: ProgramStatus) => {
    try {
      await updateProgramStatus(id, st);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: st } : a));
      toast.success('状态已更新');
      if (user?.id) {
        await addProgramReviewLog(id, user.id, 'status_change', `set to ${st}`);
        const logs = await listProgramReviewLogs(id);
        setLogsMap(prev => ({ ...prev, [id]: logs as any[] }));
      }
    } catch (e) {
      console.error('update status error', e);
      toast.error('更新失败');
    }
  };

  const addNote = async (id: string) => {
    const text = noteText[id]?.trim();
    if (!text) return;
    try {
      if (!user?.id) return;
      await addProgramReviewLog(id, user.id, 'note', text);
      const logs = await listProgramReviewLogs(id);
      setLogsMap(prev => ({ ...prev, [id]: logs as any[] }));
      setNoteText(prev => ({ ...prev, [id]: '' }));
      toast.success('备注已添加');
    } catch (e) {
      console.error('add note error', e);
      toast.error('添加失败');
    }
  };

  const handleRevokeAccess = () => {
    revokeAdminAccess();
    toast.success('Admin access revoked');
    if (onClose) onClose();
  };

  const adminSessionTime = localStorage.getItem('leoai-admin-session');
  const sessionStart = adminSessionTime ? new Date(parseInt(adminSessionTime, 10)) : null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
      "animate-in fade-in duration-200"
    )}>
      <div className={cn(
        "w-full max-w-md rounded-lg shadow-xl",
        actualTheme === 'dark' 
          ? "bg-gray-800 border border-gray-700" 
          : "bg-white border border-gray-200"
      )}>
        {/* Header */}
        <div className={cn(
          "px-6 py-4 border-b flex items-center justify-between",
          actualTheme === 'dark' ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className={cn(
              "text-lg font-semibold",
              actualTheme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              Admin Panel
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                "text-gray-400 hover:text-gray-600 transition-colors",
                actualTheme === 'dark' ? "hover:text-gray-300" : "hover:text-gray-600"
              )}
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Admin Status */}
          <div className={cn(
            "p-3 rounded-lg border",
            actualTheme === 'dark'
              ? "bg-green-900/20 border-green-800 text-green-400"
              : "bg-green-50 border-green-200 text-green-600"
          )}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Status: Active</span>
              <Shield className="w-4 h-4" />
            </div>
            {sessionStart && (
              <div className="flex items-center space-x-1 mt-1 text-xs opacity-75">
                <Clock className="w-3 h-3" />
                <span>Session started: {sessionStart.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className={cn(
            "p-3 rounded-lg border",
            actualTheme === 'dark'
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          )}>
            <div className="text-sm space-y-1">
              <div className={cn(
                "font-medium",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                Logged in as:
              </div>
              <div className={cn(
                "text-xs font-mono",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {user?.email}
              </div>
            </div>
          </div>

          {/* Program 审核面板 */}
          <div className="space-y-2">
            <h3 className={cn(
              "text-sm font-medium",
              actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
            )}>
              Program 审核
            </h3>
            <div className="max-h-64 overflow-auto space-y-2 text-xs">
              {loadingApps ? (
                <div className="text-foreground-secondary">加载中...</div>
              ) : (
                <>
                  {apps.length === 0 && <div className="text-foreground-secondary">暂无记录</div>}
                  {apps.map((a) => (
                    <div key={a.id} className={cn(
                      "p-2 rounded border",
                      actualTheme === 'dark' ? "border-gray-700" : "border-gray-200"
                    )}>
                      <div className="flex justify-between">
                        <div className="font-medium">{a.slug}</div>
                        <div className="text-foreground-secondary">{new Date(a.created_at).toLocaleString()}</div>
                      </div>
                      <div className="mt-1">状态：{a.status}</div>
                      <div className="mt-1 flex gap-1">
                        {(['submitted','under_review','approved','rejected'] as ProgramStatus[]).map(st => (
                          <button key={st} onClick={()=>setStatus(a.id, st)} className={cn(
                            "px-2 py-1 rounded border",
                            actualTheme === 'dark' ? "border-gray-700" : "border-gray-200",
                            a.status===st ? "bg-blue-600 text-white" : ""
                          )}>
                            {st}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-medium mb-1">审核备注</div>
                        <div className="flex gap-2">
                          <input className={cn(
                            "flex-1 border rounded px-2 py-1 text-xs",
                            actualTheme === 'dark' ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-800"
                          )} value={noteText[a.id] || ''} onChange={(e)=>setNoteText(prev=>({ ...prev, [a.id]: e.target.value }))} placeholder="添加备注..." />
                          <button onClick={()=>addNote(a.id)} className={cn(
                            "px-2 py-1 rounded border text-xs",
                            actualTheme === 'dark' ? "border-gray-700" : "border-gray-200"
                          )}>添加</button>
                        </div>
                        <div className="mt-2 max-h-24 overflow-auto space-y-1 text-xs">
                          {(logsMap[a.id] || []).map((l:any) => (
                            <div key={l.id} className={cn(
                              "p-2 rounded border",
                              actualTheme === 'dark' ? "border-gray-700" : "border-gray-200"
                            )}>
                              <div className="flex justify-between">
                                <div className="font-medium">{l.action}</div>
                                <div className="text-foreground-secondary">{new Date(l.created_at).toLocaleString()}</div>
                              </div>
                              {l.note && <div className="opacity-75 mt-1">{l.note}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Admin Features */}
          <div className="space-y-2">
            <h3 className={cn(
              "text-sm font-medium",
              actualTheme === 'dark' ? "text-gray-200" : "text-gray-700"
            )}>
              Available Features:
            </h3>
            
            <div className="space-y-1">
              {[
                { icon: BarChart3, label: 'Analytics Access', enabled: adminFeatures.canAccessAnalytics },
                { icon: Users, label: 'User Management', enabled: adminFeatures.canManageUsers },
                { icon: Settings, label: 'Debug Information', enabled: adminFeatures.canViewDebugInfo },
                { icon: AlertTriangle, label: 'Content Moderation', enabled: adminFeatures.canModifyContent }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-2 px-2 py-1 rounded text-xs",
                    feature.enabled
                      ? actualTheme === 'dark'
                        ? "text-green-400 bg-green-900/20"
                        : "text-green-600 bg-green-50"
                      : actualTheme === 'dark'
                        ? "text-gray-500 bg-gray-800"
                        : "text-gray-400 bg-gray-100"
                  )}
                >
                  <feature.icon className="w-3 h-3" />
                  <span>{feature.label}</span>
                  <span className="ml-auto">
                    {feature.enabled ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className={cn(
            "p-3 rounded-lg border text-xs",
            actualTheme === 'dark'
              ? "bg-yellow-900/20 border-yellow-800 text-yellow-400"
              : "bg-yellow-50 border-yellow-200 text-yellow-600"
          )}>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Security Notice</div>
                <div className="mt-1 opacity-75">
                  Admin session expires after 24 hours. All admin actions are logged and monitored.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "px-6 py-4 border-t",
          actualTheme === 'dark' ? "border-gray-700" : "border-gray-200"
        )}>
          <button
            onClick={handleRevokeAccess}
            className={cn(
              "w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors text-sm font-medium",
              "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span>Revoke Admin Access</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;