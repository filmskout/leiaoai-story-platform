// 全局 Prism 初始化
import Prism from 'prismjs';

// 导入样式
import 'prismjs/themes/prism-tomorrow.css';

// 导入语言
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';

// 确保在客户端环境中全局可用
if (typeof window !== 'undefined') {
  window.Prism = window.Prism || Prism;
}

// 手动处理动态加载的内容
export function highlightAll() {
  if (typeof window !== 'undefined' && Prism && typeof Prism.highlightAll === 'function') {
    setTimeout(() => {
      Prism.highlightAll();
    }, 10);
  }
}

export default Prism;