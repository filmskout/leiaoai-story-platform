import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * BP分析API
 * 
 * 功能:
 * 1. 接收文件URL或extracted_text
 * 2. 调用LLM进行4个维度的分析
 * 3. 返回详细的分析得分
 * 
 * POST /api/bp-analysis
 * Body: { 
 *   extractedText: string,
 *   model?: 'deepseek' | 'openai' | 'qwen'
 * }
 */

interface AnalysisScores {
  aiInsight: {
    overall: number;
    planStructure: number;
    content: number;
    viability: number;
  };
  marketInsights: {
    overall: number;
    marketCap: number;
    profitPotential: number;
    popularity: number;
    competition: number;
  };
  riskAssessment: {
    overall: number;
    politicalStability: number;
    economicTrend: number;
    policyVolatility: number;
    warSanctions: number;
  };
  growthProjections: {
    overall: number;
    marketGrowth: number;
    fiveYearProjection: number;
    saturationTimeline: number;
    resourceLimitations: number;
  };
  detailedAnalysis: {
    aiInsight: string;
    marketInsights: string;
    riskAssessment: string;
    growthProjections: string;
  };
}

const MODEL_MAP: Record<string, { provider: 'deepseek' | 'openai' | 'qwen'; model: string }> = {
  deepseek: { provider: 'deepseek', model: 'deepseek-chat' },
  openai: { provider: 'openai', model: 'gpt-4o' },
  qwen: { provider: 'qwen', model: 'qwen-turbo' },
};

