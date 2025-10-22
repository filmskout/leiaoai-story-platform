import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// 初始化客户端
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 任务状态枚举
export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused'
}

// 任务类型枚举
export enum TaskType {
  GENERATE_FULL_DATA = 'generate-full-data',
  RECONFIGURE = 'reconfigure',
  CLEAR_DATABASE = 'clear-database'
}

// 任务进度接口
export interface TaskProgress {
  current: number;
  total: number;
  percentage: number;
  currentStep?: string;
  details?: string[];
}

// 任务结果接口
export interface TaskResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// 后台任务管理器类
export class BackgroundTaskManager {
  private static instance: BackgroundTaskManager;
  private runningTasks: Map<string, boolean> = new Map();

  static getInstance(): BackgroundTaskManager {
    if (!BackgroundTaskManager.instance) {
      BackgroundTaskManager.instance = new BackgroundTaskManager();
    }
    return BackgroundTaskManager.instance;
  }

  // 创建新任务
  async createTask(taskType: TaskType, metadata?: any): Promise<string> {
    const taskId = uuidv4();
    
    try {
      const { error } = await supabase
        .from('background_tasks')
        .insert({
          task_id: taskId,
          task_type: taskType,
          status: TaskStatus.PENDING,
          progress: {
            current: 0,
            total: 0,
            percentage: 0
          },
          result_data: metadata || {}
        });

      if (error) {
        console.error('❌ 创建任务失败:', error);
        throw error;
      }

      console.log(`✅ 任务创建成功: ${taskId}`);
      return taskId;
    } catch (error) {
      console.error('❌ 创建任务失败:', error);
      throw error;
    }
  }

  // 启动任务
  async startTask(taskId: string): Promise<void> {
    if (this.runningTasks.get(taskId)) {
      console.log(`⚠️ 任务 ${taskId} 已在运行中`);
      return;
    }

    this.runningTasks.set(taskId, true);

    try {
      // 更新任务状态为运行中
      await this.updateTaskStatus(taskId, TaskStatus.RUNNING, {
        started_at: new Date().toISOString()
      });

      // 获取任务信息
      const { data: task, error } = await supabase
        .from('background_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (error || !task) {
        throw new Error(`任务 ${taskId} 不存在`);
      }

      // 根据任务类型执行相应操作
      switch (task.task_type) {
        case TaskType.GENERATE_FULL_DATA:
          await this.executeGenerateFullData(taskId);
          break;
        case TaskType.RECONFIGURE:
          await this.executeReconfigure(taskId);
          break;
        case TaskType.CLEAR_DATABASE:
          await this.executeClearDatabase(taskId);
          break;
        default:
          throw new Error(`未知的任务类型: ${task.task_type}`);
      }

      // 任务完成
      await this.updateTaskStatus(taskId, TaskStatus.COMPLETED, {
        completed_at: new Date().toISOString()
      });

    } catch (error: any) {
      console.error(`❌ 任务 ${taskId} 执行失败:`, error);
      await this.updateTaskStatus(taskId, TaskStatus.FAILED, {
        error_message: error.message,
        completed_at: new Date().toISOString()
      });
    } finally {
      this.runningTasks.delete(taskId);
    }
  }

  // 更新任务状态
  async updateTaskStatus(taskId: string, status: TaskStatus, updates?: any): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (updates) {
        Object.assign(updateData, updates);
      }

      const { error } = await supabase
        .from('background_tasks')
        .update(updateData)
        .eq('task_id', taskId);

