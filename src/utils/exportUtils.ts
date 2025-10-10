// 导出工具函数
import { type ChatMessage } from '@/hooks/useAIChat';

/**
 * 将消息历史格式化为Markdown
 */
export function formatMessagesToMarkdown(messages: ChatMessage[], title: string): string {
  const formattedDate = new Date().toLocaleString();
  let markdown = `# ${title}\n\n`;
  markdown += `生成时间：${formattedDate}\n\n`;
  
  // 添加每条消息
  messages.forEach((message) => {
    const formattedTime = message.timestamp.toLocaleString();
    const roleLabel = message.role === 'user' ? '用户' : '蕾奥AI';
    const modelInfo = message.aiModel ? ` (${message.aiModel})` : '';
    
    markdown += `## ${roleLabel}${modelInfo} - ${formattedTime}\n\n`;
    markdown += `${message.content}\n\n`;
    
    // 如果有处理时间，添加标记
    if (message.processingTime) {
      markdown += `*处理时间：${message.processingTime}秒*\n\n`;
    }
    
    markdown += `---\n\n`;
  });
  
  markdown += `\n*导出自蕾奥AI投资顾问*`;
  
  return markdown;
}

/**
 * 将Markdown导出为.md文件
 */
export function exportAsMarkdown(markdown: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `蕾奥AI对话_${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 简单的Markdown转Docx处理
 * 注意：这是一种简单的实现，不支持复杂Markdown格式
 */
export function exportAsDocx(markdown: string): void {
  // 固定的HTML头部和样式
  const htmlHeader = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>蕾奥AI对话</title>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; }
h1 { color: #333; }
h2 { color: #444; margin-top: 20px; }
hr { border: 0; height: 1px; background-color: #ddd; margin: 20px 0; }
code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow: auto; }
blockquote { border-left: 4px solid #ddd; padding-left: 10px; margin-left: 0; color: #666; }
.user { background-color: #f0f7ff; padding: 10px; border-radius: 5px; }
.assistant { background-color: #f9f9f9; padding: 10px; border-radius: 5px; }
</style>
</head>
<body>`;

  // 将markdown转换为简单的HTML
  let html = htmlHeader;
  
  // 分割段落
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  let currentRole = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 标题处理
    if (line.startsWith('# ')) {
      html += `<h1>${line.substring(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      const roleText = line.substring(3);
      if (roleText.includes('用户')) {
        currentRole = 'user';
        html += `<div class="user"><h2>${roleText}</h2>`;
      } else {
        currentRole = 'assistant';
        html += `<div class="assistant"><h2>${roleText}</h2>`;
      }
    } else if (line === '---') {
      if (currentRole) {
        html += `</div><hr/>`;
        currentRole = null;
      } else {
        html += `<hr/>`;
      }
    } else if (line.startsWith('```')) {
      // 代码块处理
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        html += `<pre><code>`;
      } else {
        html += `</code></pre>`;
      }
    } else if (line.startsWith('> ')) {
      // 引用块
      html += `<blockquote>${line.substring(2)}</blockquote>`;
    } else if (line === '') {
      // 空行
      html += `<p></p>`;
    } else {
      // 普通文本
      if (inCodeBlock) {
        html += line + '\n';
      } else {
        // 简单格式化
        let formattedLine = line
          .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>') // 粗体
          .replace(/\*([^\*]+)\*/g, '<em>$1</em>') // 斜体
          .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>'); // 链接
          
        html += `<p>${formattedLine}</p>`;
      }
    }
  }
  
  html += `</body></html>`;
  
  // 导出为HTML文件，Word可以打开
  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `蕾奥AI对话_${new Date().toISOString().slice(0, 10)}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
