import 'dotenv/config';

const API_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/unified`
  : 'https://leiao.ai/api/unified';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-123';

async function run(limit = 116) {
  console.log('🚀 Batch enrich foundation fields (founded_year, headquarters)');
  console.log('API:', API_URL);

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'batch-enrich-companies',
      token: ADMIN_TOKEN,
      limit
    })
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('❌ Failed:', data);
    process.exit(1);
  }
  console.log('✅ Done:', JSON.stringify(data, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
