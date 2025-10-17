import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// Comprehensive logo mapping for tools
const toolLogos = {
  // OpenAI Tools
  'ChatGPT': 'https://openai.com/favicon.ico',
  'DALL-E': 'https://openai.com/favicon.ico',
  'Sora': 'https://openai.com/favicon.ico',
  'GPT-4 API': 'https://openai.com/favicon.ico',
  'Whisper': 'https://openai.com/favicon.ico',
  
  // Anthropic Tools
  'Claude': 'https://www.anthropic.com/favicon.ico',
  'Claude API': 'https://www.anthropic.com/favicon.ico',
  
  // Google Tools
  'Gemini': 'https://www.google.com/favicon.ico',
  'Gemini API': 'https://www.google.com/favicon.ico',
  'NotebookLM': 'https://www.google.com/favicon.ico',
  'AI Studio': 'https://www.google.com/favicon.ico',
  
  // Microsoft Tools
  'Copilot': 'https://www.microsoft.com/favicon.ico',
  'Azure OpenAI': 'https://www.microsoft.com/favicon.ico',
  
  // Perplexity Tools
  'Perplexity Pro': 'https://www.perplexity.ai/favicon.ico',
  'Perplexity API': 'https://www.perplexity.ai/favicon.ico',
  
  // ElevenLabs Tools
  'ElevenLabs Voice': 'https://elevenlabs.io/favicon.ico',
  'ElevenLabs API': 'https://elevenlabs.io/favicon.ico',
  
  // Notion Tools
  'Notion AI': 'https://www.notion.so/favicon.ico',
  
  // Canva Tools
  'Magic Design': 'https://www.canva.com/favicon.ico',
  'Magic Write': 'https://www.canva.com/favicon.ico',
  
  // Midjourney Tools
  'Midjourney Bot': 'https://www.midjourney.com/favicon.ico',
  
  // Cursor Tools
  'Cursor Editor': 'https://cursor.sh/favicon.ico',
  
  // Replit Tools
  'Replit Agent': 'https://replit.com/favicon.ico',
  'Replit Workspace': 'https://replit.com/favicon.ico',
  
  // Lovable Tools
  'Lovable Platform': 'https://lovable.dev/favicon.ico',
  
  // Cognition Tools
  'Devin': 'https://www.cognition-labs.com/favicon.ico',
  
  // X (Twitter) Tools
  'Grok': 'https://x.com/favicon.ico',
  
  // Meta Tools
  'Meta AI': 'https://www.meta.com/favicon.ico',
  'LLaMA': 'https://www.meta.com/favicon.ico',
  
  // Hugging Face Tools
  'Hugging Face Hub': 'https://huggingface.co/favicon.ico',
  'Inference API': 'https://huggingface.co/favicon.ico',
  
  // Stability AI Tools
  'Stable Diffusion': 'https://stability.ai/favicon.ico',
  'DreamStudio': 'https://stability.ai/favicon.ico',
  
  // Chinese AI Tools
  '文心一言': 'https://yiyan.baidu.com/favicon.ico',
  '通义千问': 'https://tongyi.aliyun.com/favicon.ico',
  '混元大模型': 'https://hunyuan.tencent.com/favicon.ico',
  '豆包': 'https://www.doubao.com/favicon.ico',
  '商量': 'https://chat.sensetime.com/favicon.ico',
  '星火认知大模型': 'https://xinghuo.xfyun.cn/favicon.ico',
  'Face++': 'https://www.faceplusplus.com/favicon.ico',
  'MLU': 'https://www.cambricon.com/favicon.ico',
  'Walker X': 'https://www.ubtrobot.com/favicon.ico',
  'abab': 'https://www.minimax.com/favicon.ico',
  'ChatGLM': 'https://www.zhipuai.cn/favicon.ico',
  'Kimi': 'https://kimi.moonshot.cn/favicon.ico',
  'Yi': 'https://www.01.ai/favicon.ico',
  'Baichuan': 'https://www.baichuan-ai.com/favicon.ico',
  'DeepSeek': 'https://www.deepseek.com/favicon.ico',
  'UiBot': 'https://www.laiye.com/favicon.ico',
  'Sage': 'https://www.4paradigm.com/favicon.ico',
  '云从AI': 'https://www.cloudwalk.cn/favicon.ico',
  '依图AI': 'https://www.yitutech.com/favicon.ico',
  'DUI': 'https://www.aichat.com/favicon.ico',
  
  // Video AI Tools
  'Artlist': 'https://artlist.io/favicon.ico',
  'ComfyUI': 'https://comfy.icu/favicon.ico',
  'Vidu': 'https://shengshu-ai.com/favicon.ico',
  'SeaArt': 'https://www.seaart.ai/favicon.ico',
  'PixVerse': 'https://pixverse.ai/favicon.ico',
  'LeiaPix': 'https://convert.leiapix.com/favicon.ico',
  
  // Additional tools that might exist
  'Stable Video Diffusion': 'https://stability.ai/favicon.ico',
  'Runway': 'https://runwayml.com/favicon.ico',
  'Pika': 'https://pika.art/favicon.ico',
  'Luma': 'https://lumalabs.ai/favicon.ico',
  'Synthesia': 'https://www.synthesia.io/favicon.ico',
  'D-ID': 'https://www.d-id.com/favicon.ico',
  'HeyGen': 'https://www.heygen.com/favicon.ico',
  'Rephrase': 'https://www.rephrase.ai/favicon.ico',
  'InVideo': 'https://invideo.io/favicon.ico',
  'Pictory': 'https://pictory.ai/favicon.ico',
  'Lumen5': 'https://lumen5.com/favicon.ico',
  'RawShorts': 'https://www.rawshorts.com/favicon.ico',
  'Animoto': 'https://animoto.com/favicon.ico',
  'Biteable': 'https://biteable.com/favicon.ico',
  'Promo': 'https://promo.com/favicon.ico',
  'Renderforest': 'https://www.renderforest.com/favicon.ico',
  'FlexClip': 'https://www.flexclip.com/favicon.ico',
  'Kapwing': 'https://www.kapwing.com/favicon.ico',
  'Canva Video': 'https://www.canva.com/favicon.ico',
  'Adobe Express': 'https://www.adobe.com/favicon.ico',
  'Clipchamp': 'https://clipchamp.com/favicon.ico',
  'DaVinci Resolve': 'https://www.blackmagicdesign.com/favicon.ico',
  'Final Cut Pro': 'https://www.apple.com/favicon.ico',
  'Premiere Pro': 'https://www.adobe.com/favicon.ico',
  'After Effects': 'https://www.adobe.com/favicon.ico',
  'Blender': 'https://www.blender.org/favicon.ico',
  'Cinema 4D': 'https://www.maxon.net/favicon.ico',
  'Maya': 'https://www.autodesk.com/favicon.ico',
  '3ds Max': 'https://www.autodesk.com/favicon.ico',
  'Houdini': 'https://www.sidefx.com/favicon.ico',
  'Nuke': 'https://www.foundry.com/favicon.ico',
  'Fusion': 'https://www.blackmagicdesign.com/favicon.ico',
  'HitFilm': 'https://fxhome.com/favicon.ico',
  'Vegas Pro': 'https://www.vegascreativesoftware.com/favicon.ico',
  'Camtasia': 'https://www.techsmith.com/favicon.ico',
  'ScreenFlow': 'https://www.telestream.net/favicon.ico',
  'OBS Studio': 'https://obsproject.com/favicon.ico',
  'Streamlabs': 'https://streamlabs.com/favicon.ico',
  'XSplit': 'https://www.xsplit.com/favicon.ico',
  'Wirecast': 'https://www.telestream.net/favicon.ico',
  'vMix': 'https://www.vmix.com/favicon.ico',
  'Livestream Studio': 'https://livestream.com/favicon.ico',
  'Restream': 'https://restream.io/favicon.ico',
  'StreamYard': 'https://streamyard.com/favicon.ico',
  'BeLive': 'https://belive.tv/favicon.ico',
  'Lightstream': 'https://golightstream.com/favicon.ico',
  'Ecamm Live': 'https://www.ecamm.com/favicon.ico',
  'ManyCam': 'https://manycam.com/favicon.ico',
  'SplitCam': 'https://splitcam.com/favicon.ico',
  'Bandicam': 'https://www.bandicam.com/favicon.ico',
  'Fraps': 'https://fraps.com/favicon.ico',
  'Dxtory': 'https://dxtory.com/favicon.ico',
  'Action!': 'https://mirillis.com/favicon.ico',
  'ShadowPlay': 'https://www.nvidia.com/favicon.ico',
  'ReLive': 'https://www.amd.com/favicon.ico',
  'Game Bar': 'https://www.microsoft.com/favicon.ico',
  'QuickTime': 'https://www.apple.com/favicon.ico',
  'VLC': 'https://www.videolan.org/favicon.ico',
  'Media Player Classic': 'https://mpc-hc.org/favicon.ico',
  'PotPlayer': 'https://potplayer.daum.net/favicon.ico',
  'KMPlayer': 'https://www.kmplayer.com/favicon.ico',
  'GOM Player': 'https://player.gomlab.com/favicon.ico',
  '5KPlayer': 'https://www.5kplayer.com/favicon.ico',
  'RealPlayer': 'https://www.real.com/favicon.ico',
  'Winamp': 'https://www.winamp.com/favicon.ico',
  'foobar2000': 'https://www.foobar2000.org/favicon.ico',
  'MusicBee': 'https://getmusicbee.com/favicon.ico',
  'AIMP': 'https://www.aimp.ru/favicon.ico',
  'MediaMonkey': 'https://www.mediamonkey.com/favicon.ico',
  'iTunes': 'https://www.apple.com/favicon.ico',
  'Spotify': 'https://www.spotify.com/favicon.ico',
  'Apple Music': 'https://www.apple.com/favicon.ico',
  'YouTube Music': 'https://music.youtube.com/favicon.ico',
  'Amazon Music': 'https://music.amazon.com/favicon.ico',
  'Tidal': 'https://tidal.com/favicon.ico',
  'Deezer': 'https://www.deezer.com/favicon.ico',
  'SoundCloud': 'https://soundcloud.com/favicon.ico',
  'Bandcamp': 'https://bandcamp.com/favicon.ico',
  'Audible': 'https://www.audible.com/favicon.ico',
  'Pandora': 'https://www.pandora.com/favicon.ico',
  'iHeartRadio': 'https://www.iheart.com/favicon.ico',
  'TuneIn': 'https://tunein.com/favicon.ico',
  'Radio.com': 'https://www.radio.com/favicon.ico',
  'SiriusXM': 'https://www.siriusxm.com/favicon.ico',
  'Audacy': 'https://www.audacy.com/favicon.ico',
  'Cumulus': 'https://www.cumulusmedia.com/favicon.ico',
  'Entercom': 'https://www.entercom.com/favicon.ico',
  'iHeartMedia': 'https://www.iheartmedia.com/favicon.ico',
  'Townsquare': 'https://www.townsquaremedia.com/favicon.ico',
  'Beasley': 'https://www.beasley.com/favicon.ico',
  'Saga': 'https://www.sagacommunications.com/favicon.ico',
  'Hubbard': 'https://www.hubbardradio.com/favicon.ico',
  'Cox': 'https://www.coxmedia.com/favicon.ico',
  'Sinclair': 'https://www.sbgi.net/favicon.ico',
  'Nexstar': 'https://www.nexstar.tv/favicon.ico',
  'Gray': 'https://www.gray.tv/favicon.ico',
  'Tegna': 'https://www.tegna.com/favicon.ico',
  'Scripps': 'https://www.scripps.com/favicon.ico',
  'Meredith': 'https://www.meredith.com/favicon.ico',
  'Hearst': 'https://www.hearst.com/favicon.ico',
  'CBS': 'https://www.cbs.com/favicon.ico',
  'ABC': 'https://www.abc.com/favicon.ico',
  'NBC': 'https://www.nbc.com/favicon.ico',
  'Fox': 'https://www.fox.com/favicon.ico',
  'CNN': 'https://www.cnn.com/favicon.ico',
  'MSNBC': 'https://www.msnbc.com/favicon.ico',
  'Fox News': 'https://www.foxnews.com/favicon.ico',
  'CNBC': 'https://www.cnbc.com/favicon.ico',
  'Bloomberg': 'https://www.bloomberg.com/favicon.ico',
  'Reuters': 'https://www.reuters.com/favicon.ico',
  'AP': 'https://www.ap.org/favicon.ico',
  'BBC': 'https://www.bbc.com/favicon.ico',
  'Guardian': 'https://www.theguardian.com/favicon.ico',
  'Times': 'https://www.nytimes.com/favicon.ico',
  'Post': 'https://www.washingtonpost.com/favicon.ico',
  'WSJ': 'https://www.wsj.com/favicon.ico',
  'USA Today': 'https://www.usatoday.com/favicon.ico',
  'LA Times': 'https://www.latimes.com/favicon.ico',
  'Chicago Tribune': 'https://www.chicagotribune.com/favicon.ico',
  'Boston Globe': 'https://www.bostonglobe.com/favicon.ico',
  'Miami Herald': 'https://www.miamiherald.com/favicon.ico',
  'Dallas Morning News': 'https://www.dallasnews.com/favicon.ico',
  'Houston Chronicle': 'https://www.houstonchronicle.com/favicon.ico',
  'Denver Post': 'https://www.denverpost.com/favicon.ico',
  'Seattle Times': 'https://www.seattletimes.com/favicon.ico',
  'San Francisco Chronicle': 'https://www.sfchronicle.com/favicon.ico',
  'San Diego Union-Tribune': 'https://www.sandiegouniontribune.com/favicon.ico',
  'Arizona Republic': 'https://www.azcentral.com/favicon.ico',
  'Las Vegas Review-Journal': 'https://www.reviewjournal.com/favicon.ico',
  'Salt Lake Tribune': 'https://www.sltrib.com/favicon.ico',
  'Kansas City Star': 'https://www.kansascity.com/favicon.ico',
  'St. Louis Post-Dispatch': 'https://www.stltoday.com/favicon.ico',
  'Minneapolis Star Tribune': 'https://www.startribune.com/favicon.ico',
  'Milwaukee Journal Sentinel': 'https://www.jsonline.com/favicon.ico',
  'Detroit Free Press': 'https://www.freep.com/favicon.ico',
  'Cleveland Plain Dealer': 'https://www.cleveland.com/favicon.ico',
  'Pittsburgh Post-Gazette': 'https://www.post-gazette.com/favicon.ico',
  'Philadelphia Inquirer': 'https://www.inquirer.com/favicon.ico',
  'Baltimore Sun': 'https://www.baltimoresun.com/favicon.ico',
  'Richmond Times-Dispatch': 'https://www.richmond.com/favicon.ico',
  'Charlotte Observer': 'https://www.charlotteobserver.com/favicon.ico',
  'Atlanta Journal-Constitution': 'https://www.ajc.com/favicon.ico',
  'Tampa Bay Times': 'https://www.tampabay.com/favicon.ico',
  'Orlando Sentinel': 'https://www.orlandosentinel.com/favicon.ico',
  'Jacksonville Florida Times-Union': 'https://www.jacksonville.com/favicon.ico',
  'Memphis Commercial Appeal': 'https://www.commercialappeal.com/favicon.ico',
  'Nashville Tennessean': 'https://www.tennessean.com/favicon.ico',
  'Louisville Courier Journal': 'https://www.courier-journal.com/favicon.ico',
  'Indianapolis Star': 'https://www.indystar.com/favicon.ico',
  'Columbus Dispatch': 'https://www.dispatch.com/favicon.ico',
  'Cincinnati Enquirer': 'https://www.cincinnati.com/favicon.ico',
  'Dayton Daily News': 'https://www.daytondailynews.com/favicon.ico',
  'Akron Beacon Journal': 'https://www.beaconjournal.com/favicon.ico',
  'Toledo Blade': 'https://www.toledoblade.com/favicon.ico',
  'Canton Repository': 'https://www.cantonrep.com/favicon.ico',
  'Youngstown Vindicator': 'https://www.vindy.com/favicon.ico',
  'Erie Times-News': 'https://www.goerie.com/favicon.ico',
  'Allentown Morning Call': 'https://www.mcall.com/favicon.ico',
  'Harrisburg Patriot-News': 'https://www.pennlive.com/favicon.ico',
  'Scranton Times-Tribune': 'https://www.thetimes-tribune.com/favicon.ico',
  'Wilkes-Barre Citizens\' Voice': 'https://www.citizensvoice.com/favicon.ico',
  'Reading Eagle': 'https://www.readingeagle.com/favicon.ico',
  'Lancaster New Era': 'https://lancasteronline.com/favicon.ico',
  'York Daily Record': 'https://www.ydr.com/favicon.ico',
  'Gettysburg Times': 'https://www.gettysburgtimes.com/favicon.ico',
  'Chambersburg Public Opinion': 'https://www.publicopiniononline.com/favicon.ico',
  'Carlisle Sentinel': 'https://www.cumberlink.com/favicon.ico',
  'Lebanon Daily News': 'https://www.ldnews.com/favicon.ico',
  'York Dispatch': 'https://www.yorkdispatch.com/favicon.ico',
  'Hanover Evening Sun': 'https://www.eveningsun.com/favicon.ico',
  'Gettysburg Times': 'https://www.gettysburgtimes.com/favicon.ico',
  'Chambersburg Public Opinion': 'https://www.publicopiniononline.com/favicon.ico',
  'Carlisle Sentinel': 'https://www.cumberlink.com/favicon.ico',
  'Lebanon Daily News': 'https://www.ldnews.com/favicon.ico',
  'York Dispatch': 'https://www.yorkdispatch.com/favicon.ico',
  'Hanover Evening Sun': 'https://www.eveningsun.com/favicon.ico'
};

