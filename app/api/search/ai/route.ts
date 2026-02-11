import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Helper: call Gemini REST API for embeddings with outputDimensionality
async function getEmbedding768(text: string): Promise<number[]> {
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
        throw new Error(`Embedding API error: ${err.error?.message || res.statusText}`);
    }
    const data = await res.json();
    return data.embedding.values;
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
                Return ONLY a JSON object: {"category": "earrings", "description": "detailed professional description"}`;

                let description = '';
                const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

                if (openRouterKey) {
                    const orModels = ["google/gemini-2.0-flash-001", "meta-llama/llama-3.2-11b-vision-instruct", "google/gemini-flash-1.5"];
                    for (const modelId of orModels) {
                        try {
                            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${openRouterKey}`,
                                    'Content-Type': 'application/json',
                                    'HTTP-Referer': 'https://localhost:3000',
                                    'X-Title': 'LuxeJewel AI Search'
                                },
                                body: JSON.stringify({
                                    model: modelId,
                                    messages: [{ role: "user", content: [{ type: "text", text: visionPrompt }, { type: "image_url", image_url: { url: image.includes('base64,') ? image : `data:image/jpeg;base64,${image}` } }] }],
                                    response_format: { type: "json_object" }
                                })
                            });

                            const data = await response.json();
                            if (response.ok && data.choices?.[0]?.message?.content) {
                                try {
                                    const parsed = JSON.parse(data.choices[0].message.content);
                                    description = parsed.description;
                                    detectedCategory = parsed.category;
                                    break;
                                } catch (pErr) {
                                    description = data.choices[0].message.content;
                                }
                            }
                        } catch (e: any) {
                            console.error(`   ❌ ${modelId} error:`, e.message);
                        }
                    }
                }

                if (!description) {
                    const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                    const base64Data = image.includes(',') ? image.split(',')[1] : image;
                    const result = await visionModel.generateContent([{ inlineData: { data: base64Data, mimeType: "image/jpeg" } }, { text: visionPrompt }]);
                    try {
                        const content = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                        const parsed = JSON.parse(content);
                        description = parsed.description;
                        detectedCategory = parsed.category;
                    } catch (pErr) {
                        description = result.response.text();
                    }
                }

                if (!description) throw new Error('AI vision failed');

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
                    } else {
                        console.warn(`⚠️  Could not find Category ID for slug: "${detectedCategory}"`);
                    }
                }

                embedding = await getEmbedding768(description);
            } catch (aiError: any) {
                console.error('❌ AI Vision failed:', aiError);
                return NextResponse.json({ error: 'AI search failed' }, { status: 500 });
            }
        }

        // UNIFIED VECTOR SEARCH
        console.log('🔎 Querying database with vector similarity...', {
            threshold: query ? 0.5 : 0.3,
            count: 8,
            categoryId
        });
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
        console.error('❌ AI Search Error:', error);
        return NextResponse.json({
            error: 'Failed to process AI search',
            details: error.message
        }, { status: 500 });
    }
}
