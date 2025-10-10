import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Copy, Check, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Components } from 'react-markdown';

// 使用全局 Prism 初始化
import Prism, { highlightAll } from '@/lib/prism';

// KaTeX 数学公式样式
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isTyping?: boolean;
  enableCopy?: boolean;
  enableMath?: boolean;
  maxHeight?: string;
  compact?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

// 复制按钮组件
const CopyButton = memo(({ text, className }: { text: string; className?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={cn(
        'absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
        className
      )}
      title={copied ? '已复制' : '复制代码'}
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </Button>
  );
});

// 折叠容器组件
const CollapsibleSection = memo(({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <span className="font-medium text-foreground">{title}</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
});

export const MarkdownRenderer = memo(function MarkdownRenderer({ 
  content, 
  className, 
  isTyping,
  enableCopy = true,
  enableMath = true,
  maxHeight,
  compact = false,
  theme = 'auto'
}: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 渲染插件配置
  const remarkPlugins = useMemo(() => {
    const plugins = [remarkGfm, remarkBreaks];
    if (enableMath) {
      plugins.push(remarkMath);
    }
    return plugins;
  }, [enableMath]);
  
  const rehypePlugins = useMemo(() => {
    // 使用 rehypeRaw 来处理原始 HTML
    // 由于我们手动调用 Prism.highlightAll()，可以不使用 rehypeHighlight
    return [rehypeRaw];
  }, []);
  
  // 检查内容是否超出高度限制
  useEffect(() => {
    if (maxHeight && containerRef.current) {
      const element = containerRef.current;
      const maxHeightValue = parseInt(maxHeight);
      setIsOverflowing(element.scrollHeight > maxHeightValue);
    }
  }, [content, maxHeight]);
  
  // 全局 Prism 初始化
  useEffect(() => {
    // 每次内容更新时执行高亮
    highlightAll();
  }, [content]);
  
  // 打字效果处理
  const displayContent = useMemo(() => {
    if (!isTyping) return content;
    
    // 简单的打字效果，保留Markdown语法
    return content + (content.endsWith('\n') ? '' : '|');
  }, [content, isTyping]);
  
  const containerStyle = useMemo(() => {
    if (!maxHeight) return {};
    
    return {
      maxHeight: isExpanded ? 'none' : maxHeight,
      overflow: isExpanded ? 'visible' : 'hidden'
    };
  }, [maxHeight, isExpanded]);
  
  return (
    <div className={cn('relative', className)}>
      <div 
        ref={containerRef}
        className={cn(
          'markdown-content prose prose-neutral dark:prose-invert max-w-none',
          compact && 'prose-sm',
          'prose-headings:scroll-mt-4 prose-headings:font-semibold',
          'prose-p:leading-relaxed prose-li:leading-relaxed',
          'prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800',
          'prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-700',
          'prose-blockquote:border-l-primary-500 prose-blockquote:bg-primary-50 dark:prose-blockquote:bg-primary-900/20',
          'prose-table:border-collapse prose-th:border prose-td:border prose-th:border-border prose-td:border-border',
          'prose-img:rounded-lg prose-img:shadow-md',
          isTyping && 'animate-pulse'
        )}
        style={containerStyle}
      >
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={{
          // 增强的标题样式和锦点支持
          h1: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h1 
                id={id}
                className="group text-2xl font-bold text-foreground mt-8 mb-4 first:mt-0 border-b border-border pb-2 flex items-center gap-2"
                {...props}
              >
                {children}
                <a 
                  href={`#${id}`} 
                  className="opacity-0 group-hover:opacity-100 text-primary-500 hover:text-primary-600 transition-opacity"
                  aria-label="直接链接到此标题"
                >
                  #
                </a>
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h2 
                id={id}
                className="group text-xl font-semibold text-foreground mt-6 mb-3 first:mt-0 flex items-center gap-2"
                {...props}
              >
                {children}
                <a 
                  href={`#${id}`} 
                  className="opacity-0 group-hover:opacity-100 text-primary-500 hover:text-primary-600 transition-opacity"
                  aria-label="直接链接到此标题"
                >
                  #
                </a>
              </h2>
            );
          },
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium text-foreground mt-5 mb-2 first:mt-0" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-base font-medium text-foreground mt-4 mb-2 first:mt-0" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-sm font-medium text-foreground mt-3 mb-2 first:mt-0" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-xs font-medium text-foreground-secondary mt-2 mb-1 first:mt-0" {...props}>
              {children}
            </h6>
          ),
          
          // 段落样式
          p: ({ children }) => (
            <p className="text-foreground leading-relaxed mb-3 last:mb-0">
              {children}
            </p>
          ),
          
          // 增强的列表样式
          ul: ({ children, ...props }) => (
            <ul 
              className="space-y-1 mb-3 text-foreground list-disc pl-6"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, start, ...props }) => (
            <ol 
              className="space-y-1 mb-3 text-foreground list-decimal pl-6"
              start={start}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-foreground leading-relaxed hover:bg-neutral-50 dark:hover:bg-neutral-800/50 px-2 py-1 rounded transition-colors" {...props}>
              {children}
            </li>
          ),
          
          // 强调样式
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          
          // 增强的代码样式
          code: ({ children, className, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !match;
            
            if (isInline) {
              return (
                <code 
                  className={cn(
                    'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
                    'px-1.5 py-0.5 rounded text-sm font-mono font-medium',
                    'border border-primary-200 dark:border-primary-800'
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            const codeContent = String(children).replace(/\n$/, '');

            // 尝试使用 Prism 进行语法高亮
            useEffect(() => {
              if (Prism && language) {
                Prism.highlightAll();
              }
            }, [codeContent, language]);
            
            return (
              <div className="group relative">
                {language && (
                  <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-xs font-medium text-foreground-secondary border-b border-neutral-200 dark:border-neutral-700">
                    <span className="uppercase tracking-wide">{language}</span>
                    {enableCopy && <CopyButton text={codeContent} />}
                  </div>
                )}
                <code 
                  className={cn(
                    'block bg-neutral-50 dark:bg-neutral-900 text-foreground p-4 overflow-x-auto text-sm font-mono leading-relaxed',
                    'scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600',
                    className,
                    language && `language-${language}`
                  )}
                  {...props}
                >
                  {children}
                </code>
                {!language && enableCopy && (
                  <CopyButton text={codeContent} className="top-4 right-4" />
                )}
              </div>
            );
          },
          
          // 代码块容器
          pre: ({ children, ...props }) => (
            <pre className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden mb-4 border border-neutral-200 dark:border-neutral-700 shadow-sm prism-code" {...props}>
              {children}
            </pre>
          ),
          
          // 增强的引用样式
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className={cn(
                'relative border-l-4 border-primary-500 pl-6 pr-4 py-4 my-6',
                'bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent',
                'rounded-r-lg shadow-sm',
                'before:content-[\'\"\'] before:absolute before:top-2 before:left-2 before:text-3xl before:text-primary-400 before:font-serif',
                'after:content-[\'\"\'] after:absolute after:bottom-2 after:right-2 after:text-3xl after:text-primary-400 after:font-serif'
              )}
              {...props}
            >
              <div className="text-foreground-secondary italic leading-relaxed relative z-10">
                {children}
              </div>
            </blockquote>
          ),
          
          // 增强的表格样式
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-6 rounded-lg border border-border shadow-sm">
              <table className="min-w-full divide-y divide-border" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-neutral-50 dark:bg-neutral-800/50" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-border" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, align, ...props }) => (
            <th 
              className={cn(
                'px-4 py-3 text-sm font-semibold text-foreground border-r border-border last:border-r-0 bg-neutral-100 dark:bg-neutral-700/50',
                align === 'center' && 'text-center',
                align === 'right' && 'text-right',
                !align && 'text-left'
              )}
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, align, ...props }) => (
            <td 
              className={cn(
                'px-4 py-3 text-sm text-foreground border-r border-border last:border-r-0',
                align === 'center' && 'text-center',
                align === 'right' && 'text-right',
                !align && 'text-left'
              )}
              {...props}
            >
              {children}
            </td>
          ),
          
          // 增强的链接样式
          a: ({ children, href, ...props }) => (
            <a 
              href={href}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 decoration-primary-500/30 hover:decoration-primary-500 transition-colors"
              target={href?.startsWith('http') ? '_blank' : '_self'}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          
          // 图片样式
          img: ({ src, alt, title, ...props }) => (
            <div className="my-6">
              <img 
                src={src}
                alt={alt}
                title={title}
                className="max-w-full h-auto rounded-lg shadow-md border border-border mx-auto block"
                loading="lazy"
                {...props}
              />
              {(alt || title) && (
                <p className="text-center text-sm text-foreground-muted mt-2 italic">
                  {title || alt}
                </p>
              )}
            </div>
          ),
          
          // 分割线
          hr: ({ ...props }) => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" {...props} />
          ),
          
          // 任务列表
          input: ({ checked, type, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 rounded border-border text-primary-600 focus:ring-primary-500"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          }
        }}
        >
          {displayContent}
        </ReactMarkdown>
      </div>
      
      {/* 展开/收起按钮 */}
      {isOverflowing && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-foreground-muted hover:text-foreground"
          >
            {isExpanded ? (
              <>
                <EyeOff size={14} className="mr-2" />
                收起
              </>
            ) : (
              <>
                <Eye size={14} className="mr-2" />
                展开全部
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* 打字效果指示器 */}
      {isTyping && (
        <div className="flex items-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="ml-2 text-sm text-foreground-muted">正在生成...</span>
        </div>
      )}
    </div>
  );
});

// 语法高亮主题样式
MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
