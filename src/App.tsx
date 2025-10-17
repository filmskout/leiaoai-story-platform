import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AIProvider } from '@/contexts/AIContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTheme } from '@/contexts/ThemeContext';
import { applyThemeVariables } from '@/styles/theme';
import i18n from '@/i18n';
import { DynamicMetaTags } from '@/components/ui/DynamicMetaTags';
import { Toaster } from 'sonner';

// Lazy load page components
const Home = lazy(() => import('@/pages/Home'));
const AuthNew = lazy(() => import('@/pages/Auth'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const Profile = lazy(() => import('@/pages/Profile'));
const StoryDetail = lazy(() => import('@/pages/StoryDetail'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const EditStory = lazy(() => import('@/pages/EditStory'));
const Stories = lazy(() => import('@/pages/Stories'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const AIChat = lazy(() => import('@/pages/AIChat'));
const BPAnalysis = lazy(() => import('@/pages/BPAnalysis'));
const Settings = lazy(() => import('@/pages/Settings'));
const DebugStories = lazy(() => import('@/pages/DebugStories'));
const About = lazy(() => import('@/pages/About'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Contact = lazy(() => import('@/pages/Contact'));
const Program = lazy(() => import('@/pages/Program'));
const Events = lazy(() => import('@/pages/Events'));
const ToolsReviews = lazy(() => import('@/pages/ToolsReviews'));
const AICompaniesCatalog = lazy(() => import('@/pages/AICompaniesCatalog'));
const CompanyDetail = lazy(() => import('@/pages/CompanyDetail'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">{t('loading.auth', 'Verifying authentication...')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirect to home if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Theme applier component
function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { actualTheme } = useTheme();
  
  useEffect(() => {
    applyThemeVariables(actualTheme);
  }, [actualTheme]);
  
  return <>{children}</>;
}

// Main app routes
function AppRoutes() {
  const [appReady, setAppReady] = useState(false);
  const [appError, setAppError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for i18n initialization
        if (!i18n.isInitialized) {
          await new Promise((resolve) => {
            const onInitialized = () => {
              i18n.off('initialized', onInitialized);
              resolve(true);
            };
            i18n.on('initialized', onInitialized);
            
            // Timeout after 3 seconds
            setTimeout(() => {
              i18n.off('initialized', onInitialized);
              resolve(true);
            }, 3000);
          });
        }

        console.log('App initialized successfully');
        setAppReady(true);
      } catch (error: any) {
        console.error('App initialization failed:', error);
        setAppError(error);
        setAppReady(true); // Show app even with errors
      }
    };

    initializeApp();

    // Force show app after 5 seconds
    const timeout = setTimeout(() => {
      if (!appReady) {
        console.warn('App initialization timeout');
        setAppReady(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [appReady]);

  if (!appReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-700 font-medium">LeoAI Platform</p>
          <p className="text-gray-500 text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  if (appError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600 mb-4">Something went wrong while initializing the app.</p>
          <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm mb-4">
            <p className="font-mono">{appError.message || 'Unknown error'}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Authentication routes */}
        <Route path="/auth" element={
          <PublicRoute>
            <AuthNew />
          </PublicRoute>
        } />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Main app routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="contact" element={<Contact />} />
          <Route path="program/:slug" element={<Program />} />
          <Route path="events" element={<Events />} />
          <Route path="tools" element={<ToolsReviews />} />
          <Route path="ai-companies" element={<AICompaniesCatalog />} />
          <Route path="ai-companies/:id" element={<CompanyDetail />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="bp-analysis" element={<BPAnalysis />} />
          <Route path="stories" element={<Stories />} />
          <Route path="story/:id" element={<StoryDetail />} />
          <Route path="user/:id" element={<UserProfile />} />
          <Route path="u/:username" element={<UserProfile />} />
          
          {/* Protected routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="profile/edit" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="create-story" element={
            <ProtectedRoute>
              <CreateStory />
            </ProtectedRoute>
          } />
          <Route path="edit-story/:id" element={
            <ProtectedRoute>
              <EditStory />
            </ProtectedRoute>
          } />
          <Route path="debug-stories" element={<DebugStories />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// Main App component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ThemeApplier>
            <Router>
              <AuthProvider>
                <AdminProvider>
                  <AIProvider>
                    <DynamicMetaTags />
                    <AppRoutes />
                    {/* Toast notifications */}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'white',
                          color: '#374151',
                          border: '1px solid #e5e7eb'
                        }
                      }}
                    />
                  </AIProvider>
                </AdminProvider>
              </AuthProvider>
            </Router>
          </ThemeApplier>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
