import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import AdminPanel from '@/components/AdminPanel';
import { useMobileLayout, useCompactLayout } from '@/hooks/use-mobile';
import { 
  Home as HomeIcon, 
  User, 
  PlusCircle, 
  MessageSquare, 
  LogOut,
  Settings,
  Search,
  Bell,
  AlertTriangle,
  Bot,
  FileText,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Shield
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { isAdmin, adminSessionValid } = useAdmin();
  const { theme, actualTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobileLayout();
  const isCompact = useCompactLayout();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // 关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  // Get current user info from unified auth context
  const getCurrentUser = () => {
    if (user) {
      return {
        name: user.name || 'User',
        email: user.email || '',
        avatar: user.avatar_url || '/default_user_avatar_placeholder_modern_clean.jpg',
        isAuthenticated: true
      };
    }
    return {
      name: 'Guest',
      email: '',
      avatar: '/default_user_avatar_placeholder_modern_clean.jpg',
      isAuthenticated: false
    };
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 实现搜索功能
      console.log('搜索:', searchQuery);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={16} />;
      case 'dark': return <Moon size={16} />;
      case 'auto': return <Monitor size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const navItems = [
    {
      path: '/',
      label: t('nav.home'),
      icon: <HomeIcon size={18} />
    },
    {
      path: '/ai-chat',
      label: t('nav.ai_chat'),
      icon: <Bot size={18} />
    },
    {
      path: '/stories',
      label: t('nav.stories'),
      icon: <BookOpen size={18} />
    },
    {
      path: '/bp-analysis',
      label: t('nav.bp_analysis'),
      icon: <FileText size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 头部导航 */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo和主导航 */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
                <img
                  src={actualTheme === 'dark' ? '/leiaoai-logo-light.png' : '/leiaoai-logo-dark.png'}
                  alt={t('app_name')}
                  className={cn(
                    "h-6 sm:h-8 w-auto object-contain",
                    isMobile && "h-6"
                  )}
                />
                <span className={cn(
                  "font-bold text-foreground",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {isMobile ? t('app_name') : t('app_name')}
                </span>
              </Link>

              {/* 桌面端导航 - 调整断点 */}
              <nav className="hidden xl:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-2 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )}
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* 搜索框 - 移动端隐藏 */}
            <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </form>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* 语言切换 - 移动端隐藏 */}
              <LanguageSelector variant="header" className="hidden lg:flex" />

              {/* Admin Indicator */}
              {isAuthenticated && isAdmin && adminSessionValid && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminPanel(true)}
                  className={cn(
                    "p-0 relative",
                    isMobile ? "w-7 h-7" : "w-8 h-8"
                  )}
                  title="Admin Panel"
                >
                  <Shield size={16} className="text-red-500" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Button>
              )}

              {/* 主题切换 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={cn(
                  "p-0",
                  isMobile ? "w-7 h-7" : "w-8 h-8"
                )}
                title={t('settings.theme')}
              >
                {getThemeIcon()}
              </Button>

              {isAuthenticated ? (
                <>
                  {/* 通知 - 移动端隐藏 */}
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hidden lg:flex">
                    <Bell size={16} />
                  </Button>

                  {/* 用户菜单 */}
                  <div className="relative" ref={profileMenuRef}>
                    <Button
                      variant="ghost"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className={cn(
                        "flex items-center space-x-2 px-2",
                        isMobile ? "h-7" : "h-8"
                      )}
                    >
                      <img
                        src={getCurrentUser().avatar}
                        alt={t('user.avatar')}
                        className={cn(
                          "rounded-full object-cover",
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        )}
                      />
                      <ChevronDown size={12} className="hidden lg:block" />
                    </Button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-1 z-[110]">
                        <div className="px-3 py-2 border-b border-border">
                          <p className="text-sm font-medium text-foreground">
                            {getCurrentUser().name}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {getCurrentUser().email}
                          </p>
                        </div>
                        
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User size={16} />
                          <span>{t('nav.dashboard', 'Dashboard')}</span>
                        </Link>
                        
                        <Link
                          to="/profile/edit"
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings size={16} />
                          <span>{t('nav.settings')}</span>
                        </Link>
                        
                        <div className="border-t border-border my-1"></div>
                        
                        {/* Admin Panel Access */}
                        {isAuthenticated && isAdmin && adminSessionValid && (
                          <>
                            <button
                              onClick={() => {
                                setShowAdminPanel(true);
                                setShowProfileMenu(false);
                              }}
                              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Shield size={16} />
                              <span>Admin Panel</span>
                            </button>
                            <div className="border-t border-border my-1"></div>
                          </>
                        )}
                        
                        <Link
                          to="/create-story"
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <PlusCircle size={16} />
                          <span>{t('stories.create_story')}</span>
                        </Link>
                        
                        <div className="border-t border-border my-1"></div>
                        
                        <button
                          onClick={() => {
                            handleSignOut();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                        >
                          <LogOut size={16} />
                          <span>{t('auth.sign_out')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/auth">
                  <Button size="sm">
                    {t('auth.sign_in')}
                  </Button>
                </Link>
              )}

              {/* 移动端菜单按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={cn(
                  "xl:hidden p-0",
                  isMobile ? "w-7 h-7" : "w-8 h-8"
                )}
              >
                {showMobileMenu ? <X size={isMobile ? 14 : 16} /> : <Menu size={isMobile ? 14 : 16} />}
              </Button>
            </div>
          </div>
        </div>

        {/* 移动端导航菜单 - 优化布局 */}
        {showMobileMenu && (
          <div className="xl:hidden border-t border-border bg-background">
            <div className={cn(
              "container-custom space-y-1",
              isMobile ? "py-2" : "py-4"
            )}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg text-sm font-medium transition-colors',
                    isMobile ? 'px-2 py-1.5' : 'px-3 py-2',
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* 移动端搜索 - 只在中等屏幕显示 */}
              {!isMobile && (
                <div className="pt-2">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search')}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </form>
                </div>
              )}
              
              {/* 移动端语言选择器 */}
              <div className={cn(
                "border-t border-border",
                isMobile ? "pt-1" : "pt-2"
              )}>
                <LanguageSelector className="w-full" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      {/* 主内容区域 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-background border-t border-border mt-12">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src={actualTheme === 'dark' ? '/leoai-logo-light.png' : '/leoai-logo-dark.png'}
                alt={t('app_name')}
                className="h-6 w-auto object-contain"
              />
              <span className="text-foreground-muted text-sm">
                {t('app_description', 'Professional AI Investment Platform')}
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-foreground-muted">
              <Link to="/about" className="hover:text-foreground transition-colors">
                {t('about')}
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                {t('privacy')}
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                {t('terms')}
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                {t('contact')}
              </Link>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-foreground-muted">
            <p>{t('copyright_info')}. {t('footer.developed_by')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}