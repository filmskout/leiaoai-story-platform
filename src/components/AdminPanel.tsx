import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Users, BarChart3, Settings, LogOut, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { isAdmin, adminSessionValid, revokeAdminAccess, adminFeatures } = useAdmin();
  const { user } = useAuth();
  const { actualTheme } = useTheme();

  // Don't render if not admin
  if (!isAdmin || !adminSessionValid) {
    return null;
  }

  const handleRevokeAccess = () => {
    revokeAdminAccess();
    toast.success('Admin access revoked');
    if (onClose) onClose();
  };

  const adminSessionTime = localStorage.getItem('leiaoai-admin-session');
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