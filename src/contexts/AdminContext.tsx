import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Admin context interface
interface AdminContextType {
  isAdmin: boolean;
  adminSessionValid: boolean;
  checkAdminStatus: () => boolean;
  revokeAdminAccess: () => void;
  startEditing: () => void;
  stopEditing: () => void;
  adminFeatures: {
    canViewDebugInfo: boolean;
    canManageUsers: boolean;
    canAccessAnalytics: boolean;
    canModifyContent: boolean;
  };
}

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Admin provider component
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSessionValid, setAdminSessionValid] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Check admin status
  const checkAdminStatus = (): boolean => {
    // If actively editing, skip all checks and maintain admin status
    const editingActive = localStorage.getItem('leoai-admin-editing-active') === 'true';
    if (editingActive) {
      // During editing, always return true without any validation checks
      // This prevents any state resets during editing
      return true;
    }

    // Normal admin status check (only when not editing)
    if (!isAuthenticated || !user) {
      return false;
    }

    const adminVerified = localStorage.getItem('leoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leoai-admin-session');
    
    if (!adminVerified || !adminSession) {
      return false;
    }

    // Check if session is within 24 hours (86400000 ms)
    const sessionTime = parseInt(adminSession, 10);
    const currentTime = Date.now();
    const sessionValid = (currentTime - sessionTime) < 86400000;

    if (!sessionValid) {
      // Session expired, revoke admin access
      revokeAdminAccess();
      return false;
    }

    return true;
  };

  // Revoke admin access
  const revokeAdminAccess = () => {
    localStorage.removeItem('leoai-admin-verified');
    localStorage.removeItem('leoai-admin-session');
    localStorage.removeItem('leoai-admin-editing-active');
    localStorage.removeItem('leoai-admin-editing-since');
    setIsAdmin(false);
    setAdminSessionValid(false);
  };

  // Start editing mode (extends admin session during editing)
  const startEditing = () => {
    localStorage.setItem('leoai-admin-editing-active', 'true');
    localStorage.setItem('leoai-admin-editing-since', Date.now().toString());
    // Also refresh the session timestamp
    localStorage.setItem('leoai-admin-session', Date.now().toString());
    console.log('🟢 Admin editing mode started');
  };

  // Stop editing mode
  const stopEditing = () => {
    localStorage.removeItem('leoai-admin-editing-active');
    localStorage.removeItem('leoai-admin-editing-since');
    console.log('🔴 Admin editing mode stopped');
  };

  // Update admin status when auth changes
  useEffect(() => {
    const adminStatus = checkAdminStatus();
    setIsAdmin(adminStatus);
    setAdminSessionValid(adminStatus);
    
    // Also check immediately on mount
    if (isAuthenticated && user) {
      const verified = localStorage.getItem('leoai-admin-verified') === 'true';
      const session = localStorage.getItem('leoai-admin-session');
      if (verified && session) {
        setIsAdmin(true);
        setAdminSessionValid(true);
      }
    }
  }, [isAuthenticated, user]);

  // Check admin session periodically and listen to storage changes
  useEffect(() => {
    const checkStatus = () => {
      // Skip status check if actively editing to prevent any resets
      const editingActive = localStorage.getItem('leoai-admin-editing-active') === 'true';
      if (editingActive) {
        // Maintain admin status during editing without checks
        setIsAdmin(true);
        setAdminSessionValid(true);
        return;
      }
      
      // Only check status when not editing
      const adminStatus = checkAdminStatus();
      setIsAdmin(adminStatus);
      setAdminSessionValid(adminStatus);
    };

    // Check immediately
    checkStatus();

    // Check periodically - skip checks entirely during editing
    let interval: NodeJS.Timeout | null = null;
    
    const setupInterval = () => {
      const editingActive = localStorage.getItem('leoai-admin-editing-active') === 'true';
      if (!editingActive) {
        // Only set interval when not editing
        if (interval) {
          clearInterval(interval);
        }
        interval = setInterval(checkStatus, 30000); // Every 30 seconds when not editing
      } else {
        // Clear interval during editing, maintain status directly
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        setIsAdmin(true);
        setAdminSessionValid(true);
      }
    };

    setupInterval();

    // Listen to storage changes (when localStorage is updated from another tab/console)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'leoai-admin-editing-active') {
        // Editing state changed, adjust interval
        setupInterval();
        checkStatus();
      } else if (e.key === 'leoai-admin-verified' || e.key === 'leoai-admin-session') {
        // Only check if not editing
        if (localStorage.getItem('leoai-admin-editing-active') !== 'true') {
          checkStatus();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen to custom events (for same-tab updates)
    const handleCustomStorage = () => {
      setupInterval();
      checkStatus();
    };
    window.addEventListener('localStorageUpdate', handleCustomStorage as EventListener);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleCustomStorage as EventListener);
    };
  }, []);

  // Admin features based on current status
  const adminFeatures = {
    canViewDebugInfo: isAdmin && adminSessionValid,
    canManageUsers: isAdmin && adminSessionValid,
    canAccessAnalytics: isAdmin && adminSessionValid,
    canModifyContent: isAdmin && adminSessionValid
  };

  // Context value
  const value: AdminContextType = {
    isAdmin,
    adminSessionValid,
    checkAdminStatus,
    revokeAdminAccess,
    startEditing,
    stopEditing,
    adminFeatures
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;