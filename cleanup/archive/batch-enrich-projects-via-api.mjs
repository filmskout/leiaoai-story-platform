import fs from 'fs';

// 使用 /api/unified 端点批量补齐项目URL
// 无需本地环境变量，直接调用Vercel部署的API

const API_BASE_URL = 'https://leiao.ai/api/unified';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn';

async function callBatchEnrichProjects(batchNumber, limit = 30) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 调用API补齐第 ${batchNumber} 批项目URL`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'batch-enrich-projects',
        token: ADMIN_TOKEN,
        limit: limit
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 批量补齐成功:', data);
      return data;
    } else {
      console.error('❌ 批量补齐失败:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ API调用失败:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 开始批量补齐项目URL（通过API）\n');
  console.log('API地址:', API_BASE_URL);
  console.log(`使用的Token: ${ADMIN_TOKEN.substring(0, 10)}...\n`);

  // 调用一次API，补充30个项目
  const result = await callBatchEnrichProjects(1, 30);

  if (result) {
    console.log('\n✅ 任务完成！');
    console.log(`补齐的项目数量: ${result.enriched || 0}`);
    console.log(`错误数量: ${result.errors || 0}`);
    
    if (result.details) {
      console.log('\n📊 详细信息:');
      console.log(JSON.stringify(result.details, null, 2));
    }
  } else {
    console.log('\n❌ 任务失败，请检查：');
    console.log('1. 网络连接是否正常');
    console.log('2. API端点是否可访问');
    console.log('3. ADMIN_TOKEN是否正确');
  }
}

// 运行脚本
main().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});

