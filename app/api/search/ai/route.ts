import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Helper: Generic Retry logic with exponential backoff
async function withRetry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        const isQuotaError =
            error.status === 429 ||
            (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota')));

        if (retries > 0 && isQuotaError) {
            console.warn(`⚠️ Quota exceeded. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
}

// Helper: call Gemini REST API for embeddings with outputDimensionality
async function getEmbedding768(text: string): Promise<number[]> {
    return withRetry(async () => {
        const apiKey = process.env.GOOGLE_API_KEY!;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'models/gemini-embedding-001',
                content: { parts: [{ text }] },
                outputDimensionality: 768,
            }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw {
                status: res.status,
                message: `Embedding API error: ${err.error?.message || res.statusText}`
            };
        }
        const data = await res.json();
        return data.embedding.values;
    });
}

export async function POST(request: Request) {
    try {
        const { image, query } = await request.json();

        if (!image && !query) {
            return NextResponse.json({
                error: 'Image or query text is required'
            }, { status: 400 });
        }

        console.log('🔍 AI Search Request:', { hasImage: !!image, hasQuery: !!query });

        let embedding: number[] = [];
        let categoryId: number | null = null;
        let detectedCategory = '';

        // TEXT SEARCH
        if (query) {
            try {
                console.log('📝 Generating embedding for query:', query);
                embedding = await getEmbedding768(query);
            } catch (embedError: any) {
                console.warn('⚠️ AI Embedding failed:', embedError.message);

                // Fallback to keyword search
                const { data: keywordResults, error: keywordError } = await supabaseAdmin
                    .from('products')
                    .select('*')
                    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                    .limit(8);

                if (!keywordError && keywordResults) {
                    return NextResponse.json({
                        results: keywordResults,
                        isFallback: true,
                        message: 'AI service currently at capacity. Showing keyword matches.'
                    });
                }
                throw embedError;
            }
        }
        // IMAGE SEARCH
        else if (image) {
            try {
                const visionPrompt = `You are a professional jewelry appraiser. Analyze this jewelry image for an AI search.
                Identify the primary category (must be one of: rings, necklaces, earrings, bracelets).
                Provide a highly descriptive search string including:
                - Metal/Material (Gold, Silver, Platinum, etc.)
                - Stones/Gems (Diamond, Pearl, Emerald, Sapphire, Crystal, CZ, etc.)
                - Style (Bohemian, Minimalist, Traditional, Modern, Vintage, etc.)
                - Key visual features (Dangle, Stud, Hoop, Choker, Filigree, Locket, etc.)
                Return ONLY a JSON object: {"category": "category_name", "description": "detailed professional description"}`;

                let description = '';
                const base64Data = image.includes(',') ? image.split(',')[1] : image;
                const groqKey = process.env.GROQ_API_KEY?.trim();
                const cerebrasKey = process.env.CEREBRAS_API_KEY?.trim();
                const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

                console.log('🔑 API Keys status:', {
                    hasGroq: !!groqKey,
                    hasCerebras: !!cerebrasKey,
                    hasOpenRouter: !!openRouterKey,
                    hasGoogle: !!process.env.GOOGLE_API_KEY
                });

                // 1. TRY GROQ FIRST (Vision models prioritized for images)
                if (groqKey) {
                    const groqModels = [
                        'meta-llama/llama-4-scout-17b-16e-instruct',    // New Llama 4 Vision/Scout
                        'meta-llama/llama-4-maverick-17b-128e-instruct',// New Llama 4 Vision/Maverick
                        'llama-3.2-11b-vision-preview',                 // Legacy (in case it restores)
                        'llama-3.2-90b-vision-preview'                  // Legacy
                    ];
                    for (const modelId of groqModels) {
                        try {
                            console.log(`🚀 Attempting Groq (${modelId})...`);
                            const isVision = modelId.includes('vision') || modelId.includes('scout') || modelId.includes('maverick');
                            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${groqKey}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    model: modelId,
                                    messages: [{
                                        role: "user",
                                        content: isVision
                                            ? [
                                                { type: "text", text: visionPrompt },
                                                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
                                            ]
                                            : visionPrompt
                                    }],
                                    response_format: { type: "json_object" }
                                })
                            });

                            const data = await response.json();
                            if (response.ok && data.choices?.[0]?.message?.content) {
                                const content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
                                const parsed = JSON.parse(content);
                                description = parsed.description;
                                detectedCategory = parsed.category;
                                console.log(`✅ Groq (${modelId}) successful`);
                                break;
                            } else {
                                console.warn(`   ❌ Groq ${modelId} error:`, data.error?.message || response.statusText);
                            }
                        } catch (e: any) {
                            console.warn(`   ❌ Groq ${modelId} failed:`, e.message);
                        }
                    }
                } else {
                    console.log('⏭️ Skipping Groq: No API Key');
                }

                // 2. TRY CEREBRAS SECOND
                if (!description && cerebrasKey) {
                    const cerebrasModels = ['llama3.2-11b-vision', 'llama-3.3-70b'];
                    for (const modelId of cerebrasModels) {
                        try {
                            console.log(`🚀 Attempting Cerebras (${modelId})...`);
                            const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${cerebrasKey}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    model: modelId,
                                    messages: [{
                                        role: "user",
                                        content: modelId.includes('vision')
                                            ? [{ type: "text", text: visionPrompt }, { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }]
                                            : `${visionPrompt} (Analyze the jewelry description from the provided image context)`
                                    }],
                                    response_format: { type: "json_object" }
                                })
                            });

                            const data = await response.json();
                            if (response.ok && data.choices?.[0]?.message?.content) {
                                const parsed = JSON.parse(data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim());
                                description = parsed.description;
                                detectedCategory = parsed.category;
                                console.log(`✅ Cerebras (${modelId}) successful`);
                                break;
                            }
                        } catch (e) { /* silent fail */ }
                    }
                } else if (!description) {
                    console.log('⏭️ Skipping Cerebras: No API Key');
                }

                // 3. TRY OPENROUTER THIRD
                if (!description && openRouterKey) {
                    console.log('🔄 Falling back to OpenRouter...');
                    const orModels = [
                        "google/gemini-2.0-flash-lite-preview-02-05:free",
                        "google/gemini-flash-1.5-8b",
                        "openai/gpt-4o-mini"
                    ];
                    for (const modelId of orModels) {
                        try {
                            console.log(`📡 Trying OpenRouter model: ${modelId}`);
                            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${openRouterKey}`,
                                    'Content-Type': 'application/json',
                                    'HTTP-Referer': 'https://luxejewel.vercel.app',
                                    'X-Title': 'LuxeJewel AI Search'
                                },
                                body: JSON.stringify({
                                    model: modelId,
                                    messages: [{
                                        role: "user",
                                        content: [
                                            { type: "text", text: visionPrompt },
                                            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
                                        ]
                                    }],
                                    response_format: { type: "json_object" }
                                })
                            });

                            const data = await response.json();
                            if (response.ok && data.choices?.[0]?.message?.content) {
                                const content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
                                const parsed = JSON.parse(content);
                                description = parsed.description;
                                detectedCategory = parsed.category;
                                console.log(`✅ OpenRouter (${modelId}) successful`);
                                break;
                            } else {
                                console.warn(`   ❌ OpenRouter ${modelId} error:`, data.error?.message || response.statusText);
                            }
                        } catch (e: any) {
                            console.warn(`   ❌ OpenRouter ${modelId} failed:`, e.message);
                        }
                    }
                } else if (!description) {
                    console.log('⏭️ Skipping OpenRouter: No API Key');
                }

                // 4. TRY GEMINI SDK
                if (!description && process.env.GOOGLE_API_KEY) {
                    console.log('🔄 Final fallback to Gemini SDK...');
                    const geminiModels = ["gemini-1.5-flash", "gemini-1.5-pro"];
                    for (const modelName of geminiModels) {
                        try {
                            console.log(`🌟 Trying Gemini SDK model: ${modelName}`);
                            await withRetry(async () => {
                                const visionModel = genAI.getGenerativeModel({ model: modelName });
                                const result = await visionModel.generateContent([
                                    { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
                                    { text: visionPrompt }
                                ]);
                                const content = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                                const parsed = JSON.parse(content);
                                description = parsed.description;
                                detectedCategory = parsed.category;
                                console.log(`✅ Gemini Vision (${modelName}) successful`);
                            });
                            if (description) break;
                        } catch (gErr: any) {
                            console.warn(`   ❌ Gemini ${modelName} failed:`, gErr.message);
                        }
                    }
                }

                if (!description) throw new Error('All AI vision models failed');

                // Map category name to ID
                if (detectedCategory) {
                    const { data: catData } = await supabaseAdmin
                        .from('categories')
                        .select('id')
                        .eq('slug', detectedCategory.toLowerCase())
                        .single();
                    if (catData) {
                        categoryId = catData.id;
                        console.log(`🏷️  Mapped "${detectedCategory}" to Category ID: ${categoryId}`);
                    }
                }

                embedding = await getEmbedding768(description);
            } catch (aiError: any) {
                console.error('❌ AI Vision Flow failed:', aiError);
                return NextResponse.json({
                    error: 'AI search failed',
                    details: aiError.message
                }, { status: 500 });
            }
        }

        // UNIFIED VECTOR SEARCH
        const { data: results, error: rpcError } = await supabaseAdmin.rpc('match_products', {
            query_embedding: embedding,
            match_threshold: query ? 0.5 : 0.3,
            match_count: 8,
            match_category_id: categoryId
        });

        if (rpcError) {
            console.error('❌ Database error:', rpcError);
            return NextResponse.json({ error: rpcError.message }, { status: 500 });
        }

        return NextResponse.json({
            results: results || [],
            count: results?.length || 0,
            category: detectedCategory
        });

    } catch (error: any) {
        console.error('❌ AI Search Route Error:', error);
        return NextResponse.json({
            error: 'Failed to process AI search',
            details: error.message
        }, { status: 500 });
    }
}
