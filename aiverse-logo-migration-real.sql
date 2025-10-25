-- AIverse Logo迁移脚本 (基于真实数据)
-- 在Supabase SQL Editor中执行

-- 更新公司logo信息，使用AIverse的真实logo URL (Clearbit服务)
UPDATE companies SET 
  logo_storage_url = CASE name
    -- AI Chat & Assistants
    WHEN 'OpenAI' THEN 'https://logo.clearbit.com/chatgpt.com'
    WHEN 'Anthropic' THEN 'https://logo.clearbit.com/claude.ai'
    WHEN 'xAI' THEN 'https://logo.clearbit.com/grok.x.ai'
    WHEN 'Google' THEN 'https://logo.clearbit.com/gemini.google.com'
    WHEN 'DeepSeek' THEN 'https://logo.clearbit.com/www.deepseek.com'
    WHEN 'Perplexity AI' THEN 'https://logo.clearbit.com/www.perplexity.ai'
    WHEN 'Microsoft' THEN 'https://logo.clearbit.com/copilot.microsoft.com'
    
    -- Developer Tools
    WHEN 'Cursor' THEN 'https://logo.clearbit.com/cursor.sh'
    WHEN 'GitHub Copilot' THEN 'https://logo.clearbit.com/github.com'
    WHEN 'Replit' THEN 'https://logo.clearbit.com/replit.com'
    WHEN 'Tabnine' THEN 'https://logo.clearbit.com/www.tabnine.com'
    WHEN 'Codeium' THEN 'https://logo.clearbit.com/codeium.com'
    WHEN 'Lovable' THEN 'https://logo.clearbit.com/lovable.dev'
    WHEN 'v0 by Vercel' THEN 'https://logo.clearbit.com/v0.dev'
    WHEN 'CodeWP' THEN 'https://logo.clearbit.com/codewp.ai'
    
    -- Video & Media
    WHEN 'Synthesia' THEN 'https://logo.clearbit.com/www.synthesia.io'
    WHEN 'Runway' THEN 'https://logo.clearbit.com/runwayml.com'
    WHEN 'OpusClip' THEN 'https://logo.clearbit.com/www.opus.pro'
    WHEN 'Luma AI' THEN 'https://logo.clearbit.com/lumalabs.ai'
    WHEN 'HeyGen' THEN 'https://logo.clearbit.com/www.heygen.com'
    WHEN 'ByteDance' THEN 'https://logo.clearbit.com/www.capcut.com'
    WHEN 'Pictory' THEN 'https://logo.clearbit.com/pictory.ai'
    WHEN 'InVideo' THEN 'https://logo.clearbit.com/invideo.io'
    WHEN 'Descript' THEN 'https://logo.clearbit.com/www.descript.com'
    WHEN 'Fliki' THEN 'https://logo.clearbit.com/fliki.ai'
    WHEN 'Steve AI' THEN 'https://logo.clearbit.com/www.steve.ai'
    WHEN 'Wondershare Filmora' THEN 'https://logo.clearbit.com/filmora.wondershare.com'
    
    -- Image & Design
    WHEN 'Midjourney' THEN 'https://logo.clearbit.com/www.midjourney.com'
    WHEN 'Stability AI' THEN 'https://logo.clearbit.com/stability.ai'
    WHEN 'Leonardo' THEN 'https://logo.clearbit.com/leonardo.ai'
    WHEN 'Canva' THEN 'https://logo.clearbit.com/www.canva.com'
    WHEN 'Remove.bg' THEN 'https://logo.clearbit.com/www.remove.bg'
    WHEN 'Adobe Firefly' THEN 'https://logo.clearbit.com/firefly.adobe.com'
    WHEN 'Figma' THEN 'https://logo.clearbit.com/www.figma.com'
    WHEN 'Krea AI' THEN 'https://logo.clearbit.com/krea.ai'
    WHEN 'Ideogram' THEN 'https://logo.clearbit.com/ideogram.ai'
    WHEN 'Adobe Express' THEN 'https://logo.clearbit.com/express.adobe.com'
    WHEN 'Recraft' THEN 'https://logo.clearbit.com/recraft.ai'
    
    -- Audio & Music
    WHEN 'ElevenLabs' THEN 'https://logo.clearbit.com/elevenlabs.io'
    WHEN 'Murf.ai' THEN 'https://logo.clearbit.com/murf.ai'
    WHEN 'Suno' THEN 'https://logo.clearbit.com/suno.ai'
    WHEN 'Udio' THEN 'https://logo.clearbit.com/udio.ai'
    WHEN 'Speechify' THEN 'https://logo.clearbit.com/speechify.com'
    WHEN 'Play.ht' THEN 'https://logo.clearbit.com/play.ht'
    WHEN 'Resemble AI' THEN 'https://logo.clearbit.com/www.resemble.ai'
    WHEN 'AIVA' THEN 'https://logo.clearbit.com/www.aiva.ai'
    WHEN 'Soundraw' THEN 'https://logo.clearbit.com/soundraw.io'
    WHEN 'Krisp' THEN 'https://logo.clearbit.com/krisp.ai'
    
    -- Writing & Content
    WHEN 'Grammarly' THEN 'https://logo.clearbit.com/www.grammarly.com'
    WHEN 'Jasper.ai' THEN 'https://logo.clearbit.com/www.jasper.ai'
    WHEN 'Copy.ai' THEN 'https://logo.clearbit.com/www.copy.ai'
    WHEN 'Quillbot' THEN 'https://logo.clearbit.com/quillbot.com'
    WHEN 'Rytr' THEN 'https://logo.clearbit.com/rytr.me'
    WHEN 'Sudowrite' THEN 'https://logo.clearbit.com/www.sudowrite.com'
    WHEN 'Writesonic' THEN 'https://logo.clearbit.com/writesonic.com'
    WHEN 'Wordtune' THEN 'https://logo.clearbit.com/www.wordtune.com'
    WHEN 'Lex' THEN 'https://logo.clearbit.com/lex.page'
    WHEN 'Jenni AI' THEN 'https://logo.clearbit.com/jenni.ai'
    WHEN 'ProWritingAid' THEN 'https://logo.clearbit.com/prowritingaid.com'
    WHEN 'Hypotenuse AI' THEN 'https://logo.clearbit.com/www.hypotenuse.ai'
    
    -- Productivity & Automation
    WHEN 'Notion AI' THEN 'https://logo.clearbit.com/www.notion.so'
    WHEN 'Zapier' THEN 'https://logo.clearbit.com/zapier.com'
    WHEN 'n8n' THEN 'https://logo.clearbit.com/n8n.io'
    WHEN 'Gamma' THEN 'https://logo.clearbit.com/gamma.app'
    WHEN 'Fathom' THEN 'https://logo.clearbit.com/usefathom.com'
    WHEN 'Reclaim' THEN 'https://logo.clearbit.com/reclaim.ai'
    WHEN 'Otter.ai' THEN 'https://logo.clearbit.com/otter.ai'
    WHEN 'Calendly AI' THEN 'https://logo.clearbit.com/calendly.com'
    WHEN 'Taskade' THEN 'https://logo.clearbit.com/taskade.com'
    WHEN 'Manus' THEN 'https://logo.clearbit.com/manus.ai'
    WHEN 'Monday.com AI' THEN 'https://logo.clearbit.com/monday.com'
    WHEN 'ClickUp AI' THEN 'https://logo.clearbit.com/clickup.com'
    
    -- Marketing & Sales
    WHEN 'AdCreative' THEN 'https://logo.clearbit.com/adcreative.ai'
    WHEN 'HubSpot AI' THEN 'https://logo.clearbit.com/www.hubspot.com'
    WHEN 'Persado' THEN 'https://logo.clearbit.com/www.persado.com'
    WHEN 'Phrasee' THEN 'https://logo.clearbit.com/phrasee.co'
    WHEN 'Patterns' THEN 'https://logo.clearbit.com/patterns.app'
    WHEN 'Seventh Sense' THEN 'https://logo.clearbit.com/www.seventhsense.ai'
    WHEN 'Brandwatch' THEN 'https://logo.clearbit.com/www.brandwatch.com'
    WHEN 'Albert AI' THEN 'https://logo.clearbit.com/albert.ai'
    WHEN 'Seamless.AI' THEN 'https://logo.clearbit.com/www.seamless.ai'
    WHEN 'Gong' THEN 'https://logo.clearbit.com/www.gong.io'
    WHEN 'Outreach' THEN 'https://logo.clearbit.com/www.outreach.io'
    WHEN 'Chorus' THEN 'https://logo.clearbit.com/chorus.ai'
    
    -- Customer Support & Chatbots
    WHEN 'Character.ai' THEN 'https://logo.clearbit.com/character.ai'
    WHEN 'Poe' THEN 'https://logo.clearbit.com/poe.com'
    WHEN 'Intercom Fin' THEN 'https://logo.clearbit.com/www.intercom.com'
    WHEN 'Zendesk AI' THEN 'https://logo.clearbit.com/www.zendesk.com'
    WHEN 'Ada' THEN 'https://logo.clearbit.com/www.ada.cx'
    WHEN 'LivePerson' THEN 'https://logo.clearbit.com/www.liveperson.com'
    WHEN 'Drift' THEN 'https://logo.clearbit.com/www.drift.com'
    WHEN 'Freshworks Freddy AI' THEN 'https://logo.clearbit.com/www.freshworks.com'
    WHEN 'Botpress' THEN 'https://logo.clearbit.com/botpress.com'
    WHEN 'Rasa' THEN 'https://logo.clearbit.com/rasa.com'
    
    -- Analytics & Data
    WHEN 'DataRobot' THEN 'https://logo.clearbit.com/www.datarobot.com'
    WHEN 'H2O.ai' THEN 'https://logo.clearbit.com/www.h2o.ai'
    WHEN 'Tableau AI' THEN 'https://logo.clearbit.com/www.tableau.com'
    WHEN 'Microsoft Power BI AI' THEN 'https://logo.clearbit.com/powerbi.microsoft.com'
    WHEN 'Qlik Sense AI' THEN 'https://logo.clearbit.com/www.qlik.com'
    WHEN 'Sisense AI' THEN 'https://logo.clearbit.com/www.sisense.com'
    WHEN 'ThoughtSpot' THEN 'https://logo.clearbit.com/www.thoughtspot.com'
    WHEN 'Alteryx' THEN 'https://logo.clearbit.com/www.alteryx.com'
    
    -- Education
    WHEN 'Khan Academy Khanmigo' THEN 'https://logo.clearbit.com/www.khanacademy.org'
    WHEN 'Duolingo Max' THEN 'https://logo.clearbit.com/www.duolingo.com'
    WHEN 'Coursera AI' THEN 'https://logo.clearbit.com/www.coursera.org'
    WHEN 'Socratic by Google' THEN 'https://logo.clearbit.com/socratic.org'
    WHEN 'Quizlet AI' THEN 'https://logo.clearbit.com/quizlet.com'
    WHEN 'Gradescope AI' THEN 'https://logo.clearbit.com/www.gradescope.com'
    WHEN 'Carnegie Learning' THEN 'https://logo.clearbit.com/www.carnegielearning.com'
    WHEN 'Century Tech' THEN 'https://logo.clearbit.com/century.tech'
    
    -- Other AI Tools
    WHEN 'Hugging Face' THEN 'https://logo.clearbit.com/huggingface.co'
    WHEN 'Groq' THEN 'https://logo.clearbit.com/groq.com'
    WHEN 'DeepAI' THEN 'https://logo.clearbit.com/deepai.org'
    WHEN 'Replika' THEN 'https://logo.clearbit.com/replika.ai'
    WHEN 'MonkeyLearn' THEN 'https://logo.clearbit.com/monkeylearn.com'
    WHEN 'Lobe' THEN 'https://logo.clearbit.com/lobe.ai'
    WHEN 'Runway Academy' THEN 'https://logo.clearbit.com/academy.runwayml.com'
  END,
  logo_updated_at = NOW()
