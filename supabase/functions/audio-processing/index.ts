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
        const { audioData, operation = 'transcribe' } = await req.json();

        if (!audioData) {
            throw new Error('Audio data is required');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('Authentication required');
        }

        const openaiApiKey = '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';

        if (operation === 'transcribe') {
            // Audio to text using OpenAI Whisper
            const formData = new FormData();
            
            // Convert base64 to blob
            const base64Data = audioData.split(',')[1];
            const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const audioBlob = new Blob([binaryData], { type: 'audio/webm' });
            
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'zh');

            const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`
                },
                body: formData
            });

            if (!transcriptionResponse.ok) {
                throw new Error('Audio transcription failed');
            }

            const transcriptionData = await transcriptionResponse.json();
            const transcribedText = transcriptionData.text;

            return new Response(JSON.stringify({
                data: {
                    transcription: transcribedText,
                    operation: 'transcribe'
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } else if (operation === 'synthesize') {
            // Text to speech using OpenAI TTS
            const { text, voice = 'alloy' } = await req.json();
            
            if (!text) {
                throw new Error('Text is required for synthesis');
            }

            const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    input: text,
                    voice: voice
                })
            });

            if (!ttsResponse.ok) {
                throw new Error('Text-to-speech failed');
            }

            const audioBuffer = await ttsResponse.arrayBuffer();
            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
            
            return new Response(JSON.stringify({
                data: {
                    audioData: `data:audio/mpeg;base64,${base64Audio}`,
                    operation: 'synthesize'
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        throw new Error('Invalid operation');

    } catch (error) {
        console.error('Audio processing error:', error);

        const errorResponse = {
            error: {
                code: 'AUDIO_PROCESSING_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});