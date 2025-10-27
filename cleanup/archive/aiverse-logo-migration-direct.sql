-- AIverse Logo迁移脚本 (直接SQL版本)
-- 在Supabase SQL Editor中执行

-- 更新公司logo信息，使用AIverse的logo URL
UPDATE companies SET 
  logo_storage_url = CASE name
    WHEN 'OpenAI' THEN 'https://aiverse.ai/logos/openai-logo.png'
    WHEN 'Anthropic' THEN 'https://aiverse.ai/logos/anthropic-logo.png'
    WHEN 'Google' THEN 'https://aiverse.ai/logos/google-logo.png'
    WHEN 'Microsoft' THEN 'https://aiverse.ai/logos/microsoft-logo.png'
    WHEN 'DeepSeek' THEN 'https://aiverse.ai/logos/deepseek-logo.png'
    WHEN 'Midjourney' THEN 'https://aiverse.ai/logos/midjourney-logo.png'
    WHEN 'Stability AI' THEN 'https://aiverse.ai/logos/stability-ai-logo.png'
    WHEN 'Hugging Face' THEN 'https://aiverse.ai/logos/hugging-face-logo.png'
    WHEN 'Runway' THEN 'https://aiverse.ai/logos/runway-logo.png'
    WHEN 'ElevenLabs' THEN 'https://aiverse.ai/logos/elevenlabs-logo.png'
    WHEN 'xAI' THEN 'https://aiverse.ai/logos/xai-logo.png'
    WHEN 'Perplexity AI' THEN 'https://aiverse.ai/logos/perplexity-logo.png'
    WHEN 'Cursor' THEN 'https://aiverse.ai/logos/cursor-logo.png'
    WHEN 'Synthesia' THEN 'https://aiverse.ai/logos/synthesia-logo.png'
    WHEN 'OpusClip' THEN 'https://aiverse.ai/logos/opusclip-logo.png'
    WHEN 'Luma AI' THEN 'https://aiverse.ai/logos/luma-ai-logo.png'
    WHEN 'HeyGen' THEN 'https://aiverse.ai/logos/heygen-logo.png'
    WHEN 'ByteDance' THEN 'https://aiverse.ai/logos/bytedance-logo.png'
    WHEN 'Pictory' THEN 'https://aiverse.ai/logos/pictory-logo.png'
    WHEN 'InVideo' THEN 'https://aiverse.ai/logos/invideo-logo.png'
    WHEN 'Descript' THEN 'https://aiverse.ai/logos/descript-logo.png'
    WHEN 'Fliki' THEN 'https://aiverse.ai/logos/fliki-logo.png'
    WHEN 'Steve AI' THEN 'https://aiverse.ai/logos/steve-ai-logo.png'
    WHEN 'Wondershare Filmora' THEN 'https://aiverse.ai/logos/filmora-logo.png'
    WHEN 'Leonardo' THEN 'https://aiverse.ai/logos/leonardo-logo.png'
    WHEN 'Canva' THEN 'https://aiverse.ai/logos/canva-logo.png'
    WHEN 'Remove.bg' THEN 'https://aiverse.ai/logos/remove-bg-logo.png'
    WHEN 'Adobe Firefly' THEN 'https://aiverse.ai/logos/adobe-firefly-logo.png'
    WHEN 'Figma' THEN 'https://aiverse.ai/logos/figma-logo.png'
    WHEN 'Krea AI' THEN 'https://aiverse.ai/logos/krea-ai-logo.png'
    WHEN 'Ideogram' THEN 'https://aiverse.ai/logos/ideogram-logo.png'
    WHEN 'Adobe Express' THEN 'https://aiverse.ai/logos/adobe-express-logo.png'
    WHEN 'Recraft' THEN 'https://aiverse.ai/logos/recraft-logo.png'
    WHEN 'Murf.ai' THEN 'https://aiverse.ai/logos/murf-logo.png'
    WHEN 'Suno' THEN 'https://aiverse.ai/logos/suno-logo.png'
    WHEN 'Udio' THEN 'https://aiverse.ai/logos/udio-logo.png'
    WHEN 'Speechify' THEN 'https://aiverse.ai/logos/speechify-logo.png'
    WHEN 'Play.ht' THEN 'https://aiverse.ai/logos/play-ht-logo.png'
    WHEN 'Resemble AI' THEN 'https://aiverse.ai/logos/resemble-ai-logo.png'
    WHEN 'AIVA' THEN 'https://aiverse.ai/logos/aiva-logo.png'
    WHEN 'Soundraw' THEN 'https://aiverse.ai/logos/soundraw-logo.png'
    WHEN 'Krisp' THEN 'https://aiverse.ai/logos/krisp-logo.png'
    WHEN 'Grammarly' THEN 'https://aiverse.ai/logos/grammarly-logo.png'
    WHEN 'Jasper.ai' THEN 'https://aiverse.ai/logos/jasper-logo.png'
    WHEN 'Copy.ai' THEN 'https://aiverse.ai/logos/copy-ai-logo.png'
    WHEN 'Quillbot' THEN 'https://aiverse.ai/logos/quillbot-logo.png'
    WHEN 'Rytr' THEN 'https://aiverse.ai/logos/rytr-logo.png'
    WHEN 'Sudowrite' THEN 'https://aiverse.ai/logos/sudowrite-logo.png'
    WHEN 'Writesonic' THEN 'https://aiverse.ai/logos/writesonic-logo.png'
    WHEN 'Wordtune' THEN 'https://aiverse.ai/logos/wordtune-logo.png'
    WHEN 'Lex' THEN 'https://aiverse.ai/logos/lex-logo.png'
    WHEN 'Jenni AI' THEN 'https://aiverse.ai/logos/jenni-ai-logo.png'
    WHEN 'ProWritingAid' THEN 'https://aiverse.ai/logos/prowritingaid-logo.png'
    WHEN 'Hypotenuse AI' THEN 'https://aiverse.ai/logos/hypotenuse-ai-logo.png'
    WHEN 'GitHub Copilot' THEN 'https://aiverse.ai/logos/github-copilot-logo.png'
    WHEN 'Replit' THEN 'https://aiverse.ai/logos/replit-logo.png'
    WHEN 'Tabnine' THEN 'https://aiverse.ai/logos/tabnine-logo.png'
    WHEN 'Codeium' THEN 'https://aiverse.ai/logos/codeium-logo.png'
    WHEN 'Lovable' THEN 'https://aiverse.ai/logos/lovable-logo.png'
    WHEN 'v0 by Vercel' THEN 'https://aiverse.ai/logos/v0-logo.png'
    WHEN 'CodeWP' THEN 'https://aiverse.ai/logos/codewp-logo.png'
    WHEN 'Groq' THEN 'https://aiverse.ai/logos/groq-logo.png'
    WHEN 'Notion AI' THEN 'https://aiverse.ai/logos/notion-logo.png'
    WHEN 'Zapier' THEN 'https://aiverse.ai/logos/zapier-logo.png'
    WHEN 'n8n' THEN 'https://aiverse.ai/logos/n8n-logo.png'
    WHEN 'Gamma' THEN 'https://aiverse.ai/logos/gamma-logo.png'
    WHEN 'Fathom' THEN 'https://aiverse.ai/logos/fathom-logo.png'
    WHEN 'Reclaim' THEN 'https://aiverse.ai/logos/reclaim-logo.png'
    WHEN 'Otter.ai' THEN 'https://aiverse.ai/logos/otter-logo.png'
    WHEN 'Calendly AI' THEN 'https://aiverse.ai/logos/calendly-logo.png'
    WHEN 'Taskade' THEN 'https://aiverse.ai/logos/taskade-logo.png'
    WHEN 'Manus' THEN 'https://aiverse.ai/logos/manus-logo.png'
    WHEN 'Monday.com AI' THEN 'https://aiverse.ai/logos/monday-logo.png'
    WHEN 'ClickUp AI' THEN 'https://aiverse.ai/logos/clickup-logo.png'
    WHEN 'AdCreative' THEN 'https://aiverse.ai/logos/adcreative-logo.png'
    WHEN 'HubSpot AI' THEN 'https://aiverse.ai/logos/hubspot-logo.png'
    WHEN 'Persado' THEN 'https://aiverse.ai/logos/persado-logo.png'
    WHEN 'Phrasee' THEN 'https://aiverse.ai/logos/phrasee-logo.png'
    WHEN 'Patterns' THEN 'https://aiverse.ai/logos/patterns-logo.png'
    WHEN 'Seventh Sense' THEN 'https://aiverse.ai/logos/seventh-sense-logo.png'
    WHEN 'Brandwatch' THEN 'https://aiverse.ai/logos/brandwatch-logo.png'
    WHEN 'Albert AI' THEN 'https://aiverse.ai/logos/albert-ai-logo.png'
    WHEN 'Seamless.AI' THEN 'https://aiverse.ai/logos/seamless-ai-logo.png'
    WHEN 'Gong' THEN 'https://aiverse.ai/logos/gong-logo.png'
    WHEN 'Outreach' THEN 'https://aiverse.ai/logos/outreach-logo.png'
    WHEN 'Chorus' THEN 'https://aiverse.ai/logos/chorus-logo.png'
    WHEN 'Character.ai' THEN 'https://aiverse.ai/logos/character-ai-logo.png'
    WHEN 'Poe' THEN 'https://aiverse.ai/logos/poe-logo.png'
    WHEN 'Intercom Fin' THEN 'https://aiverse.ai/logos/intercom-logo.png'
    WHEN 'Zendesk AI' THEN 'https://aiverse.ai/logos/zendesk-logo.png'
    WHEN 'Ada' THEN 'https://aiverse.ai/logos/ada-logo.png'
    WHEN 'LivePerson' THEN 'https://aiverse.ai/logos/liveperson-logo.png'
    WHEN 'Drift' THEN 'https://aiverse.ai/logos/drift-logo.png'
    WHEN 'Freshworks Freddy AI' THEN 'https://aiverse.ai/logos/freshworks-logo.png'
    WHEN 'Botpress' THEN 'https://aiverse.ai/logos/botpress-logo.png'
    WHEN 'Rasa' THEN 'https://aiverse.ai/logos/rasa-logo.png'
    WHEN 'DataRobot' THEN 'https://aiverse.ai/logos/datarobot-logo.png'
    WHEN 'H2O.ai' THEN 'https://aiverse.ai/logos/h2o-logo.png'
    WHEN 'Tableau AI' THEN 'https://aiverse.ai/logos/tableau-logo.png'
    WHEN 'Microsoft Power BI AI' THEN 'https://aiverse.ai/logos/powerbi-logo.png'
    WHEN 'Qlik Sense AI' THEN 'https://aiverse.ai/logos/qlik-logo.png'
    WHEN 'Sisense AI' THEN 'https://aiverse.ai/logos/sisense-logo.png'
    WHEN 'ThoughtSpot' THEN 'https://aiverse.ai/logos/thoughtspot-logo.png'
    WHEN 'Alteryx' THEN 'https://aiverse.ai/logos/alteryx-logo.png'
    WHEN 'Khan Academy Khanmigo' THEN 'https://aiverse.ai/logos/khan-academy-logo.png'
    WHEN 'Duolingo Max' THEN 'https://aiverse.ai/logos/duolingo-logo.png'
    WHEN 'Coursera AI' THEN 'https://aiverse.ai/logos/coursera-logo.png'
    WHEN 'Socratic by Google' THEN 'https://aiverse.ai/logos/socratic-logo.png'
    WHEN 'Quizlet AI' THEN 'https://aiverse.ai/logos/quizlet-logo.png'
    WHEN 'Gradescope AI' THEN 'https://aiverse.ai/logos/gradescope-logo.png'
    WHEN 'Carnegie Learning' THEN 'https://aiverse.ai/logos/carnegie-learning-logo.png'
    WHEN 'Century Tech' THEN 'https://aiverse.ai/logos/century-tech-logo.png'
    WHEN 'DeepAI' THEN 'https://aiverse.ai/logos/deepai-logo.png'
    WHEN 'Replika' THEN 'https://aiverse.ai/logos/replika-logo.png'
    WHEN 'MonkeyLearn' THEN 'https://aiverse.ai/logos/monkeylearn-logo.png'
    WHEN 'Lobe' THEN 'https://aiverse.ai/logos/lobe-logo.png'
    WHEN 'Runway Academy' THEN 'https://aiverse.ai/logos/runway-academy-logo.png'
  END,
  logo_updated_at = NOW()