WHERE name IN (
  'OpenAI', 'Anthropic', 'xAI', 'Google', 'DeepSeek', 'Perplexity AI', 'Microsoft',
  'Cursor', 'GitHub Copilot', 'Replit', 'Tabnine', 'Codeium', 'Lovable', 'v0 by Vercel', 'CodeWP',
  'Synthesia', 'Runway', 'OpusClip', 'Luma AI', 'HeyGen', 'ByteDance', 'Pictory', 'InVideo', 'Descript', 'Fliki', 'Steve AI', 'Wondershare Filmora',
  'Midjourney', 'Stability AI', 'Leonardo', 'Canva', 'Remove.bg', 'Adobe Firefly', 'Figma', 'Krea AI', 'Ideogram', 'Adobe Express', 'Recraft',
  'ElevenLabs', 'Murf.ai', 'Suno', 'Udio', 'Speechify', 'Play.ht', 'Resemble AI', 'AIVA', 'Soundraw', 'Krisp',
  'Grammarly', 'Jasper.ai', 'Copy.ai', 'Quillbot', 'Rytr', 'Sudowrite', 'Writesonic', 'Wordtune', 'Lex', 'Jenni AI', 'ProWritingAid', 'Hypotenuse AI',
  'Notion AI', 'Zapier', 'n8n', 'Gamma', 'Fathom', 'Reclaim', 'Otter.ai', 'Calendly AI', 'Taskade', 'Manus', 'Monday.com AI', 'ClickUp AI',
  'AdCreative', 'HubSpot AI', 'Persado', 'Phrasee', 'Patterns', 'Seventh Sense', 'Brandwatch', 'Albert AI', 'Seamless.AI', 'Gong', 'Outreach', 'Chorus',
  'Character.ai', 'Poe', 'Intercom Fin', 'Zendesk AI', 'Ada', 'LivePerson', 'Drift', 'Freshworks Freddy AI', 'Botpress', 'Rasa',
  'DataRobot', 'H2O.ai', 'Tableau AI', 'Microsoft Power BI AI', 'Qlik Sense AI', 'Sisense AI', 'ThoughtSpot', 'Alteryx',
  'Khan Academy Khanmigo', 'Duolingo Max', 'Coursera AI', 'Socratic by Google', 'Quizlet AI', 'Gradescope AI', 'Carnegie Learning', 'Century Tech',
  'Hugging Face', 'Groq', 'DeepAI', 'Replika', 'MonkeyLearn', 'Lobe', 'Runway Academy'
);

-- 完成
SELECT 'AIverse logo迁移完成！使用Clearbit服务获取真实logo' as status;
