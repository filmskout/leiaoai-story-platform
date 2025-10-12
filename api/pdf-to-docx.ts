import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * PDF转DOCX API
 * 使用CloudConvert API进行转换
 * 
 * 流程：
 * 1. 从Supabase Storage下载PDF
 * 2. 调用CloudConvert API转换为DOCX
 * 3. 返回DOCX的URL或Base64
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ 
        error: 'filePath is required' 
      });
    }

    console.log('🔵 PDF to DOCX: Starting conversion', { filePath });

    // 获取Supabase配置
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !secretKey) {
      return res.status(500).json({ 
        error: 'Server misconfigured: missing Supabase credentials' 
      });
    }

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    // 1. 从Storage下载PDF
    console.log('🔵 Downloading PDF from Storage...');
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('bp-documents')
      .download(filePath);

    if (downloadError || !pdfData) {
      console.error('❌ Failed to download PDF:', downloadError);
      return res.status(500).json({ 
        error: 'Failed to download PDF from storage',
        details: downloadError?.message 
      });
    }

    console.log('✅ PDF downloaded', { size: pdfData.size });

    // 2. 检查是否配置了CloudConvert API Key
    const cloudConvertApiKey = process.env.CLOUDCONVERT_API_KEY;

    if (!cloudConvertApiKey) {
      // 如果没有配置CloudConvert，返回提示信息
      console.warn('⚠️ CloudConvert API key not configured');
      return res.status(501).json({
        error: 'PDF到DOCX转换服务未配置',
        details: '管理员需要配置 CLOUDCONVERT_API_KEY 环境变量。\n\n临时解决方案：\n1. 手动将PDF转换为DOCX\n2. 或使用在线工具: https://www.ilovepdf.com/pdf_to_word',
        service: 'cloudconvert',
        configured: false
      });
    }

    // 3. 调用CloudConvert API
    console.log('🔵 Calling CloudConvert API...');
    
    // CloudConvert v2 API 流程：
    // a. 创建job
    // b. 上传文件
    // c. 等待转换
    // d. 下载结果

    const cloudConvertResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cloudConvertApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks: {
          'upload-pdf': {
            operation: 'import/upload'
          },
          'convert-to-docx': {
            operation: 'convert',
            input: 'upload-pdf',
            output_format: 'docx'
          },
          'export-docx': {
            operation: 'export/url',
            input: 'convert-to-docx'
          }
        }
      })
    });

    if (!cloudConvertResponse.ok) {
      const errorText = await cloudConvertResponse.text();
      console.error('❌ CloudConvert API error:', errorText);
      return res.status(500).json({
        error: 'CloudConvert API调用失败',
        details: errorText.substring(0, 200)
      });
    }

    const jobData = await cloudConvertResponse.json();
    const uploadTask = jobData.data.tasks.find((t: any) => t.name === 'upload-pdf');

    if (!uploadTask || !uploadTask.result?.form) {
      return res.status(500).json({
        error: 'CloudConvert job创建失败'
      });
    }

    console.log('✅ CloudConvert job created', { jobId: jobData.data.id });

    // 4. 上传PDF到CloudConvert
    console.log('🔵 Uploading PDF to CloudConvert...');
    const formData = new FormData();
    
    // 添加CloudConvert要求的参数
    Object.entries(uploadTask.result.form.parameters).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    // 添加文件
    formData.append('file', pdfData, 'document.pdf');

    const uploadResponse = await fetch(uploadTask.result.form.url, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      console.error('❌ Failed to upload to CloudConvert');
      return res.status(500).json({
        error: 'Failed to upload PDF to CloudConvert'
      });
    }

    console.log('✅ PDF uploaded to CloudConvert');

    // 5. 等待转换完成（轮询）
    console.log('🔵 Waiting for conversion...');
    let attempts = 0;
    const maxAttempts = 30; // 最多等待30秒
    let conversionComplete = false;
    let exportTask: any = null;

    while (attempts < maxAttempts && !conversionComplete) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
      attempts++;

      const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobData.data.id}`, {
        headers: {
          'Authorization': `Bearer ${cloudConvertApiKey}`
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        exportTask = statusData.data.tasks.find((t: any) => t.name === 'export-docx');

        if (exportTask && exportTask.status === 'finished') {
          conversionComplete = true;
          console.log('✅ Conversion completed');
        } else if (exportTask && exportTask.status === 'error') {
          console.error('❌ Conversion failed:', exportTask.message);
          return res.status(500).json({
            error: 'PDF转换失败',
            details: exportTask.message
          });
        }
      }
    }

    if (!conversionComplete) {
      return res.status(504).json({
        error: '转换超时',
        details: 'PDF转换时间过长，请稍后重试'
      });
    }

    // 6. 获取转换后的DOCX URL
    const docxUrl = exportTask.result.files[0].url;
    console.log('✅ DOCX ready', { url: docxUrl.substring(0, 50) + '...' });

    // 7. 下载DOCX并上传到Supabase（可选）
    // 或直接返回CloudConvert的临时URL

    return res.status(200).json({
      success: true,
      docxUrl: docxUrl,
      message: 'PDF已成功转换为DOCX',
      expiresIn: '24 hours'
    });

  } catch (error: any) {
    console.error('💥 PDF to DOCX error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Internal Server Error',
      details: error?.stack?.substring(0, 200)
    });
  }
}

