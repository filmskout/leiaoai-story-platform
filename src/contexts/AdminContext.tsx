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
    if (!isAuthenticated || !user) {
      return false;
    }

    const adminVerified = localStorage.getItem('leoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leoai-admin-session');
    
    if (!adminVerified || !adminSession) {
      return false;
    }

    // Check if user is actively editing (extend session for 10 minutes during editing)
    const editingSince = localStorage.getItem('leoai-admin-editing-since');
    const editingActive = localStorage.getItem('leoai-admin-editing-active') === 'true';
    
    if (editingActive && editingSince) {
      const editingTime = parseInt(editingSince, 10);
      const currentTime = Date.now();
      // During editing, extend session to at least 10 minutes from when editing started
      const editingDuration = currentTime - editingTime;
      const extendedValid = editingDuration < 600000; // 10 minutes = 600000 ms
      
      if (extendedValid) {
        // Update session time to extend validity during editing
        localStorage.setItem('leoai-admin-session', currentTime.toString());
        return true;
      }
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
      const adminStatus = checkAdminStatus();
      setIsAdmin(adminStatus);
      setAdminSessionValid(adminStatus);
    };

    // Check immediately
    checkStatus();

    // Check periodically
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    // Listen to storage changes (when localStorage is updated from another tab/console)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'leoai-admin-verified' || e.key === 'leoai-admin-session') {
        checkStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen to custom events (for same-tab updates)
    const handleCustomStorage = () => {
      checkStatus();
    };
    window.addEventListener('localStorageUpdate', handleCustomStorage as EventListener);

    return () => {
      clearInterval(interval);
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