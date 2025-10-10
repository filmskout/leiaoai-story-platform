// 基于蕾奥AI logo的主色调和设计系统
export const leoaiColors = {
  // 主色调 - 基于logo的橙色/琢珀色
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // 主色
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407'
  },
  
  // 辅助色 - 基于logo的黑色和灰色
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },
  
  // 成功色
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a'
  },
  
  // 错误色
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626'
  },
  
  // 警告色
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706'
  },
  
  // 信息色
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb'
  }
};

// 主题变量
export const themeVariables = {
  light: {
    '--color-primary': leoaiColors.primary[500],
    '--color-primary-dark': leoaiColors.primary[600],
    '--color-primary-light': leoaiColors.primary[400],
    '--color-background': '#ffffff',
    '--color-surface': '#f8fafc',
    '--color-border': leoaiColors.neutral[200],
    '--color-text-primary': leoaiColors.neutral[900],
    '--color-text-secondary': leoaiColors.neutral[600],
    '--color-text-muted': leoaiColors.neutral[500],
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  dark: {
    '--color-primary': leoaiColors.primary[400],
    '--color-primary-dark': leoaiColors.primary[500],
    '--color-primary-light': leoaiColors.primary[300],
    '--color-background': leoaiColors.neutral[950],
    '--color-surface': leoaiColors.neutral[900],
    '--color-border': leoaiColors.neutral[800],
    '--color-text-primary': leoaiColors.neutral[50],
    '--color-text-secondary': leoaiColors.neutral[300],
    '--color-text-muted': leoaiColors.neutral[400],
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)'
  }
};

// 应用主题变量到CSS
export function applyThemeVariables(theme: 'light' | 'dark') {
  const variables = themeVariables[theme];
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}