Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://leiao.ai',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    // 获取Supabase服务密钥
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const headers = {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey
    };
    
    // 判断GET请求的情况
    if (req.method === 'GET') {
      // 如果没有action参数或者action=get，都返回统计数据
      if (!action || action === 'get') {
        try {
          // 获取统计数据
          const response = await fetch(`${supabaseUrl}/rest/v1/website_stats?select=*&order=created_at.desc&limit=1`, {
            headers
          });
          
          let data;
          try {
            data = await response.json();
          } catch (e) {
            console.error('解析数据失败:', e);
            data = [];
          }
          
          // 使用默认值
          const stats = data[0] || {
            total_users: 12580,
            total_qa: 3240,
            total_bp_analysis: 123,
            avg_response_time: 8.3
          };
          
          return new Response(JSON.stringify({ success: true, data: stats }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('获取统计数据失败:', error);
          // 返回默认数据
          const defaultStats = {
            total_users: 12580,
            total_qa: 3240,
            total_bp_analysis: 123,
            avg_response_time: 8.3
          };
          
          return new Response(JSON.stringify({ success: true, data: defaultStats }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }
    
    // 判断POST请求的情况
    if (req.method === 'POST') {
      let requestBody;
      try {
        requestBody = await req.json();
      } catch (e) {
        console.error('解析请求体失败:', e);
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // 根据action参数执行不同的操作
      if (action === 'increment' && requestBody.type) {
        // 增加统计数据
        // 先获取当前统计数据
        try {
          const getResponse = await fetch(`${supabaseUrl}/rest/v1/website_stats?select=*&order=created_at.desc&limit=1`, {
            headers
          });
          
          let currentData;
          try {
            currentData = await getResponse.json();
          } catch (e) {
            console.error('解析当前数据失败:', e);
            currentData = [];
          }
          
          const current = currentData[0] || {
            total_users: 12580,
            total_qa: 3240,
            total_bp_analysis: 123,
            avg_response_time: 8.3
          };
          
          // 根据type增加对应数据
          let updatedStats = { ...current };
          
          switch (requestBody.type) {
            case 'user':
              updatedStats.total_users = (updatedStats.total_users || 0) + 1;
              break;
            case 'qa':
              updatedStats.total_qa = (updatedStats.total_qa || 0) + 1;
              break;
            case 'bp_analysis':
              updatedStats.total_bp_analysis = (updatedStats.total_bp_analysis || 0) + 1;
              break;
            case 'response_time':
              // 更新平均响应时间（需要传入新的响应时间）
              if (requestBody.response_time) {
                const currentAvg = updatedStats.avg_response_time || 8.3;
                const currentCount = updatedStats.total_qa || 3240;
                const newAvg = ((currentAvg * currentCount) + requestBody.response_time) / (currentCount + 1);
                updatedStats.avg_response_time = Math.round(newAvg * 10) / 10; // 保留一位小数
              }
              break;
            default:
              return new Response(JSON.stringify({ error: 'Invalid type parameter' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
          }
          
          // 尝试插入新的统计记录
          const insertResponse = await fetch(`${supabaseUrl}/rest/v1/website_stats`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              ...updatedStats,
              created_at: new Date().toISOString()
            })
          });
          
          if (insertResponse.ok) {
            return new Response(JSON.stringify({ 
              success: true, 
              data: updatedStats,
              message: `Successfully incremented ${requestBody.type}` 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } else {
            console.error('插入统计数据失败:', await insertResponse.text());
            return new Response(JSON.stringify({ 
              success: true, 
              data: updatedStats,
              message: `Incremented ${requestBody.type} (local update only)` 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
        } catch (error) {
          console.error('增加统计数据失败:', error);
          return new Response(JSON.stringify({ error: 'Failed to increment stats' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
      
      // 如果action=update，更新统计数据
      if (action === 'update' && requestBody.stats) {
        try {
          const insertResponse = await fetch(`${supabaseUrl}/rest/v1/website_stats`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              ...requestBody.stats,
              created_at: new Date().toISOString()
            })
          });
          
          if (insertResponse.ok) {
            return new Response(JSON.stringify({ 
              success: true, 
              data: requestBody.stats,
              message: 'Statistics updated successfully' 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } else {
            console.error('更新统计数据失败:', await insertResponse.text());
            return new Response(JSON.stringify({ error: 'Failed to update stats' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          console.error('更新统计数据失败:', error);
          return new Response(JSON.stringify({ error: 'Failed to update stats' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }
    
    // 不支持的请求
    return new Response(JSON.stringify({ error: 'Unsupported request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('统计管理器错误:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});