const getAnalysisPrompt = (extractedText: string) => `你是一位专业的投资分析师。请分析以下商业计划书并为每个标准打分（0-100分）。

商业计划书内容：
${extractedText.slice(0, 8000)} ${extractedText.length > 8000 ? '...(内容过长已截断)' : ''}

请从以下4个维度分析并打分：

1. AI Insight（AI洞察）:
   - Plan Structure（计划结构，0-100分）：计划的组织结构如何？是否清晰有条理？
   - Content（内容完整性，0-100分）：内容是否全面完整？是否涵盖了所有关键要素？
   - Viability（可行性，0-100分）：商业模式是否可行且实用？

2. Market Insights（市场洞察）:
   - Market Cap（市场规模，0-100分）：市场规模潜力如何？
   - Profit Potential（盈利潜力，0-100分）：盈利能力如何？
   - Popularity（市场热度，0-100分）：这个市场有多热门/趋势？
   - Competition（竞争程度，0-100分）：竞争激烈程度（分数越低=竞争越激烈）

3. Risk Assessment（风险评估）:
   - Political Stability（政治稳定性，0-100分）：地区政治稳定性（分数越高=越稳定）
   - Economic Trend（经济趋势，0-100分）：国家的经济趋势（分数越高=越好）
   - Policy Volatility（政策波动性，0-100分）：政策稳定性（分数越高=越稳定）
   - War/Sanctions（战争/制裁影响，0-100分）：战争或制裁的影响（分数越高=影响越小）

4. Growth Projections（增长预测）:
   - Market Growth（市场增长，0-100分）：整体市场增长潜力
   - Five Year Projection（5年预测，0-100分）：5年市场规模增长展望
   - Saturation Timeline（饱和时间线，0-100分）：市场饱和前的时间（分数越高=时间越长）
   - Resource Limitations（资源限制，0-100分）：关键资源的可获得性（分数越高=限制越少）

请以JSON格式返回，格式如下：
{
  "aiInsight": {
    "planStructure": 85,
    "content": 90,
    "viability": 80
  },
  "marketInsights": {
    "marketCap": 75,
    "profitPotential": 80,
    "popularity": 70,
    "competition": 65
  },
  "riskAssessment": {
    "politicalStability": 75,
    "economicTrend": 70,
    "policyVolatility": 68,
    "warSanctions": 80
  },
  "growthProjections": {
    "marketGrowth": 85,
    "fiveYearProjection": 80,
    "saturationTimeline": 75,
    "resourceLimitations": 85
  },
  "detailedAnalysis": {
    "aiInsight": "详细的AI洞察分析文本...",
    "marketInsights": "详细的市场洞察分析文本...",
    "riskAssessment": "详细的风险评估分析文本...",
    "growthProjections": "详细的增长预测分析文本..."
  }
}

请只返回JSON，不要包含其他文字说明。`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { extractedText, model = 'qwen' } = req.body || {};

    console.log('🔵 BP Analysis: Request received', {
      hasText: !!extractedText,
      textLength: extractedText?.length,
      model,
    });

    if (!extractedText || typeof extractedText !== 'string') {
      res.status(400).json({ error: 'Invalid request: extractedText is required' });
      return;
    }

    if (extractedText.length < 50) {
      res.status(400).json({ error: 'Extracted text is too short. Please provide a complete business plan.' });
      return;
    }

    const mapped = MODEL_MAP[model] || MODEL_MAP['qwen'];
    console.log('🔵 BP Analysis: Using model', { provider: mapped.provider, model: mapped.model });

    // 选择API端点和密钥
    let url = '';
    let apiKey = '';
    let authHeader = '';

    if (mapped.provider === 'deepseek') {
      url = 'https://api.deepseek.com/chat/completions';
      apiKey = process.env.DEEPSEEK_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing DEEPSEEK_API_KEY' });
        return;
      }
    } else if (mapped.provider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions';
      apiKey = process.env.OPENAI_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
        return;
      }
    } else if (mapped.provider === 'qwen') {
      url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
      apiKey = process.env.QWEN_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing QWEN_API_KEY' });
        return;
      }
    }

    const startTime = Date.now();

    // 构建请求体
    const requestBody: any = {
      model: mapped.model,
      messages: [
        { role: 'user', content: getAnalysisPrompt(extractedText) },
      ],
      temperature: 0.3, // 更低的temperature以获得更一致的评分
      max_tokens: 4000,
      stream: false,
    };

    console.log(`🔵 BP Analysis: Calling ${mapped.provider}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`🔵 BP Analysis: ${mapped.provider} response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🔴 BP Analysis: ${mapped.provider} error:`, errorText.slice(0, 500));
      res.status(response.status).json({ error: errorText.slice(0, 500) });
      return;
    }

    const data: any = await response.json();
    const aiResponse: string | undefined = data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error(`🔴 BP Analysis: Invalid response from ${mapped.provider}`);
      res.status(502).json({ error: `Invalid response from ${mapped.provider}` });
      return;
    }

    console.log('🟢 BP Analysis: LLM response received', { length: aiResponse.length });

    // 解析JSON响应
    let analysisScores: AnalysisScores;
    try {
      // 尝试提取JSON（LLM可能返回带有markdown的响应）
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsedScores = JSON.parse(jsonMatch[0]);
      
      // 计算各维度的overall分数（子项平均值）
      const aiInsightOverall = Math.round(
        (parsedScores.aiInsight.planStructure + 
         parsedScores.aiInsight.content + 
         parsedScores.aiInsight.viability) / 3
      );
      
      const marketInsightsOverall = Math.round(
        (parsedScores.marketInsights.marketCap + 
         parsedScores.marketInsights.profitPotential + 
         parsedScores.marketInsights.popularity + 
         parsedScores.marketInsights.competition) / 4
      );
      
      const riskAssessmentOverall = Math.round(
        (parsedScores.riskAssessment.politicalStability + 
         parsedScores.riskAssessment.economicTrend + 
         parsedScores.riskAssessment.policyVolatility + 
         parsedScores.riskAssessment.warSanctions) / 4
      );
      
      const growthProjectionsOverall = Math.round(
        (parsedScores.growthProjections.marketGrowth + 
         parsedScores.growthProjections.fiveYearProjection + 
         parsedScores.growthProjections.saturationTimeline + 
         parsedScores.growthProjections.resourceLimitations) / 4
      );

      analysisScores = {
        aiInsight: {
          overall: aiInsightOverall,
          ...parsedScores.aiInsight,
        },
        marketInsights: {
          overall: marketInsightsOverall,
          ...parsedScores.marketInsights,
        },
        riskAssessment: {
          overall: riskAssessmentOverall,
          ...parsedScores.riskAssessment,
        },
        growthProjections: {
          overall: growthProjectionsOverall,
          ...parsedScores.growthProjections,
        },
        detailedAnalysis: parsedScores.detailedAnalysis || {
          aiInsight: '分析完成',
          marketInsights: '分析完成',
          riskAssessment: '分析完成',
          growthProjections: '分析完成',
        },
      };

      console.log('🟢 BP Analysis: Scores calculated', {
        aiInsight: aiInsightOverall,
        market: marketInsightsOverall,
        risk: riskAssessmentOverall,
        growth: growthProjectionsOverall,
      });

    } catch (parseError: any) {
      console.error('🔴 BP Analysis: JSON parse error', parseError.message);
      console.error('Raw response:', aiResponse.slice(0, 500));
      res.status(500).json({ error: 'Failed to parse analysis results from LLM' });
      return;
    }

    const endTime = Date.now();
    const processingTimeSeconds = Number(((endTime - startTime) / 1000).toFixed(1));

    res.status(200).json({
      data: {
        analysisScores,
        processingTime: processingTimeSeconds,
      },
    });

  } catch (err: any) {
    console.error('🔴 BP Analysis: Handler Error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}

