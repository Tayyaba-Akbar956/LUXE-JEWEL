/**
 * Generate and store embeddings for all products
 * STANDALONE VERSION - Does not depend on internal project libraries
 * Uses 'text-embedding-004' with outputDimensionality=768
 * Run this script: npm run generate-embeddings
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('📝 Loading environment from .env.local');
    dotenv.config({ path: envPath });
} else {
    console.log('⚠️ .env.local not found, falling back to .env');
    dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

// Robust verification of required variables
function verifyEnv() {
    const missing = [];
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!googleApiKey) missing.push('GOOGLE_API_KEY');

    if (missing.length > 0) {
        console.error('❌ ERROR: Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        console.log('\nPlease run: npm run check-env');
        process.exit(1);
    }
}

verifyEnv();

const supabase = createClient(supabaseUrl!, supabaseKey!);

// Helper: call the Gemini REST API for embeddings with outputDimensionality
async function getEmbedding(text: string): Promise<number[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${googleApiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'models/gemini-embedding-001',
            content: { parts: [{ text }] },
            outputDimensionality: 768,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Embedding API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.embedding.values;
}

async function generateEmbeddings() {
    console.log('🚀 Starting standalone embedding generation...\n');

    try {
        const shouldForce = process.argv.includes('--force');

        console.log('🔍 Fetching products...');
        const query = supabase
            .from('products')
            .select('id, name, description, short_description');

        if (!shouldForce) {
            query.is('embedding', null);
        }

        const { data: products, error } = await query;

        if (error) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }

        if (!products || products.length === 0) {
            console.log('✅ All products already have embeddings!');
            return;
        }

        console.log(`📦 Found ${products.length} products to process\n`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            try {
                const text = `Product: ${product.name}. Summary: ${product.short_description}. Details: ${product.description}`;

                console.log(`[${i + 1}/${products.length}] Processing: ${product.name}`);

                const embedding = await getEmbedding(text);

                if (embedding.length !== 768) {
                    console.warn(`   ⚠️ Unexpected embedding dimensions: ${embedding.length} (expected 768)`);
                }

                const { error: updateError } = await supabase
                    .from('products')
                    .update({ embedding })
                    .eq('id', product.id);

                if (updateError) {
                    console.error(`   ❌ Database update failed for ${product.name}:`, updateError.message);
                    errorCount++;
                } else {
                    console.log(`   ✅ Success! (${embedding.length} dimensions)`);
                    successCount++;
                }

                // Rate limiting (1 second)
                if (i < products.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (err: any) {
                console.error(`   ❌ Failed to process ${product.name}:`, err.message);
                errorCount++;

                if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
                    console.log('   ⏳ Rate limit hit, cooling down for 10s...');
                    await new Promise(resolve => setTimeout(resolve, 10000));
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Result Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Failed:  ${errorCount}`);
        console.log(`   📦 Total:   ${products.length}`);
        console.log('='.repeat(50));

    } catch (fatal: any) {
        console.error('\n❌ FATAL ERROR:', fatal.message);
        process.exit(1);
    }
}

generateEmbeddings()
    .then(() => {
        console.log('\n✨ Process complete!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ Unexpected error:', err);
        process.exit(1);
    });
