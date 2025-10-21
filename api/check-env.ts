export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '✅ Set' : '❌ Missing',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN ? '✅ Set' : '❌ Missing'
  };

  const missingVars = Object.entries(envVars)
    .filter(([_, status]) => status.includes('Missing'))
    .map(([name, _]) => name);

  const status = missingVars.length === 0 ? 'Ready' : 'Missing Variables';

  res.status(200).json({
    status,
    environment: process.env.NODE_ENV || 'development',
    variables: envVars,
    missing: missingVars,
    ready: missingVars.length === 0
  });
}
