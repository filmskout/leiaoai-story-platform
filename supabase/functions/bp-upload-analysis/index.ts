// BP Analysis Edge Function
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { fileUrl, fileName, userId, language = 'zh-CN' } = await req.json();

    if (!fileUrl || !fileName) {
      throw new Error('File URL and name are required');
    }

    console.log(`Processing BP analysis request: ${fileName} for user ${userId}`);
    const startTime = Date.now();

    // Placeholder for BP analysis logic
    // In a real implementation, this would download the document, analyze it using AI, and generate a report
    
    // For demo purposes, create a mock analysis result
    const mockAnalysis = {
      overallScore: 85,
      sections: [
        {
          name: language.startsWith('zh') ? '商业模式' : 'Business Model',
          score: 80,
          feedback: language.startsWith('zh') ? 
            '商业模式基础扎实，但缺乏差异化优势。建议明确阐述与竞争对手的区别点。' : 
            'Solid business model foundation, but lacks differentiation. Consider clarifying differences from competitors.'
        },
        {
          name: language.startsWith('zh') ? '市场分析' : 'Market Analysis',
          score: 90,
          feedback: language.startsWith('zh') ? 
            '市场分析全面且深入，数据支持充分。可以进一步探讨进入市场的时机与挑战。' : 
            'Comprehensive and in-depth market analysis with good data support. Could further explore market entry timing and challenges.'
        },
        {
          name: language.startsWith('zh') ? '财务规划' : 'Financial Planning',
          score: 75,
          feedback: language.startsWith('zh') ? 
            '财务预测过于乐观，缺少风险情景分析。建议提供三种情景下的预测。' : 
            'Financial projections seem optimistic, lacking risk scenario analysis. Consider providing projections under three scenarios.'
        },
        {
          name: language.startsWith('zh') ? '团队背景' : 'Team Background',
          score: 95,
          feedback: language.startsWith('zh') ? 
            '团队背景强大，经验丰富。建议补充关键团队成员的留任策略。' : 
            'Strong team background with rich experience. Consider adding retention strategies for key team members.'
        }
      ],
      investmentPotential: language.startsWith('zh') ? '中高' : 'Medium-High',
      recommendedActions: language.startsWith('zh') ?
        ['完善差异化竞争策略', '增加风险管理章节', '提供更详细的市场进入计划'] :
        ['Refine differentiation strategy', 'Add risk management section', 'Provide more detailed market entry plan'],
      processingTime: Date.now() - startTime
    };

    return new Response(JSON.stringify({
      data: {
        reportId: crypto.randomUUID(),
        fileName,
        fileUrl,
        userId,
        analysisResult: mockAnalysis,
        createdAt: new Date().toISOString(),
        status: 'completed'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('BP analysis error:', error);
    return new Response(JSON.stringify({
      error: {
        code: 'BP_ANALYSIS_ERROR',
        message: error.message,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});