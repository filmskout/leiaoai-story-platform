-- 测试AI Chat功能的SQL脚本
-- 在Supabase SQL Editor中执行

-- 检查环境变量配置
SELECT '=== AI Chat环境变量检查 ===' as step;

-- 检查是否有必要的环境变量
-- 注意：这里只是检查，实际的环境变量在Vercel中配置
SELECT 
  'Environment variables should be configured in Vercel:' as info,
  'OPENAI_API_KEY' as key1,
  'DEEPSEEK_API_KEY' as key2,
  'QWEN_API_KEY' as key3;

-- 完成
SELECT 'AI Chat环境变量检查完成！' as status;
