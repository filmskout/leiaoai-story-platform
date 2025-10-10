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
        const { prompt, genre, language = 'en', title_hint } = await req.json();

        if (!prompt) {
            throw new Error('Story prompt is required');
        }

        console.log('AI Story Generation Request:', { prompt, genre, language, title_hint });

        // Enhanced prompt for creative storytelling
        const storyPrompt = `Create an engaging and creative story based on the following:

Prompt: ${prompt}
Genre: ${genre || 'General'}
Language: ${language}

Requirements:
1. Write a complete, engaging story (800-1500 words)
2. Include vivid descriptions and compelling characters
3. Create a clear narrative arc with beginning, middle, and end
4. Make it suitable for social sharing
5. Include dialogue where appropriate
6. Write in ${language === 'zh' ? 'Chinese' : 'English'}

Please format the response as JSON with these fields:
- title: Creative title for the story
- content: The complete story content
- summary: Brief 2-3 sentence summary
- tags: Array of relevant tags (max 5)
- category: Story category (adventure, romance, mystery, sci-fi, fantasy, drama, comedy, thriller)
- estimated_read_time: Reading time in minutes

Create an original, engaging story that readers will want to share and discuss.`;

        // Using a simple fetch to DeepSeek API (most reliable for storytelling)
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY') || 'sk-placeholder-key'}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a creative storytelling AI that writes engaging, original stories for a social platform. Always respond with valid JSON containing the story data as requested.'
                    },
                    {
                        role: 'user',
                        content: storyPrompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.8,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            console.error('DeepSeek API Error:', response.status);
            // Fallback to a structured story template
            const fallbackStory = {
                title: title_hint || generateTitle(prompt, genre),
                content: generateFallbackStory(prompt, genre, language),
                summary: `A ${genre || 'captivating'} story inspired by: ${prompt.substring(0, 100)}...`,
                tags: extractTags(prompt, genre),
                category: genre || 'general',
                estimated_read_time: 3
            };

            return new Response(JSON.stringify({ data: fallbackStory }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const aiResponse = await response.json();
        let storyData;

        try {
            storyData = JSON.parse(aiResponse.choices[0]?.message?.content || '{}');
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            // Create structured fallback
            storyData = {
                title: title_hint || generateTitle(prompt, genre),
                content: aiResponse.choices[0]?.message?.content || generateFallbackStory(prompt, genre, language),
                summary: `A ${genre || 'captivating'} story inspired by: ${prompt.substring(0, 100)}...`,
                tags: extractTags(prompt, genre),
                category: genre || 'general',
                estimated_read_time: Math.ceil((aiResponse.choices[0]?.message?.content?.length || 1000) / 200)
            };
        }

        // Ensure all required fields exist
        const completeStory = {
            title: storyData.title || title_hint || generateTitle(prompt, genre),
            content: storyData.content || generateFallbackStory(prompt, genre, language),
            summary: storyData.summary || `A ${genre || 'captivating'} story inspired by the prompt.`,
            tags: storyData.tags || extractTags(prompt, genre),
            category: storyData.category || genre || 'general',
            estimated_read_time: storyData.estimated_read_time || 3,
            ai_generated: true,
            language: language
        };

        console.log('Story generated successfully:', completeStory.title);

        return new Response(JSON.stringify({ data: completeStory }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI Story Generation Error:', error);

        const errorResponse = {
            error: {
                code: 'STORY_GENERATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Helper functions
function generateTitle(prompt: string, genre?: string): string {
    const keywords = prompt.split(' ').slice(0, 3).join(' ');
    const genrePrefix = genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)}: ` : '';
    return `${genrePrefix}${keywords.charAt(0).toUpperCase() + keywords.slice(1)}`;
}

function generateFallbackStory(prompt: string, genre?: string, language = 'en'): string {
    if (language === 'zh') {
        return `这是一个关于"${prompt}"的故事。\n\n在一个遥远的地方，有一个关于${prompt}的传说。这个故事充满了冒险、发现和成长。主人公面临着重大挑战，但通过勇气和智慧，最终找到了解决方案。\n\n这个故事提醒我们，每个挑战都是成长的机会，每个困难都能让我们变得更强大。无论我们面临什么困境，只要保持希望和毅力，就能找到属于自己的答案。\n\n故事的结尾充满希望，主人公不仅解决了问题，还获得了宝贵的人生经验。这个关于${prompt}的故事，将永远激励着那些面临挑战的人们。`;
    }
    
    return `This is a story inspired by "${prompt}".\n\nOnce upon a time, in a world where possibilities were endless, there lived someone who encountered the fascinating concept of ${prompt}. This encounter would change everything they thought they knew about their world.\n\nThe journey began with curiosity and wonder, leading to discoveries that challenged conventional thinking. Through trials and triumphs, our protagonist learned that ${prompt} was more than just an idea—it was a gateway to understanding something profound about life itself.\n\nAs the story unfolds, we see how small actions can lead to remarkable transformations. The power of ${prompt} became evident not just in grand gestures, but in the quiet moments of reflection and growth.\n\nIn the end, this tale reminds us that every story worth telling begins with a single moment of inspiration, much like the one that brought us ${prompt}. The adventure continues, and the possibilities remain endless.`;
}

function extractTags(prompt: string, genre?: string): string[] {
    const words = prompt.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    const keywords = words
        .filter(word => word.length > 3 && !commonWords.has(word))
        .slice(0, 3);
    
    const tags = [...keywords];
    if (genre) tags.push(genre);
    tags.push('ai-generated');
    
    return tags.slice(0, 5);
}