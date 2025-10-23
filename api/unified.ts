import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import BackgroundTaskManager, { TaskType } from '../lib/BackgroundTaskManager';

// 检查环境变量
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

// 延迟初始化客户端，避免环境变量缺失时崩溃
let supabase: any = null;
let openai: any = null;

function initClients() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase配置缺失');
  }
  if (!openaiApiKey) {
    throw new Error('OpenAI API Key缺失');
  }
  
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  if (!openai) {
    openai = new OpenAI({
      apiKey: openaiApiKey,
    });
  }
}

// 数据库测试处理
async function handleTestDatabase(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 开始数据库连接测试...');
    
    // 检查环境变量
    const envCheck = {
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✅ Set' : '❌ Missing'
  };

    console.log('📋 环境变量检查:', envCheck);
    
    // 测试Supabase连接
    let connectionTest = '❌ Failed';
    let tableTest = '❌ Failed';
    let errorDetails: any = null;
    
    try {
      initClients();
      const { data, error } = await supabase.from('companies').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST116') {
          connectionTest = '✅ Connected (table not found - OK)';
          tableTest = '⚠️ Table not found';
        } else {
          connectionTest = '❌ Connection failed';
          errorDetails = error;
        }
      } else {
        connectionTest = '✅ Connected';
        tableTest = '✅ Table accessible';
      }
    } catch (connError: any) {
      connectionTest = '❌ Connection error';
      errorDetails = connError;
    }
    
    console.log('🔗 连接测试结果:', connectionTest);
    console.log('📊 表测试结果:', tableTest);
    
    return res.status(200).json({
      success: true,
      message: '数据库测试完成',
      results: {
        environment: envCheck,
        connection: connectionTest,
        tableAccess: tableTest,
        errorDetails: errorDetails ? {
          message: errorDetails.message,
          code: errorDetails.code,
          name: errorDetails.name
        } : null,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ 数据库测试失败:', error);
    return res.status(500).json({ 
      success: false,
      error: `数据库测试失败: ${error.message}`,
      details: {
        errorType: error.name,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// 数据库清理处理
async function handleClearDatabase(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🧹 开始清理数据库...');
    
    initClients();
    
    // 定义需要清理的表（按依赖关系排序）- 先只清理核心表
    const tablesToClear = [
      'companies',
      'tools', 
      'fundings',
      'stories'
    ];

    const results: any[] = [];
    let clearedCount = 0;
    let errorCount = 0;

    for (const table of tablesToClear) {
      try {
        console.log(`🔄 清理表: ${table}`);
        
        // 先检查表是否存在
        const { data: tableExists, error: checkError } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (checkError) {
          console.log(`⚠️ 表 ${table} 不存在或无法访问:`, checkError.message);
          results.push({ table, success: false, error: `表不存在: ${checkError.message}` });
          errorCount++;
          continue;
        }

        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');

        if (error) {
          console.log(`⚠️ 清理表 ${table} 时出现错误:`, error.message);
          results.push({ table, success: false, error: error.message });
          errorCount++;
        } else {
          console.log(`✅ 成功清理表: ${table}`);
          results.push({ table, success: true, message: '清理成功' });
          clearedCount++;
        }
      } catch (err: any) {
        console.log(`❌ 清理表 ${table} 失败:`, err);
        results.push({ table, success: false, error: err.message });
        errorCount++;
      }
    }

    console.log(`📊 清理完成: ${clearedCount} 个表成功, ${errorCount} 个表失败`);

    // 即使有错误也返回成功，但包含错误详情
    return res.status(200).json({
      success: true,
      message: `数据库清理完成: ${clearedCount} 个表成功, ${errorCount} 个表失败`,
      results: {
        clearedCount,
        errorCount,
        totalTables: tablesToClear.length,
        details: results
      }
    });

  } catch (error: any) {
    console.error('❌ 数据库清理失败:', error);
    console.error('❌ 错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    return res.status(500).json({
      success: false,
      error: `数据库清理失败: ${error.message}`,
      details: {
        errorType: error.name,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Agent模式 - 启动后台任务
async function handleStartAgentTask(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, taskType } = req.body;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    const taskManager = BackgroundTaskManager.getInstance();
    
    // 创建任务
    const taskId = await taskManager.createTask(taskType as TaskType);
    
    // 异步启动任务（不等待完成）
    taskManager.startTask(taskId).catch(error => {
      console.error(`❌ 后台任务执行失败: ${taskId}`, error);
    });

    console.log(`🚀 Agent任务已启动: ${taskId}`);
    
    return res.status(200).json({
      success: true,
      message: 'Agent任务已启动',
      taskId,
      status: 'started',
      checkUrl: `/api/unified?action=check-task-status&taskId=${taskId}`,
      note: '任务在后台执行，您可以关闭浏览器。完成后请查询任务状态。'
    });

  } catch (error: any) {
    console.error('❌ 启动Agent任务失败:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Agent模式 - 查询任务状态
async function handleCheckTaskStatus(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskId } = req.query;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId parameter' });
  }

  try {
    initClients();
    const taskManager = BackgroundTaskManager.getInstance();
    
    // 获取任务状态
    const taskStatus = await taskManager.getTaskStatus(taskId);
    
    // 获取任务日志
    const taskLogs = await taskManager.getTaskLogs(taskId, 20);

    return res.status(200).json({
      success: true,
      task: taskStatus,
      logs: taskLogs,
      isCompleted: taskStatus.status === 'completed',
      isFailed: taskStatus.status === 'failed',
      isRunning: taskStatus.status === 'running'
    });

  } catch (error: any) {
    console.error(`❌ 查询任务状态失败: ${taskId}`, error);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}

// Agent模式 - 获取所有任务列表
async function handleGetTaskList(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;
  if (token !== process.env.ADMIN_TOKEN && token !== 'admin-token-123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initClients();
    const { data: tasks, error } = await supabase
      .from('background_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      tasks: tasks || []
    });

  } catch (error: any) {
    console.error('❌ 获取任务列表失败:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}

export default async function handler(req: any, res: any) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    // 对于需要数据库的操作，先初始化客户端
    if (action === 'test-database' || action === 'clear-database' || 
        action === 'start-agent-task' || action === 'check-task-status' || action === 'get-task-list') {
      initClients();
    }

    switch (action) {
      case 'auth-token':
        return res.status(200).json({
          success: true,
          token: process.env.ADMIN_TOKEN || 'admin-token-123'
        });

      case 'test-database':
        return handleTestDatabase(req, res);
      
      case 'clear-database':
        return handleClearDatabase(req, res);
      
      case 'start-agent-task':
        return handleStartAgentTask(req, res);
      
      case 'check-task-status':
        return handleCheckTaskStatus(req, res);
      
      case 'get-task-list':
        return handleGetTaskList(req, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}