WHERE name IN (
  'OpenAI', 'Anthropic', 'Google', 'Microsoft', 'DeepSeek', 'Midjourney', 
  'Stability AI', 'Hugging Face', 'Runway', 'ElevenLabs', 'xAI', 'Perplexity AI',
  'Cursor', 'Synthesia', 'OpusClip', 'Luma AI', 'HeyGen', 'ByteDance',
  'Pictory', 'InVideo', 'Descript', 'Fliki', 'Steve AI', 'Wondershare Filmora',
  'Leonardo', 'Canva', 'Remove.bg', 'Adobe Firefly', 'Figma', 'Krea AI',
  'Ideogram', 'Adobe Express', 'Recraft', 'Murf.ai', 'Suno', 'Udio',
  'Speechify', 'Play.ht', 'Resemble AI', 'AIVA', 'Soundraw', 'Krisp',
  'Grammarly', 'Jasper.ai', 'Copy.ai', 'Quillbot', 'Rytr', 'Sudowrite',
  'Writesonic', 'Wordtune', 'Lex', 'Jenni AI', 'ProWritingAid', 'Hypotenuse AI',
  'GitHub Copilot', 'Replit', 'Tabnine', 'Codeium', 'Lovable', 'v0 by Vercel',
  'CodeWP', 'Groq', 'Notion AI', 'Zapier', 'n8n', 'Gamma', 'Fathom',
  'Reclaim', 'Otter.ai', 'Calendly AI', 'Taskade', 'Manus', 'Monday.com AI',
  'ClickUp AI', 'AdCreative', 'HubSpot AI', 'Persado', 'Phrasee', 'Patterns',
  'Seventh Sense', 'Brandwatch', 'Albert AI', 'Seamless.AI', 'Gong', 'Outreach',
  'Chorus', 'Character.ai', 'Poe', 'Intercom Fin', 'Zendesk AI', 'Ada',
  'LivePerson', 'Drift', 'Freshworks Freddy AI', 'Botpress', 'Rasa', 'DataRobot',
  'H2O.ai', 'Tableau AI', 'Microsoft Power BI AI', 'Qlik Sense AI', 'Sisense AI',
  'ThoughtSpot', 'Alteryx', 'Khan Academy Khanmigo', 'Duolingo Max', 'Coursera AI',
  'Socratic by Google', 'Quizlet AI', 'Gradescope AI', 'Carnegie Learning',
  'Century Tech', 'DeepAI', 'Replika', 'MonkeyLearn', 'Lobe', 'Runway Academy'
);

-- 完成
SELECT 'AIverse logo迁移完成！' as status;