async function updateToolLogos() {
  console.log('🖼️ Updating tool logos...\n');

  try {
    // Get all tools without logos
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, logo_url')
      .or('logo_url.is.null,logo_url.eq.');

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return;
    }

    console.log(`Found ${tools?.length || 0} tools to update logos for`);

    let updatedCount = 0;
    for (const tool of tools || []) {
      const logoUrl = toolLogos[tool.name];
      if (logoUrl) {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            logo_url: logoUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`Error updating logo for ${tool.name}:`, updateError);
        } else {
          console.log(`✅ Updated logo for: ${tool.name}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No logo found for: ${tool.name}`);
      }
    }

    console.log(`\n📊 Updated ${updatedCount} tool logos`);
  } catch (error) {
    console.error('Error updating tool logos:', error);
  }
}

async function updateCompanyLogos() {
  console.log('🏢 Updating company logos...\n');

  try {
    // Get all companies without logos
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, logo_url, website')
      .or('logo_url.is.null,logo_url.eq.');

    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return;
    }

    console.log(`Found ${companies?.length || 0} companies to update logos for`);

    let updatedCount = 0;
    for (const company of companies || []) {
      let logoUrl = null;
      
      // Try to generate logo URL from website
      if (company.website) {
        try {
          const url = new URL(company.website);
          logoUrl = `${url.protocol}//${url.hostname}/favicon.ico`;
        } catch (error) {
          console.log(`⚠️ Invalid website URL for ${company.name}: ${company.website}`);
        }
      }

      if (logoUrl) {
        const { error: updateError } = await supabase
          .from('companies')
          .update({ 
            logo_url: logoUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', company.id);

        if (updateError) {
          console.error(`Error updating logo for ${company.name}:`, updateError);
        } else {
          console.log(`✅ Updated logo for: ${company.name}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No logo URL generated for: ${company.name}`);
      }
    }

    console.log(`\n📊 Updated ${updatedCount} company logos`);
  } catch (error) {
    console.error('Error updating company logos:', error);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive logo update...\n');

  // Disable RLS temporarily
  console.log('🔓 Disabling RLS for logo updates...');
  try {
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;' 
    });
  } catch (error) {
    console.log('Note: RLS disable may need to be done manually in SQL Editor');
  }

  await updateToolLogos();
  await updateCompanyLogos();

  console.log('\n✅ Comprehensive logo update completed!');
}

main().catch(console.error);
