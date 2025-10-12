import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'Missing URL',
        details: 'Please provide a valid website URL.' 
      });
    }

    console.log('🔵 Website Extract: Starting extraction for', url);

    // 验证URL格式
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      // 只允许http和https协议
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (urlError) {
      console.error('🔴 Website Extract: Invalid URL format', urlError);
      return res.status(400).json({ 
        error: 'Invalid URL format',
        details: 'Please provide a valid HTTP or HTTPS URL.' 
      });
    }

    // 获取网页内容
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeiaoAI-BP-Analyzer/1.0; +https://leiaoai.com)'
      },
      timeout: 15000 // 15秒超时
    });

    if (!response.ok) {
      console.error('🔴 Website Extract: HTTP error', response.status);
      return res.status(400).json({ 
        error: 'Failed to fetch website',
        details: `HTTP ${response.status}: ${response.statusText}` 
      });
    }

    const html = await response.text();
    console.log('🔵 Website Extract: HTML fetched, length:', html.length);

    // 使用cheerio解析HTML
    const $ = cheerio.load(html);

    // 移除script和style标签
    $('script, style, noscript').remove();

    // 提取关键信息
    const extractedData = {
      url: validUrl.toString(),
      title: $('title').text().trim() || $('h1').first().text().trim() || '',
      description: $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      
      // 提取主要文本内容
      content: extractMainContent($),
      
      // 提取标题层次
      headings: {
        h1: $('h1').map((i, el) => $(el).text().trim()).get().filter(Boolean),
        h2: $('h2').map((i, el) => $(el).text().trim()).get().filter(Boolean),
        h3: $('h3').map((i, el) => $(el).text().trim()).get().filter(Boolean)
      },
      
      // 提取图片（限制数量）
      images: $('img').map((i, el) => {
        const src = $(el).attr('src');
        const alt = $(el).attr('alt');
        if (src) {
          // 转换相对URL为绝对URL
          try {
            const imgUrl = new URL(src, validUrl.toString());
            return {
              url: imgUrl.toString(),
              alt: alt || ''
            };
          } catch {
            return null;
          }
        }
        return null;
      }).get().filter(Boolean).slice(0, 10), // 最多10张图片
      
      // 提取链接（内部链接优先）
      links: $('a[href]').map((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (href && text) {
          try {
            const linkUrl = new URL(href, validUrl.toString());
            return {
              url: linkUrl.toString(),
              text: text
            };
          } catch {
            return null;
          }
        }
        return null;
      }).get().filter(Boolean).slice(0, 20), // 最多20个链接
      
      // Open Graph数据
      og: {
        title: $('meta[property="og:title"]').attr('content') || '',
        type: $('meta[property="og:type"]').attr('content') || '',
        image: $('meta[property="og:image"]').attr('content') || '',
        url: $('meta[property="og:url"]').attr('content') || ''
      }
    };

    // 生成适合LLM分析的文本摘要
    const textSummary = generateTextSummary(extractedData);

    console.log('🟢 Website Extract: Extraction complete', {
      title: extractedData.title,
      contentLength: extractedData.content.length,
      headingsCount: Object.values(extractedData.headings).flat().length,
      imagesCount: extractedData.images.length
    });

    return res.status(200).json({
      success: true,
      data: extractedData,
      textSummary: textSummary,
      metadata: {
        extractedAt: new Date().toISOString(),
        sourceUrl: validUrl.toString(),
        contentType: 'website'
      }
    });

  } catch (error: any) {
    console.error('💥 Website Extract: Error', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to extract website content',
      details: error.toString()
    });
  }
}

// 提取主要文本内容
function extractMainContent($: cheerio.CheerioAPI): string {
  // 优先提取主要内容区域
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '#main-content',
    '#content',
    '.content',
    'body'
  ];

  let content = '';
  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length > 0) {
      content = element.text();
      break;
    }
  }

  // 清理文本
  content = content
    .replace(/\s+/g, ' ') // 多个空白符替换为单个空格
    .replace(/\n+/g, '\n') // 多个换行符替换为单个换行
    .trim();

  // 限制长度（约10000字符，避免太长）
  if (content.length > 10000) {
    content = content.substring(0, 10000) + '...[内容已截断]';
  }

  return content;
}

// 生成适合LLM分析的文本摘要
function generateTextSummary(data: any): string {
  const sections: string[] = [];

  // 标题和描述
  if (data.title) {
    sections.push(`# ${data.title}\n`);
  }
  if (data.description) {
    sections.push(`## 网站描述\n${data.description}\n`);
  }
  if (data.keywords) {
    sections.push(`## 关键词\n${data.keywords}\n`);
  }

  // 标题层次
  if (data.headings.h1.length > 0) {
    sections.push(`## 主要标题\n${data.headings.h1.join('\n')}\n`);
  }
  if (data.headings.h2.length > 0) {
    sections.push(`## 章节标题\n${data.headings.h2.slice(0, 10).join('\n')}\n`);
  }

  // 主要内容
  if (data.content) {
    sections.push(`## 网站内容\n${data.content}\n`);
  }

  // 图片信息
  if (data.images.length > 0) {
    const imageList = data.images
      .slice(0, 5)
      .map((img: any) => `- ${img.alt || '图片'}: ${img.url}`)
      .join('\n');
    sections.push(`## 图片资源\n${imageList}\n`);
  }

  return sections.join('\n');
}

