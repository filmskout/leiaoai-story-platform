// Vercel Edge Function: Migrate AIverse Logos to Storage
// 这个函数可以直接使用Vercel的环境变量

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// AIverse logo URL映射
const aiverseLogoMapping = {
  'OpenAI': 'https://aiverse.ai/logos/openai-logo.png',
  'Anthropic': 'https://aiverse.ai/logos/anthropic-logo.png',
  'Google': 'https://aiverse.ai/logos/google-logo.png',
  'Microsoft': 'https://aiverse.ai/logos/microsoft-logo.png',
  'DeepSeek': 'https://aiverse.ai/logos/deepseek-logo.png',
  'Midjourney': 'https://aiverse.ai/logos/midjourney-logo.png',
  'Stability AI': 'https://aiverse.ai/logos/stability-ai-logo.png',
  'Hugging Face': 'https://aiverse.ai/logos/hugging-face-logo.png',
  'Runway': 'https://aiverse.ai/logos/runway-logo.png',
  'ElevenLabs': 'https://aiverse.ai/logos/elevenlabs-logo.png',
  'xAI': 'https://aiverse.ai/logos/xai-logo.png',
  'Perplexity AI': 'https://aiverse.ai/logos/perplexity-logo.png',
  'Cursor': 'https://aiverse.ai/logos/cursor-logo.png',
  'Synthesia': 'https://aiverse.ai/logos/synthesia-logo.png',
  'OpusClip': 'https://aiverse.ai/logos/opusclip-logo.png',
  'Luma AI': 'https://aiverse.ai/logos/luma-ai-logo.png',
  'HeyGen': 'https://aiverse.ai/logos/heygen-logo.png',
  'ByteDance': 'https://aiverse.ai/logos/bytedance-logo.png',
  'Pictory': 'https://aiverse.ai/logos/pictory-logo.png',
  'InVideo': 'https://aiverse.ai/logos/invideo-logo.png',
  'Descript': 'https://aiverse.ai/logos/descript-logo.png',
  'Fliki': 'https://aiverse.ai/logos/fliki-logo.png',
  'Steve AI': 'https://aiverse.ai/logos/steve-ai-logo.png',
  'Wondershare Filmora': 'https://aiverse.ai/logos/filmora-logo.png',
  'Leonardo': 'https://aiverse.ai/logos/leonardo-logo.png',
  'Canva': 'https://aiverse.ai/logos/canva-logo.png',
  'Remove.bg': 'https://aiverse.ai/logos/remove-bg-logo.png',
  'Adobe Firefly': 'https://aiverse.ai/logos/adobe-firefly-logo.png',
  'Figma': 'https://aiverse.ai/logos/figma-logo.png',
  'Krea AI': 'https://aiverse.ai/logos/krea-ai-logo.png',
  'Ideogram': 'https://aiverse.ai/logos/ideogram-logo.png',
  'Adobe Express': 'https://aiverse.ai/logos/adobe-express-logo.png',
  'Recraft': 'https://aiverse.ai/logos/recraft-logo.png',
  'Murf.ai': 'https://aiverse.ai/logos/murf-logo.png',
  'Suno': 'https://aiverse.ai/logos/suno-logo.png',
  'Udio': 'https://aiverse.ai/logos/udio-logo.png',
  'Speechify': 'https://aiverse.ai/logos/speechify-logo.png',
  'Play.ht': 'https://aiverse.ai/logos/play-ht-logo.png',
  'Resemble AI': 'https://aiverse.ai/logos/resemble-ai-logo.png',
  'AIVA': 'https://aiverse.ai/logos/aiva-logo.png',
  'Soundraw': 'https://aiverse.ai/logos/soundraw-logo.png',
  'Krisp': 'https://aiverse.ai/logos/krisp-logo.png',
  'Grammarly': 'https://aiverse.ai/logos/grammarly-logo.png',
  'Jasper.ai': 'https://aiverse.ai/logos/jasper-logo.png',
  'Copy.ai': 'https://aiverse.ai/logos/copy-ai-logo.png',
  'Quillbot': 'https://aiverse.ai/logos/quillbot-logo.png',
  'Rytr': 'https://aiverse.ai/logos/rytr-logo.png',
  'Sudowrite': 'https://aiverse.ai/logos/sudowrite-logo.png',
  'Writesonic': 'https://aiverse.ai/logos/writesonic-logo.png',
  'Wordtune': 'https://aiverse.ai/logos/wordtune-logo.png',
  'Lex': 'https://aiverse.ai/logos/lex-logo.png',
  'Jenni AI': 'https://aiverse.ai/logos/jenni-ai-logo.png',
  'ProWritingAid': 'https://aiverse.ai/logos/prowritingaid-logo.png',
  'Hypotenuse AI': 'https://aiverse.ai/logos/hypotenuse-ai-logo.png',
  'GitHub Copilot': 'https://aiverse.ai/logos/github-copilot-logo.png',
  'Replit': 'https://aiverse.ai/logos/replit-logo.png',
  'Tabnine': 'https://aiverse.ai/logos/tabnine-logo.png',
  'Codeium': 'https://aiverse.ai/logos/codeium-logo.png',
  'Lovable': 'https://aiverse.ai/logos/lovable-logo.png',
  'v0 by Vercel': 'https://aiverse.ai/logos/v0-logo.png',
  'CodeWP': 'https://aiverse.ai/logos/codewp-logo.png',
  'Groq': 'https://aiverse.ai/logos/groq-logo.png',
  'Notion AI': 'https://aiverse.ai/logos/notion-logo.png',
  'Zapier': 'https://aiverse.ai/logos/zapier-logo.png',
  'n8n': 'https://aiverse.ai/logos/n8n-logo.png',
  'Gamma': 'https://aiverse.ai/logos/gamma-logo.png',
  'Fathom': 'https://aiverse.ai/logos/fathom-logo.png',
  'Reclaim': 'https://aiverse.ai/logos/reclaim-logo.png',
  'Otter.ai': 'https://aiverse.ai/logos/otter-logo.png',
  'Calendly AI': 'https://aiverse.ai/logos/calendly-logo.png',
  'Taskade': 'https://aiverse.ai/logos/taskade-logo.png',
  'Manus': 'https://aiverse.ai/logos/manus-logo.png',
  'Monday.com AI': 'https://aiverse.ai/logos/monday-logo.png',
  'ClickUp AI': 'https://aiverse.ai/logos/clickup-logo.png',
  'AdCreative': 'https://aiverse.ai/logos/adcreative-logo.png',
  'HubSpot AI': 'https://aiverse.ai/logos/hubspot-logo.png',
  'Persado': 'https://aiverse.ai/logos/persado-logo.png',
  'Phrasee': 'https://aiverse.ai/logos/phrasee-logo.png',
  'Patterns': 'https://aiverse.ai/logos/patterns-logo.png',
  'Seventh Sense': 'https://aiverse.ai/logos/seventh-sense-logo.png',
  'Brandwatch': 'https://aiverse.ai/logos/brandwatch-logo.png',
  'Albert AI': 'https://aiverse.ai/logos/albert-ai-logo.png',
  'Seamless.AI': 'https://aiverse.ai/logos/seamless-ai-logo.png',
  'Gong': 'https://aiverse.ai/logos/gong-logo.png',
  'Outreach': 'https://aiverse.ai/logos/outreach-logo.png',
  'Chorus': 'https://aiverse.ai/logos/chorus-logo.png',
  'Character.ai': 'https://aiverse.ai/logos/character-ai-logo.png',
  'Poe': 'https://aiverse.ai/logos/poe-logo.png',
  'Intercom Fin': 'https://aiverse.ai/logos/intercom-logo.png',
  'Zendesk AI': 'https://aiverse.ai/logos/zendesk-logo.png',
  'Ada': 'https://aiverse.ai/logos/ada-logo.png',
  'LivePerson': 'https://aiverse.ai/logos/liveperson-logo.png',
  'Drift': 'https://aiverse.ai/logos/drift-logo.png',
  'Freshworks Freddy AI': 'https://aiverse.ai/logos/freshworks-logo.png',
  'Botpress': 'https://aiverse.ai/logos/botpress-logo.png',
  'Rasa': 'https://aiverse.ai/logos/rasa-logo.png',
  'DataRobot': 'https://aiverse.ai/logos/datarobot-logo.png',
  'H2O.ai': 'https://aiverse.ai/logos/h2o-logo.png',
  'Tableau AI': 'https://aiverse.ai/logos/tableau-logo.png',
  'Microsoft Power BI AI': 'https://aiverse.ai/logos/powerbi-logo.png',
  'Qlik Sense AI': 'https://aiverse.ai/logos/qlik-logo.png',
  'Sisense AI': 'https://aiverse.ai/logos/sisense-logo.png',
  'ThoughtSpot': 'https://aiverse.ai/logos/thoughtspot-logo.png',
  'Alteryx': 'https://aiverse.ai/logos/alteryx-logo.png',
  'Khan Academy Khanmigo': 'https://aiverse.ai/logos/khan-academy-logo.png',
  'Duolingo Max': 'https://aiverse.ai/logos/duolingo-logo.png',
  'Coursera AI': 'https://aiverse.ai/logos/coursera-logo.png',
  'Socratic by Google': 'https://aiverse.ai/logos/socratic-logo.png',
  'Quizlet AI': 'https://aiverse.ai/logos/quizlet-logo.png',
  'Gradescope AI': 'https://aiverse.ai/logos/gradescope-logo.png',
  'Carnegie Learning': 'https://aiverse.ai/logos/carnegie-learning-logo.png',
  'Century Tech': 'https://aiverse.ai/logos/century-tech-logo.png',
  'DeepAI': 'https://aiverse.ai/logos/deepai-logo.png',
  'Replika': 'https://aiverse.ai/logos/replika-logo.png',
  'MonkeyLearn': 'https://aiverse.ai/logos/monkeylearn-logo.png',
  'Lobe': 'https://aiverse.ai/logos/lobe-logo.png',
  'Runway Academy': 'https://aiverse.ai/logos/runway-academy-logo.png'
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🚀 开始迁移AIverse logo到Storage...')
    
    const migrationResults = []
    let successCount = 0
    let errorCount = 0

    // 获取所有公司
    const { data: companies, error: companiesError } = await supabaseAdmin
      .from('companies')
      .select('id, name')

    if (companiesError) {
      throw new Error(`Failed to fetch companies: ${companiesError.message}`)
    }

    console.log(`📊 找到 ${companies.length} 家公司`)

    for (const company of companies) {
      const logoUrl = aiverseLogoMapping[company.name]
      
      if (!logoUrl) {
        console.log(`⚠️  ${company.name} 没有对应的AIverse logo`)
        continue
      }

      try {
        console.log(`📤 处理 ${company.name} 的logo...`)
        
        // 下载logo
        const logoResponse = await fetch(logoUrl)
        if (!logoResponse.ok) {
          throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`)
        }
        
        const logoBuffer = await logoResponse.arrayBuffer()
        const fileName = `${company.name.toLowerCase().replace(/\s+/g, '-')}-logo.png`
        
        // 上传到Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('company-logos')
          .upload(fileName, logoBuffer, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        // 获取公共URL
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('company-logos')
          .getPublicUrl(fileName)

        const publicUrl = publicUrlData.publicUrl

        // 更新数据库
        const { error: updateError } = await supabaseAdmin
          .from('companies')
          .update({
            logo_storage_url: publicUrl,
            logo_updated_at: new Date().toISOString()
          })
          .eq('id', company.id)

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`)
        }

        migrationResults.push({
          company: company.name,
          fileName,
          publicUrl,
          success: true
        })

        successCount++
        console.log(`✅ ${company.name} logo迁移成功: ${publicUrl}`)

        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.error(`❌ ${company.name} logo迁移失败:`, error.message)
        migrationResults.push({
          company: company.name,
          logoUrl,
          success: false,
          error: error.message
        })
        errorCount++
      }
    }

    console.log(`\n🎉 AIverse logo迁移完成！`)
    console.log(`📊 成功: ${successCount}, 失败: ${errorCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'AIverse logo迁移完成',
        results: {
          successCount,
          errorCount,
          totalCompanies: companies.length,
          details: migrationResults
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Logo迁移失败:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