      if (error) {
        console.error(`❌ 更新任务状态失败: ${taskId}`, error);
      }
    } catch (error) {
      console.error(`❌ 更新任务状态失败: ${taskId}`, error);
    }
  }

  // 更新任务进度
  async updateTaskProgress(taskId: string, progress: TaskProgress): Promise<void> {
    try {
      const { error } = await supabase
        .from('background_tasks')
        .update({
          progress,
          current_step: progress.currentStep,
          updated_at: new Date().toISOString()
        })
        .eq('task_id', taskId);

      if (error) {
        console.error(`❌ 更新任务进度失败: ${taskId}`, error);
      }
    } catch (error) {
      console.error(`❌ 更新任务进度失败: ${taskId}`, error);
    }
  }

  // 记录任务日志
  async logTaskMessage(taskId: string, level: 'info' | 'warning' | 'error', message: string, details?: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_logs')
        .insert({
          task_id,
          log_level: level,
          message,
          details: details || {}
        });

      if (error) {
        console.error(`❌ 记录任务日志失败: ${taskId}`, error);
      }
    } catch (error) {
      console.error(`❌ 记录任务日志失败: ${taskId}`, error);
    }
  }

  // 获取任务状态
  async getTaskStatus(taskId: string): Promise<any> {
    try {
      const { data: task, error } = await supabase
        .from('background_tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (error) {
        throw new Error(`任务 ${taskId} 不存在`);
      }

      return task;
    } catch (error) {
      console.error(`❌ 获取任务状态失败: ${taskId}`, error);
      throw error;
    }
  }

  // 获取任务日志
  async getTaskLogs(taskId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data: logs, error } = await supabase
        .from('task_logs')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`获取任务日志失败: ${taskId}`);
      }

      return logs || [];
    } catch (error) {
      console.error(`❌ 获取任务日志失败: ${taskId}`, error);
      return [];
    }
  }

  // 执行完整数据生成任务
  private async executeGenerateFullData(taskId: string): Promise<void> {
    await this.logTaskMessage(taskId, 'info', '开始执行完整数据生成任务');

    try {
      // 步骤1: 清理数据库
      await this.updateTaskProgress(taskId, {
        current: 0,
        total: 4,
        percentage: 0,
        currentStep: '清理数据库...'
      });

      await this.logTaskMessage(taskId, 'info', '步骤1: 清理数据库');
      await this.clearDatabase();
      await this.logTaskMessage(taskId, 'info', '步骤1完成: 数据库清理完成');

      // 步骤2: 海外公司数据生成
      await this.updateTaskProgress(taskId, {
        current: 1,
        total: 4,
        percentage: 25,
        currentStep: '生成海外公司数据...'
      });

      await this.logTaskMessage(taskId, 'info', '步骤2: 生成海外公司数据');
      const overseasResult = await this.generateOverseasCompanies(taskId);
      await this.logTaskMessage(taskId, 'info', `步骤2完成: 生成了 ${overseasResult.count} 家海外公司`);

      // 步骤3: 国内公司数据生成
      await this.updateTaskProgress(taskId, {
        current: 2,
        total: 4,
        percentage: 50,
        currentStep: '生成国内公司数据...'
      });

      await this.logTaskMessage(taskId, 'info', '步骤3: 生成国内公司数据');
      const domesticResult = await this.generateDomesticCompanies(taskId);
      await this.logTaskMessage(taskId, 'info', `步骤3完成: 生成了 ${domesticResult.count} 家国内公司`);

      // 步骤4: 完成
      await this.updateTaskProgress(taskId, {
        current: 4,
        total: 4,
        percentage: 100,
        currentStep: '任务完成'
      });

      await this.logTaskMessage(taskId, 'info', '任务完成', {
        overseasCount: overseasResult.count,
        domesticCount: domesticResult.count,
        totalCompanies: overseasResult.count + domesticResult.count
      });

    } catch (error: any) {
      await this.logTaskMessage(taskId, 'error', `任务执行失败: ${error.message}`, error);
      throw error;
    }
  }

  // 执行重新配置任务
  private async executeReconfigure(taskId: string): Promise<void> {
    await this.logTaskMessage(taskId, 'info', '开始执行重新配置任务');
    // 实现重新配置逻辑
  }

  // 执行数据库清理任务
  private async executeClearDatabase(taskId: string): Promise<void> {
    await this.logTaskMessage(taskId, 'info', '开始执行数据库清理任务');
    await this.clearDatabase();
    await this.logTaskMessage(taskId, 'info', '数据库清理任务完成');
  }

  // 清理数据库
  private async clearDatabase(): Promise<void> {
    const tablesToClear = [
      'tool_stories', 'company_stories', 'tool_ratings', 'company_ratings',
      'user_favorites', 'tool_stats', 'company_stats', 'tools', 'fundings',
      'stories', 'companies'
    ];

    for (const table of tablesToClear) {
      try {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
          console.log(`⚠️ 清理表 ${table} 时出现错误:`, error.message);
        } else {
          console.log(`✅ 成功清理表: ${table}`);
        }
      } catch (err: any) {
        console.log(`❌ 清理表 ${table} 失败:`, err);
      }
    }
  }

  // 生成海外公司数据
  private async generateOverseasCompanies(taskId: string): Promise<{ count: number }> {
    const overseasCompanies = [
      'OpenAI', 'Google', 'Microsoft', 'Meta', 'Anthropic', 'DeepMind', 'NVIDIA', 'Tesla',
      'Amazon', 'Apple', 'IBM', 'Intel', 'AMD', 'Qualcomm', 'Broadcom', 'ARM',
      'Palantir', 'C3.ai', 'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'SAS',
      'Salesforce', 'Oracle', 'SAP', 'Adobe', 'ServiceNow', 'Workday', 'Snowflake',
      'Databricks', 'MongoDB', 'Elastic', 'Redis', 'Neo4j', 'CockroachDB'
    ];

    let successCount = 0;
    const total = overseasCompanies.length;

    for (let i = 0; i < overseasCompanies.length; i++) {
      const companyName = overseasCompanies[i];
      
      try {
        await this.updateTaskProgress(taskId, {
          current: i + 1,
          total: total,
          percentage: Math.round(((i + 1) / total) * 100),
          currentStep: `处理海外公司: ${companyName}`
        });

        // 这里调用原有的公司数据处理逻辑
        await this.processCompany(companyName, true);
        successCount++;

        await this.logTaskMessage(taskId, 'info', `成功处理海外公司: ${companyName}`);

        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        await this.logTaskMessage(taskId, 'error', `处理海外公司失败: ${companyName}`, error);
      }
    }

    return { count: successCount };
  }

  // 生成国内公司数据
  private async generateDomesticCompanies(taskId: string): Promise<{ count: number }> {
    const domesticCompanies = [
      '百度', '阿里巴巴', '腾讯', '字节跳动', '华为', '小米', '美团', '滴滴',
      '京东', '拼多多', '网易', '新浪', '搜狐', '360', '猎豹移动', '金山',
      '科大讯飞', '商汤科技', '旷视科技', '依图科技', '云从科技', '第四范式',
      '明略科技', '容联云通讯', '声网', '极光', '个推', '友盟', 'TalkingData'
    ];

    let successCount = 0;
    const total = domesticCompanies.length;

    for (let i = 0; i < domesticCompanies.length; i++) {
      const companyName = domesticCompanies[i];
      
      try {
        await this.updateTaskProgress(taskId, {
          current: i + 1,
          total: total,
          percentage: Math.round(((i + 1) / total) * 100),
          currentStep: `处理国内公司: ${companyName}`
        });

        // 这里调用原有的公司数据处理逻辑
        await this.processCompany(companyName, false);
        successCount++;

        await this.logTaskMessage(taskId, 'info', `成功处理国内公司: ${companyName}`);

        // 添加延迟避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        await this.logTaskMessage(taskId, 'error', `处理国内公司失败: ${companyName}`, error);
      }
    }

    return { count: successCount };
  }

  // 处理单个公司
  private async processCompany(companyName: string, isOverseas: boolean): Promise<void> {
    // 这里实现具体的公司数据处理逻辑
    // 包括调用OpenAI API、插入数据库等
    console.log(`处理公司: ${companyName} (${isOverseas ? '海外' : '国内'})`);
  }
}

export default BackgroundTaskManager;
