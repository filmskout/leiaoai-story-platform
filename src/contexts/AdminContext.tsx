import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Admin context interface
interface AdminContextType {
  isAdmin: boolean;
  adminSessionValid: boolean;
  checkAdminStatus: () => boolean;
  revokeAdminAccess: () => void;
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

    const adminVerified = localStorage.getItem('leiaoai-admin-verified') === 'true';
    const adminSession = localStorage.getItem('leiaoai-admin-session');
    
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
    localStorage.removeItem('leiaoai-admin-verified');
    localStorage.removeItem('leiaoai-admin-session');
    setIsAdmin(false);
    setAdminSessionValid(false);
  };

  // Update admin status when auth changes
  useEffect(() => {
    const adminStatus = checkAdminStatus();
    setIsAdmin(adminStatus);
    setAdminSessionValid(adminStatus);
  }, [isAuthenticated, user]);

  // Check admin session periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const adminStatus = checkAdminStatus();
      setIsAdmin(adminStatus);
      setAdminSessionValid(adminStatus);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
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
    adminFeatures
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;