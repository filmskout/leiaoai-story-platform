import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react({
      // 跳过类型检查，直接构建
      babel: {
        plugins: []
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 禁用类型检查
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true
        }
      }
    }
  },
  build: {
    // 增加chunk大小限制，避免大文件警告
    chunkSizeWarningLimit: 1000, // 从默认的500KB增加到1000KB
    // 添加缓存破坏策略
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.code === 'CIRCULAR_DEPENDENCY' || 
            warning.code === 'MISSING_EXPORT') {
          return;
        }
        warn(warning);
      },
      output: {
        // 手动分块，优化大文件
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'vendor-markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight'],
          'html2canvas': ['html2canvas'],
        },
        // 添加文件名哈希，确保缓存破坏
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  }
})

